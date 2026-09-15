import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Cpu, MessageSquare, Flame, Play, Sparkles, ArrowRight } from 'lucide-react';

export const QuickActionPillCards = () => {
  const actions = [
    {
      title: 'Coding & Algorithms',
      subtitle: 'LeetCode style live code editor with AI test runner',
      icon: Code2,
      path: '/coding',
      color: 'from-rose-500/10 to-pink-500/10 border-rose-200 text-rose-600',
      badge: 'Most Popular'
    },
    {
      title: 'Full AI Mock Interview',
      subtitle: 'Live voice, webcam preview & real-time evaluation',
      icon: Flame,
      path: '/interview',
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-600',
      badge: 'FAANG Simulation'
    },
    {
      title: 'System Design Canvas',
      subtitle: 'Architecture diagramming with distributed nodes',
      icon: Cpu,
      path: '/assessment',
      color: 'from-sky-500/10 to-blue-500/10 border-sky-200 text-sky-600',
      badge: 'L5+ Senior'
    },
    {
      title: 'AI Behavioral Coach',
      subtitle: 'STAR technique evaluator & voice conversation lab',
      icon: MessageSquare,
      path: '/coaching',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-600',
      badge: 'Instant Feedback'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Link
            key={idx}
            to={act.path}
            className={`group p-5 rounded-3xl bg-gradient-to-br ${act.color} border bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                {act.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-black uppercase tracking-wider text-slate-700 border border-slate-200/60 shadow-2xs">
                    {act.badge}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {act.subtitle}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-rose-600 group-hover:translate-x-1 transition-all">
              <span>Start Session</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActionPillCards;
