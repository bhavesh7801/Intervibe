import React, { useState } from 'react';
import { Play, X, Code2, Layers, Cpu, ChevronRight, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const HERO_CODE_SAMPLE = `def two_sum(nums: list[int], target: int) -> list[int]:
    # Hash Map lookup for O(N) linear time complexity
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # Output: [0, 1]`;

const WatchDemoModal = ({ isOpen, onClose, onLaunchPlayground }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0C1222] border border-[#1A253F] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 animate-entrance">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#162035] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Play size={20} className="fill-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Interview Prep AI — Interactive Showcase Tour</h3>
              <p className="text-xs text-slate-400">Explore the Coding IDE, Candidate Dashboard, and AI Resume Analyzer in action.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#141A2B] border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Slide Navigation Tabs Bar */}
        <div className="flex items-center justify-between bg-[#05070E] p-1.5 rounded-2xl border border-[#162035]">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSlide(0)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSlide === 0
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 size={15} />
              <span>1. Coding IDE</span>
            </button>

            <button
              onClick={() => setActiveSlide(1)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSlide === 1
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={15} />
              <span>2. Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSlide(2)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSlide === 2
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu size={15} />
              <span>3. Profile & AI Resume</span>
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : 2))}
              className="p-2 rounded-xl bg-[#0C1222] border border-[#1A253F] text-slate-300 hover:text-white hover:border-blue-500/40 cursor-pointer"
              title="Previous Slide"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev < 2 ? prev + 1 : 0))}
              className="p-2 rounded-xl bg-[#0C1222] border border-[#1A253F] text-slate-300 hover:text-white hover:border-blue-500/40 cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Slideshow Display Area */}
        <div className="min-h-[320px] bg-[#05070e] rounded-2xl border border-[#162035] p-5 relative overflow-hidden flex flex-col justify-between">
          {activeSlide === 0 && (
            <div className="space-y-4 animate-entrance">
              <div className="flex items-center justify-between border-b border-[#162035] pb-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-white ml-2">two_sum.py — Monaco Editor</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  AST Time O(N) • Space O(N)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto">
                <pre>{HERO_CODE_SAMPLE}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C1222] border border-[#1A253F] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-slate-200">Test 1: [2,7,11,15], target=9 ➔ Output [0,1]</span>
                </div>
                <span className="text-emerald-400 font-bold">Passed (0.01ms)</span>
              </div>
            </div>
          )}

          {activeSlide === 1 && (
            <div className="space-y-4 animate-entrance">
              <div className="flex items-center justify-between border-b border-[#162035] pb-3">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  Dashboard Analytics & FAANG Passport
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  🔥 7-Day Streak Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0C1222] border border-[#1A253F] text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Problems Solved</span>
                  <span className="text-2xl font-black text-white">21</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1222] border border-[#1A253F] text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Success Rate</span>
                  <span className="text-2xl font-black text-emerald-400">85%</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1222] border border-[#1A253F] text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Daily Streak</span>
                  <span className="text-2xl font-black text-amber-400">7 Days</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C1222] border border-[#1A253F] text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Review Score</span>
                  <span className="text-2xl font-black text-cyan-400">92</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0C1222] border border-blue-500/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">FAANG Candidate Readiness Passport</span>
                  <h4 className="text-sm font-extrabold text-white">Target Company: Google (L5 Senior Engineer)</h4>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 font-mono font-black text-sm shrink-0 border border-blue-500/40">
                  Top 12% Percentile
                </div>
              </div>
            </div>
          )}

          {activeSlide === 2 && (
            <div className="space-y-4 animate-entrance">
              <div className="flex items-center justify-between border-b border-[#162035] pb-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Candidate Profile & AI Resume Growth Plan
                </span>
                <span className="text-xs font-bold text-slate-300 font-mono">
                  resume_alex.pdf (Processed)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0C1222] border border-[#1A253F] flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 font-mono uppercase">FAANG Resume Alignment</span>
                  <h4 className="font-bold text-white">Strong technical foundation in Full Stack Engineering</h4>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-black text-sm shrink-0 border border-emerald-500/30">
                  Score: 85/100
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#080D1A] border border-[#162035] space-y-1.5">
                  <span className="font-bold text-amber-400 uppercase text-[11px] font-mono">🛠️ What to Change in Resume</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">Quantify impact metrics (e.g., % latency reduction, daily API volume) and use strong action verbs like Architected.</p>
                </div>
                <div className="p-3 rounded-xl bg-[#080D1A] border border-[#162035] space-y-1.5">
                  <span className="font-bold text-cyan-400 uppercase text-[11px] font-mono">📚 Skills to Learn Next</span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {['Docker', 'Kubernetes', 'System Design', 'Redis'].map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-[#162035] flex items-center justify-center gap-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx ? 'bg-blue-500 w-6' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <span className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>No credit card required. Start practicing in 10 seconds.</span>
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#141A2B] hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all cursor-pointer border border-slate-700 w-1/2 sm:w-auto"
            >
              Close Tour
            </button>
            <button
              onClick={onLaunchPlayground}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 cursor-pointer border border-blue-400/30 flex items-center justify-center gap-2 w-1/2 sm:w-auto"
            >
              <span>Launch Live Playground</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchDemoModal;
