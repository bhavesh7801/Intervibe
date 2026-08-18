import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import (
    UserDB, SessionDB, QuestionDB, AnswerDB,
    SessionCreate, SessionResponse, QuestionResponse,
    AnswerSubmit, AnswerResponse
)
from ai_service import AIService
from auth_middleware import get_current_user, get_optional_current_user, get_current_user_simple

router = APIRouter(prefix="", tags=["Sessions & Analytics"])
ai_service = AIService()

@router.post("/sessions", response_model=SessionResponse)
async def create_session(
    session_data: SessionCreate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new interview session and generate questions"""
    if getattr(current_user, 'credits', 0) <= 0:
        raise HTTPException(status_code=402, detail="Insufficient credits. Please upgrade your account to generate more mock interviews.")
        
    current_user.credits -= 1
    db.add(current_user)

    raw_num = session_data.question_limit or session_data.num_questions or 10
    if raw_num > 50:
        raise HTTPException(status_code=400, detail="Maximum 50 questions permitted per interview session")
    num_questions = min(50, max(1, raw_num))

    questions_data = await ai_service.generate_questions(
        role=session_data.role,
        experience_level=current_user.experience_level,
        num_questions=num_questions,
        persona=session_data.persona or "Standard"
    )
    
    new_session = SessionDB(
        user_id=current_user.id,
        role=session_data.role,
        question_limit=num_questions,
        persona=session_data.persona or "Standard",
        status="in_progress"
    )
    db.add(new_session)
    db.flush()
    
    for idx, q in enumerate(questions_data):
        q_obj = QuestionDB(
            session_id=new_session.id,
            text=q.get("text", ""),
            category=q.get("category", "technical"),
            difficulty=q.get("difficulty", "medium"),
            order=idx
        )
        db.add(q_obj)
        
    db.commit()
    db.refresh(new_session)
    return SessionResponse.model_validate(new_session)

@router.get("/sessions", response_model=List[SessionResponse])
async def get_user_sessions(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all interview sessions for current candidate"""
    sessions = db.query(SessionDB).filter(SessionDB.user_id == current_user.id).order_by(SessionDB.date.desc()).all()
    return [SessionResponse.model_validate(s) for s in sessions]

@router.get("/sessions/{session_id}", response_model=SessionResponse)
async def get_session(
    session_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get single interview session details"""
    session_obj = db.query(SessionDB).filter(
        SessionDB.id == session_id,
        SessionDB.user_id == current_user.id
    ).first()
    
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return SessionResponse.model_validate(session_obj)

@router.post("/sessions/{session_id}/end", response_model=SessionResponse)
async def end_session(
    session_id: str,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """End an interview session and compute final candidate score"""
    session_obj = db.query(SessionDB).filter(
        SessionDB.id == session_id,
        SessionDB.user_id == current_user.id
    ).first()
    
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session_obj.status = "completed"
    answers = db.query(AnswerDB).filter(AnswerDB.session_id == session_id).all()
    if answers:
        scores = [getattr(a, 'ai_score', getattr(a, 'score', None)) for a in answers if getattr(a, 'ai_score', getattr(a, 'score', None)) is not None]
        if scores:
            session_obj.overall_score = round(sum(scores) / len(scores))
            
    db.commit()
    db.refresh(session_obj)
    return SessionResponse.model_validate(session_obj)

@router.post("/answers", response_model=AnswerResponse)
async def submit_answer(
    answer_data: AnswerSubmit,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit candidate answer and evaluate with AI Service"""
    question = db.query(QuestionDB).filter(QuestionDB.id == answer_data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    user_text = answer_data.transcript if hasattr(answer_data, 'transcript') and answer_data.transcript else getattr(answer_data, 'user_answer', '')

    existing_answer = db.query(AnswerDB).filter(
        AnswerDB.session_id == answer_data.session_id,
        AnswerDB.question_id == answer_data.question_id
    ).first()
    
    eval_result = await ai_service.evaluate_answer(
        question_text=question.text,
        user_answer=user_text,
        category=question.category
    )
    
    score_val = eval_result.get("score") or eval_result.get("ai_score") or 70
    
    # Track weakness if score is low
    if score_val < 65:
        current_weak_areas = current_user.weak_areas or []
        # Try to identify a concise topic from the question category or text
        topic = question.category
        if "design" in question.text.lower():
            topic = "System Design"
        elif "behavioral" in question.category.lower():
            topic = "Behavioral (STAR)"
            
        if topic and topic not in current_weak_areas:
            # We must assign a new list for SQLAlchemy JSON column mutation to be detected
            current_user.weak_areas = current_weak_areas + [topic]
            db.add(current_user)

    if existing_answer:
        existing_answer.transcript = user_text
        existing_answer.ai_score = score_val
        existing_answer.feedback = eval_result.get("feedback", "")
        existing_answer.strengths = eval_result.get("strengths", [])
        existing_answer.improvements = eval_result.get("improvements", [])
        ans_obj = existing_answer
    else:
        ans_obj = AnswerDB(
            session_id=answer_data.session_id,
            question_id=answer_data.question_id,
            transcript=user_text,
            ai_score=score_val,
            feedback=eval_result.get("feedback", ""),
            strengths=eval_result.get("strengths", []),
            improvements=eval_result.get("improvements", [])
        )
        db.add(ans_obj)
        
    db.commit()
    db.refresh(ans_obj)
    return AnswerResponse.model_validate(ans_obj)

@router.get("/stats")
@router.get("/user/stats")
async def get_user_stats(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate overall candidate performance analytics using SQL aggregate functions for maximum speed"""
    user_id = current_user.id
    
    total_sessions = db.query(func.count(SessionDB.id)).filter(SessionDB.user_id == user_id).scalar() or 0
    completed_sessions = db.query(func.count(SessionDB.id)).filter(SessionDB.user_id == user_id, SessionDB.status == "completed").scalar() or 0
    
    total_questions = db.query(func.count(AnswerDB.id)).join(SessionDB).filter(SessionDB.user_id == user_id).scalar() or 0
    avg_score_res = db.query(func.avg(AnswerDB.ai_score)).join(SessionDB).filter(SessionDB.user_id == user_id).scalar()
    
    avg_score = round(float(avg_score_res)) if avg_score_res is not None else 0

    # Fetch all activity dates
    session_dates = db.query(SessionDB.date).filter(SessionDB.user_id == user_id).all()
    # Assuming CodeSubmissionDB is imported, but we might need to import it at the top. Let's do it inline to avoid circular imports if any, or just import it at top.
    from models import CodeSubmissionDB
    code_dates = db.query(CodeSubmissionDB.created_at).filter(CodeSubmissionDB.user_id == user_id).all()

    activity_dates = []
    for (d,) in session_dates:
        if d:
            activity_dates.append(d.strftime("%Y-%m-%d"))
    for (d,) in code_dates:
        if d:
            activity_dates.append(d.strftime("%Y-%m-%d"))

    # Calculate Streak
    date_set = set(activity_dates)
    streak_count = 0
    if date_set:
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        import datetime as dt
        today = dt.datetime.utcnow().date()
        yesterday = today - dt.timedelta(days=1)
        
        current_check_date = None
        if today_str in date_set:
            streak_count = 1
            current_check_date = yesterday
        elif yesterday.strftime("%Y-%m-%d") in date_set:
            streak_count = 1
            current_check_date = yesterday - dt.timedelta(days=1)

        while current_check_date and current_check_date.strftime("%Y-%m-%d") in date_set:
            streak_count += 1
            current_check_date -= dt.timedelta(days=1)

    solved_challenges = db.query(func.count(func.distinct(CodeSubmissionDB.question_id))).filter(
        CodeSubmissionDB.user_id == user_id, 
        CodeSubmissionDB.status == "Accepted"
    ).scalar() or 0
    
    return {
        "totalSessions": total_sessions,
        "completedSessions": completed_sessions,
        "totalQuestionsAnswered": total_questions,
        "averageScore": avg_score,
        "activityDates": activity_dates,
        "practiceStreak": streak_count,
        "solvedChallenges": solved_challenges
    }
