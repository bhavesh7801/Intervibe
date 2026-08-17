import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field

from database import get_db
from models import UserDB, FeedbackDB
from auth_middleware import get_optional_current_user

router = APIRouter(prefix="", tags=["Feedback & Complaints"])

class FeedbackCreateRequest(BaseModel):
    userName: str = Field(..., min_length=2, max_length=64)
    userEmail: EmailStr = Field(..., max_length=255)
    category: str = Field(..., min_length=2, max_length=50)
    subject: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5, max_length=2000)
    rating: Optional[int] = Field(default=5, ge=1, le=5)

@router.post("/feedback")
async def create_feedback(
    payload: FeedbackCreateRequest,
    db: Session = Depends(get_db)
):
    """Submit a feedback or support ticket"""
    fb = FeedbackDB(
        user_name=payload.userName,
        user_email=payload.userEmail,
        category=payload.category,
        subject=payload.subject,
        description=payload.description,
        rating=payload.rating,
        status="Open"
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return {
        "message": "Feedback ticket submitted successfully",
        "ticketId": f"FB-{fb.id[:8].upper()}",
        "feedback": {
            "id": fb.id,
            "category": fb.category,
            "subject": fb.subject,
            "status": fb.status,
            "createdAt": fb.created_at.isoformat() if fb.created_at else None
        }
    }

@router.get("/feedback")
async def get_user_feedbacks(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Retrieve submitted feedback and complaint tickets"""
    query = db.query(FeedbackDB)
    if current_user:
        query = query.filter(FeedbackDB.user_email == current_user.email)
    
    results = query.order_by(FeedbackDB.created_at.desc()).all()
    return [
        {
            "id": f.id,
            "ticketId": f"FB-{f.id[:8].upper()}",
            "userName": f.user_name,
            "userEmail": f.user_email,
            "category": f.category,
            "subject": f.subject,
            "description": f.description,
            "rating": f.rating,
            "status": f.status,
            "createdAt": f.created_at.isoformat() if f.created_at else None
        }
        for f in results
    ]
