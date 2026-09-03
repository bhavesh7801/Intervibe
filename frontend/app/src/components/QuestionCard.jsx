import React, { useEffect } from 'react';
import { HelpCircle, Code, MessageSquare, Flame, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

const QuestionCard = ({ question, questionNumber, totalQuestions, ttsEnabled = true }) => {
  const { speak, stop, isSpeaking, hasSupport } = useSpeechSynthesis();
  const isTechnical = question?.category === 'technical';



  // 1. Auto-speak question text when loaded or changed
  useEffect(() => {
    if (question?.text && ttsEnabled && hasSupport) {
      const timer = setTimeout(() => {
        speak(question.text);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!ttsEnabled) {
      stop();
    }
  }, [question?.text, speak, stop, ttsEnabled, hasSupport]);

  // 2. Cleanup speech audio on component unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop, question?.text]);

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };



  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(question.text);
    }
  };

  return (
    <div className="card-3d rounded-2xl p-4 sm:p-8 mb-5 sm:mb-6 animate-entrance" data-testid="question-card">
      <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#162035]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs">
            {questionNumber}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider" data-testid="question-progress">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Speak Question Audio Toggle Button */}
          {hasSupport && (
            <button
              type="button"
              onClick={handleToggleSpeak}
              aria-label={isSpeaking ? 'Stop reading question aloud' : 'Read question aloud'}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border ${
                isSpeaking
                  ? 'bg-rose-600/30 text-rose-300 border-rose-500/60 shadow-[0_0_18px_rgba(244,63,94,0.4)] animate-pulse'
                  : 'bg-[#18132B] hover:bg-[#261E42] text-slate-300 border-[#382A5C] hover:border-rose-500/50'
              }`}
              title={isSpeaking ? 'Mute Question Audio' : 'Speak Question Aloud'}
              data-testid="speak-question-btn"
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={14} className="text-rose-400 animate-bounce" />
                  <span className="text-[11px] sm:text-xs">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} className="text-rose-400" />
                  <span className="text-[11px] sm:text-xs">Audio</span>
                </>
              )}
            </button>
          )}

          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 border backdrop-blur-md ${
              isTechnical
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
            }`}
            data-testid="question-category"
          >
            {isTechnical ? <Code size={12} /> : <MessageSquare size={12} />}
            {question.category}
          </span>

          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 border backdrop-blur-md ${getDifficultyBadge(
              question.difficulty
            )}`}
            data-testid="question-difficulty"
          >
            <Flame size={12} />
            {question.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-1">
          <HelpCircle size={20} className="animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-[#F8FAFC] leading-relaxed break-words [overflow-wrap:anywhere]" data-testid="question-text">
            {question.text}
          </h2>
          {isSpeaking && (
            <p className="text-[11px] sm:text-xs font-semibold text-rose-400 mt-2 flex items-center gap-1.5 animate-pulse">
              <Sparkles size={12} /> Reading question aloud...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
