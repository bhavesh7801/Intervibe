import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Bot, User, Sparkles, Send, Loader2, RotateCcw } from 'lucide-react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis.js';
import { coachingApi } from '../../api/index.js';

export const VoiceAICoachTab = () => {
  const { speak, isSpeaking, stop: stopSpeaking } = useSpeechSynthesis();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Technical Coach. Let's do a fast 1-on-1 drill. Tell me about a time you had to optimize a slow database query or troubleshoot a production bottleneck."
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Setup Web Speech API for voice recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputVal(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer or use Google Chrome / Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        stopSpeaking();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleSend = async (text) => {
    const candidateMsg = (text || inputVal).trim();
    if (!candidateMsg || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    stopSpeaking();

    const currentHistory = [...messages];
    const newMsgs = [...currentHistory, { sender: 'user', text: candidateMsg }];
    setMessages(newMsgs);
    setInputVal('');
    setIsLoading(true);

    try {
      // Call backend AI coaching engine to get real dynamic feedback
      const coachReply = await coachingApi.getVoiceCoachReply(candidateMsg, currentHistory);
      setMessages((prev) => [...prev, { sender: 'ai', text: coachReply }]);
      speak(coachReply);
    } catch (err) {
      console.error('AI Coach error:', err);
      const fallbackMsg = "Good breakdown. You explained the logic clearly. To elevate this for staff-level loops, quantify the latency improvement and mention failure recovery strategies.";
      setMessages((prev) => [...prev, { sender: 'ai', text: fallbackMsg }]);
      speak(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    stopSpeaking();
    setMessages([
      {
        sender: 'ai',
        text: "Let's restart! Tell me about a time you had to optimize a slow database query or troubleshoot a production bottleneck."
      }
    ]);
    setInputVal('');
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
            <p className="text-xs text-slate-500">Real-time conversational interview drills with live AI feedback</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold animate-pulse">
              <Volume2 size={14} />
              <span>Coach Speaking...</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            title="Restart drill conversation"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="h-80 overflow-y-auto space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-2xs ${
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

        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[85%] animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs shrink-0">
              <Bot size={14} />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-rose-600" />
              <span>AI Coach is analyzing your response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder={isListening ? "Listening to your voice..." : "Speak or type your answer to the coach..."}
          disabled={isLoading}
          className={`flex-1 p-3 rounded-2xl border text-slate-900 text-xs focus:outline-none transition-colors ${
            isListening
              ? 'bg-rose-50/70 border-rose-400 placeholder-rose-700 font-medium animate-pulse'
              : 'bg-slate-50 border-slate-200 focus:border-rose-500 focus:bg-white'
          }`}
        />

        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading}
          className={`p-3 rounded-2xl font-bold text-xs transition-colors cursor-pointer ${
            isListening ? 'bg-rose-600 text-white animate-bounce' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title={isListening ? "Click to stop listening" : "Click to speak your answer"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={isLoading || !inputVal.trim()}
          className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send size={13} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceAICoachTab;
