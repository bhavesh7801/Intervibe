import uuid
import random
import re

# Comprehensive Topic Question Banks for Assessment Exams
TOPIC_QUESTION_BANKS = {
    "react": [
        {
            "title": "React useEffect Dependency Array Pitfall",
            "questionType": "mcq",
            "category": "React & Frontend",
            "difficulty": "Medium",
            "description": "In React, what happens if an object or function created inside a component body is passed directly into a useEffect dependency array without useMemo or useCallback?",
            "options": [
                "A. React compiles the object once and skips re-running the effect",
                "B. A new reference is created on every render, causing the effect to execute on every render",
                "C. React throws an Uncaught ReferenceError in development mode",
                "D. The effect only runs when the component unmounts"
            ],
            "correctAnswer": "B",
            "explanation": "Because JavaScript compares objects and functions by reference (referential equality), defining them inside the component body creates a fresh reference on every render, causing useEffect to re-run every time."
        },
        {
            "title": "Virtual DOM & Reconciliation Diffing",
            "questionType": "mcq",
            "category": "React & Frontend",
            "difficulty": "Medium",
            "description": "Why does React require stable, unique 'key' props when rendering dynamic lists of elements?",
            "options": [
                "A. To apply CSS styling rules to individual elements",
                "B. To help React's reconciliation algorithm identify which items have changed, been added, or removed",
                "C. To prevent the browser from caching DOM nodes",
                "D. To trigger garbage collection on unmounted array items"
            ],
            "correctAnswer": "B",
            "explanation": "Keys provide a persistent identity for list elements across renders. Without stable keys, React falls back to index-based reconciliation, which can cause subtle rendering bugs and unnecessary DOM mutations."
        },
        {
            "title": "React Server Components (RSC) vs Client Components",
            "questionType": "mcq",
            "category": "React & Frontend",
            "difficulty": "Hard",
            "description": "What is the primary architectural advantage of React Server Components over traditional Client Components?",
            "options": [
                "A. They run faster because they bypass JavaScript entirely",
                "B. They execute exclusively on the server with zero client bundle impact and direct access to backend resources",
                "C. They enable automatic state synchronization across multiple browser tabs",
                "D. They convert HTML directly into WebAssembly binary bytecode"
            ],
            "correctAnswer": "B",
            "explanation": "React Server Components execute only on the server, streaming structured UI to the client without including their dependencies in the client-side JavaScript bundle."
        },
        {
            "title": "React State Batching in React 18+",
            "questionType": "mcq",
            "category": "React & Frontend",
            "difficulty": "Easy",
            "description": "How does React 18 handle multiple consecutive setState calls inside asynchronous operations like setTimeout or fetch promises?",
            "options": [
                "A. Each setState triggers an immediate, synchronous re-render",
                "B. React automatically batches them into a single re-render (Automatic Batching)",
                "C. React cancels all but the final setState call",
                "D. React throws a ConcurrentModeWarning"
            ],
            "correctAnswer": "B",
            "explanation": "React 18 introduced Automatic Batching across all contexts (promises, setTimeout, native event handlers), grouping multiple state updates into a single re-render for performance."
        },
        {
            "title": "useCallback vs useMemo",
            "questionType": "mcq",
            "category": "React & Frontend",
            "difficulty": "Medium",
            "description": "What is the primary difference between useCallback(fn, deps) and useMemo(fn, deps)?",
            "options": [
                "A. useCallback caches a memoized function definition, whereas useMemo caches the result of calling the function",
                "B. useCallback runs synchronously, while useMemo runs asynchronously in a Web Worker",
                "C. useMemo is deprecated in favor of React Compiler",
                "D. useCallback can only be used with DOM event handlers"
            ],
            "correctAnswer": "A",
            "explanation": "useCallback returns a memoized version of the callback function itself, while useMemo calls the function and caches its calculated return value."
        }
    ],

    "python": [
        {
            "title": "Python Global Interpreter Lock (GIL)",
            "questionType": "mcq",
            "category": "Python & Backend",
            "difficulty": "Medium",
            "description": "What is the primary consequence of CPython's Global Interpreter Lock (GIL) when running multithreaded programs?",
            "options": [
                "A. CPU-bound tasks cannot achieve true multicore parallelism across multiple threads in a single process",
                "B. I/O-bound network requests are completely blocked from running concurrently",
                "C. Memory leaks occur whenever background worker threads terminate",
                "D. Python code is automatically compiled into static C binary files"
            ],
            "correctAnswer": "A",
            "explanation": "The GIL ensures only one thread executes Python bytecode at a time in CPython. As a result, CPU-bound multithreaded tasks do not run on multiple cores concurrently; multiprocessing or asyncio is preferred."
        },
        {
            "title": "Python Generators vs Lists",
            "questionType": "mcq",
            "category": "Python & Backend",
            "difficulty": "Easy",
            "description": "What is the primary performance benefit of using a generator expression with 'yield' instead of a list comprehension?",
            "options": [
                "A. Generators evaluate elements lazily on-demand with O(1) memory footprint rather than allocating the entire list in RAM",
                "B. Generators compile directly into GPU CUDA instructions",
                "C. Generators are strictly immutable and cannot be iterated over",
                "D. Generators allow random-access indexing like gen[5]"
            ],
            "correctAnswer": "A",
            "explanation": "Generators compute items one by one on the fly (lazy evaluation), avoiding high memory consumption when streaming or processing large datasets."
        },
        {
            "title": "Python Function Decorators & Closures",
            "questionType": "mcq",
            "category": "Python & Backend",
            "difficulty": "Medium",
            "description": "Why is 'functools.wraps(func)' recommended when writing custom Python decorators?",
            "options": [
                "A. To enforce strict type checking on decorator arguments",
                "B. To preserve the original function's metadata such as __name__, __doc__, and __annotations__",
                "C. To run the decorated function inside an isolated thread",
                "D. To automatically retry the function if an exception is raised"
            ],
            "correctAnswer": "B",
            "explanation": "Without functools.wraps, the decorated function inherits the wrapper's name ('wrapper') and docstring, which breaks introspection, debugging tools, and documentation generators."
        },
        {
            "title": "Python Mutable Default Arguments",
            "questionType": "mcq",
            "category": "Python & Backend",
            "difficulty": "Medium",
            "description": "What is the danger of defining a function like `def append_item(item, target_list=[])` in Python?",
            "options": [
                "A. Python raises a SyntaxError during module import",
                "B. The default list is created once at function definition time, so mutations persist across subsequent function calls",
                "C. The list is cleared from memory every time the function terminates",
                "D. The function can only accept string items"
            ],
            "correctAnswer": "B",
            "explanation": "Default argument values are evaluated when the function definition is executed, not at runtime. Mutable defaults like lists or dicts are shared across all calls that omit the argument."
        },
        {
            "title": "Python Asyncio Event Loop",
            "questionType": "mcq",
            "category": "Python & Backend",
            "difficulty": "Hard",
            "description": "In an asyncio application (e.g. FastAPI), what happens if a synchronous, CPU-heavy computation (`time.sleep(10)` or complex math) is executed directly in an `async def` route?",
            "options": [
                "A. Asyncio spawns an OS thread to run the computation in the background",
                "B. It blocks the single event loop thread, freezing all other incoming network requests for 10 seconds",
                "C. Asyncio automatically converts the function to a non-blocking generator",
                "D. The connection is dropped with HTTP 504 Gateway Timeout immediately"
            ],
            "correctAnswer": "B",
            "explanation": "Asyncio runs on a single event loop thread. A blocking synchronous call prevents the event loop from scheduling other coroutines until the blocking call finishes."
        }
    ],

    "javascript": [
        {
            "title": "JavaScript Event Loop: Microtasks vs Macrotasks",
            "questionType": "mcq",
            "category": "JavaScript & Web",
            "difficulty": "Hard",
            "description": "Consider this code: `setTimeout(() => console.log('A'), 0); Promise.resolve().then(() => console.log('B')); console.log('C');` What is the exact execution order?",
            "options": [
                "A. A, B, C",
                "B. C, B, A",
                "C. C, A, B",
                "D. B, C, A"
            ],
            "correctAnswer": "B",
            "explanation": "Synchronous code runs first ('C'). Then all pending Microtasks (Promise callbacks) run before the next event loop tick ('B'). Finally, Macrotasks like setTimeout callbacks are dequeued ('A')."
        },
        {
            "title": "JavaScript Closures & Lexical Scope",
            "questionType": "mcq",
            "category": "JavaScript & Web",
            "difficulty": "Medium",
            "description": "What is a closure in JavaScript?",
            "options": [
                "A. A function bundled together with references to its surrounding lexical environment",
                "B. A method that permanently seals an object to prevent adding new properties",
                "C. A syntax construct used to terminate infinite while loops",
                "D. An asynchronous callback that executes only after DOMContentLoaded"
            ],
            "correctAnswer": "A",
            "explanation": "A closure gives an inner function access to an outer function's scope variables, even after the outer function has finished executing and returned."
        },
        {
            "title": "TypeScript Type Narrowing & Discriminated Unions",
            "questionType": "mcq",
            "category": "TypeScript",
            "difficulty": "Medium",
            "description": "In TypeScript, what is a 'Discriminated Union'?",
            "options": [
                "A. A union type where all member types share a common literal property used by the compiler for pattern matching and narrowing",
                "B. A type that merges multiple interfaces into a single SQL table",
                "C. An experimental feature for runtime schema validation",
                "D. A union type that excludes undefined and null automatically"
            ],
            "correctAnswer": "A",
            "explanation": "A discriminated union uses a common literal property (e.g. `kind: 'circle' | 'square'`) so TypeScript can automatically narrow the type inside switch or if blocks."
        }
    ],

    "databases": [
        {
            "title": "Database Isolation Levels & Dirty Reads",
            "questionType": "mcq",
            "category": "Databases & SQL",
            "difficulty": "Medium",
            "description": "Which SQL transaction isolation level prevents 'Dirty Reads' but still permits 'Non-Repeatable Reads'?",
            "options": [
                "A. Read Uncommitted",
                "B. Read Committed",
                "C. Repeatable Read",
                "D. Serializable"
            ],
            "correctAnswer": "B",
            "explanation": "Read Committed ensures a transaction only views data committed prior to query execution, preventing dirty reads while still allowing non-repeatable reads if another transaction commits changes concurrently."
        },
        {
            "title": "Database Indexing: B-Tree vs Hash Index",
            "questionType": "mcq",
            "category": "Databases & SQL",
            "difficulty": "Medium",
            "description": "Why are B-Tree indexes preferred over Hash indexes as the default indexing structure in relational databases like PostgreSQL and MySQL?",
            "options": [
                "A. B-Trees require less disk space than hash tables",
                "B. B-Trees efficiently support range queries (BETWEEN, <, >, ORDER BY) whereas Hash indexes only support point equality lookups (=)",
                "C. B-Trees do not require lock acquisition during concurrent writes",
                "D. Hash indexes cannot be used on integer columns"
            ],
            "correctAnswer": "B",
            "explanation": "B-Tree indexes maintain keys in sorted order, enabling logarithmic search for point lookups as well as fast range scans, prefix matching, and sorted outputs."
        },
        {
            "title": "N+1 Query Problem in ORMs",
            "questionType": "mcq",
            "category": "Databases & SQL",
            "difficulty": "Medium",
            "description": "What is the N+1 query problem commonly encountered with Object-Relational Mappers (ORMs)?",
            "options": [
                "A. Inserting N rows requires N database restarts",
                "B. Fetching 1 parent query followed by N individual round-trip queries to fetch related child records for each row",
                "C. Database connection pool exhaustion caused by having N+1 simultaneous users",
                "D. Primary key auto-increment values skipping N intervals"
            ],
            "correctAnswer": "B",
            "explanation": "The N+1 problem occurs when an application executes one query to retrieve parent entities and then executes a separate query for each of the N entities to load associations. Eager loading (JOIN/prefetch) solves this."
        }
    ],

    "devops": [
        {
            "title": "Docker Multi-Stage Builds",
            "questionType": "mcq",
            "category": "DevOps & Cloud",
            "difficulty": "Medium",
            "description": "What is the primary operational benefit of using Multi-Stage Dockerfiles in production builds?",
            "options": [
                "A. They allow running multiple distinct operating systems inside a single container",
                "B. They separate build dependencies and compilers from the final runtime image, resulting in dramatically smaller and more secure images",
                "C. They enable Docker containers to bypass kernel cgroups",
                "D. They automatically configure Kubernetes pod auto-scalers"
            ],
            "correctAnswer": "B",
            "explanation": "Multi-stage builds allow developers to install heavy compilers, SDKs, and build tooling in intermediate stages, copying only compiled production artifacts to a minimal final image (e.g. alpine or distroless)."
        },
        {
            "title": "Kubernetes Pod vs Deployment",
            "questionType": "mcq",
            "category": "DevOps & Cloud",
            "difficulty": "Easy",
            "description": "In Kubernetes, why are raw Pods rarely deployed directly to production clusters without a Deployment controller?",
            "options": [
                "A. Raw Pods cannot attach Persistent Volumes",
                "B. Raw Pods lack self-healing, rolling updates, rollbacks, and replica management if a node crashes",
                "C. Raw Pods cannot expose network ports over TCP",
                "D. Kubernetes CLI commands forbid creating standalone Pods"
            ],
            "correctAnswer": "B",
            "explanation": "A Deployment controller manages ReplicaSets, enabling self-healing (replacing dead pods), zero-downtime rolling updates, and declarative replica scaling."
        },
        {
            "title": "Blue-Green vs Canary Deployment Strategies",
            "questionType": "mcq",
            "category": "DevOps & Cloud",
            "difficulty": "Medium",
            "description": "What distinguishes a Canary deployment from a Blue-Green deployment strategy?",
            "options": [
                "A. Blue-Green deploys to cloud; Canary deploys strictly on-premises",
                "B. Canary routes a small percentage of production traffic to the new version first to validate metrics before a full rollout",
                "C. Blue-Green requires zero duplicate infrastructure",
                "D. Canary does not support rollbacks in case of errors"
            ],
            "correctAnswer": "B",
            "explanation": "Canary deployment exposes a small subset of live users/traffic to the new build to monitor error rates and latency before gradually shifting 100% of traffic."
        }
    ],

    "system_design": [
        {
            "title": "CAP Theorem & Partition Tolerance",
            "questionType": "mcq",
            "category": "System Design",
            "difficulty": "Hard",
            "description": "According to the CAP theorem, when a network partition (P) occurs in a distributed system, what fundamental tradeoff must be made?",
            "options": [
                "A. Between Performance and Scalability",
                "B. Between Consistency (returning latest data) and Availability (every non-failing node responding)",
                "C. Between Latency and Durability",
                "D. Between Encryption and Compression"
            ],
            "correctAnswer": "B",
            "explanation": "When nodes cannot communicate across a network partition, the system must either reject requests to preserve strong consistency (CP) or accept writes/reads risking stale data to maintain availability (AP)."
        },
        {
            "title": "Cache Invalidation & Cache-Aside Pattern",
            "questionType": "mcq",
            "category": "System Design",
            "difficulty": "Medium",
            "description": "In the Cache-Aside (Lazy Loading) architecture, how does the application handle a cache miss?",
            "options": [
                "A. It returns HTTP 404 Not Found to the client",
                "B. The application reads data from the database, writes it into the cache, and then returns the data to the client",
                "C. The cache server automatically triggers a database stored procedure",
                "D. The application waits until an hourly cron job refreshes the cache"
            ],
            "correctAnswer": "B",
            "explanation": "In Cache-Aside, application code reads from cache. On a miss, it queries the database, writes the result to cache with a TTL, and responds to the client."
        },
        {
            "title": "Horizontal Scaling vs Vertical Scaling",
            "questionType": "mcq",
            "category": "System Design",
            "difficulty": "Easy",
            "description": "What is the key advantage of horizontal scaling (scaling out) over vertical scaling (scaling up)?",
            "options": [
                "A. It requires zero network configuration",
                "B. It allows near-limitless scaling by adding more commodity machines without hardware ceilings or single-point failure",
                "C. It eliminates the need for distributed load balancing",
                "D. It guarantees ACID transactions across all nodes by default"
            ],
            "correctAnswer": "B",
            "explanation": "Vertical scaling hits hard physical hardware limits and introduces single points of failure. Horizontal scaling adds redundant nodes behind load balancers for higher availability and elasticity."
        }
    ],

    "machine_learning": [
        {
            "title": "Overfitting vs Underfitting: Bias-Variance Tradeoff",
            "questionType": "mcq",
            "category": "Machine Learning & AI",
            "difficulty": "Medium",
            "description": "A deep neural network achieves 99.5% accuracy on training data but drops to 62% on validation data. What is this phenomenon, and what causes it?",
            "options": [
                "A. Underfitting caused by high bias",
                "B. Overfitting caused by high variance (model memorized training noise instead of generalizable patterns)",
                "C. Gradient vanishing in the initial layer",
                "D. Data leakage during train-test split"
            ],
            "correctAnswer": "B",
            "explanation": "High training accuracy paired with poor generalization to unseen validation data is the hallmark of overfitting (high variance). Techniques like dropout, L2 regularization, and data augmentation help alleviate this."
        },
        {
            "title": "Precision vs Recall Tradeoff",
            "questionType": "mcq",
            "category": "Machine Learning & AI",
            "difficulty": "Medium",
            "description": "In a critical medical diagnostic model designed to detect a rare, life-threatening disease, which metric should be maximized even at the cost of the other?",
            "options": [
                "A. Precision, to avoid any false alarms",
                "B. Recall (Sensitivity), to minimize False Negatives and avoid missing actual disease cases",
                "C. Silhouette Score",
                "D. Mean Squared Error (MSE)"
            ],
            "correctAnswer": "B",
            "explanation": "In life-or-death diagnostics, missing a true positive (False Negative) is catastrophic. High Recall minimizes false negatives, ensuring nearly all diseased patients receive further evaluation."
        }
    ],

    "dsa": [
        {
            "title": "Time Complexity of Search in Balanced BST",
            "questionType": "mcq",
            "category": "Data Structures & Algorithms",
            "difficulty": "Medium",
            "description": "What is the worst-case time complexity of searching for an element in a self-balancing AVL Tree or Red-Black Tree with N nodes?",
            "options": ["A. O(1)", "B. O(log N)", "C. O(N)", "D. O(N log N)"],
            "correctAnswer": "B",
            "explanation": "Balanced Binary Search Trees maintain a height bound of O(log N), ensuring lookup, insertion, and deletion operations all complete in O(log N) worst-case time."
        },
        {
            "title": "Hash Table Collisions & Load Factor",
            "questionType": "mcq",
            "category": "Data Structures & Algorithms",
            "difficulty": "Medium",
            "description": "What happens when a hash table's load factor exceeds its configured threshold (e.g. 0.75)?",
            "options": [
                "A. The hash table switches permanently to binary search",
                "B. The internal array is resized (typically doubled) and all existing keys are rehashed to maintain O(1) average lookup",
                "C. Incoming keys are rejected with an OverflowException",
                "D. Oldest keys are automatically evicted via LRU policy"
            ],
            "correctAnswer": "B",
            "explanation": "When load factor exceeds threshold, hash collision rates rise, degrading lookups toward O(N). Resizing the bucket array and rehashing entries restores O(1) average time."
        },
        {
            "title": "Dijkstra's Algorithm Limitations",
            "questionType": "mcq",
            "category": "Data Structures & Algorithms",
            "difficulty": "Hard",
            "description": "Why does standard Dijkstra's single-source shortest path algorithm fail on graphs containing negative edge weights?",
            "options": [
                "A. Dijkstra requires the graph to be bipartite",
                "B. It greedily assumes once a vertex's shortest distance is finalized, no shorter path to it can ever be found",
                "C. Priority queues cannot store negative integers",
                "D. Dijkstra only works on directed acyclic graphs (DAGs)"
            ],
            "correctAnswer": "B",
            "explanation": "Dijkstra relies on the greedy property that adding non-negative edges never decreases path length. A negative weight can violate this assumption, requiring the Bellman-Ford algorithm instead."
        }
    ]
}


