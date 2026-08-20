import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from ai_service import AIService
from auth_middleware import get_optional_current_user
from models import UserDB

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/system-design", tags=["System Design Evaluation"])
ai_service = AIService()

class SystemDesignEvaluationRequest(BaseModel):
    problem_title: str
    requirements: Optional[List[str]] = None
    topology: Dict[str, Any]

@router.post("/evaluate")
async def evaluate_system_design(
    req: SystemDesignEvaluationRequest,
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Evaluates a visual system design architecture topology using Groq AI"""
    try:
        result = await ai_service.evaluate_system_architecture(
            topology=req.topology,
            problem_title=req.problem_title,
            requirements=req.requirements
        )
        return result
    except Exception as e:
        logger.error(f"Error evaluating system design architecture: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to evaluate architecture topology: {str(e)}"
        )
