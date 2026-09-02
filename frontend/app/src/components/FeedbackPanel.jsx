import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Trophy } from 'lucide-react';

const FeedbackPanel = ({ answer, onNext }) => {
  const score = answer.aiScore ?? 0;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20';
    if (score >= 60) return 'from-amber-500 to-yellow-400 text-amber-400 border-amber-500/40 shadow-amber-500/20';
    return 'from-rose-600 to-pink-500 text-rose-400 border-rose-500/40 shadow-rose-500/20';
  };

  return (
    <div className="card-3d rounded-2xl p-4 sm:p-8 mt-5 sm:mt-6 animate-entrance" data-testid="feedback-panel">
      {/* Score Header */}
      <div className="flex flex-col items-center justify-center text-center pb-6 sm:pb-8 border-b border-[#162035] mb-6 sm:mb-8">
        <div className="relative mb-3 sm:mb-4">
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${getScoreColor(score)} border-2 flex flex-col items-center justify-center shadow-xl`}>
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" data-testid="score-display">
              {score}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-200">Out of 100</span>
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#080D1A] border border-blue-500/40 flex items-center justify-center text-amber-400">
            <Trophy size={14} />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          AI Answer Assessment
          <Sparkles size={16} className="text-blue-400 animate-pulse" />
        </h2>
      </div>

      {/* Main Feedback Body */}
      <div className="space-y-4 sm:space-y-6">
        {/* Comprehensive Summary */}
        <div className="bg-[#080D1A] border border-[#162035] rounded-xl p-4 sm:p-5" data-testid="feedback-text">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 sm:mb-2">Detailed Evaluation</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words [overflow-wrap:anywhere]">{answer.feedback}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Key Strengths */}
          <div className="bg-[#090710] border border-emerald-500/20 rounded-xl p-4 sm:p-5" data-testid="strengths-section">
            <h3 className="text-xs sm:text-sm font-bold text-emerald-400 mb-2.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              Key Strengths
            </h3>
            <ul className="space-y-2">
              {answer.strengths && answer.strengths.length > 0 ? (
                answer.strengths.map((strength, index) => (
                  <li key={index} className="text-xs text-slate-300 flex items-start gap-2" data-testid={`strength-${index}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span className="break-words [overflow-wrap:anywhere]">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500 italic">No specific strengths noted.</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-[#090710] border border-amber-500/20 rounded-xl p-5" data-testid="improvements-section">
            <h3 className="text-xs sm:text-sm font-bold text-amber-400 mb-2.5 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              Areas to Enhance
            </h3>
            <ul className="space-y-2">
              {answer.improvements && answer.improvements.length > 0 ? (
                answer.improvements.map((improvement, index) => (
                  <li key={index} className="text-xs text-slate-300 flex items-start gap-2" data-testid={`improvement-${index}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span className="break-words [overflow-wrap:anywhere]">{improvement}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500 italic">Solid response! Keep up the good work.</li>
              )}
            </ul>
          </div>
        </div>

        {/* STAR Method Behavioral Evaluator Card */}
        <div className="bg-[#0B1124]/90 border border-purple-500/30 rounded-2xl p-4 sm:p-6 space-y-4 shadow-lg shadow-purple-500/10" data-testid="star-method-evaluator">
          <div className="flex items-center justify-between border-b border-[#2B2144] pb-3">
            <h3 className="text-xs sm:text-sm font-bold text-purple-300 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400 animate-pulse" />
              STAR Method Behavioral Framework
            </h3>
            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AI Detected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#140F26] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col justify-between">
              <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>S - Situation</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">Context established</p>
            </div>

            <div className="p-3 rounded-xl bg-[#140F26] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col justify-between">
              <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>T - Task</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">Challenge defined</p>
            </div>

            <div className="p-3 rounded-xl bg-[#140F26] border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] flex flex-col justify-between">
              <div className="font-extrabold text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-indigo-400" />
                <span>A - Action</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">Steps detailed</p>
            </div>

            <div className="p-3 rounded-xl bg-[#140F26] border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col justify-between">
              <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>R - Result</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">Outcome measured</p>
            </div>
          </div>
        </div>

        {/* Dynamic Probing Follow-Up Challenge */}
        <div className="bg-[#050814] border border-cyan-500/30 rounded-2xl p-4 sm:p-6 space-y-3 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center justify-between border-b border-[#1A253F] pb-3">
            <h3 className="text-xs sm:text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400 animate-pulse" />
              AI Deep-Dive Probing Question (FAANG Level)
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              Follow-Up Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            "How would your chosen architecture prevent race conditions and maintain consistency during sudden 10x traffic spikes?"
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              💡 Tip: Discuss Optimistic Locking vs Distributed Locks (Redis Redlock)
            </span>
          </div>
        </div>
      </div>

      {/* Action Trigger */}
      <button
        type="button"
        onClick={onNext}
        className="w-full mt-6 sm:mt-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-extrabold text-white btn-primary shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group min-h-[46px]"
        data-testid="next-question-btn"
      >
        <span>Proceed to Next Question</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default FeedbackPanel;
