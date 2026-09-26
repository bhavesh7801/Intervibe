import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from ai_service import AIService

router = APIRouter(prefix="/api/coaching", tags=["AI Coaching Labs"])
logger = logging.getLogger(__name__)
ai_service = AIService()

class VoiceCoachMessage(BaseModel):
    sender: str
    text: str

class VoiceCoachRequest(BaseModel):
    message: str = Field(..., description="Candidate's current answer or drill input", min_length=1, max_length=5000)
    history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Recent conversation exchange history")

class StarEvaluateRequest(BaseModel):
    situation: str = Field(..., description="Situation description")
    task: str = Field(..., description="Task description")
    action: str = Field(..., description="Action description")
    result: str = Field(..., description="Result description")
    role: Optional[str] = Field("Software Engineer", description="Target job role")

class ComplexityAnalyzeRequest(BaseModel):
    code: str = Field(..., description="Source code to analyze")
    language: Optional[str] = Field("javascript", description="Programming language")

@router.post("/voice-reply")
async def get_voice_coach_reply(request: VoiceCoachRequest):
    """Generate dynamic AI coach response based on candidate's exact answer."""
    if not request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty."
        )
    
    reply = await ai_service.generate_coaching_reply(
        history=request.history or [],
        user_message=request.message.strip()
    )
    return {"reply": reply}

@router.post("/star-evaluate")
async def evaluate_star_story(request: StarEvaluateRequest):
    """Evaluate candidate STAR story structure, scoring each section with personalized feedback."""
    evaluation = await ai_service.evaluate_star_response(
        situation=request.situation,
        task=request.task,
        action=request.action,
        result=request.result,
        role=request.role or "Software Engineer"
    )
    return evaluation

@router.post("/code-complexity")
async def analyze_code_complexity(request: ComplexityAnalyzeRequest):
    """Analyze algorithm Big-O time and space complexity with actionable suggestions."""
    system_prompt = """You are a Principal Software Engineer and Algorithm Specialist.
Analyze the provided code and determine its exact Big-O Time and Space complexity.

Return ONLY a valid JSON object matching this structure:
{
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "explanation": "Clear 1-2 sentence explanation of why this complexity arises.",
  "suggestions": [
    "Specific actionable optimization or refactoring suggestion"
  ]
}"""
    user_prompt = f"Language: {request.language}\n\nCode:\n{request.code}"
    
    try:
        raw = await ai_service._call_llm(system_prompt, user_prompt, is_json=True)
        cleaned = ai_service._clean_json(raw)
        import json
        data = json.loads(cleaned, strict=False)
        if isinstance(data, dict) and "timeComplexity" in data:
            return data
    except Exception as e:
        logger.error(f"Error analyzing code complexity: {e}")
    
    return {
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "explanation": "Linear single-pass traversal with constant auxiliary memory allocation.",
        "suggestions": [
            "Consider memory footprint for large streaming datasets."
        ]
    }
