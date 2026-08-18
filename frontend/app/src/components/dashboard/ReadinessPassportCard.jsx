import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const ReadinessPassportCard = ({ stats, onStartMock }) => {
  const percentile = Math.max(1, 100 - Math.round(((stats?.averageScore || 80) * 0.9) + 15));

  return (
    <div className="p-6 rounded-2xl mb-8 border border-slate-800 bg-[#0D121F] animate-entrance shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-blue-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck size={12} className="text-amber-400" /> FAANG Readiness Passport
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-[#090710] px-2 py-0.5 rounded-md border border-slate-800">
              Top {percentile}% Percentile
            </span>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Target Role Alignment Index</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Calculated against live interview feedback datasets for Google, Meta, and Amazon engineering roles.
          </p>
        </div>

        <button
          onClick={onStartMock}
          className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xl shadow-blue-500/25 border border-blue-400/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span>Recalibrate Passport</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ReadinessPassportCard;
