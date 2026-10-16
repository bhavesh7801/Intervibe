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
from question_models.question_generation import (
    QuestionGenRequest, QuestionGenResponse, MCQResponse, CodingResponse, InterviewQuestionItem
)

try:
    from api.topic_question_bank import get_curated_assessment_questions
except ImportError:
    from topic_question_bank import get_curated_assessment_questions

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
GROQ_MODEL = "qwen/qwen3.8-27b"
GROQ_FALLBACK_MODEL = "openai/gpt-oss-120b"


def _create_ssl_context():
    try:
        return ssl.create_default_context()
    except Exception:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        return ctx


def _call_gemini(prompt_system: str, prompt_user: str) -> str:
    """Call Google Gemini API using GEMINI_API_KEY with 15s timeout."""
    key = os.getenv("GEMINI_API_KEY", "").strip().strip('"').strip("'")
    if not key or len(key) < 10:
        raise ValueError("GEMINI_API_KEY is missing or too short")
    
    models_to_try = [
        "gemini-2.5-flash",
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-2.5-pro"
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
    """Call Groq Chat API with primary and fallback models."""
    key = os.getenv("GROQ_API_KEY", "").strip()
    if not key:
        raise ValueError("GROQ_API_KEY is not configured")
    
    groq_models = [GROQ_MODEL, GROQ_FALLBACK_MODEL, "openai/gpt-oss-20b"]
    
    # Try official Groq SDK first
    try:
        from groq import Groq
        client = Groq(api_key=key)
        for model_name in groq_models:
            try:
                resp = client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": prompt_system},
                        {"role": "user", "content": prompt_user},
                    ],
                    temperature=0.85,
                    max_tokens=4096
                )
                text = resp.choices[0].message.content
                if text and text.strip():
                    return text
            except Exception:
                continue
    except ImportError:
        pass

    # Fallback to direct HTTP request
    for model_name in groq_models:
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
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, context=_create_ssl_context(), timeout=20) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["choices"][0]["message"]["content"]
        except Exception:
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
    """Extract first JSON object or array from raw LLM text with strict=False and robust cleanup."""
    cleaned_text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.MULTILINE)
    cleaned_text = re.sub(r"\s*```$", "", cleaned_text, flags=re.MULTILINE)

    match = re.search(r"(\[.*\]|\{.*\})", cleaned_text, re.DOTALL)
    if not match:
        raise ValueError("No JSON object or array found in LLM response")
    
    json_str = match.group(1)
    try:
        return json.loads(json_str, strict=False)
    except Exception:
        pass

    try:
        sanitized = re.sub(r'"""(.*?)"""', lambda m: json.dumps(m.group(1)), json_str, flags=re.DOTALL)
        sanitized = re.sub(r"'''(.*?)'''", lambda m: json.dumps(m.group(1)), sanitized, flags=re.DOTALL)
        sanitized = re.sub(r",\s*([\]}])", r"\1", sanitized)
        return json.loads(sanitized, strict=False)
    except Exception:
        pass

    try:
        fixed = re.sub(r'("(?:[^"\\]|\\.)*")', lambda m: m.group(1).replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t'), json_str)
        fixed = re.sub(r",\s*([\]}])", r"\1", fixed)
        return json.loads(fixed, strict=False)
    except Exception as final_e:
        raise final_e


def build_llm_prompt(topic: str, difficulty: str, exclude_titles: list = None, resume_text: str = None) -> tuple[str, str]:
    """Build system and user prompts with creative salt hash, timestamp seed, and strict LeetCode structure."""
    unique_salt = random.randint(10000, 99999)
    current_time_seed = int(time.time() * 1000)

    system_prompt = (
        "You are a Principal LeetCode Problem Setter and competitive programming contest author. "
        "Your mission is to invent brand-new, original LeetCode-style interview problems that feel 100% authentic to the official LeetCode platform. "
        "Strictly adhere to LeetCode format conventions: clear problem statement, structured Example blocks (Input, Output, Explanation), bulleted Constraints, and canonical class Solution method signatures."
    )

    avoid_clause = ""
    if exclude_titles and len(exclude_titles) > 0:
        titles_str = ", ".join([f"'{t}'" for t in exclude_titles[:15]])
        avoid_clause = f"\n- PREVIOUSLY GENERATED / EXCLUDED TITLES: Do NOT generate any problem matching these titles or concepts: {titles_str}."

    resume_clause = ""
    if resume_text:
        resume_clause = f"\n- CANDIDATE RESUME CONTEXT: Tailor the narrative/scenario of the question to match the domains, industries, or technologies mentioned in this resume snippet: {resume_text[:1000]}"

    user_prompt = f"""
    Create a completely unique, authentic LeetCode coding interview problem.
    
    STRICT PARAMETERS:
    - Target Topic: {topic} (The problem MUST test this exact data structure or algorithm).
    - Difficulty Level: {difficulty}
    - Creative Salt & Nonce: {unique_salt}-{current_time_seed}{avoid_clause}{resume_clause}

    FORMATTING REQUIREMENTS FOR 'description':
    The 'description' field MUST contain:
    1. A precise technical problem statement.
    2. At least two structured examples in this exact format:
       Example 1:
       Input: ...
       Output: ...
       Explanation: ...

       Example 2:
       Input: ...
       Output: ...
    3. A bulleted Constraints section:
       Constraints:
       • ...
       • ...
    4. An optional Follow-up question.

    FORMATTING REQUIREMENTS FOR 'starter_code':
    Must provide canonical LeetCode boilerplate code:
    - 'python': 'class Solution:\\n    def methodName(self, ...: ...) -> ...:\\n        pass'
    - 'javascript': '/**\\n * @param {{...}} ...\\n * @return {{...}}\\n */\\nvar methodName = function(...) {{\\n    \\n}};'
    - 'typescript': 'function methodName(...: ...): ... {{\\n    \\n}};'
    - 'cpp': 'class Solution {{\\npublic:\\n    ... methodName(...) {{\\n        \\n    }}\\n}};'
    - 'java': 'class Solution {{\\n    public ... methodName(...) {{\\n        \\n    }}\\n}};'
    - 'go': 'func methodName(...) ... {{\\n    \\n}}'

    Return ONLY a valid JSON object with this exact structure:
    {{
      "id": "generated-{topic.lower().replace(' ', '-')}-{unique_salt}",
      "title": "A Creative LeetCode Problem Title",
      "difficulty": "{difficulty}",
      "category": "{topic}",
      "description": "Full LeetCode markdown description with Example 1/2 and Constraints",
      "starter_code": {{
        "python": "class Solution:\\n    def solve(self, nums: List[int]) -> int:\\n        pass",
        "javascript": "/**\\n * @param {{number[]}} nums\\n * @return {{number}}\\n */\\nvar solve = function(nums) {{\\n    \\n}};",
        "typescript": "function solve(nums: number[]): number {{\\n    \\n}};",
        "cpp": "class Solution {{\\npublic:\\n    int solve(vector<int>& nums) {{\\n        return 0;\\n    }}\\n}};",
        "java": "class Solution {{\\n    public int solve(int[] nums) {{\\n        return 0;\\n    }}\\n}};",
        "go": "func solve(nums []int) int {{\\n    return 0\\n}}"
      }},
      "test_cases": [
        {{"input": "...", "expected": "..."}},
        {{"input": "...", "expected": "..."}}
      ]
    }}
    """
    return system_prompt, user_prompt


def build_interview_prompt(
    topic: str,
    role: str,
    difficulty: str,
    num_questions: int = 3,
    company: str = "Google",
    persona: str = "Standard",
    exclude_titles: list = None
) -> tuple[str, str]:
    """Build system and user prompts for multi-question FAANG verbal mock interviews."""
    unique_salt = random.randint(10000, 99999)
    current_time_seed = int(time.time() * 1000)
    avoid_clause = ""
    if exclude_titles and len(exclude_titles) > 0:
        titles_str = ", ".join([f"'{t}'" for t in exclude_titles[:15]])
        avoid_clause = f"\n- PREVIOUSLY GENERATED / EXCLUDED TITLES: Do NOT generate questions matching: {titles_str}."

    system_prompt = (
        "You are an elite Principal Interviewer and Bar Raiser at top tech companies (Google, Meta, Amazon, Netflix, Stripe).\n"
        f"Generate {num_questions} brand-new, realistic conversational verbal mock interview scenarios specifically testing '{topic}'.\n"
        f"Target Role: {role}. Difficulty Level: {difficulty}. Company Track: {company}. Interviewer Persona: {persona}.\n"
        "Each scenario must present a deep real-world production challenge, distributed system design tradeoff, incident triage problem, or behavioral engineering situation.\n"
        "Return ONLY a valid JSON list of objects (or an object with a 'questions' array) where each question has these exact fields:\n"
        "- id: string (e.g. 'int_1')\n"
        "- title: string (concise scenario title)\n"
        "- category: string (e.g. 'System Design & Scalability', 'Incident Triage & Reliability', 'Core Concurrency & DB', 'Behavioral Leadership')\n"
        "- difficulty: string ('Easy', 'Medium', or 'Hard')\n"
        "- company: string\n"
        "- role: string\n"
        "- timeLimitMinutes: integer (e.g. 20 or 25)\n"
        "- prompt: string (A thorough, realistic scenario problem description explaining scale, constraints, and specific technical questions the candidate must answer out loud)\n"
        "- evaluationRubric: list of 3-4 strings detailing what a top candidate should mention\n"
        "- speakingTips: list of 2-3 spoken delivery suggestions\n"
        "- hints: list of 1-2 architectural hints\n"
        "Do NOT include markdown formatting outside the JSON."
    )
    user_prompt = (
        f"Nonce: {unique_salt}-{current_time_seed}. Topic: '{topic}'. Role: '{role}'. Difficulty: '{difficulty}'. Company: '{company}'.\n"
        f"Generate {num_questions} fresh, distinct FAANG verbal interview questions.{avoid_clause}"
    )
    return system_prompt, user_prompt


def get_curated_interview_questions(topic: str, role: str, difficulty: str, num_questions: int = 3, company: str = "Google") -> list:
    """Generate dynamic topic-customized interview questions if LLM service is offline."""
    scenarios = [
        {
            "suffix": "Distributed Architecture & High-Throughput Scalability",
            "category": "System Design & Scalability",
            "prompt": f"You are tasked with architecting the core production infrastructure for {topic} handling 100,000 active requests per second for a {role} position at {company}.\n\nKey Scenario Focus:\n1. Propose end-to-end architecture, transport layer (HTTP/2 vs gRPC vs WebSockets), and state management for {topic}.\n2. Address replication lag, consistency guarantees (CAP theorem), and partition tolerance.\n3. How would you prevent cascading failovers during sudden downstream traffic spikes?\n\nStructure your verbal response with high-level architecture, database schema choice, and failure mode mitigation.",
            "rubric": [
                f"Mastery of {topic} architecture and distributed patterns",
                "Traffic volume estimation and bandwidth calculations",
                "Clear verbal communication and failure modes coverage"
            ],
            "tips": [
                "Clarify throughput SLAs and latency limits before proposing a solution.",
                "Explicitly compare technologies rather than picking one arbitrarily."
            ],
            "hints": [
                f"Consider how {topic} handles write contention and network partitions."
            ]
        },
        {
            "suffix": "Production Outage & Real-Time Incident Triage",
            "category": "Incident Triage & Reliability",
            "prompt": f"During peak traffic hours at {company}, the core service relying on {topic} experiences a sudden P99 latency spike from 35ms to 3,200ms, resulting in cascading gateway timeouts for users.\n\nWalk me through your real-time verbal troubleshooting playbook:\n1. First 5 minutes: Immediate blast-radius containment, traffic shedding, and circuit breaking.\n2. Telemetry & Metrics: What specific metrics (CPU, thread pool exhaustion, locks, database connection pool) would you check first to isolate the root cause in {topic}?\n3. Hot-fix cutover and blameless post-mortem preventative guardrails.",
            "rubric": [
                "Structured incident command protocol and blast radius containment",
                f"Diagnostic depth isolating root causes in {topic}",
                "Blameless post-mortem planning and preventative SLI/SLO guardrails"
            ],
            "tips": [
                "Outline your chronological steps clearly: Contain -> Diagnose -> Recover -> Post-mortem.",
                "Specify exact telemetry tools (e.g. Grafana, Prometheus, distributed tracing)."
            ],
            "hints": [
                "Check for connection pool starvation or unindexed hot partition queries."
            ]
        },
        {
            "suffix": "Concurrency Control, Race Conditions & Data Integrity",
            "category": "Core Engineering & Concurrency",
            "prompt": f"In a high-concurrency environment at {company}, multiple asynchronous workers simultaneously update shared state managed by {topic}.\n\nCompare and contrast the following concurrency control strategies in your spoken response:\n1. Optimistic Concurrency Control (version increments and CAS operations).\n2. Pessimistic Row Locking (SELECT ... FOR UPDATE).\n3. Distributed Locks (e.g. Redis Redlock or Chubby/ZooKeeper).\n\nAnalyze throughput, latency, failure modes during lease expiration, and how to guarantee idempotent transactions.",
            "rubric": [
                "Deep understanding of database isolation levels and locking mechanisms",
                "Distributed lock failure modes, clock drift, and lease renewal pitfalls",
                "Implementation of idempotency keys to guarantee exactly-once execution"
            ],
            "tips": [
                "Structure your comparison using throughput, latency overhead, and failure modes.",
                "Mention fencing tokens to protect shared resources from delayed lock holders."
            ],
            "hints": [
                "Consider the Martin Kleppmann critique of Redis Redlock and when optimistic locking is superior."
            ]
        },
        {
            "suffix": "Zero-Downtime Data Migration & Partitioning Strategy",
            "category": "Database Architecture & Migration",
            "prompt": f"Your team at {company} needs to migrate a legacy high-volume dataset into a modern {topic} architecture without incurring any user-facing downtime or dropped transactions.\n\nDetail your step-by-step spoken playbook:\n1. Dual-write and Change Data Capture (CDC with Debezium/Kafka) strategy.\n2. Historical backfill jobs and checksum reconciliation workers.\n3. Canary traffic cutover, shadow reading, and instant rollback triggers.",
            "rubric": [
                "Comprehensive 5-phase migration plan (Dual-write -> Backfill -> Verify -> Canary -> Cutover)",
                "Reconciliation worker design to resolve asynchronous write drift",
                "Zero-downtime rollback capability at any stage"
            ],
            "tips": [
                "State your phased migration roadmap upfront before diving into details.",
                "Explain how you handle writes that occur while historical backfilling is in progress."
            ],
            "hints": [
                "Use shadow reads comparing old and new query results to verify correctness."
            ]
        },
        {
            "suffix": "Behavioral Leadership & Technical Trade-off Debate",
            "category": "Behavioral Leadership (STAR Method)",
            "prompt": f"Describe a real-world scenario from your career where you advocated for a specific technical strategy regarding {topic} that was contested by senior engineers or stakeholders at {company}.\n\nUsing the STAR Method (Situation, Task, Action, Result):\n1. Detail the technical trade-offs and business stakes.\n2. Explain how you used empirical data and proof-of-concept benchmarks to achieve consensus.\n3. Share the final business outcome and quantifiable metric gains.",
            "rubric": [
                "Structured STAR framework delivery with concise Situation & Task",
                "Data-driven persuasion (POC benchmarks, latency comparisons)",
                "Quantifiable business metrics (latency reduction %, cloud spend saved)"
            ],
            "tips": [
                "Keep Situation & Task under 2 minutes to leave ample time for Action and Results.",
                "Emphasize emotional intelligence and disagree-and-commit principles."
            ],
            "hints": [
                "Highlight trade-offs you conceded to reach team consensus."
            ]
        }
    ]

    count = max(1, min(num_questions, 10))
    res = []
    rand_seed = uuid.uuid4().hex[:5]
    for i in range(count):
        s = scenarios[i % len(scenarios)]
        res.append(InterviewQuestionItem(
            id=f"int_{rand_seed}_{i+1}",
            title=f"{topic}: {s['suffix']}",
            category=s["category"],
            difficulty=difficulty or "Hard",
            company=company or "Google",
            role=role or "Senior Software Engineer",
            timeLimitMinutes=20,
            prompt=s["prompt"],
            evaluationRubric=s["rubric"],
            speakingTips=s["tips"],
            hints=s["hints"]
        ))
    return res


CURATED_CODING_FALLBACKS = {
    "binary search": {
        "title": "Search in Rotated Sorted Array",
        "description": "Given the array `nums` after a possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n### Example 1:\n- **Input:** `nums = [4,5,6,7,0,1,2], target = 0`\n- **Output:** `4`\n\n### Example 2:\n- **Input:** `nums = [4,5,6,7,0,1,2], target = 3`\n- **Output:** `-1`\n\n### Constraints:\n- `1 <= nums.length <= 5000`\n- `-10^4 <= nums[i] <= 10^4`\n- All values of `nums` are unique.",
        "starter_code": {
            "python": "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        # Write your O(log n) solution here\n        pass",
            "javascript": "class Solution {\n    search(nums, target) {\n        // Write your O(log n) solution here\n        return -1;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n};",
            "java": "class Solution {\n    public int search(int[] nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n}"
        },
        "test_cases": [
            {"input": "[4,5,6,7,0,1,2], 0", "expected": "4"},
            {"input": "[4,5,6,7,0,1,2], 3", "expected": "-1"},
            {"input": "[1], 0", "expected": "-1"}
        ]
    },
    "arrays & hashing": {
        "title": "Product of Array Except Self",
        "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nThe product of any prefix or suffix of `nums` is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in `O(n)` time and without using the division operation.\n\n### Example:\n- **Input:** `nums = [1,2,3,4]`\n- **Output:** `[24,12,8,6]`",
        "starter_code": {
            "python": "class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        pass",
            "javascript": "class Solution {\n    productExceptSelf(nums) {\n        return [];\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        return {};\n    }\n};",
            "java": "class Solution {\n    public int productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}"
        },
        "test_cases": [
            {"input": "[1,2,3,4]", "expected": "[24,12,8,6]"},
            {"input": "[-1,1,0,-3,3]", "expected": "[0,0,9,0,0]"}
        ]
    },
    "dynamic programming": {
        "title": "Coin Change",
        "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\n### Example 1:\n- **Input:** `coins = [1,2,5], amount = 11`\n- **Output:** `3` (11 = 5 + 5 + 1)\n\n### Constraints:\n- `1 <= coins.length <= 12`\n- `0 <= amount <= 10^4`",
        "starter_code": {
            "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass",
            "javascript": "class Solution {\n    coinChange(coins, amount) {\n        return -1;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        return -1;\n    }\n};",
            "java": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}"
        },
        "test_cases": [
            {"input": "[1,2,5], 11", "expected": "3"},
            {"input": "[2], 3", "expected": "-1"}
        ]
    },
    "sliding window": {
        "title": "Longest Substring Without Repeating Characters",
        "description": "Given a string `s`, find the length of the longest substring without repeating characters.\n\n### Example:\n- **Input:** `s = \"abcabcbb\"`\n- **Output:** `3` (\"abc\")",
        "starter_code": {
            "python": "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
            "javascript": "class Solution {\n    lengthOfLongestSubstring(s) {\n        return 0;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        return 0;\n    }\n};",
            "java": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}"
        },
        "test_cases": [
            {"input": "\"abcabcbb\"", "expected": "3"},
            {"input": "\"bbbbb\"", "expected": "1"}
        ]
    },
    "two pointers": {
        "title": "Container With Most Water",
        "description": "You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
        "starter_code": {
            "python": "class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        pass",
            "javascript": "class Solution {\n    maxArea(height) {\n        return 0;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        return 0;\n    }\n};",
            "java": "class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}"
        },
        "test_cases": [
            {"input": "[1,8,6,2,5,4,8,3,7]", "expected": "49"},
            {"input": "[1,1]", "expected": "1"}
        ]
    },
    "trees": {
        "title": "Binary Tree Level Order Traversal",
        "description": "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        "starter_code": {
            "python": "class Solution:\n    def levelOrder(self, root) -> list[list[int]]:\n        pass",
            "javascript": "class Solution {\n    levelOrder(root) {\n        return [];\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        return {};\n    }\n};",
            "java": "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}"
        },
        "test_cases": [
            {"input": "[3,9,20,null,null,15,7]", "expected": "[[3],[9,20],[15,7]]"}
        ]
    },
    "graphs": {
        "title": "Number of Islands",
        "description": "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.",
        "starter_code": {
            "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        pass",
            "javascript": "class Solution {\n    numIslands(grid) {\n        return 0;\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        return 0;\n    }\n};",
            "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}"
        },
        "test_cases": [
            {"input": "[[\"1\",\"1\",\"0\"],[\"0\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", "expected": "2"}
        ]
    }
}


