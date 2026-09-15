import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Terminal, AlertTriangle } from 'lucide-react';

export const TestResultsPanel = ({ results = [], isRunning = false, consoleOutput = '' }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (isRunning) {
    return (
      <div className="h-44 bg-slate-950 text-slate-400 p-6 flex flex-col items-center justify-center gap-2 font-mono text-xs rounded-b-3xl border-t border-slate-800">
        <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <span>Compiling and executing test cases...</span>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="h-40 bg-slate-950 text-slate-500 p-4 flex items-center justify-center font-mono text-xs rounded-b-3xl border-t border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal size={15} />
          <span>Click "Run Test Cases" above to evaluate your code.</span>
        </div>
      </div>
    );
  }

  const allPassed = results.every((r) => r.passed);

  return (
    <div className="bg-slate-950 text-slate-200 rounded-b-3xl border-t border-slate-800 p-4 space-y-3 font-mono text-xs">
      {/* Test Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          {results.map((res, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                activeTab === i
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {res.passed ? (
                <CheckCircle2 size={13} className="text-emerald-400" />
              ) : (
                <XCircle size={13} className="text-rose-400" />
              )}
              <span>Case {i + 1}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              allPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {allPassed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}
          </span>
        </div>
      </div>

      {/* Active Case Details */}
      {results[activeTab] && (
        <div className="space-y-2 text-[11px] pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider font-bold">Input:</span>
              <pre className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
                {results[activeTab].input}
              </pre>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 uppercase tracking-wider font-bold">Expected Output:</span>
              <pre className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 overflow-x-auto">
                {results[activeTab].expected}
              </pre>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 uppercase tracking-wider font-bold">Actual Output:</span>
            <pre
              className={`p-2.5 rounded-xl bg-slate-900 border overflow-x-auto ${
                results[activeTab].passed ? 'border-emerald-500/40 text-emerald-300' : 'border-rose-500/40 text-rose-300'
              }`}
            >
              {results[activeTab].actual || results[activeTab].expected}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResultsPanel;
