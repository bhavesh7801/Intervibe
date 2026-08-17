import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CleanCardProps {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const CleanCard: React.FC<CleanCardProps> = ({
  badgeText = 'AI MOCK INTERVIEW',
  title = 'Master Your Next Tech Interview',
  subtitle = 'Practice realistic coding and behavioral interviews with real-time speech feedback and instant AST complexity scoring.',
  buttonText = 'Start Free Practice',
  onButtonClick
}) => {
  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Responsive Glassmorphic Card */}
      <div className="w-full max-w-md sm:max-w-lg rounded-2xl sm:rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 md:p-10 flex flex-col items-start gap-5 sm:gap-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-500/20">
        
        {/* Optional Pill Badge */}
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold tracking-wide">
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Card Header & Title */}
        <div className="space-y-2.5 w-full text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug break-words">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed break-words">
            {subtitle}
          </p>
        </div>

        {/* Primary Action Button at Bottom */}
        <div className="w-full pt-2">
          <button
            onClick={onButtonClick}
            className="w-full py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base font-black text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-500/30 border border-blue-400/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{buttonText}</span>
            <ArrowRight size={18} className="shrink-0" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CleanCard;
