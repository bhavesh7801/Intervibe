import os
import json
import logging
from typing import Optional, Any
from pathlib import Path
from dotenv import load_dotenv
import redis.asyncio as aioredis

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

# Configurable Redis URL with fallback to local Redis
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

class RedisManager:
    """Production-ready Redis connection manager for FastAPI."""
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self.is_connected: bool = False

    async def connect(self):
        """Initialize async Redis connection pool."""
        try:
            self.redis = aioredis.from_url(
                REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=5.0,
                socket_connect_timeout=5.0,
                retry_on_timeout=True
            )
            # Test ping to verify connection
            await self.redis.ping()
            self.is_connected = True
            logger.info(f"✅ Successfully connected to Redis at {REDIS_URL}")
        except Exception as e:
            self.is_connected = False
            logger.warning(f"⚠️ Redis connection failed ({e}). Operating in fallback/bypass mode.")

    async def disconnect(self):
        """Close Redis connection pool gracefully on shutdown."""
        if self.redis:
            await self.redis.close()
            self.is_connected = False
            logger.info("🔌 Redis connection pool closed.")

    async def get_cache(self, key: str) -> Optional[Any]:
        """Fetch and deserialize JSON value from Redis cache."""
        if not self.is_connected or not self.redis:
            return None
        try:
            data = await self.redis.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            logger.error(f"Redis GET error for key '{key}': {e}")
            return None

    async def set_cache(self, key: str, value: Any, ttl_seconds: int = 300) -> bool:
        """Serialize and store value in Redis with automatic TTL expiration."""
        if not self.is_connected or not self.redis:
            return False
        try:
            json_data = json.dumps(value)
            await self.redis.set(key, json_data, ex=ttl_seconds)
            return True
        except Exception as e:
            logger.error(f"Redis SET error for key '{key}': {e}")
            return False

    async def delete_cache(self, key: str) -> bool:
        """Delete key from Redis cache."""
        if not self.is_connected or not self.redis:
            return False
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis DELETE error for key '{key}': {e}")
            return False

    async def set_session_state(self, session_id: str, state_data: dict, ttl_seconds: int = 3600) -> bool:
        """Store transient interview state in Redis."""
        key = f"session_state:{session_id}"
        return await self.set_cache(key, state_data, ttl_seconds=ttl_seconds)

    async def get_session_state(self, session_id: str) -> Optional[dict]:
        """Retrieve transient interview state from Redis."""
        key = f"session_state:{session_id}"
        return await self.get_cache(key)

# Global Redis instance singleton
redis_client = RedisManager()
