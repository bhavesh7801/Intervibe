from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional
from ai_service import AIService

router = APIRouter(prefix="/api/stream", tags=["streaming"])

ai_service = AIService()

class StreamEvaluateRequest(BaseModel):
    question_text: str = Field(..., description="Text of the interview question", min_length=1, max_length=10000)
    transcript: str = Field(..., description="Candidate's answer text or transcript", min_length=10, max_length=20000)
    role: Optional[str] = Field("Software Engineer", description="Target job role", max_length=100)
    session_id: Optional[str] = Field(None, description="Optional session ID", max_length=100)
    persona: Optional[str] = Field("Standard", description="Interviewer Persona", max_length=50)

@router.post("/evaluate-answer")
async def stream_evaluate_answer(request: StreamEvaluateRequest):
    """Stream token-by-token feedback evaluation as Server-Sent Events (SSE).
    Content-Type: text/event-stream
    """
    if not request.transcript.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript answer cannot be empty."
        )

    generator = ai_service.stream_score_answer(
        question=request.question_text,
        answer=request.transcript,
        role=request.role or "Software Engineer",
        persona=request.persona or "Standard"
    )

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
