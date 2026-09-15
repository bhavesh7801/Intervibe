import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Zap,
  Play,
  RotateCcw,
  Trophy,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

const RIVAL_BOTS = [
  {
    id: 'bot_alpha',
    name: 'CyberByte-L6 (Google Staff Ghost)',
    wpm: 95,
    errorRate: 0.05,
    avatarColor: 'from-blue-600 to-indigo-600',
    tagline: 'Aggressive speed with zero hesitation'
  },
  {
    id: 'bot_beta',
    name: 'MetaSpeed-L5 (Meta Fast Coder)',
    wpm: 80,
    errorRate: 0.10,
    avatarColor: 'from-purple-600 to-rose-600',
    tagline: 'Balanced algorithmic cadence & quick iteration'
  },
  {
    id: 'bot_gamma',
    name: 'SentryBot (Steady Senior)',
    wpm: 65,
    errorRate: 0.02,
    avatarColor: 'from-emerald-600 to-teal-600',
    tagline: 'Deliberate test-driven precision'
  }
];

const DRILL_PROBLEMS = [
  {
    id: 'drill_1',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    timeLimit: 120,
    expectedLines: 8,
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    sampleSolution: `function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}`
  },
  {
    id: 'drill_2',
    title: 'Valid Parentheses & Bracket Matching',
    difficulty: 'Easy',
    timeLimit: 180,
    expectedLines: 12,
    description: 'Determine if an input string containing `()[]{}` has valid bracket closure.',
    sampleSolution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char in map) {\n      if (stack.pop() !== map[char]) return false;\n    } else stack.push(char);\n  }\n  return stack.length === 0;\n}`
  },
  {
    id: 'drill_3',
    title: 'LRU Cache Eviction Policy',
    difficulty: 'Medium',
    timeLimit: 240,
    expectedLines: 16,
    description: 'Implement an O(1) get and put cache eviction structure.',
    sampleSolution: `class LRUCache {\n  constructor(capacity) {\n    this.cap = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const v = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, v);\n    return v;\n  }\n}`
  }
];

export const SpeedRivalTab = () => {
  const toast = useToast();
  const [selectedBot, setSelectedBot] = useState(RIVAL_BOTS[0]);
  const [selectedDrill, setSelectedDrill] = useState(DRILL_PROBLEMS[0]);
  
  // Game State
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [raceResult, setRaceResult] = useState(null); // 'win' | 'lose'
  const [userCode, setUserCode] = useState('');
  
  // Progress & Timers
  const [userProgress, setUserProgress] = useState(0);
  const [botProgress, setBotProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Bot telemetry log
  const [botLogs, setBotLogs] = useState([]);

  // Race Loop Effect
  useEffect(() => {
    let interval = null;
    if (isRacing && !raceFinished) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);

        // Advance AI Ghost Bot progress with probabilistic variance
        setBotProgress((prev) => {
          const step = (selectedBot.wpm / 15) * (0.8 + Math.random() * 0.4);
          const nextVal = Math.min(100, Math.round(prev + step));
          
          if (nextVal >= 100 && !raceFinished) {
            setRaceFinished(true);
            setIsRacing(false);
            setRaceResult('lose');
            toast.warning(`🏁 ${selectedBot.name} crossed the finish line first!`);
          }
          return nextVal;
        });

        // Add dynamic AI bot log every few ticks
        if (Math.random() > 0.65) {
          const messages = [
            'Ghost Bot: Analyzing base case & memory allocations...',
            'Ghost Bot: Constructing hash map pointer references...',
            'Ghost Bot: Passing sub-case test suite #2...',
            'Ghost Bot: Optimizing call stack recursion depth...'
          ];
          const randomMsg = messages[Math.floor(Math.random() * messages.length)];
          setBotLogs((prev) => [randomMsg, ...prev.slice(0, 3)]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRacing, raceFinished, selectedBot, toast]);

  // Handle user code input & progress calculation
  const handleCodeChange = (e) => {
    const val = e.target.value;
    setUserCode(val);

    if (isRacing) {
      // Approximate progress based on non-whitespace character count towards target solution
      const targetLen = selectedDrill.sampleSolution.replace(/\s/g, '').length;
      const curLen = val.replace(/\s/g, '').length;
      const progress = Math.min(100, Math.round((curLen / targetLen) * 100));
      setUserProgress(progress);

      if (progress >= 100 && !raceFinished) {
        setRaceFinished(true);
        setIsRacing(false);
        setRaceResult('win');
        toast.success('🏆 Victory! You defeated the AI Ghost Rival!');
      }
    }
  };

  const startRace = () => {
    setUserCode('');
    setUserProgress(0);
    setBotProgress(0);
    setElapsedSeconds(0);
    setRaceFinished(false);
    setRaceResult(null);
    setBotLogs(['🏁 Race started! Ghost bot is analyzing the prompt...']);
    setIsRacing(true);
    toast.info('🏎️ Speed Race Launched! Code fast!');
  };

  const resetRace = () => {
    setIsRacing(false);
    setRaceFinished(false);
    setRaceResult(null);
    setUserCode('');
    setUserProgress(0);
    setBotProgress(0);
    setElapsedSeconds(0);
    setBotLogs([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Hero Card */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-rose-500/10 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
            <Flame size={13} className="text-yellow-300" />
            <span>AI Speed Rival • Ghost Racer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Race Against AI Ghost Bots in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Sharpen your coding velocity and instinctual problem solving. Challenge simulated FAANG candidates with live progress tracking and telemetry.
          </p>
        </div>
      </div>

      {/* 2. Setup Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drill Selector */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Code2 size={15} className="text-rose-600" />
              <span>Select Speed Drill</span>
            </label>
            <span className="text-[11px] font-bold text-slate-500">{selectedDrill.difficulty}</span>
          </div>

          <div className="space-y-2">
            {DRILL_PROBLEMS.map((drill) => (
              <button
                key={drill.id}
                type="button"
                disabled={isRacing}
                onClick={() => {
                  setSelectedDrill(drill);
                  resetRace();
                }}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                  selectedDrill.id === drill.id
                    ? 'bg-rose-50/80 border-rose-500 text-rose-950'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="font-black text-slate-900">{drill.title}</p>
                  <span className="text-[10px] text-slate-500">{drill.description.slice(0, 50)}...</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-white text-[10px] font-bold text-slate-700 border border-slate-200 shrink-0">
                  ⏱️ {drill.timeLimit}s
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rival Bot Selector */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Bot size={15} className="text-purple-600" />
              <span>Choose Rival Ghost Bot</span>
            </label>
            <span className="text-[11px] font-bold text-purple-600">{selectedBot.wpm} WPM Pace</span>
          </div>

          <div className="space-y-2">
            {RIVAL_BOTS.map((bot) => (
              <button
                key={bot.id}
                type="button"
                disabled={isRacing}
                onClick={() => {
                  setSelectedBot(bot);
                  resetRace();
                }}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                  selectedBot.id === bot.id
                    ? 'bg-purple-50/80 border-purple-500 text-purple-950'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${bot.avatarColor} text-white flex items-center justify-center shrink-0`}>
                    <Bot size={14} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{bot.name}</p>
                    <span className="text-[10px] text-slate-500">{bot.tagline}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-white text-[10px] font-mono font-bold text-purple-700 border border-purple-200 shrink-0">
                  {bot.wpm} WPM
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Live Race Arena Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-slate-900">
              Drill: {selectedDrill.title}
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              {selectedDrill.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-800">
              <Clock size={13} className="text-slate-500" />
              <span>{elapsedSeconds}s elapsed</span>
            </div>

            {!isRacing && !raceFinished ? (
              <button
                type="button"
                onClick={startRace}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                <Play size={14} />
                <span>Start Race</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={resetRace}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Race Progress Trackers */}
        <div className="space-y-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
          {/* User Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 text-rose-600">
                <User size={15} />
                <span>You (Candidate)</span>
              </div>
              <span className="font-mono text-slate-900">{userProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-300 rounded-full"
                style={{ width: `${userProgress}%` }}
              />
            </div>
          </div>

          {/* AI Ghost Bot Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 text-purple-600">
                <Bot size={15} />
                <span>{selectedBot.name}</span>
              </div>
              <span className="font-mono text-slate-900">{botProgress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${botProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Victory / Defeat Modal Callout */}
        {raceFinished && (
          <div
            className={`p-5 rounded-2xl border text-center space-y-2 animate-in zoom-in-95 duration-200 ${
              raceResult === 'win'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {raceResult === 'win' ? (
                <Trophy size={24} className="text-emerald-600" />
              ) : (
                <XCircle size={24} className="text-rose-600" />
              )}
              <h4 className="text-base font-black">
                {raceResult === 'win' ? 'VICTORY! YOU BEAT THE GHOST BOT!' : 'RIVAL COMPLETED FIRST!'}
              </h4>
            </div>
            <p className="text-xs">
              {raceResult === 'win'
                ? `You finished in ${elapsedSeconds} seconds, out-pacing ${selectedBot.name}!`
                : `${selectedBot.name} finished first at ${selectedBot.wpm} WPM. Try another round to improve your muscle memory!`}
            </p>
            <button
              type="button"
              onClick={startRace}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Race Again
            </button>
          </div>
        )}

        {/* Live Code Input Scratchpad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Type Solution Fast to Advance Progress
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              Target ~{selectedDrill.expectedLines} lines
            </span>
          </div>

          <textarea
            rows={7}
            disabled={!isRacing && !raceFinished}
            value={userCode}
            onChange={handleCodeChange}
            placeholder={
              isRacing
                ? 'Type your solution here as fast and accurately as you can...'
                : 'Click "Start Race" to unlock the editor and begin racing...'
            }
            className="w-full p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 transition-all leading-relaxed"
          />
        </div>

        {/* Bot Activity Telemetry Log */}
        {botLogs.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
              Ghost Bot Live Telemetry
            </span>
            {botLogs.map((log, idx) => (
              <p key={idx} className="text-slate-400 text-xs">
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedRivalTab;
