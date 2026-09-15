import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Clock,
  CheckCircle2,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  Volume2,
  ChevronDown,
  ChevronUp,
  Tag,
  Target,
  Flame,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../../utils/roleUtils.js';

export const RealTimeInterviewQuestionCard = ({
  question,
  currentIndex = 1,
  totalQuestions = 5,
  onSpeak,
  isSpeaking = false
}) => {
  const [showRubric, setShowRubric] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!question) return null;

  const diffConfig = DIFFICULTY_CONFIG[question.difficulty] || DIFFICULTY_CONFIG.Medium;

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Badges & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Question Index */}
          <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-mono font-black shadow-xs">
            Scenario {currentIndex} of {totalQuestions}
          </span>

          {/* Difficulty Badge */}
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${diffConfig.badge}`}
          >
            {question.difficulty || 'Medium'}
          </span>

          {/* Category Pill */}
          <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 text-xs font-bold flex items-center gap-1.5">
            <Tag size={12} className="text-purple-600" />
            <span>{question.category || 'System Architecture & Strategy'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio TTS Replay Button */}
          {onSpeak && (
            <button
              type="button"
              onClick={() => onSpeak(question)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Read Question with Interviewer Voice"
            >
              <Volume2 size={14} className={isSpeaking ? 'text-rose-600' : 'text-slate-500'} />
              <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="Bookmark Scenario"
          >
            <Bookmark size={15} className={bookmarked ? 'fill-amber-500 text-amber-500' : ''} />
          </button>
        </div>
      </div>

      {/* 2. Company Track & Target Role */}
      {(question.company || question.role || question.timeLimitMinutes) && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
          {question.company && (
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Building2 size={14} className="text-rose-600" />
              <span>Target Loop: {question.company}</span>
            </div>
          )}
          {question.role && (
            <span className="text-slate-400 hidden sm:inline">•</span>
          )}
          {question.role && (
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <span>{question.role}</span>
            </div>
          )}
          {question.timeLimitMinutes && (
            <>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-slate-500 font-medium">
                <Clock size={13} className="text-slate-400" />
                <span>{question.timeLimitMinutes} min verbal discussion</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* 3. Scenario Title & Main Real-Time Interview Prompt */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
          {question.title}
        </h3>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 shadow-2xs space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
          {question.prompt || question.description}
        </div>
      </div>

      {/* 4. Evaluation Rubric & Expected Talking Points */}
      {question.evaluationRubric && question.evaluationRubric.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowRubric(!showRubric)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-purple-900 font-bold text-xs hover:bg-purple-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Target size={15} className="text-purple-600" />
              <span>Interviewer Evaluation Rubric & Key Talking Points</span>
            </div>
            {showRubric ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showRubric && (
            <div className="p-4 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-2 text-xs">
              <ul className="space-y-1.5">
                {question.evaluationRubric.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                    <CheckCircle2 size={13} className="text-purple-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. Spoken Delivery Strategy & Pro Tips */}
      {question.speakingTips && question.speakingTips.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 font-bold text-xs hover:bg-emerald-100/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={15} className="text-emerald-600" />
              <span>Spoken Delivery Guide & Structure Tips</span>
            </div>
            {showTips ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showTips && (
            <div className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 space-y-2 text-xs">
              <ul className="space-y-1.5">
                {question.speakingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                    <Flame size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 6. Hints Accordion */}
      {question.hints && question.hints.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={15} className="text-slate-500" />
              <span>Architectural Hints ({question.hints.length})</span>
            </div>
            {showHints ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showHints && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <ul className="space-y-1.5 list-disc list-inside">
                {question.hints.map((hint, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimeInterviewQuestionCard;
