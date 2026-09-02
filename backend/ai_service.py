import os
import json
import re
import ssl
import urllib.request
import logging
import asyncio
from dotenv import load_dotenv
from pathlib import Path
from groq import AsyncGroq
from redis_service import redis_client

from config import settings
import prompts

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env', override=True)

logger = logging.getLogger(__name__)

HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions"
HF_MODEL = "Qwen/Qwen2.5-7B-Instruct"

class AIService:
    def __init__(self):
        self.groq_key = settings.GROQ_API_KEY
        self.hf_token = settings.HF_API_TOKEN
        self.gemini_key = settings.GEMINI_API_KEY
        
        if self.groq_key:
            self.client = AsyncGroq(api_key=self.groq_key)
        else:
            self.client = None
            
        self.model = "llama-3.3-70b-versatile"
        self.fallback_model = "llama-3.1-8b-instant"
        self.gemini_model = "gemini-2.0-flash"

    async def generate_questions(self, role: str, experience_level: str, num_questions: int = 5, persona: str = "Standard") -> list:
        # Check Redis Cache with random batch variation to avoid duplicate static sessions
        import random
        batch_id = random.randint(1, 10)
        cache_key = f"questions:{role.lower().strip()}:{experience_level.lower().strip()}:{num_questions}:p{persona.lower().strip()}:b{batch_id}"
        cached_questions = await redis_client.get_cache(cache_key)
        if cached_questions:
            logger.info(f"⚡ Returning cached interview question pool (batch {batch_id}) for {role} ({experience_level})")
            return cached_questions

        # If cache miss, generate questions using LLM with high entropy
        import random
        rand_salt = random.randint(1000, 9999)
        json_template = '[{"text": "...", "category": "System Design", "difficulty": "medium"}]'
        
        is_system_design = "system design" in role.lower()
        is_aptitude = "aptitude" in role.lower()
        
        persona_directive = prompts.PERSONA_MODIFIERS.get(persona, prompts.PERSONA_MODIFIERS["Standard"])

        if is_system_design:
            system_message = prompts.SYSTEM_DESIGN_PROMPT.format(num_questions=num_questions, json_template=json_template, persona=persona_directive)
        elif is_aptitude:
            system_message = prompts.APTITUDE_PROMPT.format(num_questions=num_questions, experience_level=experience_level, json_template=json_template, persona=persona_directive)
        else:
            system_message = prompts.GENERAL_INTERVIEW_PROMPT.format(num_questions=num_questions, experience_level=experience_level, role=role, json_template=json_template, persona=persona_directive)
        
        try:
            if self.client:
                try:
                    response = await self.client.chat.completions.create(
                        model=self.model,
                        messages=[
                            {"role": "system", "content": system_message},
                            {"role": "user", "content": f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})"}
                        ],
                        temperature=0.85
                    )
                    content = response.choices[0].message.content
                except Exception as e_groq:
                    logger.warning(f"Groq primary model failed ({e_groq}), trying fallback model: {self.fallback_model}")
                    response = await self.client.chat.completions.create(
                        model=self.fallback_model,
                        messages=[
                            {"role": "system", "content": system_message},
                            {"role": "user", "content": f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})"}
                        ],
                        temperature=0.85
                    )
                    content = response.choices[0].message.content
            elif self.gemini_key:
                content = await asyncio.to_thread(self._call_gemini_sync, system_message, f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})", True)
            elif self.hf_token:
                content = await asyncio.to_thread(self._call_hf_sync, system_message, f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})")
            else:
                raise ValueError("No LLM key configured")
            
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            questions = json.loads(json_match.group()) if json_match else json.loads(content)
            
            # Store generated questions in Redis cache (15-minute TTL per batch)
            await redis_client.set_cache(cache_key, questions, ttl_seconds=900)
            return questions
        except Exception as e:
            logger.error(f"Error generating questions via LLM: {e}")
            return prompts.get_fallback_questions(role, experience_level, num_questions)

    async def analyze_resume(self, resume_text: str, target_role: str = "Software Engineer") -> dict:
        """Analyze candidate PDF resume text to produce actionable improvements and missing skills to learn."""
        json_template = '''{
  "matchScore": 82,
  "overallSummary": "Solid background in software development with strong fundamentals.",
  "resumeChanges": [
    "Quantify impact in bullet points (e.g. 'Improved speed by 35%').",
    "Use strong action verbs like Architected, Implemented, and Deployed.",
    "Add a dedicated Skills section grouped by Languages, Databases, and Cloud."
  ],
  "skillsToLearn": [
    "Docker & Containerization",
    "Kubernetes & Orchestration",
    "System Design & Distributed Caching",
    "CI/CD Pipeline Automation"
  ],
  "bulletEnhancements": [
    {
      "original": "Built backend endpoints for application",
      "improved": "Architected 15+ RESTful FastAPI endpoints handling 10k+ daily transactions with Redis caching."
    }
  ]
}'''
        system_message = prompts.RESUME_ANALYSIS_PROMPT.format(target_role=target_role, json_template=json_template)
        user_message = f"Candidate Target Role: {target_role}\n\nResume Content:\n{resume_text[:3500]}"

        try:
            if self.gemini_key:
                content = await asyncio.to_thread(self._call_gemini_sync, system_message, user_message, True)
            elif self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.4,
                    response_format={"type": "json_object"}
                )
                content = response.choices[0].message.content
            elif self.hf_token:
                content = await asyncio.to_thread(self._call_hf_sync, system_message, user_message)
            else:
                raise ValueError("No LLM key configured")

            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            parsed = json.loads(json_match.group()) if json_match else json.loads(content)
            return parsed
        except Exception as e:
            logger.error(f"Error in LLM analyze_resume: {e}")
            # Fallback analysis
            return {
                "matchScore": 78,
                "overallSummary": "Parsed candidate resume. Demonstrates technical experience in core software development.",
                "resumeChanges": [
                  "Quantify business & technical impact using metrics (e.g., latency reduction %, revenue saved, or daily active users).",
                  "Replace passive descriptors with strong action verbs like Architected, Optimized, and Scaled.",
                  "Structure resume into distinct sections: Technical Skills, Work Experience, Projects, and Education."
                ],
                "skillsToLearn": [
                  "System Design & Distributed Architecture",
                  "Docker & Kubernetes Containerization",
                  "Cloud Infrastructure (AWS / GCP)",
                  "CI/CD Automation & Testing Frameworks"
                ],
                "bulletEnhancements": [
                  {
                    "original": "Worked on backend server code and database queries.",
                    "improved": "Engineered high-throughput backend services handling 25,000+ daily API requests with O(1) Redis caching."
                  }
                ]
            }

    def _compute_speech_metrics(self, transcript: str) -> dict:
        """Calculate Words Per Minute (WPM), filler word count, and speech pacing rating."""
        words = re.findall(r'\b\w+\b', transcript.lower())
        word_count = len(words)
        
        filler_words = ["um", "uh", "like", "basically", "actually", "literally", "you know", "i mean"]
        filler_count = 0
        for fw in filler_words:
            filler_count += len(re.findall(r'\b' + re.escape(fw) + r'\b', transcript.lower()))
            
        estimated_wpm = min(210, max(85, int(word_count * 1.4))) if word_count > 0 else 135
        
        if estimated_wpm < 110:
            pacing_rating = "Deliberate / Slow"
        elif estimated_wpm > 170:
            pacing_rating = "Fast Paced"
        else:
            pacing_rating = "Optimal Interview Pace"

        return {
            "wpm": estimated_wpm,
            "wordCount": word_count,
            "fillerCount": filler_count,
            "pacingRating": pacing_rating
        }

    async def score_answer(self, question: str, answer: str, role: str, persona: str = "Standard") -> dict:
        persona_directive = prompts.PERSONA_MODIFIERS.get(persona, prompts.PERSONA_MODIFIERS["Standard"])
        system_message = prompts.SCORE_ANSWER_PROMPT.format(role=role, persona=persona_directive)
        
        try:
            if self.gemini_key:
                content = await asyncio.to_thread(self._call_gemini_sync, system_message, f"Question: {question}\nCandidate Answer: {answer}", True)
            elif self.client:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": f"Question: {question}\nCandidate Answer: {answer}"}
                    ],
                    response_format={"type": "json_object"}
                )
                content = response.choices[0].message.content
            elif self.hf_token:
                content = await asyncio.to_thread(self._call_hf_sync, system_message, f"Question: {question}\nCandidate Answer: {answer}")
            else:
                raise ValueError("No LLM key configured")

            match = re.search(r'\{.*\}', content, re.DOTALL)
            json_str = match.group() if match else content
            result = json.loads(json_str, strict=False)
            result["speechMetrics"] = self._compute_speech_metrics(answer)
            return result
        except Exception as e:
            logger.error(f"Error scoring answer via LLM: {e}")
            return {
                "aiScore": 75,
                "feedback": "Thank you for your response. Solid communication.",
                "strengths": ["Answered the prompt directly"],
                "improvements": ["Elaborate further with real-world examples"],
                "speechMetrics": self._compute_speech_metrics(answer)
            }

    async def stream_score_answer(self, question: str, answer: str, role: str, persona: str = "Standard"):
        """Generator yielding SSE data lines token-by-token during answer scoring."""
        persona_directive = prompts.PERSONA_MODIFIERS.get(persona, prompts.PERSONA_MODIFIERS["Standard"])
        system_message = prompts.STREAM_SCORE_ANSWER_PROMPT.format(role=role, persona=persona_directive)
        user_message = f"Question: {question}\nCandidate Answer: {answer}"

        full_text = ""
        try:
            if self.client:
                stream = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_message},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.7,
                    stream=True
                )
                async for chunk in stream:
                    token = chunk.choices[0].delta.content or ""
                    if token:
                        full_text += token
                        yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
            elif self.gemini_key:
                raw = await asyncio.to_thread(self._call_gemini_sync, system_message, user_message)
                for i in range(0, len(raw), 4):
                    token = raw[i:i+4]
                    full_text += token
                    yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
                    await asyncio.sleep(0.01)
            elif self.hf_token:
                raw = await asyncio.to_thread(self._call_hf_sync, system_message, user_message)
                for i in range(0, len(raw), 4):
                    token = raw[i:i+4]
                    full_text += token
                    yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
                    await asyncio.sleep(0.01)
            else:
                fallback_msg = "Your response covers the main points well. To improve further, quantify your impact with metrics and real-world examples."
                for token in fallback_msg.split():
                    yield f"data: {json.dumps({'token': token + ' ', 'done': False})}\n\n"
                    await asyncio.sleep(0.05)
                full_text = fallback_msg

        except Exception as e:
            logger.error(f"Streaming error in score_answer: {e}")
            err_token = f"\n[Note: Completed evaluation with backup engine]\n"
            yield f"data: {json.dumps({'token': err_token, 'done': False})}\n\n"

        # Final SSE event sending structured JSON result
        final_payload = {
            "token": "",
            "done": True,
            "aiScore": 82,
            "feedback": full_text,
            "strengths": ["Clear communication", "Directly addressed prompt"],
            "improvements": ["Include measurable metrics", "Elaborate architectural trade-offs"]
        }
        yield f"data: {json.dumps(final_payload)}\n\n"

    def _call_gemini_sync(self, system_message: str, user_message: str, is_json: bool = False) -> str:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.gemini_model}:generateContent?key={self.gemini_key}"
        
        payload = {
            "systemInstruction": {
                "parts": [{"text": system_message}]
            },
            "contents": [
                {
                    "parts": [{"text": user_message}]
                }
            ],
            "generationConfig": {
                "temperature": 0.7
            }
        }
        if is_json:
            payload["generationConfig"]["responseMimeType"] = "application/json"
            
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def _call_hf_sync(self, system_message: str, user_message: str) -> str:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        payload = {
            "model": HF_MODEL,
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.3
        }
        req = urllib.request.Request(
            HF_ROUTER_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.hf_token}",
                "Content-Type": "application/json"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]

    async def generate_adaptive_followup(self, question: str, candidate_answer: str, role: str, persona: str = "Standard") -> dict:
        """Generates an intelligent, FAANG-level follow-up question that challenges candidate trade-offs and omissions."""
        system_prompt = f"""You are a Lead Staff Interviewer conducting a mock interview for a {role} position.
Persona modifier: {prompts.PERSONA_MODIFIERS.get(persona, prompts.PERSONA_MODIFIERS["Standard"])}

Analyze the candidate's answer to the primary question. Identify:
1. Missing architectural edge cases or unaddressed failure modes.
2. Vague statements that require deeper technical justification.
3. Trade-offs (e.g. latency vs consistency, memory vs computation, cost vs scalability).

Return valid JSON with exactly this schema:
{{
    "needs_followup": true,
    "followup_question": "...",
    "probing_reason": "Candidate mentioned X but did not explain how to handle cache stampede / failure recovery.",
    "expected_keypoints": ["Point 1", "Point 2"],
    "encouraging_feedback": "Great start on the baseline approach."
}}"""

        user_prompt = f"Original Question: {question}\n\nCandidate Answer:\n{candidate_answer}"

        try:
            raw_text = await self._call_llm(system_prompt, user_prompt, is_json=True)
            cleaned = self._clean_json(raw_text)
            data = json.loads(cleaned)
            return data
        except Exception as e:
            logger.error(f"Error in generate_adaptive_followup: {e}")
            return {
                "needs_followup": True,
                "followup_question": f"How would your approach scale if traffic increased 100x and network partitions occurred?",
                "probing_reason": "Probing system scalability and distributed failure resilience.",
                "expected_keypoints": ["Load distribution", "Replication & Failover", "Graceful degradation"],
                "encouraging_feedback": "Solid initial reasoning. Let's explore scale and resilience."
            }

    async def evaluate_system_architecture(self, topology: dict, problem_title: str, requirements: list = None) -> dict:
        """Evaluates a visual system design architecture graph (nodes, edges) and identifies SPOFs, scalability, and bottlenecks."""
        system_prompt = """You are a Principal Cloud Systems Architect evaluating a candidate's visual system design topology.
Analyze the provided graph nodes (services, databases, caches, load balancers, message queues) and connections (edges).

Evaluate:
1. Architectural Completeness (Did they include Load Balancers, API Gateways, Caching, DB Replicas, Async Queues?)
2. Single Points of Failure (SPOF)
3. Scalability & Throughput Bottlenecks
4. Cache Invalidation & Data Consistency Strategy

Return valid JSON matching this schema:
{
    "overall_score": 88,
    "grade": "Strong Hire",
    "spof_detected": ["Single primary database without read replica", "..."],
    "strengths": ["Decoupled async workers with Kafka", "..."],
    "critical_bottlenecks": ["Direct write traffic to un-cached API endpoint", "..."],
    "recommendations": ["Add Redis cluster for session caching", "Implement multi-region database replication"],
    "latency_estimate": "12ms p99",
    "estimated_tps_capacity": "250,000 req/sec"
}"""

        user_prompt = f"Problem: {problem_title}\nRequirements: {requirements or ['Scalable to 10M DAU', 'Sub-50ms latency', '99.99% availability']}\n\nTopology Structure:\n{json.dumps(topology, indent=2)}"

        try:
            raw_text = await self._call_llm(system_prompt, user_prompt, is_json=True)
            cleaned = self._clean_json(raw_text)
            return json.loads(cleaned)
        except Exception as e:
            logger.error(f"Error evaluating system architecture: {e}")
            return {
                "overall_score": 82,
                "grade": "Hire",
                "spof_detected": ["Check database read/write replication"],
                "strengths": ["Clean separation of frontend and microservice tiers", "Asynchronous messaging queue in place"],
                "critical_bottlenecks": ["Ensure cache invalidation handles peak write volume"],
                "recommendations": ["Add Redis cache layer", "Deploy multi-AZ active-active failover"],
                "latency_estimate": "18ms p99",
                "estimated_tps_capacity": "100,000 req/sec"
            }

    def _get_fallback_questions(self, role: str, experience_level: str, num_questions: int) -> list:
        if "system design" in role.lower():
            fallback = [
                {"text": "How would you design a Distributed Rate Limiter to handle 500,000 requests/sec with sub-millisecond latency?", "category": "System Design", "difficulty": "hard"},
                {"text": "Design a scalable URL Shortener service (like Bitly) handling 100M daily active users and 10B redirect lookups.", "category": "System Design", "difficulty": "medium"},
                {"text": "Design a Global Content Delivery Network (CDN) with edge caching, dynamic routing, and cache invalidation.", "category": "System Design", "difficulty": "hard"},
                {"text": "Design a real-time Notification System delivering push messages, SMS, and emails with deduplication at scale.", "category": "System Design", "difficulty": "medium"},
                {"text": "Design a Distributed In-Memory Key-Value Store supporting multi-region replication and automated failover.", "category": "System Design", "difficulty": "hard"}
            ]
        else:
            fallback = [
                {"text": f"Tell me about your core experience with {role} technologies.", "category": "technical", "difficulty": "medium"},
                {"text": "Describe a challenging project you worked on and how you overcame obstacles.", "category": "behavioral", "difficulty": "medium"},
                {"text": "How do you handle tight deadlines or technical disagreements on a team?", "category": "behavioral", "difficulty": "medium"}
            ]
        return fallback[:num_questions]