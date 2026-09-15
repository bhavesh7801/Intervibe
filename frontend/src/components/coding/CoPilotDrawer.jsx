import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, Lightbulb, ChevronRight } from 'lucide-react';

export const CoPilotDrawer = ({ isOpen, onClose, currentCode = '', problemTitle = '' }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hi! I'm your Socratic AI CoPilot for "${problemTitle || 'this problem'}". Ask me for hints, edge-case checks, or Big-O analysis without spoiling the solution!`
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'What edge cases should I test?',
    'Give me a subtle hint on time complexity',
    'Am I missing space optimization?'
  ];

  const handleSend = (text) => {
    const query = text || inputVal;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInputVal('');

    setTimeout(() => {
      let aiResponse = "Have you considered what happens when the array contains duplicate elements or negative integers?";
      if (query.includes('edge cases')) {
        aiResponse = "Key edge cases to verify: 1) Minimum array length (e.g. 2 elements), 2) Negative target values, 3) All elements are identical.";
      } else if (query.includes('hint')) {
        aiResponse = "Hint: Instead of checking pairs with a nested loop O(N²), store the required complement (target - num) in a Map for instantaneous O(1) lookup.";
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 sm:w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl relative z-40 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Bot size={16} />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">AI Socratic Assistant</h4>
            <span className="text-[10px] text-slate-500 font-medium">Guided hints & edge cases</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl text-xs leading-relaxed break-words ${
              m.sender === 'user'
                ? 'bg-rose-600 text-white ml-6'
                : 'bg-slate-100 text-slate-800 mr-6 border border-slate-200/80'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Inquiries
        </span>
        <div className="flex flex-col gap-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp)}
              className="text-left p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-300 text-[11px] text-slate-700 font-medium transition-colors cursor-pointer flex items-center justify-between"
            >
              <span className="truncate">{qp}</span>
              <ChevronRight size={12} className="text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Input */}
      <div className="p-3 border-t border-slate-200 flex items-center gap-1.5 bg-white">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask for a hint..."
          className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-sm"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default CoPilotDrawer;
