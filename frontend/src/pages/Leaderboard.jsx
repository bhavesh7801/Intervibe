import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Award, Medal, Search, Sparkles } from 'lucide-react';
import { leaderboardApi } from '../api/index.js';

export const Leaderboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    leaderboardApi.getTopCandidates().then(setCandidates);
  }, []);

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
            <Trophy size={16} />
            <span>Global Candidate Rankings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Intervibe Top 1% Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Top candidates ranked by simulated FAANG algorithm performance, streak consistency, and design scores.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search candidate or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 shadow-2xs"
          />
          <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-6">Target Role</th>
                <th className="py-3.5 px-6">Streak</th>
                <th className="py-3.5 px-6">Score</th>
                <th className="py-3.5 px-6">Tier Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((c) => {
                const isTop3 = c.rank <= 3;
                return (
                  <tr key={c.rank} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-black text-slate-800">
                      {c.rank === 1 ? '🥇 #1' : c.rank === 2 ? '🥈 #2' : c.rank === 3 ? '🥉 #3' : `#${c.rank}`}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black">
                        {c.name[0]}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {c.role}
                    </td>
                    <td className="py-4 px-6 font-bold text-amber-600 font-mono">
                      🔥 {c.streak} days
                    </td>
                    <td className="py-4 px-6 font-black font-mono text-emerald-600">
                      {c.score}%
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                        {c.badge}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
