from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional, Literal, Any

class InterviewQuestionItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    id: Optional[str] = None
    title: str
    category: Optional[str] = "System Design & Architecture"
    difficulty: Optional[str] = "Medium"
    company: Optional[str] = "Google"
    role: Optional[str] = "Senior Software Engineer"
    timeLimitMinutes: Optional[int] = 20
    prompt: str
    evaluationRubric: Optional[List[str]] = Field(default_factory=list)
    speakingTips: Optional[List[str]] = Field(default_factory=list)
    hints: Optional[List[str]] = Field(default_factory=list)

class QuestionGenRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    question_type: Optional[str] = Field("coding", description="Type of question to generate ('coding', 'mcq', 'interview', 'aptitude')", max_length=50)
    type: Optional[str] = Field(None, description="Alias for question_type (e.g., 'dsa', 'coding', 'mcq', 'interview')", max_length=50)
    topic: Optional[str] = Field(None, description="Subject or topic for the question", max_length=200)
    prompt: Optional[str] = Field(None, description="Topic or scenario prompt alias", max_length=500)
    role: Optional[str] = Field("Senior Software Engineer", description="Target role", max_length=100)
    company: Optional[str] = Field("Google", description="Target company", max_length=100)
    difficulty: Optional[str] = Field("Medium", description="Difficulty level (Easy, Medium, Hard)", max_length=20)
    num_questions: Optional[int] = Field(1, description="Number of questions to generate", ge=1, le=20)
    language: Optional[str] = Field(None, description="Programming language for coding questions", max_length=20)
    exclude_titles: Optional[List[str]] = Field(default_factory=list, description="Titles to avoid generating duplicate questions for", max_length=50)
    resume_text: Optional[str] = Field(None, description="Extracted resume text to tailor the questions to the candidate's actual experience", max_length=50000)
    persona: Optional[str] = Field("Standard", description="Interviewer persona", max_length=50)

    @property
    def is_dsa_or_coding(self) -> bool:
        t = (self.type or self.question_type or "").lower()
        return t in ["dsa", "coding"]

    @property
    def clean_topic(self) -> str:
        t = (self.topic or self.prompt or "").strip()
        return t if t else "Distributed Systems & Algorithms"

class MCQResponse(BaseModel):
    title: str
    description: str
    options: List[str]
    correct_answer: str = Field(..., description="Letter of the correct option, e.g., 'B'")
    explanation: Optional[str] = None

class CodingResponse(BaseModel):
    title: str
    description: str
    starter_code: Dict[str, str] = Field(..., description="Mapping language -> starter code snippet")
    test_cases: List[Dict[str, str]] = Field(..., description="List of test case objects with 'input' and 'expected'")

class QuestionGenResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")

    mcq: Optional[MCQResponse] = None
    coding: Optional[CodingResponse] = None
    questions: Optional[List[InterviewQuestionItem]] = None
    status: Optional[str] = "success"

