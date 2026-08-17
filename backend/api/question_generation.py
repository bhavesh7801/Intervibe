import os
import json
import re
import ssl
import urllib.request
import urllib.error
import uuid
import random
import time
from pathlib import Path
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from rate_limiter import authed_rate_limiter
from question_models.question_generation import QuestionGenRequest, QuestionGenResponse, MCQResponse, CodingResponse

class StarEvaluationRequest(BaseModel):
    prompt: str = Field(..., min_length=10, max_length=5000)
    situation: str = Field(..., min_length=10, max_length=5000)
    task: str = Field(..., min_length=10, max_length=5000)
    action: str = Field(..., min_length=10, max_length=5000)
    result: str = Field(..., min_length=10, max_length=5000)

load_dotenv(Path(__file__).parent.parent / ".env")

router = APIRouter(prefix="/api", tags=["question-generation"])

HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = "Qwen/Qwen2.5-7B-Instruct"

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "openai/gpt-oss-120b"
GROQ_FALLBACK_MODEL = "openai/gpt-oss-20b"


def _create_ssl_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


def _call_gemini(prompt_system: str, prompt_user: str) -> str:
    """Call Google Gemini API using GEMINI_API_KEY with 10s timeout."""
    key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    if not key or len(key) < 10:
        raise ValueError("GEMINI_API_KEY is missing or too short")
    
    models_to_try = [
        "gemini-3.5-flash",
        "gemini-2.5-flash",
        "gemini-flash-latest"
    ]
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{prompt_system}\n\nTask Instructions:\n{prompt_user}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.9,
            "responseMimeType": "application/json"
        }
    }

    last_err = None
    for model in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, context=_create_ssl_context(), timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
                raise ValueError(f"Invalid Gemini response format: {data}")
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8", errors="ignore")
            last_err = f"Gemini API ({model}) HTTP Error {e.code}: {err_msg}"
            if e.code in [404, 503, 429]:
                time.sleep(1) # Backoff for 1s
                continue 
            break
        except Exception as e:
            last_err = f"Gemini API ({model}) Error: {str(e)}"
            continue

    raise RuntimeError(last_err or "Gemini API execution failed")


