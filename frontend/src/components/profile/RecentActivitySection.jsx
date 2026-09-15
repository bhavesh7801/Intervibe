import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Flame, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RecentActivitySection = () => {
  const sessions = [
    {
      id: 'sess_1',
      title: 'Google L5 Mock Interview Loop (Algorithms & System)',
      date: 'Today, 2:45 PM',
      score: 88,
      grade: 'A',
      type: 'Full Mock',
      icon: Flame,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'sess_2',
      title: 'Distributed Rate Limiter Architecture Blueprint',
      date: 'Yesterday, 6:15 PM',
      score: 82,
      grade: 'B+',
      type: 'System Design',
      icon: Cpu,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'sess_3',
      title: 'Dynamic Programming: Two Sum & Subarray Optimization',
      date: 'Sep 13, 2026',
      score: 95,
      grade: 'A+',
      type: 'Live Coding',
      icon: Code2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          Recent Interview Sessions & Results
        </h3>
        <Link
          to="/results"
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          <span>View All Results</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {sessions.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                    {s.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>{s.type}</span>
                    <span>•</span>
                    <span>{s.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 font-mono">
                    {s.score}/100
                  </span>
                  <span className="block text-[10px] font-bold text-emerald-600 font-mono">
                    Grade {s.grade}
                  </span>
                </div>
                <Link
                  to="/results"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Review
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivitySection;
