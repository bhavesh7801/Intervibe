import React from 'react';
import { X, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

const ComplexityModal = React.memo(({
  isOpen,
  onClose,
  analyzing,
  result
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#060813] border border-[#1A253F] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 relative border-t-2 border-t-blue-500">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Big-O Complexity Report</h3>
              <p className="text-[11px] text-slate-400">Time & Space Analysis Engine</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Complexity Modal"
          >
            <X size={18} />
          </button>
        </div>

        {analyzing ? (
          <div className="py-12 text-center space-y-3">
            <Sparkles size={32} className="text-amber-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-300">Analyzing Code AST Complexity...</p>
          </div>
        ) : result ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block mb-1">Time Complexity</span>
                <span className="text-lg font-mono font-extrabold text-white">{result.time_complexity}</span>
              </div>
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-center">
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block mb-1">Space Complexity</span>
                <span className="text-lg font-mono font-extrabold text-white">{result.space_complexity}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#140F26] border border-white/10 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-amber-400 block">Analysis Summary:</span>
              <p className="text-slate-300 leading-relaxed">{result.explanation}</p>
            </div>

            {result.optimization_tips && result.optimization_tips.length > 0 && (
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>FAANG Optimization Recommendations:</span>
                </span>
                <ul className="list-disc list-inside text-emerald-200 text-xs space-y-1 pl-1">
                  {result.optimization_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
});

export default ComplexityModal;
