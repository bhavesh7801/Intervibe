import React from 'react';

const QuickActionPillCards = ({ onNavigate, onOpenPrompt }) => {
  const items = [
    { label: 'Resume Tips', icon: '👤', onClick: () => onNavigate('/profile') },
    { label: 'Behavioral Questions', icon: '⚙️', onClick: () => onOpenPrompt('Behavioral Specialist') },
    { label: 'System Design', icon: '💼', onClick: () => onOpenPrompt('System Design Architect') },
    { label: 'Mock Tests', icon: '👥', onClick: () => onOpenPrompt('Senior Full Stack Engineer') }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className="p-4 rounded-2xl bg-[#0D121F] border border-slate-800 hover:border-blue-500/50 flex flex-col items-center justify-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionPillCards;
