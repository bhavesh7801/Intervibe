import os
import logging
import json
import ssl
import secrets
import hmac
import hashlib
import time
import urllib.request
import urllib.parse
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from models import UserDB
from auth_utils import create_access_token, JWT_SECRET
from rate_limiter import auth_rate_limiter

logger = logging.getLogger("linkedin_auth")
router = APIRouter(prefix="", tags=["LinkedIn OAuth"])

LINKEDIN_CLIENT_ID = os.environ.get("LINKEDIN_CLIENT_ID", "")
LINKEDIN_CLIENT_SECRET = os.environ.get("LINKEDIN_CLIENT_SECRET", "")
LINKEDIN_REDIRECT_URI = os.environ.get("LINKEDIN_REDIRECT_URI", "http://localhost:8000/auth/linkedin/callback")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

# Enforce strictly verified SSL for all external OAuth exchanges
ssl_ctx = ssl.create_default_context()

def generate_oauth_state() -> str:
    """Generate a tamper-proof time-bounded HMAC state token for CSRF protection."""
    timestamp = str(int(time.time()))
    random_entropy = secrets.token_hex(16)
    message = f"{timestamp}:{random_entropy}".encode('utf-8')
    signature = hmac.new(JWT_SECRET.encode('utf-8'), message, hashlib.sha256).hexdigest()
    return f"{timestamp}:{random_entropy}:{signature}"

def verify_oauth_state(state: str, max_age_seconds: int = 600) -> bool:
    """Verify cryptographic HMAC signature and age of OAuth state token."""
    if not state:
        return False
    parts = state.split(":")
    if len(parts) != 3:
        return False
    timestamp_str, random_entropy, signature = parts
    try:
        timestamp = int(timestamp_str)
        if time.time() - timestamp > max_age_seconds:
            return False # State expired (older than 10 minutes)
        
        expected_msg = f"{timestamp_str}:{random_entropy}".encode('utf-8')
        expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), expected_msg, hashlib.sha256).hexdigest()
        return hmac.compare_digest(signature, expected_sig)
    except Exception:
        return False


class LinkedInCodeRequest(BaseModel):
    code: str
    state: Optional[str] = None
    targetRole: Optional[str] = "Software Engineer"
    experienceLevel: Optional[str] = "Mid Level"


def exchange_code_for_token(code: str) -> dict:
    """Exchange LinkedIn authorization code for access token."""
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    data = urllib.parse.urlencode({
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
    }).encode("utf-8")

    req = urllib.request.Request(
        token_url,
        data=data,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_linkedin_userinfo(access_token: str) -> dict:
    """Fetch user profile from LinkedIn OpenID Connect userinfo endpoint."""
    req = urllib.request.Request(
        "https://api.linkedin.com/v2/userinfo",
        method="GET",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


@router.get("/auth/linkedin/url")
async def get_linkedin_auth_url():
    """Generate secure LinkedIn OAuth authorization URL with anti-CSRF state token."""
    if not LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_ID == "YOUR_LINKEDIN_CLIENT_ID_HERE":
        raise HTTPException(status_code=503, detail="LinkedIn OAuth is not configured yet. Set LINKEDIN_CLIENT_ID in backend .env.")

    state = generate_oauth_state()
    params = {
        "response_type": "code",
        "client_id": LINKEDIN_CLIENT_ID,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "state": state,
        "scope": "openid profile email"
    }
    auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urllib.parse.urlencode(params)}"
    return {
        "authUrl": auth_url,
        "state": state
    }


@router.post("/auth/linkedin", dependencies=[Depends(auth_rate_limiter)])
async def linkedin_auth(payload: LinkedInCodeRequest, db: Session = Depends(get_db)):
    """Exchange LinkedIn authorization code for a JWT token with CSRF state verification."""
    if not LINKEDIN_CLIENT_SECRET or LINKEDIN_CLIENT_SECRET == "YOUR_LINKEDIN_CLIENT_SECRET_HERE":
        raise HTTPException(status_code=503, detail="LinkedIn OAuth is not configured yet. Please set LINKEDIN_CLIENT_SECRET in the backend .env file.")

    # Validate anti-CSRF state token if provided
    if payload.state and not verify_oauth_state(payload.state):
        raise HTTPException(status_code=400, detail="Invalid or expired OAuth state token (potential CSRF attempt). Please initiate login again.")

    try:
        token_data = exchange_code_for_token(payload.code)
    except Exception as e:
        logger.error(f"LinkedIn token exchange failed: {e}")
        raise HTTPException(status_code=401, detail="Failed to exchange LinkedIn authorization code. Please try again.")

    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="LinkedIn did not return an access token.")

    try:
        user_info = get_linkedin_userinfo(access_token)
    except Exception as e:
        logger.error(f"LinkedIn userinfo fetch failed: {e}")
        raise HTTPException(status_code=401, detail="Failed to fetch LinkedIn profile.")

    email = user_info.get("email")
    name = user_info.get("name") or user_info.get("given_name", "")
    if user_info.get("family_name"):
        name = f"{name} {user_info['family_name']}".strip()

    if not email:
        raise HTTPException(status_code=400, detail="LinkedIn account must have a verified email. Please ensure your LinkedIn email is visible.")

    # Find or create user
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

    jwt_token = create_access_token(user_id=user.id, email=user.email)
    return {
        "token": jwt_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "targetRole": user.target_role,
            "experienceLevel": user.experience_level
        }
    }


@router.get("/auth/linkedin/callback")
async def linkedin_callback(code: str = None, state: str = None, error: str = None, error_description: str = None):
    """
    LinkedIn redirects here after user approves.
    Pass code and state back to frontend callback page with CSRF validation.
    """
    if error:
        frontend_redirect = f"{FRONTEND_URL}/login?linkedin_error={urllib.parse.quote(error_description or error)}"
        return RedirectResponse(url=frontend_redirect)

    if not code:
        return RedirectResponse(url=f"{FRONTEND_URL}/login?linkedin_error=no_code")

    # Anti-CSRF verification on callback
    if state and not verify_oauth_state(state):
        logger.warning(f"Rejected LinkedIn OAuth callback with invalid state parameter: {state}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login?linkedin_error={urllib.parse.quote('Invalid OAuth session state.')}")

    # Redirect to frontend callback route with code and state
    params = {"code": code}
    if state:
        params["state"] = state
    frontend_redirect = f"{FRONTEND_URL}/auth/linkedin/callback?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=frontend_redirect)
