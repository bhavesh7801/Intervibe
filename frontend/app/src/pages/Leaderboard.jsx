import React, { useState, useEffect } from 'react';
import { Trophy, Award, Flame, ShieldCheck, Sparkles, TrendingUp, User, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../apiClient';

const Leaderboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.getLeaderboard();
      if (res.data?.leaderboard) {
        setCandidates(res.data.leaderboard);
      }
    } catch (e) {
      console.error('Error fetching leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-center bg-[#060813] text-slate-200 py-8 px-4 overflow-x-hidden">
      <div className="w-full max-w-[1400px] mx-auto space-y-8 px-4">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
            <Trophy size={14} className="text-amber-400" /> Global Leaderboard
          </span>
        </div>

        {/* Hero Card */}
        <div className="card-3d rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-[#170E2E] via-[#140F26] to-[#0A0714] border border-purple-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-3 shadow-xl">
            <Trophy size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Top Candidate Rankings & FAANG Index
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Benchmark your AI interview scores, practice streaks, and competency percentile against global candidates.
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="card-3d rounded-2xl border border-[#1A253F] bg-[#0A0F1D] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1A253F] bg-[#060813] text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center">Rank</th>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Target Role</th>
                  <th className="py-3.5 px-4 text-center">Completed</th>
                  <th className="py-3.5 px-4 text-center">Avg Score</th>
                  <th className="py-3.5 px-4 text-right">FAANG Percentile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162035] text-xs sm:text-sm">
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className={`transition-colors hover:bg-blue-600/5 ${
                      c.isCurrentUser ? 'bg-purple-900/20 font-bold border-l-4 border-l-purple-500' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {c.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-black border border-amber-500/40">🥇</span>
                      ) : c.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 font-black border border-slate-300/40">🥈</span>
                      ) : c.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 font-black border border-amber-700/40">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-extrabold">#{c.rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {c.name}
                            {c.isCurrentUser && (
                              <span className="text-[10px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/40">You</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Flame size={11} className="text-amber-400" /> {c.streakDays} Day Streak
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{c.targetRole}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-300">{c.completedSessions} Sessions</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-xs border border-emerald-500/30">
                        {c.averageScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 inline-flex items-center gap-1">
                        <ShieldCheck size={13} className="text-amber-400" /> Top {100 - c.readinessPercentile}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
