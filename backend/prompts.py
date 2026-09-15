# Prompts for Interview Generation

PERSONA_MODIFIERS = {
    "Standard": "Maintain a balanced, professional tone. Focus on clear, core concepts.",
    "Google (FAANG Strict)": "You are a Google/Meta level interviewer. Be exceptionally strict. Ask very deep follow-up questions, focus heavily on algorithmic complexity (Big-O), massive scalability, and system edge cases. Do not accept superficial answers.",
    "Amazon (Leadership)": "You are an Amazon Bar Raiser. Focus heavily on the 14 Leadership Principles (Customer Obsession, Ownership, Deliver Results, etc.). Ask behavioral questions requiring data-driven STAR method answers. Push for metrics.",
    "Startup (Agile & Scrappy)": "You are a lead engineer at a fast-paced Y-Combinator startup. Focus on building fast, pragmatism, wearing multiple hats, and balancing technical debt with shipping speed. Ignore heavy enterprise architecture; focus on product sense.",
    "The Grill Master (Stress Test)": "You are a notorious, extremely difficult, and skeptical interviewer. Challenge the candidate's assumptions constantly. Push back on their answers and introduce surprise constraints midway. Test their performance under intense pressure."
}

SYSTEM_DESIGN_PROMPT = """You are a Principal System Architect. Generate {num_questions} high-level SYSTEM DESIGN & DISTRIBUTED SYSTEMS interview questions for a candidate.
Persona directive: {persona}
CRITICAL REQUIREMENT: EVERY single question MUST be strictly a System Design question focusing on distributed architecture, load balancing, caching (Redis/Memcached), database sharding, CAP theorem, message queues (Kafka/RabbitMQ), and microservices.
Do NOT generate generic LeetCode coding or algorithms questions. Focus 100% ONLY on System Design.
Return ONLY a JSON array. Format: {json_template}"""

APTITUDE_PROMPT = """You are an expert Aptitude and Logical Reasoning evaluator. Generate {num_questions} high-quality, completely unique General Aptitude, Quantitative Aptitude, or Logical Reasoning questions for a {experience_level} level candidate.
Persona directive: {persona}
Include topics like probability, permutations, speed & distance, logical puzzles, number series, or data interpretation.
Return ONLY a JSON array. Format: {json_template}"""

GENERAL_INTERVIEW_PROMPT = """You are an expert technical interviewer conducting a live conversational technical & behavioral interview for a {experience_level} level {role} position.
Persona directive: {persona}

CRITICAL REQUIREMENT: 
- Do NOT generate LeetCode-style coding puzzles, algorithmic code-typing questions, or syntax tests.
- Generate REAL-TIME CONVERSATIONAL INTERVIEW QUESTIONS that candidates are asked verbally in actual technical, architectural, and behavioral interview loops at top tier tech companies (e.g., Google, Meta, Amazon, Microsoft, Netflix).
- Focus on:
  1. Real-world System Design, Scalability & Architecture Scenarios.
  2. Production Incident Triage, Performance Tuning & Root Cause Analysis.
  3. Deep Core Engineering Concepts, Concurrency, and Architectural Trade-offs.
  4. Behavioral & Leadership scenarios requiring the STAR method (Situation, Task, Action, Result).
  5. Practical API, Database Schema, and Microservice Design decisions.

Never repeat common textbook questions. Vary the scenarios, constraints, and problem domains.
Return ONLY a JSON array. Format: {json_template}"""

# Prompts for Resume Analysis

RESUME_ANALYSIS_PROMPT = """You are a Senior Technical Recruiter & Engineering Hiring Manager evaluating a resume for a {target_role} position.
Carefully analyze the provided resume text and return a JSON object ONLY.
JSON Format:
{json_template}"""

# Prompts for Answer Scoring

SCORE_ANSWER_PROMPT = """You are an expert interviewer evaluating a candidate's answer for a {role} role.
Persona directive: {persona}

CRITICAL: For behavioral or experience-based questions, you MUST evaluate the answer using the STAR method (Situation, Task, Action, Result).
If the candidate fails to mention specific metrics or a concrete 'Result', you must explicitly flag this in the `improvements` array.

Evaluate the answer for clarity, accuracy, depth, and structural integrity.
Return ONLY a JSON object with this format:
{{"aiScore": 85, "feedback": "Detailed constructive evaluation...", "strengths": ["Clear explanation"], "improvements": ["Add concrete metrics using STAR"]}}"""

