import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  ChevronRight,
  User,
  ArrowRight,
  Award,
  Code2,
} from "lucide-react";

const RecentActivitySection = ({ recentSessions, userTargetRole }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 sm:space-y-10">
      {/* RECENT INTERVIEW SESSION */}
      <div className="bg-[#080D1A]/80 border-2 border-cyan-500/30 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between border-b border-[#1A253F] pb-4 sm:pb-5 mb-2">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Recent Interview Session</h2>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            See All <ChevronRight size={12} />
          </button>
        </div>

        {recentSessions && recentSessions.length > 0 ? (
          <div
            className="bg-[#050A18] border border-[#1A253F] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-500/30 transition-colors group cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">
                    {recentSessions[0].role || userTargetRole || "Software Engineer"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {recentSessions[0].status || "in_progress"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                  <span className="flex items-center gap-1"><User size={10} /> Active</span>
                  <span>•</span>
                  <span>{recentSessions[0].questions?.length || 10} Questions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block font-mono">
                  AI SCORE
                </span>
                <span className="text-xl font-black text-emerald-400 font-mono group-hover:text-emerald-300 transition-colors">
                  {recentSessions[0].score || recentSessions[0].averageScore
                    ? `${Math.round(recentSessions[0].score || recentSessions[0].averageScore)}%`
                    : "88%"}
                </span>
              </div>
              <ArrowRight size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-slate-400">
            No mock interview sessions recorded yet.
          </div>
        )}

        {/* CTA BUTTON */}
        <div className="flex justify-center pt-2 pb-1 relative z-10 w-full">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto justify-center px-6 sm:px-12 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white font-black text-sm sm:text-base tracking-wide shadow-[0_0_40px_rgba(16,185,129,0.55)] hover:shadow-[0_0_60px_rgba(16,185,129,0.75)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-200 border border-teal-300/50 flex items-center gap-3 cursor-pointer"
          >
            <span>🚀</span>
            <span>Start Mock Interview</span>
            <ArrowRight size={18} className="ml-1" />
          </button>
        </div>
      </div>

      {/* BOTTOM SPLIT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#080D1A]/80 border-2 border-blue-500/30 rounded-[2rem] p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_20px_rgba(59,130,246,0.1)] group">
          <div className="flex items-center justify-between border-b border-[#1A253F] pb-5 mb-5">
            <h2 className="text-sm font-bold text-white pl-1">FAANG Interview Streak</h2>
            <Award size={14} className="text-blue-400" />
          </div>
          <div className="flex items-center gap-4 pl-1">
            <div className="text-4xl flex items-center gap-1 cursor-default hover:scale-105 transition-transform">
              🔥🔥🔥🔥
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200">3 Day Streak</div>
              <div className="text-[10px] text-pink-400">Severe Agenda</div>
            </div>
          </div>
        </div>

        <div className="bg-[#080D1A]/80 border-2 border-blue-500/30 rounded-[2rem] p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_20px_rgba(59,130,246,0.1)] group">
          <div className="flex items-center justify-between border-b border-[#1A253F] pb-5 mb-5">
            <h2 className="text-sm font-bold text-white">Practice Workspace</h2>
            <Code2 size={14} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-2 hover:text-slate-200 transition-colors cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
              Simulate AI-powered technical interviews.
            </li>
            <li className="flex items-start gap-2 hover:text-slate-200 transition-colors cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
              Access coding problems and hints.
            </li>
            <li className="flex items-start gap-2 hover:text-slate-200 transition-colors cursor-default">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
              Review performance insights.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default RecentActivitySection;
