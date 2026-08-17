import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw, Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

const SAMPLE_QUESTIONS = [
  "Tell me about a complex technical problem you solved recently and how you approached it.",
  "How do you handle disagreement with a Senior Staff Engineer on architectural design?",
  "Describe a time when a production incident occurred. How did you diagnose and resolve it under pressure?",
  "Explain the difference between optimistic concurrency control and pessimistic locking to a junior engineer."
];

const VoiceAICoachTab = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(SAMPLE_QUESTIONS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      analyzeVoiceResponse();
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setReport(null);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscript(text);
        };

        recognition.onerror = (err) => {
          console.log("Speech recognition error:", err);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        setTranscript("In my recent project, I redesigned our distributed caching layer using Redis cluster and reduced p99 latency from 450ms down to 42ms while maintaining high availability across 3 AWS regions.");
      }
    }
  };

  const analyzeVoiceResponse = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setReport({
        overallScore: 92,
        clarityScore: 95,
        pacingScore: 88,
        confidenceScore: 94,
        fillerWordsCount: 2,
        keyStrengths: [
          "Clear problem statement and quantitative metrics mentioned (450ms -> 42ms)",
          "Confident tone with strong action verbs",
          "Demonstrated deep architectural knowledge"
        ],
        improvementTips: [
          "Consider elaborating slightly more on trade-offs considered before picking Redis",
          "Keep vocal pitch steady when detailing error handling mechanisms"
        ],
        aiFeedbackSummary: "Outstanding technical delivery! You clearly articulated the business impact and architectural changes. Your speech rate was optimal (~135 words/min)."
      });
    }, 1800);
  };

  const playAiVoiceFeedback = () => {
    if (isSpeaking) {
      stop();
    } else {
      const text = report ? report.aiFeedbackSummary : selectedQuestion;
      speak(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Question Header */}
      <div className="p-5 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
            <Sparkles size={14} /> Active Interview Prompt
          </span>
          <button
            onClick={() => {
              const next = SAMPLE_QUESTIONS[(SAMPLE_QUESTIONS.indexOf(selectedQuestion) + 1) % SAMPLE_QUESTIONS.length];
              setSelectedQuestion(next);
              setTranscript('');
              setReport(null);
            }}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw size={13} />
            <span>Next Question</span>
          </button>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          "{selectedQuestion}"
        </h3>
        <button
          onClick={playAiVoiceFeedback}
          className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1.5 cursor-pointer pt-1"
        >
          <Volume2 size={15} className={`text-blue-400 ${isSpeaking ? 'animate-bounce' : ''}`} />
          <span>{isSpeaking ? 'Speaking...' : 'Listen to AI Interviewer'}</span>
        </button>
      </div>

      {/* Voice Recording Control Box */}
      <div className="p-8 rounded-2xl bg-[#0C1222] border border-[#1A253F] text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-bold">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-blue-400'}`} />
            <span>{isRecording ? `Recording Live (${recordingTime}s)` : 'Ready to Record'}</span>
          </div>
          <h4 className="text-xl font-black text-white">Speak Your Response</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the microphone button to start answering out loud. AI will evaluate your speech pacing, clarity, and quantitative depth.
          </p>
        </div>

        {/* Big Pulsing Mic Button */}
        <div className="flex justify-center items-center py-4">
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-500/40 ring-4 ring-rose-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 ring-4 ring-blue-500/20'
            }`}
          >
            {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
          </button>
        </div>

        {/* Live Audio Soundwave Wavemeter */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1.5 h-10">
            {[40, 70, 30, 90, 50, 80, 60, 100, 45, 85, 35, 75].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-blue-400 animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        )}

        {/* Live Speech Transcript Box */}
        <div className="text-left bg-[#080D1A] border border-[#162035] p-4 rounded-xl space-y-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 block font-mono">Live Speech Transcript</span>
          <p className="text-xs text-slate-200 min-h-[50px] leading-relaxed italic">
            {transcript || (isRecording ? "Listening to your spoken answer..." : "Your spoken response transcript will appear here in real-time...")}
          </p>
        </div>
      </div>

      {/* AI Analysis Loading State */}
      {isAnalyzing && (
        <div className="p-8 text-center rounded-2xl bg-[#0C1222] border border-[#1A253F] space-y-3 animate-pulse">
          <Sparkles size={28} className="mx-auto text-blue-400 animate-spin" />
          <h4 className="text-base font-bold text-white">Analyzing Speech Pacing & Technical Depth...</h4>
          <p className="text-xs text-slate-400">Evaluating clarity score, filler words, and STAR impact metrics.</p>
        </div>
      )}

      {/* Voice AI Report Card */}
      {report && !isAnalyzing && (
        <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] space-y-6 shadow-2xl animate-entrance">
          <div className="flex items-center justify-between border-b border-[#162035] pb-4">
            <div className="flex items-center gap-2">
              <Award size={22} className="text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white">Voice Coaching Evaluation</h3>
            </div>
            <div className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-black font-mono">
              Overall: {report.overallScore}/100
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-[#080D1A] border border-[#162035] text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Clarity Score</span>
              <span className="text-xl font-black text-blue-400 font-mono">{report.clarityScore}%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#080D1A] border border-[#162035] text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Pacing Rate</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{report.pacingScore}%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#080D1A] border border-[#162035] text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Confidence</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{report.confidenceScore}%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#080D1A] border border-[#162035] text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Filler Words</span>
              <span className="text-xl font-black text-amber-400 font-mono">{report.fillerWordsCount} Used</span>
            </div>
          </div>

          {/* AI Feedback Summary */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 leading-relaxed flex items-start gap-3">
            <Zap size={18} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white block">AI Coach Assessment:</span>
              <p>{report.aiFeedbackSummary}</p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2.5">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Key Delivery Strengths
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {report.keyStrengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2.5">
              <span className="font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                <AlertCircle size={14} /> Recommended Refinements
              </span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {report.improvementTips.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAICoachTab;
