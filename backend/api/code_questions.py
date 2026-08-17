import json
import random
from fastapi import APIRouter
from typing import List, Dict

router = APIRouter(prefix="/api/code", tags=["code-questions"])

DEFAULT_QUESTIONS = [
    {
        "id": "q1",
        "title": "Two Sum",
        "difficulty": "Easy",
        "category": "Arrays & Hashing",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        "starter_code": {
            "python": "class Solution:\n    def twoSum(self, nums, target):\n        # Write your code here\n        pass",
            "javascript": "class Solution {\n    twoSum(nums, target) {\n        // Write your code here\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};",
            "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}"
        },
        "test_cases": [
            {"input": "[2,7,11,15], 9", "expected": "[0,1]"},
            {"input": "[3,2,4], 6", "expected": "[1,2]"},
            {"input": "[3,3], 6", "expected": "[0,1]"}
        ]
    },
    {
        "id": "q2",
        "title": "Valid Anagram",
        "difficulty": "Easy",
        "category": "Arrays & Hashing",
        "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        "starter_code": {
            "python": "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass",
            "javascript": "class Solution {\n    isAnagram(s, t) {\n        // Write your code here\n    }\n}",
            "cpp": "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        // Write your code here\n    }\n};",
            "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}"
        },
        "test_cases": [
            {"input": "\"anagram\", \"nagaram\"", "expected": "true"},
            {"input": "\"rat\", \"car\"", "expected": "false"}
        ]
    },
    {
        "id": "q3",
        "title": "Merge Intervals",
        "difficulty": "Medium",
        "category": "Intervals",
        "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        "starter_code": {
            "python": "class Solution:\n    def merge(self, intervals):\n        # Write your code here\n        pass",
            "javascript": "class Solution {\n    merge(intervals) {\n        // Write your code here\n    }\n}",
            "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n    }\n};",
            "java": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your code here\n        return new int[][]{};\n    }\n}"
        },
        "test_cases": [
            {"input": "[[1,3],[2,6],[8,10],[15,18]]", "expected": "[[1,6],[8,10],[15,18]]"},
            {"input": "[[1,4],[4,5]]", "expected": "[[1,5]]"}
        ]
    },
    {
        "id": "q4",
        "title": "LRU Cache",
        "difficulty": "Medium",
        "category": "Linked List",
        "description": "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with **positive** size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
        "starter_code": {
            "python": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass",
            "javascript": "class LRUCache {\n    constructor(capacity) {\n    }\n\n    get(key) {\n    }\n\n    put(key, value) {\n    }\n}",
            "cpp": "class LRUCache {\npublic:\n    LRUCache(int capacity) {\n    }\n    \n    int get(int key) {\n    }\n    \n    void put(int key, int value) {\n    }\n};",
            "java": "class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    \n    public int get(int key) {\n        return -1;\n    }\n    \n    public void put(int key, int value) {\n    }\n}"
        },
        "test_cases": [
            {"input": "[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]", "expected": "[null, null, null, 1, null, -1, null, -1, 3, 4]"}
        ]
    },
    {
        "id": "q5",
        "title": "Trapping Rain Water",
        "difficulty": "Hard",
        "category": "Two Pointers",
        "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
        "starter_code": {
            "python": "class Solution:\n    def trap(self, height):\n        # Write your code here\n        pass",
            "javascript": "class Solution {\n    trap(height) {\n        // Write your code here\n    }\n}",
            "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your code here\n    }\n};",
            "java": "class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}"
        },
        "test_cases": [
            {"input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "expected": "6"},
            {"input": "[4,2,0,3,2,5]", "expected": "9"}
        ]
    }
]


@router.get("/questions", response_model=List[Dict])
async def get_coding_questions(limit: int = 10, randomize: bool = True):
    """Return a list of coding questions to display in the workspace."""
    questions = list(DEFAULT_QUESTIONS)
    if randomize:
        random.shuffle(questions)
    return questions[:limit]
