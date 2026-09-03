import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from contextlib import asynccontextmanager

import traceback
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, init_db_schema
from redis_service import redis_client
from rate_limiter import public_rate_limiter, authed_rate_limiter, llm_rate_limiter

# Import modular API Routers
from api.question_generation import router as question_generation_router
from api.streaming import router as streaming_router
from api.code_execution import router as code_execution_router
from api.code_questions import router as code_questions_router
from api.audio_transcription import router as audio_transcription_router
from api.audio_tts import router as audio_tts_router

from routes.auth_routes import router as auth_router
from routes.session_routes import router as session_router
from routes.feedback_routes import router as feedback_router
from routes.resume_routes import router as resume_router
from routes.leaderboard_routes import router as leaderboard_router
from routes.system_design_routes import router as system_design_router
from routes.certificate_routes import router as certificate_router
from routes.linkedin_routes import router as linkedin_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("server")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan manager for async Redis connection lifecycle"""
    logger.info("🚀 Starting Interview Prep AI Server...")
    await redis_client.connect()
    
    if redis_client.is_connected and redis_client.redis:
        logger.info("✅ Connected to Redis successfully")

    yield
    logger.info("🛑 Shutting down server and closing Redis connection...")
    await redis_client.disconnect()

# Auto-migrate database tables in Supabase PostgreSQL / SQLite
Base.metadata.create_all(bind=engine)
init_db_schema()

app = FastAPI(
    title="Intervibe AI Enterprise Server",
    description="Modularized AI Interview Intelligence Backend",
    version="2.5.0",
    lifespan=lifespan
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Inject defensive HTTP response security headers on all endpoints."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch all unhandled exceptions, log the full traceback server-side,
    and return a generic 500 error to the client to prevent leaking sensitive details.
    """
    logger.error(f"Unhandled Exception on {request.method} {request.url}")
    logger.error(traceback.format_exc())
    
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Robust Multi-Origin CORS Configuration
cors_raw = os.environ.get("CORS_ORIGINS") or os.environ.get("FRONTEND_URL") or "http://localhost:5173"
if cors_raw == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [orig.strip() for orig in cors_raw.split(",") if orig.strip()]
    for default_origin in [
        "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173",
        "http://intervibe.duckdns.org", "https://intervibe.duckdns.org"
    ]:
        if default_origin not in allowed_origins:
            allowed_origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Domain APIRouters (Auth routes have internal specific rate limiters)
app.include_router(auth_router)
app.include_router(linkedin_router)
app.include_router(session_router, dependencies=[Depends(authed_rate_limiter)])
app.include_router(feedback_router, dependencies=[Depends(authed_rate_limiter)])
app.include_router(resume_router, dependencies=[Depends(authed_rate_limiter)])
app.include_router(leaderboard_router, dependencies=[Depends(public_rate_limiter)])
app.include_router(system_design_router, dependencies=[Depends(authed_rate_limiter)])
app.include_router(certificate_router, dependencies=[Depends(public_rate_limiter)])

# Mount AI Engine Sub-Routers
app.include_router(question_generation_router, dependencies=[Depends(authed_rate_limiter)])  # /api/questions/generate
app.include_router(streaming_router, dependencies=[Depends(authed_rate_limiter)])            # /api/stream/evaluate-answer
app.include_router(code_execution_router, dependencies=[Depends(authed_rate_limiter)])       # /api/code/run
app.include_router(code_questions_router, dependencies=[Depends(authed_rate_limiter)])       # /api/code/questions
app.include_router(audio_transcription_router, dependencies=[Depends(authed_rate_limiter)])  # /api/audio/transcribe
app.include_router(audio_tts_router, dependencies=[Depends(authed_rate_limiter)])            # /api/audio/tts

@app.get("/")
async def root_health_check():
    return {
        "status": "online",
        "service": "Interview Prep AI Backend Engine",
        "version": "2.5.0",
        "architecture": "Modular APIRouter Architecture"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
