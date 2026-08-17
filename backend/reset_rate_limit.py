import redis
import os
from dotenv import load_dotenv

load_dotenv(r"c:\Users\ratho\OneDrive\Desktop\coding\ai interview prep platform\backend\.env")
r = redis.from_url(os.getenv("REDIS_URL"))
keys_deleted = 0
for key in r.scan_iter("*ratelimit*"):
    r.delete(key)
    keys_deleted += 1
for key in r.scan_iter("*lockout*"):
    r.delete(key)
    keys_deleted += 1
print(f"Rate limiter reset! Deleted {keys_deleted} tracking keys.")
