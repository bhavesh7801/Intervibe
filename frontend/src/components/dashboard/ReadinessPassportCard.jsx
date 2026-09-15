import React from 'react';
import { Award, ShieldCheck, Target, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { getScoreColor, getScoreBadge } from '../../utils/roleUtils.js';

export const ReadinessPassportCard = ({ user }) => {
  const readiness = user?.readinessScore || 78;
  const targetCompany = user?.targetCompany || 'Google';
  const targetRole = user?.targetRole || 'Full Stack Engineer';
  const badge = getScoreBadge(readiness);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Profile Details */}
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>AI Interview Readiness Passport</span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {user?.name || 'Candidate'}, you are on track!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Calibrated for <strong className="text-white">{targetRole}</strong> interview loops at <strong className="text-rose-400">{targetCompany}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
              <Target size={14} className="text-rose-400" />
              <span>Target: <strong className="text-white">{targetCompany}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Status: <strong className="text-white">{badge.label}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Circular Readiness Gauge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shrink-0 self-center md:self-auto min-w-[160px] text-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-700/50"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#E11D48"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * readiness) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-mono">{readiness}%</span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-300 mt-2">
            Readiness Index
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReadinessPassportCard;
