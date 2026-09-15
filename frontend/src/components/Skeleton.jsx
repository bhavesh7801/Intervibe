import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = 'animate-pulse bg-slate-200/80 rounded-md';

  if (variant === 'circle') {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 rounded-3xl border border-slate-200 bg-white space-y-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-3 w-1/4 bg-slate-100 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 rounded-md animate-pulse" />
          <div className="h-3 w-5/6 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-3 w-2/3 bg-slate-100 rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} />;
};

export default Skeleton;
