import React, { useState } from 'react';
import { X, Sparkles, Building2, Briefcase, Zap, ArrowRight, UserCheck, Code2 } from 'lucide-react';
import { ROLES, COMPANY_TRACKS } from '../utils/roleUtils.js';
import { questionsApi } from '../api/index.js';

// Comprehensive LeetCode generator for dynamic tracks & instant fallback
function generateLeetCodeProblem({ topic, difficulty, company, role, persona }) {
  const tLower = topic.toLowerCase();
  const numId = Math.floor(100 + Math.random() * 890);

  // Dynamic template selection based on topic
  if (tLower.includes('tree') || tLower.includes('bst') || tLower.includes('binary tree')) {
    return {
      id: `lc_${numId}`,
      title: `${numId}. Lowest Common Ancestor in Binary Tree`,
      category: 'Trees & Recursion',
      topics: ['Tree', 'Depth-First Search', 'Binary Tree'],
      difficulty: difficulty || 'Medium',
      company: company || 'Google',
      role: role || 'Full Stack Engineer',
      persona: persona || 'Standard',
      timeLimitMinutes: difficulty === 'Hard' ? 45 : 30,
      acceptance: '58.4%',
      prompt: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes \`p\` and \`q\`.\n\nAccording to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in \`T\` that has both \`p\` and \`q\` as descendants (where we allow a node to be a descendant of itself)."\n\nExample 1:\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\nOutput: 3\nExplanation: The LCA of nodes 5 and 1 is 3.\n\nExample 2:\nInput: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4\nOutput: 5\nExplanation: The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.\n\nExample 3:\nInput: root = [1,2], p = 1, q = 2\nOutput: 1\n\nConstraints:\n• The number of nodes in the tree is in the range [2, 10^5].\n• -10^9 <= Node.val <= 10^9\n• All Node.val are unique.\n• p != q\n• p and q will exist in the tree.\n\nFollow-up: Can you solve this iteratively using parent pointers?`,
      hints: [
        'Start by traversing from the root. If the current node matches p or q, return it.',
        'Search the left and right subtrees recursively. If both left and right return non-null values, the current node is the LCA.'
      ],
      starterCode: {
        python: `class TreeNode:\n    def __init__(self, x):\n        self.val = x\n        self.left = None\n        self.right = None\n\nclass Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        if not root or root == p or root == q:\n            return root\n        \n        left = self.lowestCommonAncestor(root.left, p, q)\n        right = self.lowestCommonAncestor(root.right, p, q)\n        \n        if left and right:\n            return root\n        return left if left else right`,
        javascript: `/**\n * Definition for a binary tree node.\n * function TreeNode(val) {\n *     this.val = val;\n *     this.left = this.right = null;\n * }\n */\n/**\n * @param {TreeNode} root\n * @param {TreeNode} p\n * @param {TreeNode} q\n * @return {TreeNode}\n */\nvar lowestCommonAncestor = function(root, p, q) {\n    if (!root || root === p || root === q) return root;\n    const left = lowestCommonAncestor(root.left, p, q);\n    const right = lowestCommonAncestor(root.right, p, q);\n    if (left && right) return root;\n    return left || right;\n};`,
        typescript: `class TreeNode {\n    val: number\n    left: TreeNode | null\n    right: TreeNode | null\n    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n        this.val = (val===undefined ? 0 : val)\n        this.left = (left===undefined ? null : left)\n        this.right = (right===undefined ? null : right)\n    }\n}\n\nfunction lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {\n    if (!root || root === p || root === q) return root;\n    const left = lowestCommonAncestor(root.left, p, q);\n    const right = lowestCommonAncestor(root.right, p, q);\n    if (left && right) return root;\n    return left ?? right;\n};`,
        cpp: `class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        if (!root || root == p || root == q) return root;\n        TreeNode* left = lowestCommonAncestor(root->left, p, q);\n        TreeNode* right = lowestCommonAncestor(root->right, p, q);\n        if (left && right) return root;\n        return left ? left : right;\n    }\n};`,
        java: `class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        if (root == null || root == p || root == q) return root;\n        TreeNode left = lowestCommonAncestor(root.left, p, q);\n        TreeNode right = lowestCommonAncestor(root.right, p, q);\n        if (left != null && right != null) return root;\n        return left != null ? left : right;\n    }\n}`,
        go: `func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {\n    if root == nil || root == p || root == q {\n        return root\n    }\n    left := lowestCommonAncestor(root.Left, p, q)\n    right := lowestCommonAncestor(root.Right, p, q)\n    if left != nil && right != nil {\n        return root\n    }\n    if left != nil {\n        return left\n    }\n    return right\n}`
      },
      testCases: [
        { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', expected: '3' },
        { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', expected: '5' }
      ]
    };
  }

  if (tLower.includes('cache') || tLower.includes('lru') || tLower.includes('design')) {
    return {
      id: `lc_${numId}`,
      title: `${numId}. LRU Cache Design & High-Throughput Invalidation`,
      category: 'System Design & Data Structures',
      topics: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
      difficulty: difficulty || 'Hard',
      company: company || 'Amazon',
      role: role || 'Distributed Systems Engineer',
      persona: persona || 'Strict Bar Raiser',
      timeLimitMinutes: 45,
      acceptance: '41.2%',
      prompt: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the \`LRUCache\` class:\n• \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.\n• \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.\n• \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.\n\nThe functions \`get\` and \`put\` must each run in O(1) average time complexity.\n\nExample 1:\nInput: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]\nOutput: [null, null, null, 1, null, -1, null, -1, 3, 4]\nExplanation:\nLRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4\n\nConstraints:\n• 1 <= capacity <= 3000\n• 0 <= key <= 10^4\n• 0 <= value <= 10^5\n• At most 2 * 10^5 calls will be made to get and put.`,
      hints: [
        'How can we achieve O(1) key lookup combined with O(1) removal and insertion of elements?',
        'Consider a combination of a Hash Map and a Doubly Linked List with dummy head and tail sentinel nodes.'
      ],
      starterCode: {
        python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        val = self.cache.pop(key)\n        self.cache[key] = val\n        return val\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.pop(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            oldest = next(iter(self.cache))\n            del self.cache[oldest]`,
        javascript: `/**\n * @param {number} capacity\n */\nvar LRUCache = function(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n};\n\n/** \n * @param {number} key\n * @return {number}\n */\nLRUCache.prototype.get = function(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n};\n\n/** \n * @param {number} key \n * @param {number} value\n * @return {void}\n */\nLRUCache.prototype.put = function(key, value) {\n    if (this.cache.has(key)) {\n        this.cache.delete(key);\n    }\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n        const oldestKey = this.cache.keys().next().value;\n        this.cache.delete(oldestKey);\n    }\n};`,
        typescript: `class LRUCache {\n    private capacity: number;\n    private cache: Map<number, number>;\n\n    constructor(capacity: number) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n\n    get(key: number): number {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key)!;\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n\n    put(key: number, value: number): void {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, value);\n        if (this.cache.size > this.capacity) {\n            const oldestKey = this.cache.keys().next().value;\n            this.cache.delete(oldestKey);\n        }\n    }\n}`,
        cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n    \n    int get(int key) {\n        return -1;\n    }\n    \n    void put(int key, int value) {\n        \n    }\n};`,
        java: `class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}`,
        go: `type LRUCache struct {\n    \n}\n\nfunc Constructor(capacity int) LRUCache {\n    return LRUCache{}\n}\n\nfunc (this *LRUCache) Get(key int) int {\n    return -1\n}\n\nfunc (this *LRUCache) Put(key int, value int)  {\n    \n}`
      },
      testCases: [
        { input: 'LRUCache(2), put(1,1), put(2,2), get(1)', expected: '1' },
        { input: 'put(3,3), get(2)', expected: '-1' }
      ]
    };
  }

  // Default: Dynamic Programming / Subarray / Graph / Array
  const cleanTitle = topic ? topic.replace(/[^a-zA-Z0-9\s]/g, '') : 'Optimal Subarray Partition';
  return {
    id: `lc_${numId}`,
    title: `${numId}. ${cleanTitle} Optimization`,
    category: 'Algorithms & Optimization',
    topics: ['Array', 'Dynamic Programming', 'Hash Table', 'Greedy'],
    difficulty: difficulty || 'Medium',
    company: company || 'Google',
    role: role || 'Software Engineer',
    persona: persona || 'Standard',
    timeLimitMinutes: difficulty === 'Hard' ? 45 : 30,
    acceptance: '51.8%',
    prompt: `You are given an integer array \`nums\` and an integer \`k\`. Return the maximum total score achievable by partitioning or selecting optimal subarrays under the target constraints for ${company} (${role}).\n\nExample 1:\nInput: nums = [1, -2, 0, 3], k = 2\nOutput: 4\nExplanation: Selecting subarray [1, 3] or taking contiguous segment yields the optimal score 4.\n\nExample 2:\nInput: nums = [6, 3, -1, 5], k = 3\nOutput: 14\nExplanation: Taking all positive elements achieves sum 14 without violating the k-window constraint.\n\nExample 3:\nInput: nums = [-1, -2, -3], k = 1\nOutput: -1\n\nConstraints:\n• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4\n• 1 <= k <= nums.length\n\nFollow-up: Can you achieve O(N) time complexity and O(1) auxiliary space?`,
    hints: [
      'Break down the problem using state transitions: consider memoizing the max score at index i.',
      'Check if a sliding window deque or prefix sum array simplifies the inner lookup from O(K) to O(1).'
    ],
    starterCode: {
      python: `class Solution:\n    def maxSubarrayScore(self, nums: List[int], k: int) -> int:\n        # Write your LeetCode solution here\n        ans = nums[0]\n        current = 0\n        for num in nums:\n            current = max(num, current + num)\n            ans = max(ans, current)\n        return ans`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nvar maxSubarrayScore = function(nums, k) {\n    // Write your LeetCode solution here\n    let ans = nums[0];\n    let current = 0;\n    for (const num of nums) {\n        current = Math.max(num, current + num);\n        ans = Math.max(ans, current);\n    }\n    return ans;\n};`,
      typescript: `function maxSubarrayScore(nums: number[], k: number): number {\n    let ans = nums[0];\n    let current = 0;\n    for (const num of nums) {\n        current = Math.max(num, current + num);\n        ans = Math.max(ans, current);\n    }\n    return ans;\n};`,
      cpp: `class Solution {\npublic:\n    int maxSubarrayScore(vector<int>& nums, int k) {\n        int ans = nums[0];\n        int current = 0;\n        for (int num : nums) {\n            current = max(num, current + num);\n            ans = max(ans, current);\n        }\n        return ans;\n    }\n};`,
      java: `class Solution {\n    public int maxSubarrayScore(int[] nums, int k) {\n        int ans = nums[0];\n        int current = 0;\n        for (int num : nums) {\n            current = Math.max(num, current + num);\n            ans = Math.max(ans, current);\n        }\n        return ans;\n    }\n}`,
      go: `func maxSubarrayScore(nums []int, k int) int {\n    ans := nums[0]\n    current := 0\n    for _, num := range nums {\n        if current+num > num {\n            current += num\n        } else {\n            current = num\n        }\n        if current > ans {\n            ans = current\n        }\n    }\n    return ans\n}`
    },
    testCases: [
      { input: 'nums = [1, -2, 0, 3], k = 2', expected: '4' },
      { input: 'nums = [6, 3, -1, 5], k = 3', expected: '14' }
    ]
  };
}

// Aptitude & Logical Reasoning Synthesizer
function generateAptitudeProblem({ topic, difficulty }) {
  const numId = Math.floor(100 + Math.random() * 890);
  const tLower = (topic || '').toLowerCase();

  if (tLower.includes('work') || tLower.includes('time and work')) {
    return {
      id: `apt_${numId}`,
      title: 'Time & Work: Combined Rate & Efficiency',
      questionType: 'mcq',
      category: 'Quantitative Aptitude',
      difficulty: difficulty || 'Medium',
      description: 'A can complete a piece of work in 12 days, and B can complete the same work in 18 days. They work together for 4 days, after which A leaves. How many days will B take alone to finish the remaining work?',
      options: [
        'A. 6 days',
        'B. 8 days',
        'C. 10 days',
        'D. 12 days'
      ],
      correctAnswer: 'B',
      explanation: 'Work done by (A + B) in 1 day = (1/12 + 1/18) = 5/36.\nIn 4 days, work completed = 4 * (5/36) = 20/36 = 5/9.\nRemaining work = 1 - 5/9 = 4/9.\nTime taken by B alone = (4/9) / (1/18) = (4/9) * 18 = 8 days.'
    };
  }

  if (tLower.includes('speed') || tLower.includes('distance') || tLower.includes('train')) {
    return {
      id: `apt_${numId}`,
      title: 'Speed, Distance & Relative Velocity',
      questionType: 'mcq',
      category: 'Quantitative Aptitude',
      difficulty: difficulty || 'Medium',
      description: 'A train 180 meters long is traveling at a constant speed of 54 km/h. How many seconds will it take to pass a stationary platform of length 270 meters completely?',
      options: [
        'A. 25 seconds',
        'B. 30 seconds',
        'C. 35 seconds',
        'D. 40 seconds'
      ],
      correctAnswer: 'B',
      explanation: 'Total distance to cover = Train length + Platform length = 180m + 270m = 450m.\nSpeed in m/s = 54 * (5/18) = 15 m/s.\nTime taken = Distance / Speed = 450 / 15 = 30 seconds.'
    };
  }

  if (tLower.includes('probability') || tLower.includes('permutation') || tLower.includes('combination')) {
    return {
      id: `apt_${numId}`,
      title: 'Probability & Combinatorics: Ball Selection',
      questionType: 'mcq',
      category: 'Quantitative Aptitude',
      difficulty: difficulty || 'Medium',
      description: 'A bag contains 5 red balls, 4 blue balls, and 3 green balls. If 2 balls are drawn at random simultaneously, what is the probability that both balls are of the same color?',
      options: [
        'A. 19/66',
        'B. 23/66',
        'C. 1/3',
        'D. 5/22'
      ],
      correctAnswer: 'A',
      explanation: 'Total balls = 5 + 4 + 3 = 12 balls.\nTotal ways to pick 2 balls = 12C2 = (12 * 11) / 2 = 66.\nFavorable outcomes:\n- Both Red: 5C2 = 10\n- Both Blue: 4C2 = 6\n- Both Green: 3C2 = 3\nTotal favorable = 10 + 6 + 3 = 19.\nProbability = 19/66.'
    };
  }

  // Default: Logical Reasoning & Series Completion
  return {
    id: `apt_${numId}`,
    title: 'Logical Reasoning: Pattern Recognition & Number Series',
    questionType: 'mcq',
    category: 'Logical Reasoning',
    difficulty: difficulty || 'Medium',
    description: 'Find the missing number in the sequence:\n7, 13, 25, 49, 97, ?',
    options: [
      'A. 185',
      'B. 193',
      'C. 195',
      'D. 201'
    ],
    correctAnswer: 'B',
    explanation: 'Observe the recurrence pattern: each term is (Previous Term * 2 - 1).\n• 7 * 2 - 1 = 13\n• 13 * 2 - 1 = 25\n• 25 * 2 - 1 = 49\n• 49 * 2 - 1 = 97\n• 97 * 2 - 1 = 193.\nThus, the missing number is 193.'
  };
}

// Technical MCQ Synthesizer
function generateMCQProblem({ topic, difficulty, role }) {
  const numId = Math.floor(100 + Math.random() * 890);
  const cleanTitle = topic || 'Distributed Computing';

  return {
    id: `mcq_${numId}`,
    title: `${cleanTitle}: Architectural Core Concept`,
    questionType: 'mcq',
    category: topic || 'Computer Science',
    difficulty: difficulty || 'Medium',
    description: `In the context of ${topic || 'high-concurrency backend systems'} for a ${role || 'Software Engineer'}, which design decision provides optimal fault tolerance and horizontal scalability without introducing bottlenecks?`,
    options: [
      'A. Stateless service instances backed by distributed Redis caching and read replicas with eventual consistency',
      'B. Sticky in-memory sessions locked to a single monolithic database master node',
      'C. Synchronous HTTP chaining across 10+ microservices without circuit breakers',
      'D. Storing binary assets directly in relational database tables using BLOB fields'
    ],
    correctAnswer: 'A',
    explanation: 'Stateless application instances allow elastic autoscaling behind load balancers. Offloading shared state to Redis and read traffic to replicas prevents database write bottlenecks.'
  };
}

export const QuestionGeneratorModal = ({
  isOpen,
  onClose,
  onGenerate,
  defaultType = 'coding',
  defaultTopic = ''
}) => {
  const [questionType, setQuestionType] = useState(defaultType || 'coding');
  const [role, setRole] = useState(ROLES[0]);
  const [company, setCompany] = useState('Google');
  const [topic, setTopic] = useState(defaultTopic || 'Dynamic Programming & Subarrays');
  const [difficulty, setDifficulty] = useState('Medium');
  const [persona, setPersona] = useState('Standard');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      if (questionType === 'aptitude') {
        const aptProblem = generateAptitudeProblem({ topic, difficulty });
        onGenerate(aptProblem);
        onClose();
        return;
      }

      if (questionType === 'mcq') {
        try {
          const generated = await questionsApi.generateAIQuestion({
            role,
            company,
            difficulty,
            topic,
            persona,
            question_type: 'mcq'
          });

          if (generated?.mcq) {
            const m = generated.mcq;
            onGenerate({
              id: 'mcq_' + Math.floor(100 + Math.random() * 890),
              title: m.title || `${topic} Question`,
              questionType: 'mcq',
              category: topic,
              difficulty,
              description: m.description,
              options: m.options || ['A. ...', 'B. ...', 'C. ...', 'D. ...'],
              correctAnswer: m.correct_answer || 'A',
              explanation: m.explanation || 'Optimal approach verified.'
            });
            onClose();
            return;
          }
        } catch {}

        const fallbackMcq = generateMCQProblem({ topic, difficulty, role });
        onGenerate(fallbackMcq);
        onClose();
        return;
      }

      // Coding question flow
      let generated = await questionsApi.generateAIQuestion({
        role,
        company,
        difficulty,
        topic,
        persona,
        question_type: 'coding'
      });

      let finalProblem = null;

      if (generated?.coding) {
        const c = generated.coding;
        const starter = c.starter_code || {};
        finalProblem = {
          id: 'lc_' + Math.floor(100 + Math.random() * 890),
          title: c.title || `${topic} Challenge`,
          category: topic,
          difficulty: difficulty,
          company: company,
          role: role,
          persona: persona,
          timeLimitMinutes: difficulty === 'Hard' ? 45 : 30,
          acceptance: '52.3%',
          prompt: c.description || `Implement an optimal solution for ${topic}.`,
          hints: [
            'Break down the recurrence relation and observe optimal sub-problems.',
            'Consider space optimization using rolling arrays or two pointers.'
          ],
          starterCode: {
            javascript: starter.javascript || `/**\n * @param {any} input\n * @return {any}\n */\nvar solve = function(input) {\n    // Write your LeetCode solution here\n};`,
            python: starter.python || `class Solution:\n    def solve(self, nums: List[int]) -> int:\n        # Write your LeetCode solution here\n        pass`,
            cpp: starter.cpp || `class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        // Write your solution here\n        return 0;\n    }\n};`,
            java: starter.java || `class Solution {\n    public int solve(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`,
            typescript: starter.typescript || `function solve(nums: number[]): number {\n    // Write your solution here\n    return 0;\n};`,
            go: starter.go || `func solve(nums []int) int {\n    return 0\n}`
          },
          testCases: c.test_cases || [
            { input: 'Standard benchmark payload', expected: 'Optimal result O(N)' }
          ]
        };
      } else if (generated?.title && generated?.starterCode) {
        finalProblem = generated;
      } else {
        finalProblem = generateLeetCodeProblem({ topic, difficulty, company, role, persona });
      }

      onGenerate(finalProblem);
      onClose();
    } catch (err) {
      console.warn('AI Gen error, using engine fallback:', err);
      const fallback = questionType === 'aptitude' 
        ? generateAptitudeProblem({ topic, difficulty })
        : questionType === 'mcq'
        ? generateMCQProblem({ topic, difficulty, role })
        : generateLeetCodeProblem({ topic, difficulty, company, role, persona });
      onGenerate(fallback);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                AI Question Synthesizer & Generator
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Create custom LeetCode algorithms, technical MCQs, or Aptitude tests
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Generator Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          
          {/* Question Format Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Question Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuestionType('coding');
                  setTopic('Dynamic Programming & Subarrays');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  questionType === 'coding'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                💻 Coding (LeetCode)
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuestionType('mcq');
                  setTopic('Distributed Systems & Architecture');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  questionType === 'mcq'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                📝 Technical MCQ
              </button>

              <button
                type="button"
                onClick={() => {
                  setQuestionType('aptitude');
                  setTopic('Time and Work');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  questionType === 'aptitude'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                📐 Aptitude & Logic
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition-colors cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Company
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition-colors cursor-pointer"
              >
                {COMPANY_TRACKS.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="Easy">Easy (L3)</option>
                <option value="Medium">Medium (L4-L5)</option>
                <option value="Hard">Hard (L5-L6)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Specific Topic / Area
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                questionType === 'aptitude'
                  ? 'e.g. Time and Work, Speed Distance Time, Probability, Series'
                  : 'e.g. Binary Search, Dynamic Programming, SQL Indexing'
              }
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            <Sparkles size={15} />
            <span>{isGenerating ? 'Synthesizing with AI...' : `Generate ${questionType.toUpperCase()} Question`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionGeneratorModal;


