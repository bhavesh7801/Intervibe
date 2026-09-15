import React from 'react';
import { Flame, Award, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export const StatsOverviewGrid = ({ user }) => {
  const stats = [
    {
      label: 'Readiness Score',
      value: `${user?.readinessScore || 78}%`,
      subtitle: 'Top 10% percentile',
      icon: Award,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      label: 'Practice Streak',
      value: `${user?.streakDays || 5} Days`,
      subtitle: 'Personal record: 14 days',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      label: 'Interviews Completed',
      value: `${user?.interviewsCompleted || 12}`,
      subtitle: '9.4 hours total live practice',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Avg Response Grade',
      value: 'A- (86%)',
      subtitle: '+14% improvement this month',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((st, idx) => {
        const Icon = st.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {st.label}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${st.color}`}>
                <Icon size={16} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {st.value}
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {st.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverviewGrid;
