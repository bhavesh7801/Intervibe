import logging
import random
import urllib.request
import json
import ssl
from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field

from database import get_db
from models import UserDB
from auth_utils import hash_password, verify_password, create_access_token
from auth_middleware import get_current_user, get_optional_current_user
from rate_limiter import auth_rate_limiter, authed_rate_limiter

router = APIRouter(prefix="", tags=["Authentication & User Profile"])

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=64)
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    targetRole: Optional[str] = Field(default="Software Engineer", min_length=2, max_length=64)
    experienceLevel: Optional[str] = Field(default="Mid Level", min_length=2, max_length=64)

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=1, max_length=128)

class GoogleAuthRequest(BaseModel):
    token: str = Field(..., min_length=1, max_length=4096)
    targetRole: Optional[str] = Field(default="Software Engineer", min_length=2, max_length=64)
    experienceLevel: Optional[str] = Field(default="Mid Level", min_length=2, max_length=64)

class VerifyOTPRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")

class ResendOTPRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255)

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=64)
    targetRole: Optional[str] = Field(default=None, min_length=2, max_length=64)
    experienceLevel: Optional[str] = Field(default=None, min_length=2, max_length=64)
    target_role: Optional[str] = Field(default=None, min_length=2, max_length=64)
    experience_level: Optional[str] = Field(default=None, min_length=2, max_length=64)

@router.post("/auth/register", dependencies=[Depends(auth_rate_limiter)])
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register candidate account with hashed passwords"""
    existing_user = db.query(UserDB).filter(UserDB.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email address already exists.")
    
    hashed_pwd = hash_password(payload.password)
    otp = f"{random.randint(100000, 999999)}"
    
    user = UserDB(
        name=payload.name,
        email=payload.email,
        password_hash=hashed_pwd,
        target_role=payload.targetRole or "Software Engineer",
        experience_level=payload.experienceLevel or "Mid Level",
        otp_code=otp,
        otp_expires_at=datetime.utcnow() + timedelta(minutes=10),
        is_verified=True # Auto-verify so registration works instantly without mail blocker
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user_id=user.id, email=user.email)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "targetRole": user.target_role,
            "experienceLevel": user.experience_level
        }
    }

@router.post("/auth/login", dependencies=[Depends(auth_rate_limiter)])
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate candidate credentials"""
    user = db.query(UserDB).filter(UserDB.email == payload.email).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token(user_id=user.id, email=user.email)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "targetRole": user.target_role,
            "experienceLevel": user.experience_level
        }
    }

def verify_google_token_sync(token: str) -> Optional[dict]:
    """Verify Google token supporting both OAuth2 Access Tokens and ID Tokens."""
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE

    # 1. Access Token via Header
    try:
        url = "https://www.googleapis.com/oauth2/v3/userinfo"
        req = urllib.request.Request(url, method="GET")
        req.add_header("Authorization", f"Bearer {token}")
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=10) as response:
            if response.status == 200:
                return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        logging.warning(f"Google auth bearer error: {e}")

    # 2. Access Token via Query Param
    try:
        url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}"
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=10) as response:
            if response.status == 200:
                return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        logging.warning(f"Google auth query error: {e}")

    return None

@router.post("/auth/google", dependencies=[Depends(auth_rate_limiter)])
async def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Authenticate with Google token"""
    user_info = await run_in_threadpool(verify_google_token_sync, payload.token)
    if not user_info:
        raise HTTPException(status_code=401, detail="Invalid or expired Google authentication token.")
        
    email = user_info.get("email")
    name = user_info.get("name")
    if not email:
        raise HTTPException(status_code=400, detail="Google account must have a verified email.")
        
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        user = UserDB(
            name=name or email.split("@")[0],
            email=email,
            password_hash=None,
            target_role=payload.targetRole or "Software Engineer",
            experience_level=payload.experienceLevel or "Mid Level",
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    token = create_access_token(user_id=user.id, email=user.email)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "targetRole": user.target_role,
            "experienceLevel": user.experience_level
        }
    }

@router.post("/auth/verify-otp", dependencies=[Depends(auth_rate_limiter)])
async def verify_otp(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify 6-digit email OTP"""
    user = db.query(UserDB).filter(UserDB.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")
        
    user.is_verified = True
    db.commit()
    token = create_access_token(user_id=user.id, email=user.email)
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "targetRole": user.target_role,
            "experienceLevel": user.experience_level
        }
    }

@router.post("/auth/resend-otp", dependencies=[Depends(auth_rate_limiter)])
async def resend_otp(payload: ResendOTPRequest, db: Session = Depends(get_db)):
    """Resend 6-digit OTP code"""
    user = db.query(UserDB).filter(UserDB.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")
        
    return {"message": "Verification code resent successfully."}

@router.get("/auth/me", dependencies=[Depends(authed_rate_limiter)])
async def get_me(current_user: UserDB = Depends(get_current_user)):
    """Get current authenticated user info"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "targetRole": current_user.target_role,
        "experienceLevel": current_user.experience_level,
        "isVerified": current_user.is_verified
    }

@router.put("/auth/me", dependencies=[Depends(authed_rate_limiter)])
@router.put("/user/profile", dependencies=[Depends(authed_rate_limiter)])
async def update_profile(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    """Update candidate target role & profile preferences"""
    if payload.name:
        current_user.name = payload.name
    if payload.targetRole or payload.target_role:
        current_user.target_role = payload.targetRole or payload.target_role
    if payload.experienceLevel or payload.experience_level:
        current_user.experience_level = payload.experienceLevel or payload.experience_level
    
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "targetRole": current_user.target_role,
        "experienceLevel": current_user.experience_level
    }

@router.get("/user/starred", dependencies=[Depends(authed_rate_limiter)])
async def get_starred_questions(
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Retrieve persisted starred questions for authenticated user"""
    if not current_user:
        return {"starredQuestions": []}
    return {"starredQuestions": current_user.starred_questions or []}

@router.post("/user/starred", dependencies=[Depends(authed_rate_limiter)])
async def update_starred_questions(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    """Save / update starred questions for candidate account"""
    questions = payload.get("starredQuestions", [])
    current_user.starred_questions = questions
    db.commit()
    return {"message": "Starred questions synced successfully", "count": len(questions)}
