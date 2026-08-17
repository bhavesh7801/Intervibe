from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from auth_utils import decode_token
from database import get_db
from models import UserDB

security = HTTPBearer()

# 1. Simple: Just validates the JWT token (fast, no DB call)
async def get_current_user_simple(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired token"
        )
    return payload  # Returns dictionary with user_id and email

# 2. Advanced: Validates token AND fetches full user object from SQLAlchemy DB
async def get_current_user_full(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    user = db.query(UserDB).filter(UserDB.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user