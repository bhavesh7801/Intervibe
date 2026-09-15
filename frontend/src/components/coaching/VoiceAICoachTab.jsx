import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Bot, User, Sparkles, Send } from 'lucide-react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis.js';

export const VoiceAICoachTab = () => {
  const { speak, isSpeaking } = useSpeechSynthesis();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Technical Coach. Let's do a fast 1-on-1 drill. Tell me about a time you had to optimize a slow database query in production."
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isCoachListening, setIsCoachListening] = useState(false);

  const handleSend = (text) => {
    const candidateMsg = text || inputVal;
    if (!candidateMsg.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: candidateMsg }];
    setMessages(newMsgs);
    setInputVal('');

    // Generate AI Coach constructive response
    setTimeout(() => {
      const coachReply = `Good explanation. You addressed indexing and EXPLAIN ANALYZE well. To make this an L5+ answer, mention whether you considered query caching with Redis or read replicas for scale.`;
      setMessages((prev) => [...prev, { sender: 'ai', text: coachReply }]);
      speak(coachReply);
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Interactive AI Voice Coach
            </h3>
            <p className="text-xs text-slate-500">Real-time conversational interview drills</p>
          </div>
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold animate-pulse">
            <Volume2 size={14} />
            <span>Coach Speaking...</span>
          </div>
        )}
      </div>

      {/* Conversation Thread */}
      <div className="h-72 overflow-y-auto space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
              }`}
            >
              {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed break-words ${
                m.sender === 'user'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input controls */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak or type your answer to the coach..."
          className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
        />

        <button
          type="button"
          onClick={() => {
            setIsCoachListening(!isCoachListening);
            if (!isCoachListening) {
              handleSend("I analyzed slow execution with PostgreSQL EXPLAIN ANALYZE, added a B-tree composite index, and reduced p99 latency by 65%.");
            }
          }}
          className={`p-3 rounded-2xl font-bold text-xs transition-colors cursor-pointer ${
            isCoachListening ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Mic input toggle"
        >
          {isCoachListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          type="button"
          onClick={() => handleSend()}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
        >
          <span>Send</span>
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};

export default VoiceAICoachTab;
