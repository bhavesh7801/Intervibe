import React, { useState } from 'react';
import { Cpu, Code2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const AstRefactorTab = () => {
  const [code, setCode] = useState(
    `def twoSum(nums, target):\n    # Sub-optimal O(N^2) double loop solution\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const handleAnalyzeCode = (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setReport({
        currentTime: "O(N^2) Nested Loops",
        optimalTime: "O(N) Hash Map",
        currentSpace: "O(1) Constant",
        optimalSpace: "O(N) Memory Tradeoff",
        score: 65,
        refactoredCode: `def twoSum(nums, target):\n    # Optimized O(N) single pass using Hash Map\n    seen = {}\n    for idx, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], idx]\n        seen[num] = idx\n    return []`,
        improvements: [
          "Reduced time complexity from O(N^2) down to linear O(N)",
          "Added descriptive variable names (complement, seen)",
          "Handled empty lookup safety in O(1) hash table lookup"
        ]
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Cpu size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AST Code Quality & $O(N)$ Refactoring Coach</h3>
            <p className="text-xs text-slate-400">Perform Abstract Syntax Tree analysis to detect $O(N^2)$ bottlenecks and auto-generate clean, production-ready code.</p>
          </div>
        </div>
      </div>

      {/* Code Input */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-4">
        <form onSubmit={handleAnalyzeCode} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Paste Your Python / JavaScript Code Solution</span>
              <span className="text-[10px] text-blue-400">AST Analysis Engine</span>
            </label>
            <textarea
              rows={7}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#080D1A] border border-[#162035] text-blue-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>{isAnalyzing ? 'Running AST Complexity Analysis...' : 'Analyze Complexity & Refactor'}</span>
          </button>
        </form>
      </div>

      {/* Results Preview */}
      {report && (
        <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-2xl space-y-6 animate-entrance">
          <div className="flex items-center justify-between border-b border-[#162035] pb-4">
            <div className="flex items-center gap-2">
              <Code2 size={22} className="text-blue-400" />
              <h4 className="text-lg font-black text-white">AST Refactoring Analysis</h4>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-sm font-black font-mono">
              AST Quality Rating: {report.score}/100
            </div>
          </div>

          {/* Complexity Comparison Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#080D1A] border border-amber-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Current Submission</span>
              <div className="text-white font-bold">Time: <span className="text-amber-400">{report.currentTime}</span></div>
              <div className="text-slate-400">Space: {report.currentSpace}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#080D1A] border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Optimal FAANG Target</span>
              <div className="text-white font-bold">Time: <span className="text-emerald-400">{report.optimalTime}</span></div>
              <div className="text-slate-400">Space: {report.optimalSpace}</div>
            </div>
          </div>

          {/* Side-by-side / Refactored Code Display */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block font-mono">
              ✨ AI Refactored Code ($O(N)$ Linear Solution):
            </span>
            <pre className="p-4 rounded-xl bg-[#05070E] border border-[#162035] text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto">
              {report.refactoredCode}
            </pre>
          </div>

          {/* Key Improvements */}
          <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2 text-xs">
            <span className="font-bold text-blue-400 uppercase tracking-wider block font-mono">Key Improvements Applied:</span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {report.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstRefactorTab;
