import os
import time
import math
from fastapi import Request, HTTPException, status
from redis_service import redis_client

# Configs
AUTH_IP_MAX = int(os.getenv("RATE_LIMIT_AUTH_IP_MAX", 5))
AUTH_ACCOUNT_MAX = int(os.getenv("RATE_LIMIT_AUTH_ACCOUNT_MAX", 5))
PUBLIC_MAX = int(os.getenv("RATE_LIMIT_PUBLIC_MAX", 20))
AUTHED_MAX = int(os.getenv("RATE_LIMIT_AUTHED_MAX", 100))
WINDOW = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", 60))
LLM_MAX = int(os.getenv("RATE_LIMIT_LLM_MAX", 10))
LLM_WINDOW = int(os.getenv("RATE_LIMIT_LLM_WINDOW_SECONDS", 3600)) # 1 hour

async def get_email_from_request(request: Request) -> str | None:
    """Safely attempts to parse the email from the request body."""
    try:
        # We must await body, then parse. FastAPI allows multiple reads if we use request.json()
        body = await request.json()
        return body.get("email")
    except Exception:
        return None

async def apply_exponential_backoff(key: str, max_attempts: int, window: int):
    """
    Tracks attempts in a sliding window. If max is exceeded, sets a lockout key 
    with an exponentially increasing TTL based on excess attempts.
    """
    if not redis_client.redis:
        return
    
    lockout_key = f"lockout:{key}"
    ttl = await redis_client.redis.ttl(lockout_key)
    if ttl > 0:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many attempts. Please try again in {ttl} seconds.",
            headers={"Retry-After": str(ttl)}
        )
        
    current_time = int(time.time())
    pipe = redis_client.redis.pipeline()
    # Clean up old attempts
    pipe.zremrangebyscore(key, 0, current_time - window)
    # Add new attempt (unique member via milliseconds)
    pipe.zadd(key, {f"{current_time}-{math.floor(time.time()*1000)}": current_time})
    # Count current attempts in window
    pipe.zcard(key)
    # Refresh TTL of the set
    pipe.expire(key, window * 2)
    results = await pipe.execute()
    
    attempts = results[2]
    
    if attempts > max_attempts:
        excess = attempts - max_attempts
        delay = min(2 ** excess, 3600) # Cap at 1 hour
        await redis_client.redis.setex(lockout_key, delay, "locked")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many attempts. Please try again in {delay} seconds.",
            headers={"Retry-After": str(delay)}
        )

def get_client_ip(request: Request) -> str:
    """Extract true client IP address honoring reverse proxies (Nginx/Cloudflare/AWS ALB)."""
    forwarded = request.headers.get("x-forwarded-for") or request.headers.get("x-real-ip")
    if forwarded:
        # X-Forwarded-For can be a comma-separated list; first entry is the client
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

async def auth_rate_limiter(request: Request):
    """Stricter limits for authentication endpoints with exponential backoff."""
    ip = get_client_ip(request)
    email = await get_email_from_request(request)
    
    if ip:
        await apply_exponential_backoff(f"ratelimit:auth:ip:{ip}", AUTH_IP_MAX, WINDOW)
        
    if email:
        await apply_exponential_backoff(f"ratelimit:auth:acc:{email}", AUTH_ACCOUNT_MAX, WINDOW)

async def public_rate_limiter(request: Request):
    """Moderate limits for public endpoints (Sliding Window)."""
    ip = get_client_ip(request)
    if not ip or not redis_client.redis:
        return
        
    key = f"ratelimit:public:ip:{ip}"
    current_time = int(time.time())
    
    pipe = redis_client.redis.pipeline()
    pipe.zremrangebyscore(key, 0, current_time - WINDOW)
    pipe.zadd(key, {f"{current_time}-{math.floor(time.time()*1000)}": current_time})
    pipe.zcard(key)
    pipe.expire(key, WINDOW)
    
    results = await pipe.execute()
    attempts = results[2]
    
    if attempts > PUBLIC_MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests to public endpoints.",
            headers={"Retry-After": str(WINDOW)}
        )

async def authed_rate_limiter(request: Request):
    """Looser limits for authenticated actions."""
    ip = get_client_ip(request)
    if not ip or not redis_client.redis:
        return
        
    key = f"ratelimit:authed:ip:{ip}"
    current_time = int(time.time())
    
    pipe = redis_client.redis.pipeline()
    pipe.zremrangebyscore(key, 0, current_time - WINDOW)
    pipe.zadd(key, {f"{current_time}-{math.floor(time.time()*1000)}": current_time})
    pipe.zcard(key)
    pipe.expire(key, WINDOW)
    
    results = await pipe.execute()
    attempts = results[2]
    
    if attempts > AUTHED_MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please slow down.",
            headers={"Retry-After": str(WINDOW)}
        )

async def llm_rate_limiter(request: Request):
    """Extremely strict limits for AI Generation endpoints."""
    ip = get_client_ip(request)
    email = await get_email_from_request(request)
    
    if ip:
        await apply_exponential_backoff(f"ratelimit:llm:ip:{ip}", LLM_MAX, LLM_WINDOW)
    if email:
        await apply_exponential_backoff(f"ratelimit:llm:acc:{email}", LLM_MAX, LLM_WINDOW)
