import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ReadinessPassportCard from '../components/dashboard/ReadinessPassportCard.jsx';
import QuickActionPillCards from '../components/dashboard/QuickActionPillCards.jsx';
import ActivityHeatmap from '../components/ActivityHeatmap.jsx';
import CompetencyRadarChart from '../components/CompetencyRadarChart.jsx';
import RecentActivitySection from '../components/profile/RecentActivitySection.jsx';
import QuestionGeneratorModal from '../components/QuestionGeneratorModal.jsx';
import { Sparkles, Calendar, ArrowRight, Play, Zap, ShieldCheck, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showGenModal, setShowGenModal] = useState(false);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Readiness Banner */}
      <ReadinessPassportCard user={user} />

      {/* 2. Prominent AI Question Generator Action Card */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-rose-500/15 flex flex-wrap items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white">
            <Sparkles size={13} className="text-yellow-300" />
            <span>AI Dynamic Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Need a custom technical interview question?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Generate on-demand FAANG algorithmic challenges, distributed system design rubrics, or behavioral prompts customized to your target role and difficulty.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowGenModal(true)}
          className="relative z-10 px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0"
        >
          <Sparkles size={16} className="text-rose-600" />
          <span>Generate AI Question Now</span>
          <ArrowRight size={16} className="text-slate-400" />
        </button>

        {/* Ambient background decoration */}
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. Quick Action Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Zap size={18} className="text-rose-600" />
            <span>Fast-Start Preparation Rooms</span>
          </h2>
          <button
            type="button"
            onClick={() => setShowGenModal(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Customize Question</span>
          </button>
        </div>
        <QuickActionPillCards />
      </div>

      {/* 4. Analytics Grid (Radar Chart + Practice Heatmap) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Skill Competency Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across your recent FAANG technical mock loops
            </p>
          </div>
          <CompetencyRadarChart />
        </div>

        {/* Heatmap & Next Milestone */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ActivityHeatmap streakDays={user?.streakDays || 5} totalSessions={user?.interviewsCompleted || 12} />
          
          {/* Daily Challenge Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                Daily Drill
              </span>
              <h4 className="text-sm font-black text-slate-900">
                Sliding Window Maximum & Distributed Caching Strategy
              </h4>
              <p className="text-xs text-slate-600">
                15-minute quick sprint tailored to your Google track.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/coding')}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <Play size={13} fill="currentColor" />
              <span>Start Challenge</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Log */}
      <RecentActivitySection />

      {/* Dynamic Question Generator Modal */}
      <QuestionGeneratorModal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
        onGenerate={(genQuestion) => {
          navigate('/coding', { state: { question: genQuestion } });
        }}
      />
    </div>
  );
};

export default Dashboard;
