import React, { useState, useEffect } from 'react';
import { Clock, Zap, Play, RotateCcw, CheckCircle2, Award, Bot } from 'lucide-react';

const SpeedRivalTab = () => {
  const [isDuelActive, setIsDuelActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [duelResult, setDuelResult] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isDuelActive && !duelResult) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
        // AI Rival progress simulation
        setAiProgress((prev) => Math.min(100, prev + Math.floor(Math.random() * 8) + 2));
      }, 800);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isDuelActive, duelResult]);

  useEffect(() => {
    if (aiProgress >= 100 && !duelResult) {
      setDuelResult('ai_win');
    }
  }, [aiProgress, duelResult]);

  const handleStartDuel = () => {
    setIsDuelActive(true);
    setTimer(0);
    setUserProgress(0);
    setAiProgress(0);
    setDuelResult(null);
  };

  const handleUserSubmit = () => {
    setUserProgress(100);
    if (aiProgress < 100) {
      setDuelResult('user_win');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1v1 AI Rival Speed Trainer</h3>
            <p className="text-xs text-slate-400">Race live against a Google L5 AI Rival bot to train under high-pressure time constraints.</p>
          </div>
        </div>
      </div>

      {/* Control Box */}
      <div className="p-8 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-2xl text-center space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-amber-400 font-mono">Live Speed Arena</span>
          <h4 className="text-xl font-black text-white">Challenge Target: Valid Anagram ($O(N)$ Hash Map)</h4>
          <p className="text-xs text-slate-400">Target FAANG Speed Benchmark: 90 Seconds</p>
        </div>

        {/* Start Button */}
        {!isDuelActive ? (
          <button
            onClick={handleStartDuel}
            className="px-8 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-xl shadow-amber-500/25 border border-amber-400/40 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Play size={18} />
            <span>Start 1v1 AI Speed Duel</span>
          </button>
        ) : (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm">
              <Clock size={16} className="animate-spin text-amber-400" />
              <span>Elapsed Duel Time: {timer}s</span>
            </div>

            {/* Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Candidate Progress */}
              <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>👤 Your Code Progress</span>
                  <span className="text-blue-400 font-mono">{userProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#05070E] overflow-hidden border border-[#1A253F]">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${userProgress}%` }} />
                </div>
                <button
                  onClick={handleUserSubmit}
                  disabled={!!duelResult}
                  className="w-full mt-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer border border-blue-400/30 transition-all disabled:opacity-50"
                >
                  Submit Final Code Solution
                </button>
              </div>

              {/* AI Rival Progress */}
              <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Bot size={14} /> Google L5 AI Rival
                  </span>
                  <span className="text-rose-400 font-mono">{aiProgress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#05070E] overflow-hidden border border-[#1A253F]">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${aiProgress}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 italic pt-2">AI Rival is typing pseudocode and compiling unit tests...</p>
              </div>
            </div>

            {/* Duel Result */}
            {duelResult && (
              <div className={`p-6 rounded-2xl border space-y-3 animate-entrance ${
                duelResult === 'user_win'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
              }`}>
                <h4 className="text-lg font-black flex items-center justify-center gap-2">
                  <Award size={22} />
                  <span>{duelResult === 'user_win' ? '🏆 VICTORY! You Beat the AI Rival!' : '⚡ AI Rival Submitted First!'}</span>
                </h4>
                <p className="text-xs text-slate-300">
                  {duelResult === 'user_win'
                    ? `You completed the algorithm in ${timer}s, beating Google L5 AI benchmark speed.`
                    : `The AI rival finished in ${timer}s. Re-try to improve your speed.`}
                </p>
                <button
                  onClick={handleStartDuel}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
                >
                  <RotateCcw size={14} />
                  <span>Rematch AI Rival</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeedRivalTab;
