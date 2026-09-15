import React from 'react';
import { Play, RotateCcw, Sparkles, Maximize2, Moon, Sun, Settings, Zap, CheckCircle2, Send, Download } from 'lucide-react';

export const EditorToolbar = ({
  language = 'javascript',
  onLanguageChange,
  onRunCode,
  onSubmitCode,
  onResetCode,
  onOpenComplexity,
  onDownloadCode,
  isRunning = false,
  isSubmitting = false
}) => {
  const languages = [
    { id: 'javascript', label: 'JavaScript (Node.js)' },
    { id: 'python', label: 'Python 3.11' },
    { id: 'typescript', label: 'TypeScript 5.0' },
    { id: 'cpp', label: 'C++ (g++ 17)' },
    { id: 'java', label: 'Java 21 (OpenJDK)' },
    { id: 'go', label: 'Go 1.22' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 border-b border-slate-800 text-white rounded-t-3xl">
      {/* Left Language Selector & Reset & Download */}
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={onResetCode}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer text-xs"
          title="Reset to starter code"
        >
          <RotateCcw size={14} />
        </button>

        {onDownloadCode && (
          <button
            type="button"
            onClick={onDownloadCode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            title="Download solution file"
          >
            <Download size={14} />
          </button>
        )}
      </div>

      {/* Right Actions: Big-O, Run Code & Submit */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenComplexity}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
        >
          <Zap size={13} className="text-amber-400" />
          <span>Big-O Audit</span>
        </button>

        <button
          type="button"
          onClick={onRunCode}
          disabled={isRunning || isSubmitting}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 active:scale-95 border border-slate-700"
        >
          <Play size={13} fill="currentColor" className="text-emerald-400" />
          <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
        </button>

        <button
          type="button"
          onClick={onSubmitCode}
          disabled={isRunning || isSubmitting}
          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
        >
          <CheckCircle2 size={14} />
          <span>{isSubmitting ? 'Evaluating Submission...' : 'Submit Solution'}</span>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
