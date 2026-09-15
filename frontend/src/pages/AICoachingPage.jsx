import React, { useState } from 'react';
import VoiceAICoachTab from '../components/coaching/VoiceAICoachTab.jsx';
import StarEvaluatorTab from '../components/coaching/StarEvaluatorTab.jsx';
import AstRefactorTab from '../components/coaching/AstRefactorTab.jsx';
import ResumeJobFitTab from '../components/coaching/ResumeJobFitTab.jsx';
import SpeedRivalTab from '../components/coaching/SpeedRivalTab.jsx';
import { Bot, MessageSquare, Code2, Target, Sparkles, Flame } from 'lucide-react';

export const AICoachingPage = () => {
  const [activeTab, setActiveTab] = useState('voice');

  const tabs = [
    { id: 'voice', label: '1-on-1 Voice Coach', icon: Bot },
    { id: 'star', label: 'STAR Behavioral Evaluator', icon: MessageSquare },
    { id: 'ast', label: 'Code Refactor & AST Audit', icon: Code2 },
    { id: 'resume', label: 'Resume & JD Fit', icon: Target },
    { id: 'rival', label: 'Speed Rival (Ghost Racer)', icon: Flame }
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-600 mb-1">
          <Sparkles size={14} />
          <span>Interactive AI Coaching Labs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Targeted Skill Coaching & Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Master behavioral storytelling, algorithmic optimization, speed drills, and voice delivery with dedicated AI tools.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === 'voice' && <VoiceAICoachTab />}
        {activeTab === 'star' && <StarEvaluatorTab />}
        {activeTab === 'ast' && <AstRefactorTab />}
        {activeTab === 'resume' && <ResumeJobFitTab />}
        {activeTab === 'rival' && <SpeedRivalTab />}
      </div>
    </div>
  );
};

export default AICoachingPage;
