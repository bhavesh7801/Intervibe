import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, streamEvaluateAnswer } from '../api';

import QuestionCard from '../components/QuestionCard';
import VoiceRecorder from '../components/VoiceRecorder';
import FeedbackPanel from '../components/FeedbackPanel';
import WebcamPreview from '../components/WebcamPreview';
import SystemDesignCanvas from '../components/SystemDesignCanvas';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, SkipForward, Volume2, VolumeX } from 'lucide-react';

const InterviewSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Audio & Speech-to-Text Recording Hook
  const initialTextRef = useRef('');
  const {
    isRecording,
    isSupported,
    audioLevel,
    transcript,
    interimTranscript,
    errorMsg,
    startRecording,
    stopRecording,
    retrySpeechRecognition
  } = useAudioRecorder();

  // Real-time Streaming & Audio Transcription State
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [streamingTokens, setStreamingTokens] = useState('');
  const [streamError, setStreamError] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);



  const handleStartRecording = () => {
    initialTextRef.current = textAnswer.trim();
    startRecording();
  };

  // Sync real-time live speech recognition into text answer textarea as user speaks
  useEffect(() => {
    if (isRecording) {
      const combinedVoice = [transcript, interimTranscript].filter(Boolean).join(' ');
      if (combinedVoice) {
        const prefix = initialTextRef.current ? initialTextRef.current.trim() + ' ' : '';
        setTextAnswer(prefix + combinedVoice);
      }
    } else if (transcript) {
      const prefix = initialTextRef.current ? initialTextRef.current.trim() + ' ' : '';
      setTextAnswer((prefix + transcript).trim());
    }
  }, [transcript, interimTranscript, isRecording]);

  const fetchSession = async () => {
    try {
      const response = await api.getSession(sessionId);
      setSession(response.data);
      if (response.data.answers && response.data.answers.length > 0) {
        setCurrentQuestionIndex(response.data.answers.length);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      alert('Session not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    const finalAnswerText = textAnswer.trim() || transcript.trim();
    if (!finalAnswerText) return;

    const currentQuestion = session.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setSubmitting(true);
    setIsStreaming(true);
    setStreamingTokens('');
    setStreamError(null);

    // 1. Initiate progressive token streaming
    streamEvaluateAnswer(
      {
        question_text: currentQuestion.text,
        transcript: finalAnswerText,
        role: session.role || "Software Engineer",
        session_id: sessionId,
        persona: session.persona || "Standard"
      },
      (token) => {
        // Token received progressively
        setStreamingTokens((prev) => prev + token);
      },
      async (finalData) => {
        // Streaming complete — persist answer in DB
        try {
          const response = await api.submitAnswer(
            currentQuestion.id,
            currentQuestion.text,
            finalAnswerText,
            sessionId
          );
          // Combine DB result with stream text for formatted feedback card
          const mergedAnswer = {
            ...response.data,
            feedback: finalData.feedback || streamingTokens || response.data.feedback
          };
          setCurrentAnswer(mergedAnswer);
          setTextAnswer('');
        } catch (dbErr) {
          console.error("Failed to save answer to DB:", dbErr);
          // Fallback UI payload if DB write drops
          setCurrentAnswer({
            question_id: currentQuestion.id,
            transcript: finalAnswerText,
            ai_score: finalData.aiScore || 80,
            feedback: finalData.feedback || streamingTokens,
            strengths: finalData.strengths || ["Detailed answer provided"],
            improvements: finalData.improvements || ["Consider elaborating further"]
          });
        } finally {
          setIsStreaming(false);
          setSubmitting(false);
        }
      },
      (err) => {
        console.error("Streaming connection error:", err);
        setStreamError(err.message || "Network drop encountered. Attempting fallback evaluation...");
        setIsStreaming(false);

        // Fallback to standard synchronous submission endpoint
        api.submitAnswer(currentQuestion.id, currentQuestion.text, finalAnswerText, sessionId)
          .then((res) => {
            setCurrentAnswer(res.data);
            setTextAnswer('');
            setStreamError(null);
          })
          .catch((syncErr) => {
            console.error("Fallback submission failed:", syncErr);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    );
  };

  const handleNextQuestion = () => {
    setCurrentAnswer(null);
    setStreamingTokens('');
    setStreamError(null);
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate(`/results/${sessionId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060813] flex items-center justify-center px-4">
        <div className="text-base sm:text-xl font-medium text-slate-300">Loading interview session...</div>
      </div>
    );
  }

  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-[#060813] text-white p-6">
        <div className="text-center space-y-4 max-w-sm">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold">No Questions Found</h3>
          <p className="text-xs text-slate-400">This session has no active questions. Return to the dashboard to start a new interview.</p>
          <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition-all cursor-pointer">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentQuestionIndex >= session.questions.length) {
    navigate(`/results/${sessionId}`);
    return null;
  }

  const currentQuestion = session.questions[currentQuestionIndex] || {};

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#060813] py-4 sm:py-8 overflow-x-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation Bar: Back to Dashboard & Session Details */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#162035]">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer bg-[#080D1A] px-3.5 py-1.5 rounded-xl border border-[#162035]"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30 max-w-[160px] sm:max-w-none truncate">
              {session.role || 'Interview Session'}
            </span>
          </div>
        </div>

        {/* Network / Stream Error Banner */}
        {streamError && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{streamError}</span>
            </div>
            <button
              onClick={handleSubmitAnswer}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8 card-3d p-4 rounded-xl sm:rounded-2xl">
          <div className="flex justify-between items-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <span>Progress</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  ttsEnabled
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm shadow-blue-500/20'
                    : 'bg-[#080D1A] text-slate-400 border-[#162035]'
                }`}
                title="Toggle AI Spoken Voice"
              >
                {ttsEnabled ? <Volume2 size={13} className="text-blue-400 animate-pulse" /> : <VolumeX size={13} />}
                <span>{ttsEnabled ? 'AI Voice Active' : 'AI Voice Muted'}</span>
              </button>
              <span>Question {currentQuestionIndex + 1} of {session.questions.length}</span>
            </div>
          </div>
          <div className="w-full bg-[#080D1A] rounded-full h-2.5 overflow-hidden border border-[#162035]">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={session.questions.length}
          ttsEnabled={ttsEnabled}
        />

        {/* Live Token Streaming Progress Card */}
        {isStreaming && (
          <div className="card-3d rounded-2xl p-5 mt-6 bg-[#0C1222] border border-blue-500/30 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 mb-3">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                <span>AI Interviewer Stream Feedback (Live)</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Streaming Tokens...
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[60px] font-mono">
              {streamingTokens || <span className="text-slate-500 italic">Connecting stream to AI engine...</span>}
            </p>
          </div>
        )}

        {!currentAnswer ? (
          <>
            {(session?.role?.toLowerCase().includes('system design') || currentQuestion?.category?.toLowerCase().includes('system design')) && (
              <div className="my-6">
                <SystemDesignCanvas />
              </div>
            )}

            <WebcamPreview isRecording={isRecording} />

            <VoiceRecorder
              isRecording={isRecording}
              isSupported={isSupported}
              onStart={handleStartRecording}
              onStop={async () => {
                setIsTranscribing(true);
                const { audioBlob, transcript: voiceText } = await stopRecording();
                if (voiceText && voiceText.trim()) {
                  const prefix = initialTextRef.current ? initialTextRef.current.trim() + ' ' : '';
                  setTextAnswer((prefix + voiceText.trim()).trim());
                  setIsTranscribing(false);
                } else if (audioBlob) {
                  try {
                    const data = await api.transcribeAudio(audioBlob);
                    if (data && data.transcript && data.transcript.trim()) {
                      const prefix = initialTextRef.current ? initialTextRef.current.trim() + ' ' : '';
                      setTextAnswer((prefix + data.transcript.trim()).trim());
                    } else {
                      setTextAnswer((prev) => prev || "Audio answer recorded. Ready for AI evaluation.");
                    }
                  } catch (err) {
                    console.warn("Backend Whisper transcription error:", err);
                    setTextAnswer((prev) => prev || "Voice answer recorded. Ready for AI evaluation.");
                  } finally {
                    setIsTranscribing(false);
                  }
                } else {
                  setIsTranscribing(false);
                }
              }}
              onRetrySpeech={retrySpeechRecognition}
              transcript={transcript}
              interimTranscript={interimTranscript}
              audioLevel={audioLevel}
              errorMsg={errorMsg}
            />

            <div className="card-3d rounded-2xl p-4 sm:p-6 mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm sm:text-base font-bold text-[#E2E8F0]">Your Answer (Voice or Typed)</h3>
                {isRecording ? (
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 animate-pulse bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>Live Spoken Text Appearing Below...</span>
                  </span>
                ) : isTranscribing ? (
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    Transcribing with Groq Whisper AI...
                  </span>
                ) : null}
              </div>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder={
                  isRecording
                    ? "Listening live... Spoken words will appear here automatically in real-time as you speak."
                    : isTranscribing
                    ? "Transcribing your spoken audio with Whisper AI..."
                    : "Your spoken transcript will appear here automatically. You can also type or edit your answer..."
                }
                className="w-full px-4 py-3 bg-[#080D1A] border border-[#162035] rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 min-h-[120px] sm:min-h-[140px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={submitting}
                className="w-full sm:w-1/3 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-300 bg-[#0C1222] hover:bg-[#162035] border border-[#1A253F] hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                title="Skip this question and move to the next"
              >
                <SkipForward size={16} />
                <span>Skip Question</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={submitting || !textAnswer.trim()}
                className="w-full sm:flex-1 py-3.5 sm:py-4 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating your answer with AI Streaming...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer for AI Evaluation</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <FeedbackPanel answer={currentAnswer} onNext={handleNextQuestion} />
        )}
      </div>
    </div>
  );
};

export default InterviewSession;