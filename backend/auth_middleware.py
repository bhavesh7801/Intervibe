from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models import UserDB
from auth_utils import decode_token

security = HTTPBearer(auto_error=False)

async def get_current_user_simple(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Validate JWT and return payload dict"""
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return payload

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> UserDB:
    """Validate JWT and return UserDB instance"""
    payload = await get_current_user_simple(credentials)
    user = db.query(UserDB).filter(UserDB.id == payload['user_id']).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[UserDB]:
    """Retrieve UserDB instance if authenticated, or return None"""
    if not credentials or not credentials.credentials:
        return None
    try:
        payload = decode_token(credentials.credentials)
        if not payload or 'user_id' not in payload:
            return None
        return db.query(UserDB).filter(UserDB.id == payload['user_id']).first()
    except Exception:
        return None
