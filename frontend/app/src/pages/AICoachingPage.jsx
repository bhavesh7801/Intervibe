import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mic, Briefcase, Award, Lightbulb, Cpu, Zap, Sparkles } from 'lucide-react';
import VoiceAICoachTab from '../components/coaching/VoiceAICoachTab';
import ResumeJobFitTab from '../components/coaching/ResumeJobFitTab';
import StarEvaluatorTab from '../components/coaching/StarEvaluatorTab';
import SocraticHintTab from '../components/coaching/SocraticHintTab';
import AstRefactorTab from '../components/coaching/AstRefactorTab';
import SpeedRivalTab from '../components/coaching/SpeedRivalTab';

const TABS = [
  { id: 'voice', label: 'Voice AI Coach', icon: Mic, color: 'text-blue-400' },
  { id: 'fit', label: 'Resume & Job Fit', icon: Briefcase, color: 'text-cyan-400' },
  { id: 'star', label: 'STAR Answer Evaluator', icon: Award, color: 'text-emerald-400' },
  { id: 'hints', label: 'Socratic Hints', icon: Lightbulb, color: 'text-amber-400' },
  { id: 'refactor', label: 'AST Refactoring', icon: Cpu, color: 'text-indigo-400' },
  { id: 'duel', label: '1v1 Speed Duel', icon: Zap, color: 'text-rose-400' },
];

const AICoachingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'voice';
  const [activeTab, setActiveTab] = useState(activeTabParam);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden" data-testid="ai-coaching-page">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Top Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#162035] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-bold">
              <Sparkles size={14} className="text-blue-400 animate-spin" />
              <span>Google Gemini Powered Coach</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">AI Coaching Hub</h1>
            <p className="text-xs text-slate-400">
              Interactive voice mock sessions, target job description fit analysis, STAR behavioral evaluations, and live 1v1 speed duels.
            </p>
          </div>
        </div>

        {/* Tab Selection Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#162035]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-lg shadow-blue-500/10 scale-105'
                    : 'bg-[#0C1222] border-[#1A253F] text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-blue-400' : tab.color} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Render Tab Content */}
        <div className="pt-2">
          {activeTab === 'voice' && <VoiceAICoachTab />}
          {activeTab === 'fit' && <ResumeJobFitTab />}
          {activeTab === 'star' && <StarEvaluatorTab />}
          {activeTab === 'hints' && <SocraticHintTab />}
          {activeTab === 'refactor' && <AstRefactorTab />}
          {activeTab === 'duel' && <SpeedRivalTab />}
        </div>
      </div>
    </div>
  );
};

export default AICoachingPage;
