import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, Award, Medal, Search, Sparkles, 
  Crown, Star, TrendingUp, Users, ArrowUpRight, RefreshCw, UserCheck 
} from 'lucide-react';
import { leaderboardApi } from '../api/index.js';
import { useAuth } from '../context/AuthContext.jsx';

export const Leaderboard = () => {
  const { user: currentUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await leaderboardApi.getTopCandidates();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  // Filter candidates based on search & role filter
  const filtered = safeCandidates.filter((c) => {
    const name = (c?.name || '').toLowerCase();
    const role = (c?.role || c?.targetRole || '').toLowerCase();
    const email = (c?.email || '').toLowerCase();
    const q = search.toLowerCase().trim();

    const matchesSearch = !q || name.includes(q) || role.includes(q) || email.includes(q);

    if (!matchesSearch) return false;

    if (selectedRoleFilter === 'All') return true;
    if (selectedRoleFilter === 'Top 10') return (c?.rank || 999) <= 10;
    if (selectedRoleFilter === 'Staff / Lead') return role.includes('staff') || role.includes('lead') || role.includes('principal') || role.includes('architect');
    if (selectedRoleFilter === 'Senior') return role.includes('senior') || (c?.experienceLevel || '').toLowerCase().includes('senior');
    if (selectedRoleFilter === 'Mid / Junior') return role.includes('mid') || role.includes('junior') || (c?.experienceLevel || '').toLowerCase().includes('mid') || (c?.experienceLevel || '').toLowerCase().includes('entry');

    return true;
  });

  // Podium (Top 3)
  const top1 = safeCandidates.find(c => c.rank === 1);
  const top2 = safeCandidates.find(c => c.rank === 2);
  const top3 = safeCandidates.find(c => c.rank === 3);

  // Quick stats
  const topScore = safeCandidates.length > 0 ? Math.max(...safeCandidates.map(c => c.score || c.averageScore || 0)) : 98;
  const avgScore = safeCandidates.length > 0 ? Math.round(safeCandidates.reduce((acc, c) => acc + (c.score || c.averageScore || 0), 0) / safeCandidates.length) : 89;
  const topStreak = safeCandidates.length > 0 ? Math.max(...safeCandidates.map(c => c.streak || c.streakDays || 0)) : 24;

  const roleFilters = ['All', 'Top 10', 'Staff / Lead', 'Senior', 'Mid / Junior'];

  const getBadgeStyle = (badge) => {
    const b = (badge || '').toLowerCase();
    if (b.includes('faang') || b.includes('elite')) {
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
    }
    if (b.includes('algorithm') || b.includes('master')) {
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
    }
    if (b.includes('system') || b.includes('architect')) {
      return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
    }
    if (b.includes('star')) {
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30';
    }
    return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30';
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Trophy size={14} className="text-amber-400" />
              <span>Global Technical Rankings</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Intervibe Top 1% Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time candidate rankings benchmarked against simulated FAANG algorithmic evaluations, system design depth, and STAR storytelling clarity.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              type="button"
              onClick={fetchLeaderboard}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Refreshing...' : 'Live Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Top Score</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
              {topScore}%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Average Score</span>
              <TrendingUp size={14} className="text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              {avgScore}%
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Max Streak</span>
              <Flame size={14} className="text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-400">
              🔥 {topStreak}d
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
              <span>Candidates</span>
              <Users size={14} className="text-indigo-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-indigo-400">
              {safeCandidates.length} Active
            </div>
          </div>
        </div>
      </div>

      {/* Podium Showcase (Top 3) */}
      {safeCandidates.length >= 3 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Top Ranked Champions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Rank 2 - Silver */}
            {top2 && (
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-700 p-5 shadow-sm space-y-3 flex flex-col justify-between order-2 md:order-1 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5">
                    🥈 Rank #2
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {top2.readinessPercentile || 96}th percentile
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-800 flex items-center justify-center font-black text-lg shadow-sm">
                    {top2.name ? top2.name[0] : 'C'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 dark:text-white truncate">
                      {top2.name || 'Candidate'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {top2.targetRole || top2.role || 'Software Engineer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    🔥 {top2.streak || top2.streakDays || 1}d Streak
                  </span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {top2.score || top2.averageScore || 90}% Score
                  </span>
                </div>
              </div>
            )}

            {/* Rank 1 - Gold (Center / Prominent) */}
            {top1 && (
              <div className="relative rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-400 dark:border-amber-500/50 p-6 shadow-lg space-y-4 flex flex-col justify-between order-1 md:order-2 transform md:-translate-y-2 hover:shadow-xl transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-md">
                  <Crown size={14} className="fill-current" />
                  <span>CHAMPION #1</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black">
                    🏆 1st Place
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    {top1.readinessPercentile || 99}th percentile
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-200">
                    {top1.name ? top1.name[0] : 'C'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-base text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                      <span>{top1.name || 'Candidate'}</span>
                      <Sparkles size={14} className="text-amber-500 shrink-0" />
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                      {top1.targetRole || top1.role || 'Principal Engineer'}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold border border-amber-400/30">
                      {top1.badge || 'FAANG Elite'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-amber-200/60 dark:border-amber-900/40 text-xs">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    🔥 {top1.streak || top1.streakDays || 1}d Streak
                  </span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                    {top1.score || top1.averageScore || 98}% Score
                  </span>
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {top3 && (
              <div className="relative rounded-3xl bg-gradient-to-b from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-amber-700/30 dark:border-amber-800/40 p-5 shadow-sm space-y-3 flex flex-col justify-between order-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-xs font-black flex items-center gap-1.5">
                    🥉 Rank #3
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {top3.readinessPercentile || 93}th percentile
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    {top3.name ? top3.name[0] : 'C'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 dark:text-white truncate">
                      {top3.name || 'Candidate'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {top3.targetRole || top3.role || 'Frontend Lead'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    🔥 {top3.streak || top3.streakDays || 1}d Streak
                  </span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {top3.score || top3.averageScore || 88}% Score
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {roleFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedRoleFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleFilter === filter
                  ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search candidate, role, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 shadow-2xs"
          />
          <Search size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-6">Rank</th>
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-6">Target Role</th>
                <th className="py-3.5 px-6">Sessions</th>
                <th className="py-3.5 px-6">Streak</th>
                <th className="py-3.5 px-6">Score</th>
                <th className="py-3.5 px-6">Tier Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6"><div className="w-8 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1">
                          <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="w-28 h-3 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-10 h-3 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-12 h-3 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-10 h-3 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                    <Trophy size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300">No candidates match your search filter</p>
                    <p className="text-xs text-slate-400">Try adjusting your keywords or clearing the active filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const rank = c?.rank || 99;
                  const isTop3 = rank <= 3;
                  const name = c?.name || 'Candidate';
                  const role = c?.targetRole || c?.role || 'Software Engineer';
                  const streak = c?.streak || c?.streakDays || 1;
                  const score = c?.score || c?.averageScore || 80;
                  const badge = c?.badge || (score >= 95 ? 'FAANG Elite' : score >= 90 ? 'Algorithm Master' : score >= 85 ? 'System Architect' : score >= 75 ? 'STAR Expert' : 'Rising Star');
                  const isUser = c?.isCurrentUser || (currentUser && (currentUser.email === c.email || currentUser.name === c.name));

                  return (
                    <tr 
                      key={c?.id || rank} 
                      className={`transition-colors ${
                        isUser 
                          ? 'bg-rose-50/70 dark:bg-rose-950/20 font-medium' 
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="py-4 px-6 font-mono font-black text-slate-800 dark:text-slate-200">
                        {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : rank === 3 ? '🥉 #3' : `#${rank}`}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                          rank === 1 ? 'bg-amber-400 text-slate-950' :
                          rank === 2 ? 'bg-slate-300 text-slate-900' :
                          rank === 3 ? 'bg-amber-700 text-white' :
                          'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {name[0] || 'C'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{name}</span>
                            {isUser && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                          {c?.email && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal block font-mono">
                              {c.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                        <div>{role}</div>
                        {c?.experienceLevel && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {c.experienceLevel}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {c?.completedSessions ?? (c?.streakDays ? Math.max(1, Math.round(c.streakDays / 2)) : 5)} mocks
                      </td>
                      <td className="py-4 px-6 font-bold text-amber-600 dark:text-amber-400 font-mono">
                        🔥 {streak} {streak === 1 ? 'day' : 'days'}
                      </td>
                      <td className="py-4 px-6 font-black font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                        {score}%
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold inline-block ${getBadgeStyle(badge)}`}>
                          {badge}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