def get_curated_assessment_questions(target_role: str, num_questions: int = 5, difficulty: str = "Mixed") -> list[dict]:
    """
    Intelligently matches the candidate's target role/topic to the most relevant
    curated question domain, samples questions, and customizes them dynamically.
    """
    role_lower = (target_role or "").lower()
    
    # 1. Topic Keyword Matching
    matched_domain = "dsa"
    if any(k in role_lower for k in ["react", "frontend", "front-end", "next", "vue", "angular", "css", "html", "ui"]):
        matched_domain = "react"
    elif any(k in role_lower for k in ["python", "django", "fastapi", "flask"]):
        matched_domain = "python"
    elif any(k in role_lower for k in ["javascript", "typescript", "node", "express", "js"]):
        matched_domain = "javascript"
    elif any(k in role_lower for k in ["database", "sql", "postgres", "mysql", "mongodb", "redis", "data engineer"]):
        matched_domain = "databases"
    elif any(k in role_lower for k in ["devops", "docker", "kubernetes", "k8s", "aws", "cloud", "sre", "ci/cd", "terraform"]):
        matched_domain = "devops"
    elif any(k in role_lower for k in ["system design", "architect", "distributed", "microservices"]):
        matched_domain = "system_design"
    elif any(k in role_lower for k in ["machine learning", "ml", "ai", "artificial intelligence", "data science", "deep learning", "nlp", "llm"]):
        matched_domain = "machine_learning"
    elif any(k in role_lower for k in ["algorithm", "dsa", "leetcode", "data structure", "software engineer", "backend"]):
        # Rotate or select between backend, databases, and algorithms
        matched_domain = random.choice(["python", "system_design", "dsa", "databases"])
    else:
        # Custom novel topic: choose relevant domain or system design
        matched_domain = random.choice(list(TOPIC_QUESTION_BANKS.keys()))

    pool = list(TOPIC_QUESTION_BANKS.get(matched_domain, TOPIC_QUESTION_BANKS["dsa"]))
    
    # If more questions are requested than available in single pool, augment with related pools
    if len(pool) < num_questions:
        for other_domain, other_questions in TOPIC_QUESTION_BANKS.items():
            if other_domain != matched_domain:
                pool.extend(other_questions)
            if len(pool) >= num_questions * 2:
                break

    # Filter by difficulty if explicitly requested and enough matches exist
    if difficulty in ["Easy", "Medium", "Hard"]:
        diff_pool = [q for q in pool if q.get("difficulty") == difficulty]
        if len(diff_pool) >= num_questions:
            pool = diff_pool

    # Sample and randomize
    sample_size = min(num_questions, len(pool))
    selected = random.sample(pool, sample_size)
    
    # Transform with unique IDs and customized role headers
    result = []
    for idx, q in enumerate(selected):
        new_q = dict(q)
        new_q["id"] = f"ai-exam-{uuid.uuid4().hex[:8]}"
        # Ensure category reflects candidate role if custom
        if target_role and target_role.lower() not in ["software engineer", "mixed"]:
            new_q["category"] = f"{target_role.title()} Core"
        result.append(new_q)

    return result
