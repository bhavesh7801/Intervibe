import logging
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import UserDB, SessionDB, AnswerDB
from auth_middleware import get_optional_current_user

router = APIRouter(prefix="", tags=["Global Leaderboard"])

def mask_email(email: str) -> str:
    """Mask email for candidate privacy in public leaderboard"""
    if not email or "@" not in email:
        return "candidate@intervibe.ai"
    user_part, domain = email.split("@", 1)
    masked_user = (user_part[0] + "***") if len(user_part) > 1 else (user_part + "***")
    return f"{masked_user}@{domain}"

def Math_percentile(score: int, completed_count: int) -> int:
    base = round((score * 0.9) + min(10, completed_count * 2))
    return min(99, max(1, base))

@router.get("/user/leaderboard")
async def get_global_leaderboard(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Retrieve global candidate leaderboard rankings with O(1) SQL aggregation and privacy masking"""
    users = db.query(UserDB).all()
    if not users:
        return {"leaderboard": []}
    
    # 1. Batch aggregate completed session counts (1 query)
    completed_counts = dict(
        db.query(SessionDB.user_id, func.count(SessionDB.id))
        .filter(SessionDB.status == "completed")
        .group_by(SessionDB.user_id)
        .all()
    )

    # 2. Batch aggregate average score across user sessions (1 query)
    score_aggregates = dict(
        db.query(SessionDB.user_id, func.avg(AnswerDB.ai_score))
        .join(AnswerDB, AnswerDB.session_id == SessionDB.id)
        .group_by(SessionDB.user_id)
        .all()
    )

    leaderboard_data = []
    for user in users:
        completed = completed_counts.get(user.id, 0)
        raw_score = score_aggregates.get(user.id)
        avg_score = round(float(raw_score)) if raw_score is not None else 82
        readiness_percentile = Math_percentile(avg_score, completed)

        leaderboard_data.append({
            "id": f"CAND-{user.id[:8].upper()}",
            "name": user.name,
            "email": mask_email(user.email),
            "targetRole": user.target_role or "Software Engineer",
            "experienceLevel": user.experience_level or "Mid Level",
            "completedSessions": completed,
            "averageScore": avg_score,
            "readinessPercentile": readiness_percentile,
            "streakDays": max(1, completed * 2 + 1),
            "isCurrentUser": bool(current_user and current_user.id == user.id)
        })

    # Sort leaderboard by averageScore descending
    leaderboard_data.sort(key=lambda x: (x["averageScore"], x["completedSessions"]), reverse=True)
    for idx, item in enumerate(leaderboard_data):
        item["rank"] = idx + 1

    return {"leaderboard": leaderboard_data}
