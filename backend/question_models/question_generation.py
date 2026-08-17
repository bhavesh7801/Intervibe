from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal

class QuestionGenRequest(BaseModel):
    question_type: Optional[str] = Field("coding", description="Type of question to generate ('coding' or 'mcq')", max_length=20)
    type: Optional[str] = Field(None, description="Alias for question_type (e.g., 'dsa', 'coding', 'mcq')", max_length=20)
    topic: Optional[str] = Field("Arrays & Hashing", description="Subject or topic for the question", max_length=100)
    difficulty: Optional[str] = Field("Easy", description="Difficulty level (Easy, Medium, Hard)", max_length=20)
    language: Optional[str] = Field(None, description="Programming language for coding questions", max_length=20)
    exclude_titles: Optional[List[str]] = Field(default_factory=list, description="Titles to avoid generating duplicate questions for", max_length=50)
    resume_text: Optional[str] = Field(None, description="Extracted resume text to tailor the questions to the candidate's actual experience", max_length=50000)

    @property
    def is_dsa_or_coding(self) -> bool:
        t = (self.type or self.question_type or "").lower()
        return t in ["dsa", "coding"]

    @property
    def clean_topic(self) -> str:
        t = (self.topic or "").strip()
        return t if t else "Arrays & Hashing"

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
    mcq: Optional[MCQResponse] = None
    coding: Optional[CodingResponse] = None
