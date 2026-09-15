import React from 'react';
import { CheckCircle2, AlertCircle, TrendingUp, Award, Sparkles, ArrowRight } from 'lucide-react';
import { getScoreColor, getScoreBadge } from '../utils/roleUtils.js';

export const FeedbackPanel = ({ feedback }) => {
  if (!feedback) return null;

  const scoreBadge = getScoreBadge(feedback.overallScore || 80);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Evaluation Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
            <Award size={16} />
            <span>AI Interview Score Report</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Grade: {feedback.grade || 'A-'} ({feedback.overallScore || 84}/100)
          </h3>
          <p className="text-xs text-slate-300 max-w-md">
            {feedback.summary || 'Strong performance demonstrating structured problem-solving.'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[110px]">
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {feedback.overallScore || 84}%
          </span>
          <span className="text-[10px] font-bold text-slate-200 mt-0.5">
            {scoreBadge.label}
          </span>
        </div>
      </div>

      {/* Competency Metric Sliders */}
      {feedback.competencies && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Competency Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(feedback.competencies).map(([key, val]) => {
              const formattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
              return (
                <div key={key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">{formattedName}</span>
                    <span className="font-mono text-slate-900">{val}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        val >= 85 ? 'bg-emerald-500' : val >= 70 ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Key Strengths Identified</span>
          </div>
          <ul className="space-y-2 text-xs text-emerald-950">
            {(feedback.strengths || ['Good structured breakdown', 'Optimal algorithmic complexity']).map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="break-words">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Improvements */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase tracking-wider">
            <TrendingUp size={16} className="text-amber-600" />
            <span>Actionable Next Steps</span>
          </div>
          <ul className="space-y-2 text-xs text-amber-950">
            {(feedback.improvements || ['Test more edge cases', 'Clarify constraints early']).map((imp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">→</span>
                <span className="break-words">{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPanel;
