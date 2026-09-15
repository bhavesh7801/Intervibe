import React from 'react';
import { Check } from 'lucide-react';

export const StepProgress = ({ steps = [], currentStep = 0, onStepClick }) => {
  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between relative">
        {/* Continuous background bar */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 -z-0" />
        {/* Active progress bar */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-rose-600 -translate-y-1/2 -z-0 transition-all duration-300"
          style={{ width: `${(currentStep / Math.max(1, steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.id || idx}
              onClick={() => onStepClick && isCompleted && onStepClick(idx)}
              className={`relative z-10 flex flex-col items-center group ${
                onStepClick && isCompleted ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-500/30'
                    : isCurrent
                    ? 'bg-white border-rose-600 text-rose-600 shadow-md ring-4 ring-rose-100'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                className={`absolute top-9 text-[11px] font-bold tracking-tight whitespace-nowrap hidden sm:block ${
                  isCurrent ? 'text-rose-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.title || step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
