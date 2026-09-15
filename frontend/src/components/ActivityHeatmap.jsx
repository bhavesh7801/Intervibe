import React from 'react';
import { Flame, Calendar, Sparkles } from 'lucide-react';

export const ActivityHeatmap = ({ streakDays = 7, totalSessions = 42 }) => {
  // Generate 16 weeks of realistic practice activity cells
  const weeks = Array.from({ length: 16 }, (_, wIdx) => {
    return Array.from({ length: 7 }, (_, dIdx) => {
      // Deterministic simulation
      const count = ((wIdx * 7 + dIdx) % 3 === 0 || (wIdx * 7 + dIdx) % 5 === 0) ? ((wIdx + dIdx) % 4) + 1 : 0;
      return { day: dIdx, count };
    });
  });

  const getCellColor = (count) => {
    if (count >= 4) return 'bg-rose-600';
    if (count === 3) return 'bg-rose-400';
    if (count === 2) return 'bg-rose-300';
    if (count === 1) return 'bg-rose-200';
    return 'bg-slate-100 hover:bg-slate-200';
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-rose-600" />
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Interview Practice Activity
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <Flame size={14} className="text-rose-500 fill-rose-500" />
            <span>{streakDays} Day Streak!</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {totalSessions} mock sessions this year
          </span>
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-[480px]">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-1">
              {week.map((cell, d) => (
                <div
                  key={d}
                  title={`${cell.count} practice questions solved`}
                  className={`w-3.5 h-3.5 rounded-[4px] transition-colors cursor-pointer ${getCellColor(cell.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
        <span>Recent 16 weeks</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[3px] bg-slate-100" />
          <div className="w-3 h-3 rounded-[3px] bg-rose-200" />
          <div className="w-3 h-3 rounded-[3px] bg-rose-400" />
          <div className="w-3 h-3 rounded-[3px] bg-rose-600" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
