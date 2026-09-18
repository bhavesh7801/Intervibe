from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from pathlib import Path
import bcrypt
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # 1. Truncate to 72 bytes
    safe_password = password[:72].encode('utf-8')
    # 2. Hash using bcrypt directly
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(safe_password, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    # 1. Truncate to 72 bytes
    safe_password = plain_password[:72].encode('utf-8')
    # 2. Verify
    return bcrypt.checkpw(safe_password, hashed_password.encode('utf-8'))

# JWT token handling
import secrets
import logging

logger = logging.getLogger("auth_utils")

_raw_jwt_secret = os.environ.get('JWT_SECRET', '').strip()
_env = os.environ.get('ENVIRONMENT', 'development').lower()

if _raw_jwt_secret and _raw_jwt_secret not in ("YOUR_JWT_SECRET_HERE", "secret", "changeme", "default_secret"):
    JWT_SECRET = _raw_jwt_secret
else:
    if _env == "production":
        raise RuntimeError(
            "CRITICAL SECURITY ERROR: 'JWT_SECRET' environment variable is missing or using an insecure default in production! "
            "Please configure a strong, random 64-character JWT_SECRET in your backend environment variables."
        )
    else:
        logger.warning(
            "⚠️ JWT_SECRET is not configured in backend/.env. Using a generated ephemeral secret for development. "
            "Define a fixed JWT_SECRET in .env to maintain active login sessions across restarts."
        )
        JWT_SECRET = os.environ.get("EPHEMERAL_DEV_JWT_SECRET") or secrets.token_hex(32)
        os.environ["EPHEMERAL_DEV_JWT_SECRET"] = JWT_SECRET

JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', '24'))

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expire
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
