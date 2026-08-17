import React, { useState } from 'react';
import { Trophy, Calendar, Flame, Zap, Award } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getUserHash = (u) => {
  const str = String(u?.id || u?.email || u?.name || 'user_activity_key');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const ActivityHeatmap = ({ userStats, streakCount = 0, user }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const userHash = getUserHash(user);
  
  // Gather real activity data from backend stats
  const activityMap = {};
  if (userStats?.activityDates && Array.isArray(userStats.activityDates)) {
    userStats.activityDates.forEach(dStr => {
      activityMap[dStr] = (activityMap[dStr] || 0) + 1;
    });
  }

  const hasAnyActivity = Object.keys(activityMap).length > 0;

  // Generate 52 weeks (364 days) activity map leading up to today
  const today = new Date();
  const days = [];
  const monthLabelPositions = [];

  let currentMonth = -1;

  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    const month = d.getMonth();
    const weekIndex = Math.floor((363 - i) / 7);

    // Track column position for month labels
    if (month !== currentMonth && (363 - i) % 7 === 0) {
      monthLabelPositions.push({ month: MONTH_NAMES[month], weekIndex });
      currentMonth = month;
    }

    const dString = d.toISOString().split('T')[0];
    let count = activityMap[dString] || 0;

    days.push({
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      count,
      dayOfWeek: d.getDay(),
      weekIndex
    });
  }

  // Calculate totals
  const totalSubmissions = days.reduce((acc, d) => acc + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;
  const longestStreak = hasAnyActivity ? Math.max(streakCount, activeDays > 0 ? 1 : 0) : 0;

  const getColorClass = (count) => {
    if (count >= 5) return 'bg-[#39D353] border-[#39D353] shadow-[0_0_10px_rgba(57,211,83,0.6)]';
    if (count >= 3) return 'bg-[#26A641] border-[#26A641]';
    if (count >= 2) return 'bg-[#006D32] border-[#006D32]';
    if (count >= 1) return 'bg-[#0E4429] border-[#0E4429]';
    return 'bg-[#161B22] border-white/5 hover:border-slate-600';
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl mb-8 border border-slate-800 bg-[#0D121F] shadow-lg space-y-4" data-testid="activity-heatmap-card">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Trophy size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              365-Day Practice Activity Heatmap
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold flex items-center gap-1">
                <Flame size={13} className="text-amber-400 animate-pulse" />
                <span>{streakCount} Day Streak</span>
              </span>
            </h3>
            <p className="text-xs text-slate-400">GitHub & LeetCode style daily practice breakdown</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono self-start sm:self-auto">
          <span>Less</span>
          <span className="w-3 h-3 rounded-xs bg-[#161B22] border border-white/5" />
          <span className="w-3 h-3 rounded-xs bg-[#0E4429]" />
          <span className="w-3 h-3 rounded-xs bg-[#006D32]" />
          <span className="w-3 h-3 rounded-xs bg-[#26A641]" />
          <span className="w-3 h-3 rounded-xs bg-[#39D353] shadow-[0_0_6px_rgba(57,211,83,0.6)]" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Section */}
      <div className="relative overflow-x-auto pb-2">
        <div className="inline-block min-w-[720px] space-y-1">
          
          {/* Month Labels Header Row */}
          <div className="relative h-4 text-[11px] text-slate-400 font-mono mb-1 ml-8">
            {monthLabelPositions.map((m, idx) => (
              <span
                key={idx}
                className="absolute top-0"
                style={{ left: `${m.weekIndex * 16}px` }}
              >
                {m.month}
              </span>
            ))}
          </div>

          {/* Heatmap Grid with Left Day Labels */}
          <div className="flex gap-2">
            {/* Left Day of Week Labels */}
            <div className="grid grid-rows-7 gap-1 text-[10px] text-slate-500 font-mono w-6 text-right pr-1">
              {DAY_LABELS.map((label, idx) => (
                <span key={idx} className="h-3 flex items-center justify-end leading-none">
                  {label}
                </span>
              ))}
            </div>

            {/* 52-Week 7-Row Grid */}
            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3 h-3 rounded-xs border transition-all duration-150 cursor-pointer ${getColorClass(day.count)}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Floating Tooltip Card */}
        {hoveredDay && (
          <div className="absolute bottom-2 right-4 bg-[#141A2B] border border-slate-800 rounded-xl px-3 py-2 shadow-2xl text-xs z-20 animate-fade-in pointer-events-none">
            <span className="font-bold text-white block">{hoveredDay.dateStr}</span>
            <span className="text-emerald-400 font-mono font-semibold">
              {hoveredDay.count === 0
                ? 'No practice submissions logged'
                : `${hoveredDay.count} mock interview & coding submission${hoveredDay.count > 1 ? 's' : ''}`}
            </span>
          </div>
        )}
      </div>

      {/* Heatmap Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-[#141A2B] border border-slate-800 flex items-center gap-2.5">
          <Calendar size={16} className="text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">365-Day Total</span>
            <span className="font-extrabold text-white text-sm font-mono">{totalSubmissions} Submissions</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141A2B] border border-slate-800 flex items-center gap-2.5">
          <Flame size={16} className="text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Streak</span>
            <span className="font-extrabold text-amber-300 text-sm font-mono">{streakCount} Days</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141A2B] border border-slate-800 flex items-center gap-2.5">
          <Zap size={16} className="text-purple-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Longest Streak</span>
            <span className="font-extrabold text-purple-300 text-sm font-mono">{longestStreak} Days</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141A2B] border border-slate-800 flex items-center gap-2.5">
          <Award size={16} className="text-rose-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Days</span>
            <span className="font-extrabold text-rose-300 text-sm font-mono">{activeDays} / 364 ({Math.round((activeDays/364)*100)}%)</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ActivityHeatmap;
