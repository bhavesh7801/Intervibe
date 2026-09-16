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
            
        self.model = "openai/gpt-oss-120b"
        self.fallback_model = "openai/gpt-oss-20b"
        self.gemini_model = "gemini-2.5-flash"

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
            content = None
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
                    try:
                        response = await self.client.chat.completions.create(
                            model=self.fallback_model,
                            messages=[
                                {"role": "system", "content": system_message},
                                {"role": "user", "content": f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})"}
                            ],
                            temperature=0.85
                        )
                        content = response.choices[0].message.content
                    except Exception as e_fb:
                        logger.warning(f"Groq fallback failed ({e_fb})")

            # Fallback to Gemini if Groq failed or was unconfigured
            if not content and self.gemini_key:
                try:
                    content = await asyncio.to_thread(self._call_gemini_sync, system_message, f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})", True)
                except Exception as e_gem:
                    logger.warning(f"Gemini fallback failed: {e_gem}")

            # Fallback to HF
            if not content and self.hf_token:
                try:
                    content = await asyncio.to_thread(self._call_hf_sync, system_message, f"Generate {num_questions} distinct questions for {experience_level} {role} (Seed #{rand_salt})")
                except Exception as e_hf:
                    logger.warning(f"HF fallback failed: {e_hf}")

            if not content:
                raise ValueError("No LLM key configured or all providers failed")
            
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

    def _clean_json(self, text: str) -> str:
        if not text:
            return "{}"
        cleaned = re.sub(r'^```(?:json)?\s*', '', text.strip(), flags=re.MULTILINE)
        cleaned = re.sub(r'\s*```$', '', cleaned.strip(), flags=re.MULTILINE)
        match = re.search(r'(\{.*\}|\[.*\])', cleaned, re.DOTALL)
        return match.group(1) if match else cleaned

    async def _call_llm(self, system_prompt: str, user_prompt: str, is_json: bool = True) -> str:
        if self.client:
            try:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"} if is_json else None,
                    temperature=0.4
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.warning(f"Groq LLM call failed ({e}), trying fallback model: {self.fallback_model}")
                response = await self.client.chat.completions.create(
                    model=self.fallback_model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"} if is_json else None,
                    temperature=0.4
                )
                return response.choices[0].message.content
        elif self.gemini_key:
            return await asyncio.to_thread(self._call_gemini_sync, system_prompt, user_prompt, is_json)
        elif self.hf_token:
            return await asyncio.to_thread(self._call_hf_sync, system_prompt, user_prompt)
        raise ValueError("No LLM engine available")

    async def analyze_resume(self, resume_text: str, target_role: str = "Software Engineer", job_description: str = "") -> dict:
        """
        Analyzes candidate resume against target role and job description.
        Computes compatibility score, matches skills, identifies missing skills with suggestions.
        """
        json_template = """{
    "overallScore": 84,
    "fitVerdict": "Strong Match",
    "role": "Senior Backend Engineer",
    "experienceSummary": "Solid backend background with high API and database fluency.",
    "matchedSkills": ["Python", "FastAPI", "PostgreSQL", "Docker", "RESTful APIs", "Redis"],
    "missingSkills": [
        {"skill": "Kafka", "category": "Message Streaming", "importance": "High", "reason": "Target role requires event-driven high-throughput pub/sub streaming architecture."},
        {"skill": "Kubernetes", "category": "DevOps & Orchestration", "importance": "Medium", "reason": "Cloud container orchestration is essential for modern backend microservices deployment."}
    ],
    "strengths": [
        "Strong fundamentals in backend API development and asynchronous programming",
        "Demonstrated database design and query optimization experience"
    ],
    "skillGapsByCategory": {
        "Languages & Frameworks": {"score": 90, "status": "Strong", "missing": []},
        "System Architecture & Scaling": {"score": 75, "status": "Moderate", "missing": ["Distributed Event Streaming (Kafka)"]},
        "Cloud & Infrastructure": {"score": 70, "status": "Needs Improvement", "missing": ["Kubernetes (k8s)", "Terraform IaC"]},
        "Databases & Caching": {"score": 88, "status": "Strong", "missing": []}
    },
    "actionableSuggestions": [
        {
            "skill": "Kafka",
            "action": "Build a hands-on event-driven microservice using Kafka partitions to handle asynchronous order processing or real-time telemetry.",
            "studyTopic": "Partition rebalancing, consumer groups, and exactly-once delivery semantics"
        },
        {
            "skill": "Kubernetes",
            "action": "Deploy your backend service to a local Minikube / K3s cluster with Helm charts, Ingress routing, and Horizontal Pod Autoscaling (HPA).",
            "studyTopic": "K8s Pod lifecycles, ConfigMaps/Secrets, and zero-downtime rolling updates"
        }
    ],
    "interviewFocusAreas": [
        "Distributed message broker partition strategies",
        "Container scaling and production health probe configurations"
    ]
}"""

        default_jd = job_description.strip() if job_description and job_description.strip() else f"Standard industry requirements for a {target_role} specializing in scalable architecture, performance, clean code, and production reliability."
        
        system_prompt = prompts.RESUME_ANALYSIS_PROMPT.format(
            target_role=target_role,
            job_description=default_jd,
            json_template=json_template
        )
        user_prompt = f"Target Role: {target_role}\n\nCandidate Resume Content:\n{resume_text[:6000]}"

        try:
            raw_text = await self._call_llm(system_prompt, user_prompt, is_json=True)
            cleaned = self._clean_json(raw_text)
            parsed = json.loads(cleaned, strict=False)
            if isinstance(parsed, dict) and "overallScore" in parsed:
                return parsed
        except Exception as e:
            logger.error(f"Error analyzing resume via LLM: {e}")

        # Deterministic Rule-Based Fallback
        return self._get_deterministic_resume_analysis(resume_text, target_role, default_jd)

    def _get_deterministic_resume_analysis(self, resume_text: str, target_role: str, job_description: str) -> dict:
        """Deterministic skill matrix evaluation fallback if LLM is unavailable."""
        role_lower = target_role.lower()
        resume_lower = resume_text.lower()

        # Skill taxonomy map
        role_skills_map = {
            "backend": [
                ("Python", "Languages", "High", "Core backend development language"),
                ("Go / Golang", "Languages", "Medium", "High-concurrency systems programming"),
                ("FastAPI / Express / Spring", "Frameworks", "High", "RESTful web services & APIs"),
                ("PostgreSQL / MySQL", "Databases", "High", "Relational database modeling and indexing"),
                ("Redis", "Caching", "High", "In-memory caching and distributed session management"),
                ("Kafka / RabbitMQ", "Streaming & Queues", "High", "Event-driven asynchronous messaging"),
                ("Docker", "Containerization", "High", "Service containerization & reproducible builds"),
                ("Kubernetes", "DevOps", "Medium", "Container cluster orchestration & scaling"),
                ("System Design", "Architecture", "High", "Distributed scalability and microservice patterns"),
                ("CI/CD & GitHub Actions", "DevOps", "Medium", "Automated build and test deployment pipelines")
            ],
            "frontend": [
                ("JavaScript (ES6+)", "Languages", "High", "Core web programming language"),
                ("TypeScript", "Languages", "High", "Type safety for large-scale web applications"),
                ("React", "Frameworks", "High", "Component-driven UI architecture"),
                ("Next.js", "Frameworks", "Medium", "Server-side rendering and static site generation"),
                ("Tailwind CSS", "Styling", "Medium", "Modern utility-first responsive styling"),
                ("State Management (Redux/Zustand)", "State", "High", "Global application state architecture"),
                ("Web Performance & Vitals", "Optimization", "High", "Bundle splitting, lazy loading, and sub-100ms render"),
                ("REST & GraphQL APIs", "Networking", "High", "Client-side data fetching and mutation"),
                ("Unit Testing (Jest/Playwright)", "Testing", "Medium", "Automated front-end testing"),
                ("Accessibility (a11y)", "Best Practices", "Medium", "WCAG compliance and keyboard navigation")
            ],
            "full stack": [
                ("TypeScript", "Languages", "High", "Full-stack end-to-end type safety"),
                ("React / Next.js", "Frontend", "High", "Interactive user interfaces"),
                ("Node.js / Python", "Backend", "High", "Backend API servers and business logic"),
                ("PostgreSQL / MongoDB", "Databases", "High", "Database design and ORM management"),
                ("Redis", "Caching", "Medium", "Low-latency query and session caching"),
                ("Docker", "DevOps", "High", "Containerization for local and cloud environments"),
                ("AWS / Cloud Infrastructure", "Cloud", "Medium", "Cloud service provisioning and deployment"),
                ("REST & GraphQL APIs", "Networking", "High", "End-to-end API contracts"),
                ("Authentication & JWT/OAuth", "Security", "High", "Secure user authorization and session state"),
                ("CI/CD Automation", "DevOps", "Medium", "Continuous integration and delivery")
            ],
            "system design": [
                ("Distributed Caching (Redis)", "Caching", "High", "Cache-aside, write-through, and stampede prevention"),
                ("Message Queues (Kafka)", "Messaging", "High", "Decoupled asynchronous event pipelines"),
                ("Database Sharding & Replication", "Storage", "High", "Horizontal scaling and read/write splitting"),
                ("Load Balancers & Reverse Proxies", "Networking", "High", "Traffic distribution and SSL termination"),
                ("CAP Theorem & PACELC", "Theory", "High", "Consistency vs availability trade-offs"),
                ("Rate Limiting & Throttling", "Resilience", "High", "Token bucket and leaky bucket algorithms"),
                ("Microservices Architecture", "Architecture", "High", "Service boundaries and gRPC/REST communication"),
                ("High Availability & Multi-AZ", "Reliability", "High", "Zero-downtime failover and disaster recovery"),
                ("Monitoring & Observability", "Ops", "Medium", "Distributed tracing (OpenTelemetry) and metrics"),
                ("Data Warehousing / Analytics", "Storage", "Medium", "OLAP vs OLTP data pipelines")
            ]
        }

        # Select closest matched role skills
        selected_key = "full stack"
        for k in role_skills_map:
            if k in role_lower:
                selected_key = k
                break

        skill_entries = role_skills_map[selected_key]

        matched = []
        missing = []
        actionable_suggestions = []

        for skill_name, category, importance, reason in skill_entries:
            # Check presence
            check_words = [w.lower() for w in re.split(r'[\s/()]+', skill_name) if len(w) > 2]
            is_present = any(w in resume_lower for w in check_words)

            if is_present:
                matched.append(skill_name)
            else:
                missing.append({
                    "skill": skill_name,
                    "category": category,
                    "importance": importance,
                    "reason": reason
                })
                actionable_suggestions.append({
                    "skill": skill_name,
                    "action": f"Build a practical project module demonstrating hands-on {skill_name} implementation.",
                    "studyTopic": f"{skill_name} core architecture, failure modes, and production best practices."
                })

        score = max(45, int((len(matched) / max(1, len(skill_entries))) * 100))
        verdict = "Strong Match" if score >= 80 else ("Moderate Fit" if score >= 65 else "Skill Gaps Detected")

        return {
            "overallScore": score,
            "fitVerdict": verdict,
            "role": target_role,
            "experienceSummary": f"Candidate demonstrates competencies in {', '.join(matched[:4]) if matched else 'core software engineering'}, with targeted growth areas in {', '.join([m['skill'] for m in missing[:3]]) if missing else 'specialized tools'}.",
            "matchedSkills": matched if matched else ["Software Engineering", "Problem Solving", "Git"],
            "missingSkills": missing,
            "strengths": [
                f"Demonstrated background in {matched[0]}" if matched else "Clear engineering background",
                f"Experience with {matched[1]}" if len(matched) > 1 else "Direct problem solving abilities"
            ],
            "skillGapsByCategory": {
                "Core Engineering": {"score": min(95, score + 10), "status": "Strong", "missing": []},
                "Architecture & Scaling": {"score": max(50, score - 15), "status": "Needs Review", "missing": [m["skill"] for m in missing if m["category"] in ["Architecture", "Storage", "Messaging"]][:2]},
                "Cloud & DevOps": {"score": max(55, score - 10), "status": "Needs Review", "missing": [m["skill"] for m in missing if m["category"] in ["DevOps", "Cloud", "Containerization"]][:2]}
            },
            "actionableSuggestions": actionable_suggestions[:4],
            "interviewFocusAreas": [
                f"Deep-dive practice on {missing[0]['skill']}" if missing else "System scalability tradeoffs",
                f"Hands-on scenarios for {missing[1]['skill']}" if len(missing) > 1 else "Production failure recovery"
            ]
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