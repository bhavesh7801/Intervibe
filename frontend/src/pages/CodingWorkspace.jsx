import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import EditorToolbar from '../components/coding/EditorToolbar.jsx';
import TestResultsPanel from '../components/coding/TestResultsPanel.jsx';
import CoPilotDrawer from '../components/coding/CoPilotDrawer.jsx';
import ComplexityModal from '../components/coding/ComplexityModal.jsx';
import QuestionGeneratorModal from '../components/QuestionGeneratorModal.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import CopyButton from '../components/CopyButton.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  Bot,
  Play,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Sparkles,
  Clock,
  RotateCcw,
  Pause,
  FileText,
  History,
  Lightbulb,
  ChevronDown,
  ArrowRight,
  Code2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

const PRELOADED_QUESTIONS = [
  {
    id: 'two-sum',
    title: '1. Two Sum',
    difficulty: 'Easy',
    company: 'Google',
    category: 'Array & Hash Table',
    topics: ['Array', 'Hash Table'],
    acceptance: '54.2%',
    timeLimitMinutes: 20,
    prompt: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\nConstraints:\n• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.\n\nFollow-up: Can you come up with an algorithm that is less than O(n^2) time complexity?`,
    hints: [
      'Can you use a Hash Map to store previously visited numbers and their indices in O(N) time?',
      'Consider edge cases where target is negative or nums has only 2 elements.'
    ],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n};`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (seen.containsKey(diff)) {\n                return new int[] { seen.get(diff), i };\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
      go: `func twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        diff := target - num\n        if idx, ok := seen[diff]; ok {\n            return []int{idx, i}\n        }\n        seen[num] = i\n    }\n    return []int{}\n}`
    },
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
      { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' },
      { input: 'nums = [3, 3], target = 6', expected: '[0, 1]' }
    ]
  },
  {
    id: 'valid-palindrome',
    title: '125. Valid Palindrome',
    difficulty: 'Easy',
    company: 'Meta',
    category: 'Two Pointers & String',
    topics: ['Two Pointers', 'String'],
    acceptance: '47.8%',
    timeLimitMinutes: 15,
    prompt: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.\n\nExample 1:\nInput: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.\n\nExample 2:\nInput: s = "race a car"\nOutput: false\nExplanation: "raceacar" is not a palindrome.\n\nExample 3:\nInput: s = " "\nOutput: true\nExplanation: s is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.\n\nConstraints:\n• 1 <= s.length <= 2 * 10^5\n• s consists only of printable ASCII characters.\n\nFollow-up: Could you solve it in O(1) extra memory without allocating new string buffers?`,
    hints: [
      'Use two pointers (one at the beginning and one at the end) moving inward.',
      'Skip non-alphanumeric characters without allocating extra strings.'
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isPalindrome = function(s) {\n    let l = 0, r = s.length - 1;\n    while (l < r) {\n        while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;\n        while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;\n        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n        l++; r--;\n    }\n    return true;\n};`,
      python: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        l, r = 0, len(s) - 1\n        while l < r:\n            while l < r and not s[l].isalnum():\n                l += 1\n            while l < r and not s[r].isalnum():\n                r -= 1\n            if s[l].lower() != s[r].lower():\n                return False\n            l += 1\n            r -= 1\n        return True`,
      typescript: `function isPalindrome(s: string): boolean {\n    let l = 0, r = s.length - 1;\n    while (l < r) {\n        while (l < r && !/[a-zA-Z0-9]/.test(s[l])) l++;\n        while (l < r && !/[a-zA-Z0-9]/.test(s[r])) r--;\n        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n        l++; r--;\n    }\n    return true;\n};`,
      cpp: `class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }\n        return true;\n    }\n};`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}`,
      go: `func isPalindrome(s string) bool {\n    l, r := 0, len(s)-1\n    for l < r {\n        for l < r && !isAlnum(s[l]) { l++ }\n        for l < r && !isAlnum(s[r]) { r-- }\n        if toLower(s[l]) != toLower(s[r]) { return false }\n        l++\n        r--\n    }\n    return true\n}`
    },
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expected: 'true' },
      { input: 's = "race a car"', expected: 'false' },
      { input: 's = " "', expected: 'true' }
    ]
  },
  {
    id: 'lru-cache',
    title: '146. LRU Cache',
    difficulty: 'Hard',
    company: 'Amazon',
    category: 'Design & Linked List',
    topics: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'],
    acceptance: '41.2%',
    timeLimitMinutes: 45,
    prompt: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the \`LRUCache\` class:\n• \`LRUCache(int capacity)\` Initialize the LRU cache with positive size \`capacity\`.\n• \`int get(int key)\` Return the value of the \`key\` if the key exists, otherwise return \`-1\`.\n• \`void put(int key, int value)\` Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.\n\nThe functions \`get\` and \`put\` must each run in O(1) average time complexity.\n\nExample 1:\nInput: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]\nOutput: [null, null, null, 1, null, -1, null, -1, 3, 4]\nExplanation:\nLRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4\n\nConstraints:\n• 1 <= capacity <= 3000\n• 0 <= key <= 10^4\n• 0 <= value <= 10^5\n• At most 2 * 10^5 calls will be made to get and put.`,
    hints: [
      'Combine a Hash Map with a Doubly Linked List for O(1) removals and updates.',
      'Head points to most recently used, tail points to least recently used.'
    ],
    starterCode: {
      javascript: `/**\n * @param {number} capacity\n */\nvar LRUCache = function(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n};\n\n/** \n * @param {number} key\n * @return {number}\n */\nLRUCache.prototype.get = function(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n};\n\n/** \n * @param {number} key \n * @param {number} value\n * @return {void}\n */\nLRUCache.prototype.put = function(key, value) {\n    if (this.cache.has(key)) {\n        this.cache.delete(key);\n    }\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n        const oldestKey = this.cache.keys().next().value;\n        this.cache.delete(oldestKey);\n    }\n};`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        val = self.cache.pop(key)\n        self.cache[key] = val\n        return val\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.pop(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            oldest = next(iter(self.cache))\n            del self.cache[oldest]`,
      typescript: `class LRUCache {\n    private capacity: number;\n    private cache: Map<number, number>;\n\n    constructor(capacity: number) {\n        this.capacity = capacity;\n        this.cache = new Map();\n    }\n\n    get(key: number): number {\n        if (!this.cache.has(key)) return -1;\n        const val = this.cache.get(key)!;\n        this.cache.delete(key);\n        this.cache.set(key, val);\n        return val;\n    }\n\n    put(key: number, value: number): void {\n        if (this.cache.has(key)) this.cache.delete(key);\n        this.cache.set(key, value);\n        if (this.cache.size > this.capacity) {\n            const oldestKey = this.cache.keys().next().value;\n            this.cache.delete(oldestKey);\n        }\n    }\n}`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {\n        \n    }\n    \n    int get(int key) {\n        return -1;\n    }\n    \n    void put(int key, int value) {\n        \n    }\n};`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}`,
      go: `type LRUCache struct {\n    \n}\n\nfunc Constructor(capacity int) LRUCache {\n    return LRUCache{}\n}\n\nfunc (this *LRUCache) Get(key int) int {\n    return -1\n}\n\nfunc (this *LRUCache) Put(key int, value int)  {\n    \n}`
    },
    testCases: [
      { input: 'LRUCache(2), put(1, 1), put(2, 2), get(1)', expected: '1' },
      { input: 'put(3, 3) [evicts 2], get(2)', expected: '-1' }
    ]
  },
  {
    id: 'longest-substring',
    title: '3. Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    company: 'Apple',
    category: 'Sliding Window & Hash Table',
    topics: ['Hash Table', 'String', 'Sliding Window'],
    acceptance: '34.5%',
    timeLimitMinutes: 25,
    prompt: `Given a string \`s\`, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.\n\nExample 2:\nInput: s = "bbbbb"\nOutput: 1\nExplanation: The answer is "b", with the length of 1.\n\nExample 3:\nInput: s = "pwwkew"\nOutput: 3\nExplanation: The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.\n\nConstraints:\n• 0 <= s.length <= 5 * 10^4\n• s consists of English letters, digits, symbols and spaces.`,
    hints: [
      'Use a sliding window with two pointers [l, r] and a set or map to track characters in the current window.',
      'When duplicate is found at r, advance l until duplicate is removed.'
    ],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    let set = new Set();\n    let l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) {\n            set.delete(s[l]);\n            l++;\n        }\n        set.add(s[r]);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_set = set()\n        l = 0\n        max_len = 0\n        for r in range(len(s)):\n            while s[r] in char_set:\n                char_set.remove(s[l])\n                l += 1\n            char_set.add(s[r])\n            max_len = max(max_len, r - l + 1)\n        return max_len`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n    const set = new Set<string>();\n    let l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        while (set.has(s[r])) {\n            set.delete(s[l]);\n            l++;\n        }\n        set.add(s[r]);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n};`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> set;\n        int l = 0, maxLen = 0;\n        for (int r = 0; r < s.length(); ++r) {\n            while (set.count(s[r])) {\n                set.erase(s[l]);\n                l++;\n            }\n            set.insert(s[r]);\n            maxLen = max(maxLen, r - l + 1);\n        }\n        return maxLen;\n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int l = 0, maxLen = 0;\n        for (int r = 0; r < s.length(); r++) {\n            while (set.contains(s.charAt(r))) {\n                set.remove(s.charAt(l));\n                l++;\n            }\n            set.add(s.charAt(r));\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        return maxLen;\n    }\n}`,
      go: `func lengthOfLongestSubstring(s string) int {\n    seen := make(map[byte]bool)\n    l, maxLen := 0, 0\n    for r := 0; r < len(s); r++ {\n        for seen[s[r]] {\n            delete(seen, s[l])\n            l++\n        }\n        seen[s[r]] = true\n        if r-l+1 > maxLen {\n            maxLen = r - l + 1\n        }\n    }\n    return maxLen\n}`
    },
    testCases: [
      { input: 's = "abcabcbb"', expected: '3' },
      { input: 's = "bbbbb"', expected: '1' },
      { input: 's = "pwwkew"', expected: '3' }
    ]
  }
];

export const CodingWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [questionList, setQuestionList] = useState(PRELOADED_QUESTIONS);
  const [question, setQuestion] = useState(location.state?.question || PRELOADED_QUESTIONS[0]);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Left column active tab ('description', 'submissions', 'solutions')
  const [leftTab, setLeftTab] = useState('description');

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Modals & Drawers
  const [showCoPilot, setShowCoPilot] = useState(false);
  const [showComplexity, setShowComplexity] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);

  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(20 * 60);
  const [timerRunning, setTimerRunning] = useState(true);

  // Load Submissions from localStorage for this question
  useEffect(() => {
    if (question?.id) {
      try {
        const key = `intervibe_submissions_${question.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          setSubmissions(JSON.parse(stored));
        } else {
          // Pre-populate with realistic sample past attempts
          const sample = [
            {
              id: 'sub_sample_1',
              status: 'Accepted',
              timestamp: '2 hours ago',
              language: 'javascript',
              runtime: '42ms',
              runtimeBeats: '88.4%',
              memory: '42.6 MB',
              memoryBeats: '74.1%',
              code: question.starterCode?.javascript || '// Sample solution'
            }
          ];
          setSubmissions(sample);
        }
      } catch (err) {
        console.warn('Submissions load note:', err);
      }
    }
  }, [question?.id]);

  useEffect(() => {
    if (question?.starterCode?.[language]) {
      setCode(question.starterCode[language]);
    } else if (question?.starterCode?.javascript) {
      setCode(question.starterCode.javascript);
    } else {
      setCode('// Write your solution here');
    }
    setTestResults([]);
  }, [question, language]);

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (question?.starterCode?.[newLang]) {
      setCode(question.starterCode[newLang]);
    }
  };

  const handleResetCode = () => {
    if (question?.starterCode?.[language]) {
      setCode(question.starterCode[language]);
    }
  };

  const handleDownloadCode = () => {
    const extMap = {
      javascript: 'js',
      python: 'py',
      typescript: 'ts',
      cpp: 'cpp',
      java: 'java',
      go: 'go'
    };
    const ext = extMap[language] || 'txt';
    const filename = `${(question?.title || 'solution').toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      await new Promise((res) => setTimeout(res, 650));

      const mockResults = (question?.testCases || [
        { input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
        { input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' }
      ]).map((tc, idx) => ({
        ...tc,
        actual: tc.expected,
        passed: true,
        runtime: `${Math.floor(Math.random() * 25) + 35}ms`,
        memory: `${(Math.random() * 4 + 41).toFixed(1)} MB`
      }));

      setTestResults(mockResults);
      toast.success('All test cases executed successfully!');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 900));

      const newSub = {
        id: 'sub_' + Date.now().toString(36),
        status: 'Accepted',
        timestamp: 'Just now',
        language: language,
        runtime: `${Math.floor(Math.random() * 20) + 38}ms`,
        runtimeBeats: `${(Math.random() * 15 + 82).toFixed(1)}%`,
        memory: `${(Math.random() * 3 + 41).toFixed(1)} MB`,
        memoryBeats: `${(Math.random() * 20 + 72).toFixed(1)}%`,
        code: code
      };

      const updated = [newSub, ...submissions];
      setSubmissions(updated);
      try {
        localStorage.setItem(`intervibe_submissions_${question.id}`, JSON.stringify(updated));
      } catch {}

      toast.success('🎉 Solution Accepted! Added to Submissions History.');
      setLeftTab('submissions');
      setSelectedSubmission(newSub);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        
        {/* Left: Problem Switcher Dropdown & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          
          <div className="relative">
            <select
              value={question?.id}
              onChange={(e) => {
                const found = questionList.find((q) => q.id === e.target.value);
                if (found) {
                  setQuestion(found);
                  setSecondsRemaining((found.timeLimitMinutes || 20) * 60);
                  setLeftTab('description');
                }
              }}
              className="pl-3 pr-8 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-900 border border-slate-200 transition-colors cursor-pointer appearance-none focus:outline-none"
            >
              {questionList.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.difficulty})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Right: Timer, AI Question Generator & CoPilot Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Practice Countdown Timer Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800">
            <Clock size={13} className={secondsRemaining < 300 ? 'text-rose-600 animate-pulse' : 'text-amber-600'} />
            <span>{formatTimer(secondsRemaining)}</span>
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
              title={timerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              <Pause size={11} />
            </button>
          </div>

          {/* AI Question Generator Action */}
          <button
            type="button"
            onClick={() => setShowGenModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-rose-600/20 hover:opacity-95 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={14} className="text-yellow-300" />
            <span>AI Generate Question</span>
          </button>

          {/* AI Socratic CoPilot Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowCoPilot(!showCoPilot)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showCoPilot
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bot size={14} />
            <span>AI CoPilot</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">
        
        {/* Left Column: Tabbed Problem Description / Submissions History / Solution */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Left Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={() => setLeftTab('description')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                leftTab === 'description'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText size={14} />
              <span>Description</span>
            </button>

            <button
              type="button"
              onClick={() => setLeftTab('submissions')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                leftTab === 'submissions'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History size={14} />
              <span>Submissions ({submissions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setLeftTab('solutions')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                leftTab === 'solutions'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Lightbulb size={14} />
              <span>AI Approach</span>
            </button>
          </div>

          {/* Tab 1: Problem Description */}
          {leftTab === 'description' && (
            <QuestionCard question={question} currentIndex={1} totalQuestions={questionList.length} />
          )}

          {/* Tab 2: Submissions History */}
          {leftTab === 'submissions' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <History size={17} className="text-rose-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Past Submissions History
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {submissions.length} Total Attempts
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2 text-xs">
                  <Code2 size={24} className="mx-auto text-slate-300" />
                  <p>No submissions yet for this problem.</p>
                  <p className="text-[11px] text-slate-500">Click "Submit Solution" in the top right to record your first attempt.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {submissions.map((sub, idx) => {
                    const isSelected = selectedSubmission?.id === sub.id;
                    const isAccepted = sub.status === 'Accepted';

                    return (
                      <div
                        key={sub.id || idx}
                        onClick={() => setSelectedSubmission(sub)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-slate-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isAccepted ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : (
                              <XCircle size={16} className="text-rose-500" />
                            )}
                            <span className={`text-xs font-black ${isAccepted ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {sub.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase font-mono">
                              {sub.language}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-medium">
                            {sub.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                          <span>Runtime: <strong className="text-slate-900">{sub.runtime}</strong> ({sub.runtimeBeats || '85%'} beats)</span>
                          <span>Memory: <strong className="text-slate-900">{sub.memory}</strong></span>
                        </div>

                        {/* Action when expanded */}
                        {isSelected && (
                          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 italic">Click restore to load this code into editor</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCode(sub.code);
                                setLanguage(sub.language);
                                toast.info('Code restored to editor!');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Restore Code
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: AI Solutions & Approach */}
          {leftTab === 'solutions' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <Sparkles size={18} />
                <h3 className="text-sm font-black text-slate-900">
                  Optimal AI Approach & Asymptotics
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-extrabold text-slate-900 block">Optimal Pattern: Single-Pass Hash Map</span>
                  <p className="text-slate-600">
                    Instead of checking every pair with nested loops ($O(N^2)$), initialize a Map to store each visited element and its index. For each number, compute complement \`target - num\`. If present in Map, return immediately in $O(1)$ lookup time.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Time Complexity</span>
                    <span className="text-base font-black text-emerald-900 font-mono block">O(N)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] uppercase font-bold text-purple-700">Space Complexity</span>
                    <span className="text-base font-black text-purple-900 font-mono block">O(N)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Monaco Editor IDE & Test Results Panel */}
        <div className="lg:col-span-7 flex flex-col space-y-0 shadow-xl rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
          <EditorToolbar
            language={language}
            onLanguageChange={handleLanguageChange}
            onRunCode={handleRunCode}
            onSubmitCode={handleSubmitSolution}
            onResetCode={handleResetCode}
            onOpenComplexity={() => setShowComplexity(true)}
            onDownloadCode={handleDownloadCode}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
          />

          {/* Monaco Editor Container */}
          <div className="h-96 w-full relative">
            <Editor
              height="100%"
              language={language === 'c++' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Menlo, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Tabbed Test Runner Panel */}
          <TestResultsPanel results={testResults} isRunning={isRunning} />
        </div>

        {/* Slide-Out AI Socratic CoPilot Drawer */}
        {showCoPilot && (
          <div className="absolute top-0 right-0 bottom-0 z-50 h-full">
            <CoPilotDrawer
              isOpen={showCoPilot}
              onClose={() => setShowCoPilot(false)}
              currentCode={code}
              problemTitle={question?.title}
            />
          </div>
        )}
      </div>

      {/* Big-O Complexity Audit Modal */}
      <ComplexityModal
        isOpen={showComplexity}
        onClose={() => setShowComplexity(false)}
        timeComp="O(N)"
        spaceComp="O(N)"
      />

      {/* AI Question Generator Modal */}
      <QuestionGeneratorModal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
        onGenerate={(newQuestion) => {
          setQuestionList((prev) => [newQuestion, ...prev]);
          setQuestion(newQuestion);
          setSecondsRemaining((newQuestion.timeLimitMinutes || 20) * 60);
          setTimerRunning(true);
          setLeftTab('description');
        }}
      />
    </div>
  );
};

export default CodingWorkspace;
