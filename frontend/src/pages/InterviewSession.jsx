import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamPreview from '../components/WebcamPreview.jsx';
import RealTimeInterviewQuestionCard from '../components/interview/RealTimeInterviewQuestionCard.jsx';
import VoiceRecorder from '../components/VoiceRecorder.jsx';
import StepProgress from '../components/StepProgress.jsx';
import { interviewApi, audioApi } from '../api/index.js';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis.js';
import { useToast } from '../context/ToastContext.jsx';
import {
  Bot,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Activity,
  MessageSquare,
  Zap,
  RefreshCw,
  Sliders,
  Flame,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';

const SUGGESTED_TOPICS = [
  'Distributed Caching & Redis',
  'Database Sharding & Zero Downtime Migration',
  'Incident Triage & Site Reliability',
  'Microservices Resiliency & Kafka Streams',
  'Behavioral Leadership (STAR Method)',
  'Web Performance & Core Web Vitals'
];

export const InterviewSession = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { speak, isSpeaking } = useSpeechSynthesis();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [candidateNotes, setCandidateNotes] = useState('');
  const [persona, setPersona] = useState('Standard');

  // Manual Topic & Question Number Configuration
  const [showConfigBar, setShowConfigBar] = useState(false);
  const [customTopic, setCustomTopic] = useState('Distributed Systems & Scalability');
  const [questionCount, setQuestionCount] = useState(3);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  // AI Adaptive Follow-Up State
  const [adaptiveFollowup, setAdaptiveFollowup] = useState(null);
  const [isGeneratingFollowup, setIsGeneratingFollowup] = useState(false);

  // Speech Telemetry
  const [speechTelemetry, setSpeechTelemetry] = useState({
    wpm: 138,
    wordCount: 0,
    fillerCount: 0,
    pacingRating: 'Optimal Interview Pace'
  });

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const speakCurrentQuestion = (q, force = false) => {
    if (!q) return;
    if (!autoSpeak && !force) return;

    // Clean text for speech synthesis
    const titleText = q.title || 'Technical Scenario';
    const cleanPrompt = (q.prompt || q.description || '').replace(/[*#•`–\\]/g, ' ').slice(0, 300);
    const speechText = `Scenario ${currentIndex + 1}: ${titleText}. ${cleanPrompt}. Whenever you are ready, speak your initial thought process.`;
    
    stopSpeaking();
    setTimeout(() => {
      speak(speechText);
    }, 150);
  };

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const qList = await interviewApi.getQuestions();
        setQuestions(qList);
        if (qList.length > 0) {
          setTimeout(() => {
            if (autoSpeak) {
              speakCurrentQuestion(qList[0], true);
            }
          }, 600);
        }
      } finally {
        setLoading(false);
      }
    };
    loadInterview();
    return () => stopSpeaking();
  }, []);

  const currentQ = questions[currentIndex];

  // Handle generating custom topic and question count
  const handleGenerateCustomSession = async (e) => {
    if (e) e.preventDefault();
    if (!customTopic.trim()) {
      toast.error('Please enter a valid interview topic.');
      return;
    }

    setIsGeneratingCustom(true);
    try {
      const generated = await interviewApi.generateCustomInterviewQuestions({
        topic: customTopic.trim(),
        numQuestions: questionCount,
        role: 'Senior Software Engineer (L5)',
        difficulty: 'Hard'
      });

      if (generated && generated.length > 0) {
        setQuestions(generated);
        setCurrentIndex(0);
        setAdaptiveFollowup(null);
        setCandidateNotes('');
        setShowConfigBar(false);
        toast.success(`✨ Prepared ${generated.length} real-time interview scenarios for "${customTopic}"!`);
        
        if (autoSpeak) {
          setTimeout(() => {
            speakCurrentQuestion(generated[0], true);
          }, 400);
        }
      }
    } catch {
      toast.error('Failed to generate custom interview questions.');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleNext = () => {
    setAdaptiveFollowup(null);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (autoSpeak) {
        speakCurrentQuestion(questions[nextIdx]);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    setAdaptiveFollowup(null);
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      if (autoSpeak) {
        speakCurrentQuestion(questions[prevIdx]);
      }
    }
  };

  const handleVoiceRecorded = async (blob) => {
    // 1. Send audio for neural transcription & telemetry
    const transcribed = await audioApi.transcribeAudio(blob);
    if (transcribed?.text) {
      setCandidateNotes((prev) => prev ? `${prev}\n\n[Voice Answer]: ${transcribed.text}` : `[Voice Answer]: ${transcribed.text}`);
    }

    // 2. Trigger Adaptive Follow-Up Probe AI
    setIsGeneratingFollowup(true);
    setTimeout(() => {
      const probe = {
        question: `How would your chosen architecture for ${currentQ?.title?.split(':')[0] || 'this system'} handle a sudden 10x traffic surge during a multi-region network partition?`,
        reason: "Probing resilience under network split-brain scenarios and write-ahead log replication lag.",
        expectedPoints: ["CAP theorem consistency trade-offs", "Read replicas replication lag", "Circuit breaker & graceful degradation"]
      };
      setAdaptiveFollowup(probe);
      setIsGeneratingFollowup(false);
      if (autoSpeak) {
        speak(`Interesting approach. Let me follow up on that: ${probe.question}`);
      }
    }, 1000);
  };

  const handleFinish = async () => {
    stopSpeaking();
    setIsFinishing(true);
    try {
      const result = await interviewApi.evaluateAnswer({
        sessionId: 'sess_' + Date.now(),
        answers: [{ questionId: currentQ?.id, notes: candidateNotes }]
      });
      navigate('/results', { state: { evaluation: result } });
    } finally {
      setIsFinishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-600">Initializing Live AI Mock Interview Room...</span>
      </div>
    );
  }

  const steps = questions.map((q, i) => ({ id: q.id, title: `Q${i + 1}: ${q.title.split(' ')[0]}` }));

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Pipeline Progress */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs border border-rose-100">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Live AI Mock Interview Room</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200/60">
                  Verbal Loop
                </span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {questions.length} Scenarios • Topic: <strong className="text-slate-800">{customTopic}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Customize Topic & Count Button */}
            <button
              type="button"
              onClick={() => setShowConfigBar(!showConfigBar)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders size={13} className="text-rose-600" />
              <span>{showConfigBar ? 'Hide Topic Setup' : 'Custom Topic & Q-Count'}</span>
            </button>

            {/* Auto-Speak Toggle */}
            <button
              type="button"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                autoSpeak
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Toggle automatic AI voice reading on question navigation"
            >
              <Volume2 size={13} className={autoSpeak ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Auto-Voice: {autoSpeak ? 'ON' : 'OFF'}</span>
            </button>

            {/* Persona Selector */}
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold cursor-pointer focus:outline-none"
            >
              <option value="Standard">Persona: Standard (Encouraging)</option>
              <option value="Strict Bar Raiser">Persona: Strict Bar Raiser</option>
              <option value="Socratic Mentor">Persona: Socratic Mentor</option>
            </select>

            {/* Speaking Status Pill & Stop Speaking Button */}
            {isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-600 hover:bg-rose-100 text-xs font-bold animate-pulse cursor-pointer"
                title="Stop AI voice speech"
              >
                <VolumeX size={14} />
                <span>Stop Speaking</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => speakCurrentQuestion(currentQ, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                title="Speak scenario out loud"
              >
                <Volume2 size={14} className="text-rose-600" />
                <span>AI Speak</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleFinish}
              disabled={isFinishing}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>{isFinishing ? 'Evaluating...' : 'End & Evaluate'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Manual Topic & Question Number Control Bar */}
        {showConfigBar && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-purple-50/70 to-indigo-50/70 border border-rose-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-950">
                <Sparkles size={15} className="text-rose-600" />
                <span>Custom Interview Topic & Question Count Generator</span>
              </div>
              <span className="text-[11px] text-slate-500">AI will synthesize tailored real-time questions</span>
            </div>

            <form onSubmit={handleGenerateCustomSession} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Topic Input */}
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Enter Interview Topic / Domain Focus
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g. Distributed Caching, Kafka Streams, PostgreSQL Optimization..."
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-semibold focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {/* Number of Questions Selector */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Number of Questions
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value={1}>1 Scenario (Quick Sprint)</option>
                    <option value={2}>2 Scenarios</option>
                    <option value={3}>3 Scenarios (Standard Loop)</option>
                    <option value={5}>5 Scenarios (Full On-Site)</option>
                    <option value={8}>8 Scenarios (Deep Dive)</option>
                    <option value={10}>10 Scenarios (Mastery Marathon)</option>
                  </select>
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Popular:</span>
                {SUGGESTED_TOPICS.map((topic, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomTopic(topic)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      customTopic === topic
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-700'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200/60">
                <button
                  type="button"
                  onClick={() => setShowConfigBar(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isGeneratingCustom}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingCustom ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Synthesize {questionCount} Scenarios & Start</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <StepProgress
          steps={steps}
          currentStep={currentIndex}
          onStepClick={(idx) => {
            setCurrentIndex(idx);
            setAdaptiveFollowup(null);
            if (autoSpeak) {
              speakCurrentQuestion(questions[idx]);
            }
          }}
        />
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Question & Answer Scratchpad */}
        <div className="lg:col-span-7 space-y-6">
          <RealTimeInterviewQuestionCard
            question={currentQ}
            currentIndex={currentIndex + 1}
            totalQuestions={questions.length}
            onSpeak={(q) => speakCurrentQuestion(q, true)}
            isSpeaking={isSpeaking}
          />

          <VoiceRecorder
            onRecordingComplete={handleVoiceRecorded}
          />

          {/* AI Adaptive Follow-Up Probe Box */}
          {isGeneratingFollowup && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center gap-2.5 text-xs text-purple-800 animate-pulse">
              <Sparkles size={16} className="text-purple-600 animate-spin" />
              <span className="font-bold">Interviewer AI is analyzing your response for trade-offs & edge cases...</span>
            </div>
          )}

          {adaptiveFollowup && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50 to-rose-50 border border-purple-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-purple-900 text-xs font-black uppercase tracking-wider">
                <Zap size={15} className="text-purple-600" />
                <span>AI Adaptive Follow-Up Question</span>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                "{adaptiveFollowup.question}"
              </p>
              <div className="text-[11px] text-slate-600 bg-white/80 p-3 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-purple-800">💡 Why the AI is asking:</span>
                <p>{adaptiveFollowup.reason}</p>
              </div>
            </div>
          )}

          {/* Candidate Text Notes Scratchpad */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Scratchpad / High-Level Talking Points (Optional)
            </label>
            <textarea
              rows={4}
              value={candidateNotes}
              onChange={(e) => setCandidateNotes(e.target.value)}
              placeholder="Outline spoken points: 1) Clarify requirements & scale, 2) High-level component architecture, 3) Trade-offs & failure scenarios..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <ArrowLeft size={14} />
              <span>Previous Scenario</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish & Review' : 'Next Scenario'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Webcam Stream & AI Telemetry */}
        <div className="lg:col-span-5 space-y-6">
          <WebcamPreview className="w-full h-64 sm:h-72" />

          {/* Realtime Speech & Pacing Telemetry */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-rose-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Live Speech Telemetry
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Optimal Pace
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated WPM</span>
                <span className="text-xl font-black font-mono text-slate-900 block mt-0.5">{speechTelemetry.wpm} WPM</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Filler Words</span>
                <span className="text-xl font-black font-mono text-emerald-600 block mt-0.5">{speechTelemetry.fillerCount} detected</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed italic">
              "Maintain a steady speaking cadence (130–150 WPM) and articulate architectural trade-offs clearly using the STAR framework or System Design principles."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
