import React from "react";
import { BarChart3, Award, Briefcase } from "lucide-react";

const StatsOverviewGrid = ({ stats, recentSessions, userTargetRole }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

      <div className="bg-[#080D1A]/80 border-2 border-indigo-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_25px_rgba(99,102,241,0.15)] relative group hover:border-indigo-500/60 transition-colors">
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1">
            <h3 className="text-xs leading-snug font-bold text-slate-400 uppercase tracking-widest">
              Total Mock Calls
            </h3>
            <div className="text-3xl sm:text-5xl font-black text-white">
              {stats?.totalSessions ?? recentSessions?.length ?? 0}
            </div>
            <p className="text-xs leading-snug text-slate-500 pt-1">
              Completed AI practice sessions.
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-900/30 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform shrink-0">
            <BarChart3 size={20} />
          </div>
        </div>
      </div>

      <div className="bg-[#080D1A]/80 border-2 border-blue-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_25px_rgba(59,130,246,0.15)] relative group hover:border-blue-500/60 transition-colors">
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1">
            <h3 className="text-xs leading-snug font-bold text-slate-400 uppercase tracking-widest">
              Average Score
            </h3>
            <div className="text-3xl sm:text-5xl font-black text-white">
              {stats?.avgScore || stats?.averageScore ? `${Math.round(stats.avgScore || stats.averageScore)}%` : "0%"}
            </div>
            <p className="text-xs leading-snug text-slate-500 pt-1">
              Overall AI evaluation score
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-900/30 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform shrink-0">
            <Award size={20} />
          </div>
        </div>
      </div>

      <div className="bg-[#080D1A]/80 border-2 border-amber-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_25px_rgba(245,158,11,0.15)] relative group hover:border-amber-500/60 transition-colors sm:col-span-2 lg:col-span-1">
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-start justify-between relative z-10 gap-3">
          <div className="space-y-1 min-w-0">
            <h3 className="text-xs leading-snug font-bold text-slate-400 uppercase tracking-widest">
              Target Role
            </h3>
            <div className="text-xl sm:text-3xl font-black text-white capitalize break-words truncate">
              {userTargetRole || "Software Engineer"}
            </div>
            <p className="text-xs leading-snug text-slate-500 pt-1">
              Primary interview track
            </p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-900/30 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform shrink-0">
            <Briefcase size={20} />
          </div>
        </div>
      </div>

    </div>

    </div>
  );
};
export default StatsOverviewGrid;