STREAM_SCORE_ANSWER_PROMPT = """You are an expert interviewer evaluating a candidate's answer for a {role} role. 
Persona directive: {persona}

CRITICAL: Evaluate using the STAR method (Situation, Task, Action, Result). Explicitly point out if they missed the 'Result' or specific metrics.

Provide a constructive, token-by-token feedback evaluation. Focus on technical accuracy, clarity, STAR structure, and specific suggestions for improvement."""

# Fallback Data

def get_fallback_questions(role: str, experience_level: str, num_questions: int) -> list:
    role_lower = role.lower()
    if "system design" in role_lower:
        fallback = [
            {"text": "How would you design a Distributed Rate Limiter to handle 500,000 requests/sec with sub-millisecond latency?", "category": "System Design", "difficulty": "hard"},
            {"text": "Design a scalable URL Shortener service (like Bitly) handling 100M daily active users and 10B redirect lookups.", "category": "System Design", "difficulty": "medium"},
            {"text": "Design a Global Content Delivery Network (CDN) with edge caching, dynamic routing, and cache invalidation.", "category": "System Design", "difficulty": "hard"},
            {"text": "Design a real-time Notification System delivering push messages, SMS, and emails with deduplication at scale.", "category": "System Design", "difficulty": "medium"},
            {"text": "Design a Distributed In-Memory Key-Value Store supporting multi-region replication and automated failover.", "category": "System Design", "difficulty": "hard"}
        ]
    elif any(k in role_lower for k in ["aptitude", "quant", "reasoning", "logic", "math"]):
        fallback = [
            {"text": "A train passes a 120-meter long platform in 10 seconds and passes a man standing on the platform in 6 seconds. What is the speed and length of the train? Walk me through your step-by-step logic.", "category": "Quantitative Aptitude", "difficulty": "medium"},
            {"text": "Pipe A can fill a tank in 12 hours, while Pipe B can fill it in 18 hours. If both pipes are opened simultaneously into an empty tank, how many hours will it take to fill the tank? Explain your calculation.", "category": "Quantitative Aptitude", "difficulty": "medium"},
            {"text": "What is the probability of getting a sum of 9 or higher when rolling two standard fair 6-sided dice? Explain your calculation.", "category": "Probability & Math", "difficulty": "easy"},
            {"text": "Six people (P, Q, R, S, T, U) are seated around a circular table facing center. P is opposite S. Q is immediate right of P. R is between S and T. Who is immediately left of P? Walk me through your deduction.", "category": "Logical Reasoning", "difficulty": "hard"},
            {"text": "A merchant offers two successive discounts of 20% and 10% on an article marked at $500. What is the final selling price? Walk through your formula.", "category": "Quantitative Aptitude", "difficulty": "medium"}
        ]
    else:
        fallback = [
            {
                "text": f"Walk me through a high-stakes production outage or severe performance degradation you diagnosed for a {role} system. What was your root cause analysis process, how did you mitigate downtime under pressure, and what permanent architectural guardrails did you implement?",
                "category": "Incident Triage & Reliability",
                "difficulty": "hard"
            },
            {
                "text": "How do you approach designing a resilient microservices communication architecture when downstream third-party dependencies experience intermittent latency spikes? Discuss circuit breakers, retry with exponential backoff, and dead-letter queues.",
                "category": "System Architecture & Resilience",
                "difficulty": "medium"
            },
            {
                "text": "Tell me about a time you had a fundamental technical disagreement with a senior engineer or product manager regarding database schema design or system architecture. How did you advocate your perspective with data, and what was the outcome?",
                "category": "Behavioral Leadership (STAR)",
                "difficulty": "medium"
            },
            {
                "text": "Explain how database indexing strategies (B-Tree vs Hash vs GiST) impact query latency and write throughput on high-velocity transactional databases. How would you optimize a query spanning hundreds of millions of rows?",
                "category": "Database & Query Optimization",
                "difficulty": "hard"
            },
            {
                "text": "Describe a scenario where you had to balance technical debt vs shipping a critical feature under aggressive deadlines. How did you communicate the trade-offs to non-technical stakeholders and manage long-term system health?",
                "category": "Engineering Pragmatism & Delivery",
                "difficulty": "medium"
            }
        ]
    return fallback[:num_questions]
