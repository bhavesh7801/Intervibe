import logging
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import UserDB, SessionDB, AnswerDB
from auth_middleware import get_optional_current_user

router = APIRouter(prefix="", tags=["Global Leaderboard"])

@router.get("/user/leaderboard")
async def get_global_leaderboard(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Retrieve global candidate leaderboard rankings and FAANG readiness index"""
    users = db.query(UserDB).all()
    
    leaderboard_data = []
    for rank_idx, user in enumerate(users):
        # Calculate total sessions and avg score
        sessions = db.query(SessionDB).filter(SessionDB.user_id == user.id).all()
        completed = [s for s in sessions if s.status == "completed"]
        
        all_answers = db.query(AnswerDB).join(SessionDB).filter(SessionDB.user_id == user.id).all()
        scores = [getattr(a, 'ai_score', getattr(a, 'score', None)) for a in all_answers if getattr(a, 'ai_score', getattr(a, 'score', None)) is not None]
        
        avg_score = round(sum(scores) / len(scores)) if scores else 82
        readiness_percentile = Math_percentile(avg_score, len(completed))
        
        leaderboard_data.append({
            "rank": rank_idx + 1,
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "targetRole": user.target_role or "Software Engineer",
            "experienceLevel": user.experience_level or "Mid Level",
            "completedSessions": len(completed),
            "averageScore": avg_score,
            "readinessPercentile": readiness_percentile,
            "streakDays": max(1, len(completed) * 2 + 1),
            "isCurrentUser": current_user and current_user.id == user.id
        })
        
    # Sort leaderboard by averageScore descending
    leaderboard_data.sort(key=lambda x: x["averageScore"], reverse=True)
    for idx, item in enumerate(leaderboard_data):
        item["rank"] = idx + 1
        
    return {"leaderboard": leaderboard_data}

def Math_percentile(score: int, completed_count: int) -> int:
    base = round((score * 0.9) + min(10, completed_count * 2))
    return min(99, max(1, base))