def get_curated_coding_fallback(topic: str, difficulty: str, language: str = "python") -> dict:
    t_lower = topic.lower().strip()
    match = None
    for key, val in CURATED_CODING_FALLBACKS.items():
        if key in t_lower or t_lower in key:
            match = val
            break
    if not match:
        match = CURATED_CODING_FALLBACKS["arrays & hashing"]
    
    return {
        "title": f"{match['title']} (Practice)",
        "description": match["description"],
        "starter_code": match["starter_code"],
        "test_cases": match["test_cases"]
    }


@router.post("/questions/generate", response_model=QuestionGenResponse)
async def generate_question(request: QuestionGenRequest):
    """Generate a coding, MCQ, or mock interview question on-demand using Groq LLM or Gemini API with strict topic enforcement."""
    target_topic = request.clean_topic
    seed_token = uuid.uuid4().hex[:6]
    is_dsa = request.is_dsa_or_coding
    q_type = (request.question_type or request.type or "coding").lower().strip()

    # 1. Real-Time Verbal Mock Interview Scenarios Generation Flow
    if q_type == "interview":
        num_q = max(1, min(request.num_questions or 3, 10))
        comp = request.company or "FAANG / Tier-1 Tech"
        role_title = request.role or "Senior Software Engineer"
        system_prompt, user_prompt = build_interview_prompt(
            target_topic, role_title, request.difficulty or "Hard", num_q, comp, request.persona or "Standard", request.exclude_titles
        )
        try:
            raw = _call_llm(system_prompt, user_prompt)
            data = _extract_json(raw)
            raw_list = data if isinstance(data, list) else (data.get("questions") if isinstance(data, dict) else [])
            if isinstance(raw_list, list) and len(raw_list) > 0:
                formatted_questions = []
                for i, item in enumerate(raw_list):
                    if isinstance(item, dict):
                        formatted_questions.append(InterviewQuestionItem(
                            id=item.get("id") or f"gen_int_{uuid.uuid4().hex[:6]}_{i+1}",
                            title=str(item.get("title") or f"{target_topic}: Scenario {i+1}"),
                            category=str(item.get("category") or target_topic),
                            difficulty=str(item.get("difficulty") or request.difficulty or "Medium"),
                            company=str(item.get("company") or comp),
                            role=str(item.get("role") or role_title),
                            timeLimitMinutes=int(item.get("timeLimitMinutes") or 20),
                            prompt=str(item.get("prompt") or item.get("description") or f"Analyze system requirements and architecture for {target_topic}."),
                            evaluationRubric=[str(x) for x in item.get("evaluationRubric", [])] if isinstance(item.get("evaluationRubric"), list) and item.get("evaluationRubric") else [f"Deep technical mastery in {target_topic}", "System trade-offs and bottleneck mitigation", "Structured verbal delivery"],
                            speakingTips=[str(x) for x in item.get("speakingTips", [])] if isinstance(item.get("speakingTips"), list) and item.get("speakingTips") else ["Clarify core constraints and volume assumptions before proposing solutions."],
                            hints=[str(x) for x in item.get("hints", [])] if isinstance(item.get("hints"), list) and item.get("hints") else [f"Consider how {target_topic} behaves under peak throughput and network partitions."]
                        ))
                if formatted_questions:
                    return QuestionGenResponse(questions=formatted_questions, status="success")
        except Exception as e:
            print(f"Interview LLM Generation Warning: {e}")

        fallback_list = get_curated_interview_questions(target_topic, role_title, request.difficulty or "Hard", num_q, comp)
        return QuestionGenResponse(questions=fallback_list, status="success")

    # 2. Technical MCQ / Aptitude Generation Flow
    elif q_type in ["mcq", "aptitude"]:
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

        try:
            raw = _call_llm(system_prompt, user_prompt)
            data = _extract_json(raw)
        except Exception as e:
            print(f"MCQ LLM Generation Failed. Returning fallback. Error: {e}")
            mcq_data = {
                "title": f"Core {target_topic} Fundamentals",
                "description": f"Which of the following statements accurately characterizes {target_topic} in modern software engineering?",
                "options": [
                    "A. It optimizes data locality and reduces algorithmic complexity",
                    "B. It eliminates the need for synchronization primitives",
                    "C. It converts dynamic queries into static hash lookups",
                    "D. It guarantees constant space allocation regardless of input"
                ],
                "correct_answer": "A",
                "explanation": f"In {target_topic}, understanding fundamental data layout and algorithmic complexity is the foundation for optimal system performance."
            }
            return QuestionGenResponse(mcq=MCQResponse(**mcq_data))

        rand_suffix = random.randint(100, 999)
        raw_title = data.get("title") or f"{target_topic} Question"
        if "#" not in raw_title and "Variant" not in raw_title:
            raw_title = f"{raw_title} (Variant #{rand_suffix})"
        raw_options = data.get("options") or ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"]
        if not isinstance(raw_options, list) or len(raw_options) == 0:
            raw_options = ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"]

        mcq_data = {
            "title": str(raw_title),
            "description": str(data.get("description") or f"Question focused on {target_topic}."),
            "options": [str(opt) for opt in raw_options],
            "correct_answer": str(data.get("correct_answer") or data.get("correctAnswer") or "A"),
            "explanation": str(data.get("explanation") or "Option A is the correct answer."),
        }
        return QuestionGenResponse(mcq=MCQResponse(**mcq_data))

    # 3. LeetCode Coding Challenge Generation Flow
    else:
        system_prompt, user_prompt = build_llm_prompt(
            target_topic, request.difficulty or "Medium", request.exclude_titles, request.resume_text
        )

        try:
            raw = _call_llm(system_prompt, user_prompt)
            data = _extract_json(raw)
        except Exception as e:
            print(f"Coding LLM Generation Failed. Returning fallback. Error: {e}")
            fb = get_curated_coding_fallback(target_topic, request.difficulty or "Medium", request.language or "python")
            return QuestionGenResponse(coding=CodingResponse(**fb))

        rand_suffix = random.randint(100, 999)
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

    # Topic-aware dynamic questions matching the requested role/domain
    topic_questions = get_curated_assessment_questions(target_role, num_questions, difficulty)
    return {"status": "success", "questions": topic_questions}


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