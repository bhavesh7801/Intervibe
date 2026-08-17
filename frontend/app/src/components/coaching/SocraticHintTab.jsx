import React, { useState } from 'react';
import { HelpCircle, Lightbulb, Lock, Unlock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const SocraticHintTab = () => {
  const [unlockedTier, setUnlockedTier] = useState(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Progressive 3-Tier Socratic AI Hint Coach</h3>
            <p className="text-xs text-slate-400">Master problem solving without spoiling code answers. Unlock progressive guidance step-by-step.</p>
          </div>
        </div>
      </div>

      {/* Active Problem Card */}
      <div className="p-5 rounded-2xl bg-[#0C1222] border border-[#1A253F] space-y-2">
        <span className="text-[10px] font-extrabold uppercase text-amber-400 font-mono">Example Coding Challenge</span>
        <h4 className="text-base font-bold text-white">Two Sum & Hash Map Optimization (Easy)</h4>
        <p className="text-xs text-slate-300">Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.</p>
      </div>

      {/* 3 Tier Progressive Cards */}
      <div className="space-y-4">
        {/* Tier 1 */}
        <div className={`p-5 rounded-2xl border transition-all ${
          unlockedTier >= 1 ? 'bg-[#080D1A] border-blue-500/40 text-slate-200' : 'bg-[#05070E] border-[#1A253F] opacity-60'
        }`}>
          <div className="flex items-center justify-between border-b border-[#162035] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">T1</span>
              <div>
                <h5 className="text-sm font-bold text-white">Tier 1: Core Problem Intuition & Visual Pattern</h5>
                <span className="text-[10px] text-slate-400">High-level concept guide</span>
              </div>
            </div>
            {unlockedTier >= 1 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <Unlock size={11} /> Unlocked
              </span>
            ) : (
              <button
                onClick={() => setUnlockedTier(1)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 cursor-pointer"
              >
                <Lock size={12} /> Unlock Tier 1
              </button>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            💡 <strong>AI Clue:</strong> Instead of checking every pair with a nested loop ($O(N^2)$), think about what value you are looking for at each step (`complement = target - current_val`). How can you remember values you've seen previously in $O(1)$ constant time?
          </p>
        </div>

        {/* Tier 2 */}
        <div className={`p-5 rounded-2xl border transition-all ${
          unlockedTier >= 2 ? 'bg-[#080D1A] border-cyan-500/40 text-slate-200' : 'bg-[#05070E] border-[#1A253F] opacity-60'
        }`}>
          <div className="flex items-center justify-between border-b border-[#162035] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">T2</span>
              <div>
                <h5 className="text-sm font-bold text-white">Tier 2: Optimal Data Structure & Algorithm Selection</h5>
                <span className="text-[10px] text-slate-400">Technical structure blueprint</span>
              </div>
            </div>
            {unlockedTier >= 2 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <Unlock size={11} /> Unlocked
              </span>
            ) : (
              <button
                onClick={() => setUnlockedTier(2)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 cursor-pointer"
              >
                <Lock size={12} /> Unlock Tier 2
              </button>
            )}
          </div>
          {unlockedTier >= 2 ? (
            <p className="text-xs text-slate-300 leading-relaxed">
              🛠️ <strong>Data Structure Choice:</strong> Use a <strong>Hash Map (Dictionary)</strong> mapping `value &rarr; index`. Iterate through the array once ($O(N)$ time, $O(N)$ space). Check if `complement` is already stored in the hash map.
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic">Click Unlock Tier 2 to reveal optimal data structure choices.</p>
          )}
        </div>

        {/* Tier 3 */}
        <div className={`p-5 rounded-2xl border transition-all ${
          unlockedTier >= 3 ? 'bg-[#080D1A] border-emerald-500/40 text-slate-200' : 'bg-[#05070E] border-[#1A253F] opacity-60'
        }`}>
          <div className="flex items-center justify-between border-b border-[#162035] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">T3</span>
              <div>
                <h5 className="text-sm font-bold text-white">Tier 3: Pseudocode Outline & Edge Case Defense</h5>
                <span className="text-[10px] text-slate-400">Step-by-step algorithm algorithm</span>
              </div>
            </div>
            {unlockedTier >= 3 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                <Unlock size={11} /> Unlocked
              </span>
            ) : (
              <button
                onClick={() => setUnlockedTier(3)}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 cursor-pointer"
              >
                <Lock size={12} /> Unlock Tier 3
              </button>
            )}
          </div>
          {unlockedTier >= 3 ? (
            <div className="space-y-2 text-xs font-mono bg-[#05070E] p-3 rounded-xl border border-[#1A253F] text-blue-300 leading-relaxed">
              <div>1. seen = {'{}'}</div>
              <div>2. for idx, num in enumerate(nums):</div>
              <div>3. &nbsp;&nbsp; diff = target - num</div>
              <div>4. &nbsp;&nbsp; if diff in seen: return [seen[diff], idx]</div>
              <div>5. &nbsp;&nbsp; seen[num] = idx</div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Click Unlock Tier 3 to view step-by-step pseudocode structure.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocraticHintTab;
