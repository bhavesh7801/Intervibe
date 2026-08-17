from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from database import Base

class UserDB(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    target_role = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # OTP Authentication Fields for SendGrid Email Verification
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    is_verified = Column(Boolean, default=False)

    # Persisted Starred Questions across devices
    starred_questions = Column(JSON, default=list)
    
    # Track topics where the user scored poorly
    weak_areas = Column(JSON, default=list)

    # Monetization / Credit System
    credits = Column(Integer, default=5)

    sessions = relationship("SessionDB", back_populates="user", cascade="all, delete-orphan")


class SessionDB(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role = Column(String, nullable=False)
    question_limit = Column(Integer, default=10)
    persona = Column(String, default="Standard")
    date = Column(DateTime, default=datetime.utcnow)
    overall_score = Column(Integer, nullable=True)
    status = Column(String, default="in_progress")

    user = relationship("UserDB", back_populates="sessions")
    questions = relationship("QuestionDB", back_populates="session", cascade="all, delete-orphan", order_by="QuestionDB.order")
    answers = relationship("AnswerDB", back_populates="session", cascade="all, delete-orphan")


class QuestionDB(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    order = Column(Integer, default=0)

    session = relationship("SessionDB", back_populates="questions")
    answer = relationship("AnswerDB", back_populates="question", uselist=False, cascade="all, delete-orphan")


class AnswerDB(Base):
    __tablename__ = "answers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    transcript = Column(Text, nullable=False)
    ai_score = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=False)
    strengths = Column(JSON, nullable=True)
    improvements = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("SessionDB", back_populates="answers")
    question = relationship("QuestionDB", back_populates="answer")


# ==========================================
# 2. Pydantic Schemas for FastAPI Endpoints
# ==========================================

# User Schemas
class UserCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: str = Field(..., min_length=2, max_length=64)
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    target_role: str = Field(alias="targetRole", min_length=2, max_length=64)
    experience_level: str = Field(alias="experienceLevel", min_length=2, max_length=64)


class UserLogin(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


class GoogleAuthRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    token: str = Field(..., min_length=1, max_length=4096)
    target_role: Optional[str] = Field(default=None, alias="targetRole", max_length=64)
    experience_level: Optional[str] = Field(default=None, alias="experienceLevel", max_length=64)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    name: str
    email: EmailStr
    target_role: str = Field(alias="targetRole")
    experience_level: str = Field(alias="experienceLevel")
    created_at: datetime = Field(alias="createdAt")
    weak_areas: List[str] = Field(default=[], alias="weakAreas")
    credits: int = Field(default=5)


class UserUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    name: Optional[str] = Field(default=None, min_length=2, max_length=64)
    target_role: Optional[str] = Field(default=None, alias="targetRole", max_length=64)
    experience_level: Optional[str] = Field(default=None, alias="experienceLevel", max_length=64)



# Question Schemas
class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    text: str
    category: str
    difficulty: str


# Answer Schemas
class AnswerSubmit(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    question_id: str = Field(alias="questionId", min_length=1, max_length=100)
    question_text: str = Field(alias="questionText", min_length=1, max_length=10000)
    transcript: str = Field(..., min_length=5, max_length=20000)
    session_id: str = Field(alias="sessionId", min_length=1, max_length=100)


class AnswerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    question_id: str = Field(alias="questionId")
    transcript: str
    ai_score: int = Field(alias="aiScore")
    feedback: str
    strengths: List[str] = []
    improvements: List[str] = []
    created_at: datetime = Field(alias="createdAt")


# Session Schemas
class SessionCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    role: str = Field(..., min_length=2, max_length=100)
    num_questions: int = Field(default=10, ge=1, le=50, alias="numQuestions")
    question_limit: Optional[int] = Field(default=None, ge=1, le=50, alias="questionLimit")
    persona: Optional[str] = Field(default="Standard", max_length=50)


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    user_id: str = Field(alias="userId")
    role: str
    question_limit: int = Field(default=10, alias="questionLimit")
    date: datetime
    questions: List[QuestionResponse] = []
    answers: List[AnswerResponse] = []
    overall_score: Optional[int] = Field(default=None, alias="overallScore")
    status: str


# OTP Verification Schemas
class OTPVerifyRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class ResendOTPRequest(BaseModel):
    email: EmailStr = Field(..., max_length=255)


# ==========================================
# 3. Coding Workspace & IDE Schemas
# ==========================================
class CodingQuestionDB(Base):
    __tablename__ = "coding_questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False) # Easy, Medium, Hard
    category = Column(String, nullable=False)  # Algorithms, Data Structures, System Design
    starter_code = Column(JSON, nullable=False) # {"python": "...", "javascript": "...", "cpp": "...", "java": "..."}
    test_cases = Column(JSON, nullable=False)   # [{"input": "...", "expected": "...", "hidden": false}]
    created_at = Column(DateTime, default=datetime.utcnow)


class CodeSubmissionDB(Base):
    __tablename__ = "code_submissions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String, ForeignKey("coding_questions.id", ondelete="CASCADE"), nullable=False)
    language = Column(String, nullable=False)
    source_code = Column(Text, nullable=False)
    status = Column(String, nullable=False) # Accepted, Wrong Answer, Compile Error, Runtime Error
    execution_time = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class CodeRunRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    language: str = Field(..., min_length=1, max_length=20, pattern=r"^[a-z0-9\+\#]+$")
    source_code: str = Field(alias="sourceCode", min_length=1, max_length=50000)
    stdin: Optional[str] = Field(default="", max_length=10000)


class CodeRunResponse(BaseModel):
    output: str
    stderr: Optional[str] = ""
    execution_time: Optional[str] = "0.00s"
    exit_code: int = 0
    status: str = "Success"


class CodingQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: str
    title: str
    slug: str
    description: str
    difficulty: str
    category: str
    starter_code: dict = Field(alias="starterCode")
    test_cases: List[dict] = Field(alias="testCases")


# ==========================================
# 4. Unified Hybrid Assessment Models
# ==========================================
class HybridQuestionDB(Base):
    __tablename__ = "hybrid_questions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    question_type = Column(String, nullable=False) # 'mcq' or 'coding'
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    # MCQ Fields
    options = Column(JSON, nullable=True) # ["A. ...", "B. ...", "C. ...", "D. ..."]
    correct_answer = Column(String, nullable=True) # "A", "B", "C", or "D"
    explanation = Column(Text, nullable=True)

    # Coding Fields
    starter_code = Column(JSON, nullable=True) # {"python": "...", "javascript": "..."}
    test_cases = Column(JSON, nullable=True)   # [{"input": "...", "expected": "..."}]

    created_at = Column(DateTime, default=datetime.utcnow)


class UserAttemptDB(Base):
    __tablename__ = "user_attempts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String, ForeignKey("hybrid_questions.id", ondelete="CASCADE"), nullable=False)
    question_type = Column(String, nullable=False) # 'mcq' or 'coding'
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class MCQSubmitRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    question_id: str = Field(alias="questionId", min_length=1, max_length=100)
    selected_option: str = Field(alias="selectedOption", min_length=1, max_length=10)


class MCQSubmitResponse(BaseModel):
    is_correct: bool = Field(alias="isCorrect")
    score: int
    correct_answer: str = Field(alias="correctAnswer")
    explanation: str


class HybridQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
    id: str
    title: str
    question_type: str = Field(alias="questionType")
    category: str
    difficulty: str

class FeedbackDB(Base):
    __tablename__ = "feedbacks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=True)
    user_name = Column(String, nullable=True)
    user_email = Column(String, nullable=False)
    category = Column(String, nullable=False) # 'Feedback', 'Bug Report', 'Complaint', 'Inquiry'
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    status = Column(String, default="open") # 'open', 'resolved'
    created_at = Column(DateTime, default=datetime.utcnow)


class FeedbackCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    category: str = Field(default="General Feedback", max_length=50)
    subject: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5, max_length=2000)
    rating: Optional[int] = Field(default=5, ge=1, le=5)
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    name: Optional[str] = Field(default=None, max_length=100)



