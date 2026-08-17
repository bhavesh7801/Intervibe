import React from 'react';
import { Terminal, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const TestResultsPanel = React.memo(({
  activeOutputTab,
  setActiveOutputTab,
  consoleOutput,
  testResults,
  executing,
  complexityResult
}) => {
  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#05070E] p-4 space-y-4 shadow-2xl h-full flex flex-col" data-testid="output-panel">
      
      {/* AST Complexity Analysis Box (Matching Screenshot) */}
      <div className="p-3.5 rounded-xl border border-[#1E293B] bg-[#0A0D16] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">⚙️</span>
            <span>AST Complexity Analysis</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono">
          <div>
            <span className="text-slate-400">Time: </span>
            <span className="text-emerald-400 font-bold">O(N) Optimal</span>
          </div>
          <div>
            <span className="text-slate-400">Space: </span>
            <span className="text-emerald-400 font-bold">O(N) Hash Map</span>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveOutputTab('terminal')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeOutputTab === 'terminal'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            aria-label="Terminal Output Tab"
          >
            <span className="flex items-center gap-1.5">
              <Terminal size={14} className="text-blue-400" />
              <span>Execution Output</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveOutputTab('testcases')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              activeOutputTab === 'testcases'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
            aria-label="Test Cases Results Tab"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Test Cases ({testResults.length})</span>
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Execution Terminal (Matching Screenshot) */}
      {activeOutputTab === 'terminal' && (
        <div className="bg-[#030408] p-4 rounded-xl border border-[#1E293B] font-mono text-xs text-slate-200 flex-1 min-h-[220px] overflow-y-auto whitespace-pre-wrap flex flex-col items-center justify-center text-center">
          {executing ? (
            <span className="text-amber-400 animate-pulse font-bold">Running algorithm solution across test suite...</span>
          ) : consoleOutput ? (
            <div className="w-full text-left text-slate-200">{consoleOutput.output}</div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 py-8">
              <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                ▶
              </div>
              <span className="text-xs text-slate-400 max-w-xs">
                Click <strong className="text-emerald-400">"Run Tests"</strong> above to execute algorithm solution across test suite.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Test Cases Evaluation */}
      {activeOutputTab === 'testcases' && (
        <div className="space-y-2.5 min-h-[110px] max-h-[240px] overflow-y-auto pr-1" data-testid="test-cases-results-list">
          {testResults.length > 0 && testResults.some(r => !r.passed) && (
            <div className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-xl flex items-center justify-between text-xs text-rose-200 font-bold mb-2">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-400 shrink-0" />
                <span>⚠️ Test Case Not Cleared! Your output did not match expected test case results.</span>
              </div>
              <span className="text-[10px] bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded border border-rose-500/50 uppercase font-black">
                {testResults.filter(r => !r.passed).length} Failed
              </span>
            </div>
          )}

          {testResults.length > 0 && testResults.every(r => r.passed) && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/60 rounded-xl flex items-center justify-between text-xs text-emerald-200 font-bold mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>🎉 All Test Cases Cleared! Solution matches expected outputs.</span>
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/50 uppercase font-black">
                100% Passed
              </span>
            </div>
          )}

          {testResults.length > 0 ? (
            testResults.map((tc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs space-y-2 transition-colors ${
                  tc.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/40'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    {tc.passed ? (
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    ) : (
                      <XCircle size={15} className="text-rose-400" />
                    )}
                    <span>Test Case #{idx + 1}</span>
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    tc.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                  }`}>
                    {tc.passed ? 'PASSED ✅' : 'TEST CASE NOT PASSED ❌'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                  <div className="bg-[#050409] p-2 rounded border border-[#2B2144]">
                    <span className="text-[10px] text-slate-400 font-sans block font-bold">Input:</span>
                    <span className="text-slate-200">{tc.input}</span>
                  </div>

                  <div className="bg-[#050409] p-2 rounded border border-[#2B2144]">
                    <span className="text-[10px] text-slate-400 font-sans block font-bold">Expected:</span>
                    <span className="text-emerald-400">{tc.expected}</span>
                  </div>

                  <div className="bg-[#050409] p-2 rounded border border-[#2B2144]">
                    <span className="text-[10px] text-slate-400 font-sans block font-bold">Your Output:</span>
                    <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400 font-bold'}>{tc.actual || 'No output'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-500 italic">
              No test cases executed yet. Click "Run Code" above.
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default TestResultsPanel;
