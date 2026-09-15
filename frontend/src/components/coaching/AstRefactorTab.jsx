import React, { useState } from 'react';
import { Code2, Sparkles, Check, ArrowRight, Zap } from 'lucide-react';
import { coachingApi } from '../../api/index.js';
import CopyButton from '../CopyButton.jsx';

export const AstRefactorTab = () => {
  const [code, setCode] = useState(`function findDuplicates(arr) {\n  let duplicates = [];\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {\n        duplicates.push(arr[i]);\n      }\n    }\n  }\n  return duplicates;\n}`);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await coachingApi.analyzeCodeComplexity(code, 'javascript');
      setAnalysis({
        ...res,
        refactoredCode: `function findDuplicates(arr) {\n  const seen = new Set();\n  const duplicates = new Set();\n  for (const item of arr) {\n    if (seen.has(item)) {\n      duplicates.add(item);\n    } else {\n      seen.add(item);\n    }\n  }\n  return Array.from(duplicates);\n}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Code2 size={18} className="text-rose-600" />
          <span>AST Code Quality & Complexity Audit</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Detect nested bottlenecks (e.g. O(N²) quadratic loops) and refactor to optimal O(N) patterns.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
          Input Code Snippet
        </label>
        <textarea
          rows={7}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
        />
      </div>

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={loading}
        className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
      >
        <Zap size={15} />
        <span>{loading ? 'Auditing AST & Big-O...' : 'Analyze Complexity & Refactor'}</span>
      </button>

      {analysis && (
        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold font-mono">
              Time: {analysis.timeComplexity}
            </span>
            <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold font-mono">
              Space: {analysis.spaceComplexity}
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {analysis.explanation}
          </p>

          {analysis.refactoredCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Refactored Optimal Code (O(N) Set Lookups)
                </span>
                <CopyButton text={analysis.refactoredCode} />
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto">
                {analysis.refactoredCode}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AstRefactorTab;
