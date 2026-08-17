import React from 'react';
import { X, Sparkles, Wand2, ShieldCheck, AlertCircle } from 'lucide-react';

const CoPilotDrawer = React.memo(({
  coPilotDrawerOpen,
  setCoPilotDrawerOpen,
  coPilotReviewing,
  coPilotReview
}) => {
  if (!coPilotDrawerOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={() => setCoPilotDrawerOpen(false)}
      />

      <aside className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-[#060813] border-l border-[#1A253F] shadow-2xl z-50 p-5 overflow-y-auto space-y-5 animate-slide-left border-t-2 border-t-cyan-400">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
              <Wand2 size={16} className="animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Co-Pilot Review</h3>
              <p className="text-[10px] text-slate-400">Static Code Analysis & Optimization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCoPilotDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Co-Pilot Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {coPilotReviewing ? (
          <div className="py-16 text-center space-y-3">
            <Sparkles size={32} className="text-purple-400 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-300">Scanning AST & Loop Complexity...</p>
            <p className="text-[10px] text-slate-500">Evaluating Big-O bound algorithms</p>
          </div>
        ) : coPilotReview ? (
          <div className="space-y-4 text-xs">
            {/* Score & Risk Badges */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase text-purple-300 block">Quality Score</span>
                <span className="text-xl font-extrabold text-white">{coPilotReview.qualityScore}/100</span>
              </div>
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-center">
                <span className="text-[10px] font-bold uppercase text-amber-300 block">Risk Level</span>
                <span className="text-xs font-bold text-amber-200">{coPilotReview.riskLevel}</span>
              </div>
            </div>

            {/* Time & Space Complexity */}
            <div className="p-3 bg-[#140F26] border border-white/10 rounded-xl space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="font-mono font-bold text-emerald-400">{coPilotReview.timeComplexity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Space Complexity:</span>
                <span className="font-mono font-bold text-purple-400">{coPilotReview.spaceComplexity}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl">
              <span className="text-[11px] font-bold text-amber-400 block mb-1">Executive Summary:</span>
              <p className="text-slate-300 leading-relaxed">{coPilotReview.summary}</p>
            </div>

            {/* Code Smells */}
            {coPilotReview.codeSmells && coPilotReview.codeSmells.length > 0 && (
              <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>Code Smells Identified:</span>
                </span>
                <ul className="list-disc list-inside text-rose-200 text-[11px] space-y-1 pl-1">
                  {coPilotReview.codeSmells.map((smell, idx) => (
                    <li key={idx}>{smell}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {coPilotReview.suggestions && coPilotReview.suggestions.length > 0 && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  <ShieldCheck size={13} />
                  <span>Optimization Tips:</span>
                </span>
                <ul className="list-disc list-inside text-emerald-200 text-[11px] space-y-1 pl-1">
                  {coPilotReview.suggestions.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </aside>
    </>
  );
});

export default CoPilotDrawer;