def _call_hf(prompt_system: str, prompt_user: str) -> str:
    """Call Hugging Face Router API using HF_API_TOKEN with 12s timeout."""
    token = os.getenv("HF_API_TOKEN", "").strip()
    if not token:
        raise ValueError("HF_API_TOKEN is not configured")
    payload = {
        "model": HF_MODEL,
        "messages": [
            {"role": "system", "content": prompt_system},
            {"role": "user", "content": prompt_user},
        ],
        "temperature": 0.9,
    }
    req = urllib.request.Request(
        HF_ROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, context=_create_ssl_context(), timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HuggingFace API HTTP Error {e.code}: {err_msg}")
    except Exception as e:
        raise RuntimeError(f"HuggingFace API Error: {str(e)}")


def _call_groq(prompt_system: str, prompt_user: str) -> str:
    """Call Groq Chat API with openai/gpt-oss-120b and fallback to openai/gpt-oss-20b."""
    key = os.getenv("GROQ_API_KEY", "").strip()
    if not key:
        raise ValueError("GROQ_API_KEY is not configured")
    
    for model_name in [GROQ_MODEL, GROQ_FALLBACK_MODEL]:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": prompt_system},
                {"role": "user", "content": prompt_user},
            ],
            "temperature": 0.85,
            "max_tokens": 4096
        }
        req = urllib.request.Request(
            GROQ_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, context=_create_ssl_context(), timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            continue
            
    raise RuntimeError("All Groq models failed to generate response")


def _call_llm(prompt_system: str, prompt_user: str) -> str:
    """Try Groq API first (ultra-fast), then Gemini, then Hugging Face."""
    errors = []

    if os.getenv("GROQ_API_KEY"):
        try:
            return _call_groq(prompt_system, prompt_user)
        except Exception as e:
            errors.append(f"[Groq Error] {str(e)}")

    if os.getenv("GEMINI_API_KEY"):
        try:
            return _call_gemini(prompt_system, prompt_user)
        except Exception as e:
            errors.append(f"[Gemini Error] {str(e)}")

    if os.getenv("HF_API_TOKEN"):
        try:
            return _call_hf(prompt_system, prompt_user)
        except Exception as e:
            errors.append(f"[HuggingFace Error] {str(e)}")

    err_detail = " ; ".join(errors) if errors else "No valid API keys found in .env"
    raise RuntimeError(f"LLM Generation Failed: {err_detail}")


def _extract_json(text: str):
    """Extract first JSON object or array from raw LLM text with strict=False and regex cleanup."""
    cleaned_text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
    cleaned_text = re.sub(r"\s*```$", "", cleaned_text, flags=re.MULTILINE)

    match = re.search(r"(\[.*\]|\{.*\})", cleaned_text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object or array found in LLM response")
    
    json_str = match.group(1)
    try:
        return json.loads(json_str, strict=False)
    except Exception:
        sanitized = re.sub(r'"""(.*?)"""', lambda m: json.dumps(m.group(1)), json_str, flags=re.DOTALL)
        sanitized = re.sub(r"'''(.*?)'''", lambda m: json.dumps(m.group(1)), sanitized, flags=re.DOTALL)
        return json.loads(sanitized, strict=False)


def build_llm_prompt(topic: str, difficulty: str, exclude_titles: list = None, resume_text: str = None) -> tuple[str, str]:
    """Build system and user prompts with creative salt hash, timestamp seed, and strict exclusion list."""
    unique_salt = random.randint(10000, 99999)
    current_time_seed = int(time.time() * 1000)

    system_prompt = (
        "You are an elite competitive programming problem setter and Principal LeetCode author. "
        "Your job is to invent brand-new, original coding interview questions that have never appeared in standard question banks before. "
        "Never repeat standard textbook templates or previously seen problems."
    )

    avoid_clause = ""
    if exclude_titles and len(exclude_titles) > 0:
        titles_str = ", ".join([f"'{t}'" for t in exclude_titles[:15]])
        avoid_clause = f"\n- PREVIOUSLY GENERATED / EXCLUDED TITLES: Do NOT generate any problem matching these titles or concepts: {titles_str}."

    resume_clause = ""
    if resume_text:
        resume_clause = f"\n- CANDIDATE RESUME CONTEXT: Tailor the narrative/scenario of the question to match the domains, industries, or technologies mentioned in this resume snippet: {resume_text[:1000]}"

    user_prompt = f"""
    Create a completely unique, never-before-seen coding interview question.
    
    STRICT PARAMETERS:
    - Target Topic: {topic} (The problem MUST test this exact data structure or algorithm. If '{topic}' is Linked List, use Linked List nodes. If Trees, use binary tree nodes).
    - Difficulty Level: {difficulty}
    - Creative Salt & Nonce: {unique_salt}-{current_time_seed} (Use this hash to completely randomize the problem narrative, variable names, constraints, and test scenarios so it is 100% unique).{avoid_clause}{resume_clause}

    Return ONLY a valid JSON object with this exact structure:
    {{
      "id": "generated-{topic.lower().replace(' ', '-')}-{unique_salt}",
      "title": "A Creative, Unique Problem Title",
      "difficulty": "{difficulty}",
      "category": "{topic}",
      "description": "Write a detailed markdown description with a unique storyline, clear constraints, and at least two examples.",
      "starter_code": {{
        "python": "class Solution:\\n    def solveProblem(self, ...):\\n        # Write your code here\\n        pass",
        "javascript": "class Solution {{\\n    solveProblem(...) {{\\n        // Write your code here\\n    }}\\n}}",
        "cpp": "class Solution {{\\npublic:\\n    int solveProblem(...) {{\\n        // Write your code here\\n    \\}};\n}};",
        "java": "class Solution {{\\n    public int solveProblem(...) {{\\n        // Write your code here\\n        return 0;\\n    }}\\n}}"
      }},
      "test_cases": [
        {{"input": "...", "expected": "..."}},
        {{"input": "...", "expected": "..."}}
      ]
    }}
    """
    return system_prompt, user_prompt


@router.post("/questions/generate", response_model=QuestionGenResponse)
async def generate_question(request: QuestionGenRequest):
    """Generate a coding or MCQ question on-demand using Google Gemini API or Groq LLM with strict topic enforcement."""
    target_topic = request.clean_topic
    seed_token = uuid.uuid4().hex[:6]
    is_dsa = request.is_dsa_or_coding

    if not is_dsa and (request.question_type == "mcq" or request.type == "mcq"):
        unique_salt = random.randint(10000, 99999)
        current_time_seed = int(time.time() * 1000)
        avoid_clause = ""
        if request.exclude_titles and len(request.exclude_titles) > 0:
            titles_str = ", ".join([f"'{t}'" for t in request.exclude_titles[:15]])
            avoid_clause = f"\n- PREVIOUSLY GENERATED / EXCLUDED TITLES: Do NOT generate any question matching these titles or concepts: {titles_str}."

        system_prompt = (
            "You are an expert interview question designer and assessment author.\n"
            f"Generate a brand-new, 100% unique multiple-choice interview question strictly focused on: '{target_topic}'.\n"
            "Never repeat standard textbook questions, standard templates, or previously seen problems.\n"
            "Return ONLY a valid JSON object with these exact keys: "
            "title (string), description (string), options (list of 4 strings like ['A. ...', 'B. ...', 'C. ...', 'D. ...']), "
            "correct_answer (single letter A/B/C/D), explanation (string).\n"
            "Do NOT include markdown code blocks or extra text outside the JSON object."
        )
        resume_clause = ""
        if request.resume_text:
            resume_clause = f"\n- CANDIDATE RESUME CONTEXT: Tailor the question scenario to match the domains/technologies in this resume snippet: {request.resume_text[:1000]}"

        user_prompt = (
            f"Seed Token: {seed_token}-{unique_salt}-{current_time_seed}. Target Topic: {target_topic}. Difficulty: {request.difficulty}.\n"
            f"Invent a realistic, original technical scenario with 4 distinct, plausible options.{avoid_clause}{resume_clause}"
        )
    else:
        system_prompt, user_prompt = build_llm_prompt(
            target_topic, request.difficulty or "Medium", request.exclude_titles, request.resume_text
        )

    # Directly call the LLM — no static catalogs or pre-written mocks.
    try:
        raw = _call_llm(system_prompt, user_prompt)
        data = _extract_json(raw)
    except Exception as e:
        print(f"LLM Generation Failed. Returning fallback. Error: {e}")
        # Return fallback question
        if not is_dsa and (request.question_type == "mcq" or request.type == "mcq"):
            mcq_data = {
                "title": f"Fallback {target_topic} Question",
                "description": f"What is a core concept in {target_topic}?",
                "options": ["A. Concept 1", "B. Concept 2", "C. Concept 3", "D. Concept 4"],
                "correct_answer": "A",
                "explanation": "This is a fallback generated because the AI providers are currently unavailable."
            }
            return QuestionGenResponse(mcq=MCQResponse(**mcq_data))
        else:
            coding_data = {
                "title": f"Fallback {target_topic} Challenge",
                "description": "This is a fallback challenge since AI generation failed. Please write a simple algorithm.",
                "starter_code": {"python": "class Solution:\n    def solve(self):\n        pass"},
                "test_cases": [{"input": "test", "expected": "test"}]
            }
            return QuestionGenResponse(coding=CodingResponse(**coding_data))

    rand_suffix = random.randint(100, 999)
    if not is_dsa and (request.question_type == "mcq" or request.type == "mcq"):
        raw_title = data.get("title") or f"{target_topic} MCQ Question"
        if "#" not in raw_title and "Variant" not in raw_title:
            raw_title = f"{raw_title} (Variant #{rand_suffix})"
        raw_options = data.get("options") or ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"]
        if not isinstance(raw_options, list) or len(raw_options) == 0:
            raw_options = ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"]

        mcq_data = {
            "title": str(raw_title),
            "description": str(data.get("description") or f"Multiple choice question for {target_topic}."),
            "options": [str(opt) for opt in raw_options],
            "correct_answer": str(data.get("correct_answer") or data.get("correctAnswer") or "A"),
            "explanation": str(data.get("explanation") or "Option A is the correct answer."),
        }
        return QuestionGenResponse(mcq=MCQResponse(**mcq_data))
    else:
        lang = request.language or "python"
        raw_starter = data.get("starter_code") or data.get("starterCode")
        if isinstance(raw_starter, str):
            starter_code = {lang: raw_starter}
        elif isinstance(raw_starter, dict) and len(raw_starter) > 0:
            starter_code = {str(k): str(v) for k, v in raw_starter.items()}
        else:
            starter_code = {lang: f"class Solution:\n    def solve(self) -> None:\n        # Solution for {target_topic}\n        pass"}

        raw_tests = data.get("test_cases") or data.get("testCases")
        test_cases = []
        if isinstance(raw_tests, list):
            for item in raw_tests:
                if isinstance(item, dict):
                    test_cases.append({
                        "input": str(item.get("input", "")),
                        "expected": str(item.get("expected", ""))
                    })
        if not test_cases:
            test_cases = [{"input": "nums = [1, 2, 3]", "expected": "true"}]

        raw_title = data.get("title") or f"{target_topic} Coding Challenge"
        if "#" not in raw_title and "Variant" not in raw_title:
            raw_title = f"{raw_title} (Variant #{rand_suffix})"

        coding_data = {
            "title": str(raw_title),
            "description": str(data.get("description") or f"Write an optimal algorithm for {target_topic}."),
            "starter_code": starter_code,
            "test_cases": test_cases,
        }
        return QuestionGenResponse(coding=CodingResponse(**coding_data))


@router.post("/assessment/generate-exam")
async def generate_assessment_exam(payload: dict):
    """Generate a full set of dynamic, 100% unique assessment questions tailored to the candidate's target role."""
    target_role = (payload.get("target_role") or payload.get("topic") or payload.get("role") or "Software Engineer").strip()
    num_questions = int(payload.get("num_questions", 5))
    difficulty = (payload.get("difficulty") or "Mixed").strip()
    rand_seed = uuid.uuid4().hex[:6]

    system_prompt = (
        "You are an elite principal technical recruiter and assessment architect.\n"
        f"Generate a brand-new {num_questions}-question technical exam tailored specifically for the candidate role/topic: '{target_role}'.\n"
        f"Generate exactly {num_questions} Multiple-Choice Questions (MCQs). DO NOT generate any coding tasks or questions that require writing code.\n"
        f"The requested difficulty level for this exam is: {difficulty}.\n"
        "Make questions 100% realistic, unique, and challenging according to the difficulty.\n"
        f"Return ONLY a valid JSON list of {num_questions} objects, where each object has these exact fields:\n"
        "- id (string like 'ai-exam-1')\n"
        "- title (string)\n"
        "- questionType (must strictly be 'mcq')\n"
        "- category (string)\n"
        "- difficulty (string: 'Easy', 'Medium', or 'Hard')\n"
        "- description (string)\n"
        "- options (list of 4 strings like ['A. ...', 'B. ...', 'C. ...', 'D. ...'])\n"
        "- correctAnswer (string letter: 'A', 'B', 'C', or 'D')\n"
        "- explanation (string)\n"
        "Do NOT include markdown code blocks or any output outside the JSON array."
    )
    user_prompt = f"Seed Token: {rand_seed}. Target Role: {target_role}. Difficulty: {difficulty}. Generate {num_questions} dynamic, unique MCQ interview assessment questions."


    try:
        raw = _call_llm(system_prompt, user_prompt)
        data = _extract_json(raw)
        if isinstance(data, list) and len(data) > 0:
            return {"status": "success", "questions": data}
    except Exception as e:
        print(f"Exam Generation Warning: {e}")
        try:
            print(f"Raw Output: {raw}")
        except:
            pass

    return {"status": "fallback", "questions": []}


@router.post("/evaluate/star")
async def evaluate_star(request: StarEvaluationRequest):
    """Evaluate a candidate's STAR behavioral answer using LLM."""
    system_prompt = (
        "You are an expert technical interviewer at a FAANG company.\n"
        "Evaluate the candidate's STAR (Situation, Task, Action, Result) behavioral response based on clarity, impact, and concrete metrics.\n"
        "Return ONLY a valid JSON object with the following exact keys:\n"
        "- overallScore (int 0-100)\n"
        "- situationScore (int 0-100)\n"
        "- taskScore (int 0-100)\n"
        "- actionScore (int 0-100)\n"
        "- resultScore (int 0-100)\n"
        "- quantitativeMetricsFound (list of strings, e.g., ['10% increase', '$50k saved'])\n"
        "- strengths (list of strings)\n"
        "- suggestions (list of strings)\n"
        "- aiVerdict (string)\n"
        "Be extremely critical of the 'Result' section if it lacks hard numbers, and penalize the resultScore accordingly."
    )
    user_prompt = (
        f"Interview Prompt: {request.prompt}\n"
        f"Situation: {request.situation}\n"
        f"Task: {request.task}\n"
        f"Action: {request.action}\n"
        f"Result: {request.result}\n"
    )
    
    try:
        raw = _call_llm(system_prompt, user_prompt)
        data = _extract_json(raw)
        return {"status": "success", "evaluation": data}
    except Exception as e:
        print(f"STAR Evaluation Warning: {e}")
        raise HTTPException(status_code=500, detail="Failed to evaluate STAR answer")