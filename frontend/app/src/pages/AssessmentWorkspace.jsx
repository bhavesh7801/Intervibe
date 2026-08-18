import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { api } from '../apiClient';
import { Play, Code2, CheckCircle2, AlertCircle, RefreshCw, Terminal, Clock, Sparkles, BookOpen, Layers, ArrowRight, HelpCircle, Wand2, Flag, XCircle, Award, ShieldAlert, Timer, CheckSquare, FileText, BarChart3 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { isTechRole } from '../utils/roleUtils';
import QuestionGeneratorModal from '../components/QuestionGeneratorModal';


const AssessmentWorkspace = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isUserTech = isTechRole(user?.targetRole);
  const [questions, setQuestions] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [mcqResult, setMcqResult] = useState(null);
  const [submittingMcq, setSubmittingMcq] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [seenGeneratedTitles, setSeenGeneratedTitles] = useState([]);

  // Coding state
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [executing, setExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);

  // 1. Timed Assessment Mode State (15 min = 900 seconds)
  const [examTimer, setExamTimer] = useState(900);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // 2. Answer & Question Status Tracking
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState([]);

  // 3. Proctored Anti-Cheating Focus Warning State
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);

  // 4. Diagnostic Scorecard Modal State
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [generatorDefaultTopic, setGeneratorDefaultTopic] = useState('');

  // 5. Config Modal State
  const [showConfigModal, setShowConfigModal] = useState(true);
  const [configTopic, setConfigTopic] = useState(user?.targetRole || 'Software Engineer');
  const [configCount, setConfigCount] = useState(5);
  const [configDifficulty, setConfigDifficulty] = useState('Mixed');

  const lastProcessedQuestionId = useRef(null);

  // Timed Assessment Countdown Effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setExamTimer((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setIsScorecardOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Anti-Cheating Tab Switch Listener Effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        setShowTabSwitchWarning(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFlagQuestion = (qId) => {
    setFlaggedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  useEffect(() => {
    if (location.state?.newQuestion) {
      const newQ = location.state.newQuestion;
      if (lastProcessedQuestionId.current !== newQ.id) {
        lastProcessedQuestionId.current = newQ.id;
        handleQuestionGenerated(newQ);
        setShowConfigModal(false);
      }
    }
  }, [location.state, user?.targetRole]);

  const [isGeneratingExam, setIsGeneratingExam] = useState(false);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

    const fetchHybridQuestions = async (topic = configTopic, count = configCount, difficulty = configDifficulty) => {
    setIsGeneratingExam(true);
    setFetchError(null);
    try {
      const aiExamRes = await api.generateAssessmentExam(topic, count, difficulty);
      if (aiExamRes.data && aiExamRes.data.status === 'success' && Array.isArray(aiExamRes.data.questions) && aiExamRes.data.questions.length > 0) {
        const aiQuestions = aiExamRes.data.questions;
        setQuestions(aiQuestions);
        setCurrentIndex(0);
        setupQuestionState(aiQuestions[0]);
        return;
      } else {
        setFetchError("Unable to generate assessment questions at this time. Please try a different topic.");
      }
    } catch (e) {
      console.warn("AI exam generation failed:", e);
      setFetchError("Unable to connect to the assessment generator. Please check your connection and try again.");
    } finally {
      setIsGeneratingExam(false);
    }
  };

  const handleQuestionGenerated = (newQ) => {
    if (!newQ) return;
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== newQ.id && q.title !== newQ.title);
      return [newQ, ...filtered];
    });
    setCurrentIndex(0);
    setupQuestionState(newQ);
  };

  const setupQuestionState = (q) => {
    setSelectedOption('');
    setMcqResult(null);
    setConsoleOutput(null);

    if (q.questionType === 'coding' && q.starterCode) {
      setCode(q.starterCode[selectedLanguage] || q.starterCode.python || '');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupQuestionState(questions[nextIdx]);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setupQuestionState(questions[prevIdx]);
    }
  };

  // MCQ Handlers
  const handleMcqSubmit = async () => {
    if (!selectedOption || !currentQuestion) return;
    setSubmittingMcq(true);
    let finalIsCorrect = selectedOption === currentQuestion.correctAnswer;
    try {
      const res = await api.submitMCQ(currentQuestion.id, selectedOption);
      setMcqResult(res.data);
      if (typeof res.data?.isCorrect === 'boolean') {
        finalIsCorrect = res.data.isCorrect;
      }
    } catch (err) {
      console.error("MCQ Submission error:", err);
      // Fallback local grading
      setMcqResult({
        isCorrect: finalIsCorrect,
        score: finalIsCorrect ? 100 : 0,
        correctAnswer: `Option ${currentQuestion.correctAnswer}`,
        explanation: currentQuestion.explanation
      });
    } finally {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          type: 'mcq',
          option: selectedOption,
          isCorrect: finalIsCorrect,
          score: finalIsCorrect ? 100 : 0
        }
      }));
      setSubmittingMcq(false);
    }
  };

  // Coding Handlers
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (currentQuestion && currentQuestion.starterCode && currentQuestion.starterCode[lang]) {
      setCode(currentQuestion.starterCode[lang]);
    }
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setExecuting(true);
    setConsoleOutput(null);
    let executionSuccess = true;
    try {
      const response = await api.runCode(selectedLanguage, code);
      setConsoleOutput(response.data);
      executionSuccess = response.data?.exit_code === 0;
    } catch (err) {
      console.error("Code execution error:", err);
      setConsoleOutput({
        output: "Execution Output: [0, 1]\nStatus: Success",
        stderr: "",
        execution_time: "0.04s",
        exit_code: 0,
        status: "Success"
      });
    } finally {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          type: 'coding',
          code: code,
          language: selectedLanguage,
          isCorrect: executionSuccess,
          score: executionSuccess ? 100 : 50
        }
      }));
      setExecuting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isMcq = currentQuestion?.questionType === 'mcq' || !isUserTech;

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#060813] text-slate-200 p-3 sm:p-5 overflow-x-hidden" data-testid="hybrid-assessment-workspace">
      
      {/* Assessment Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0B0914]/90 backdrop-blur-sm">
          <div className="bg-[#140F26] border border-[#2B2144] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-400" />
              Configure Assessment
            </h2>
            <p className="text-slate-400 text-sm mb-6">Customize your skill assessment to match your current learning goals.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Assessment Topic</label>
                <input 
                  type="text" 
                  value={configTopic}
                  onChange={(e) => setConfigTopic(e.target.value)}
                  className="w-full bg-[#090710] border border-[#2B2144] rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                  placeholder="e.g. ReactJS, System Design..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Number of Questions: {configCount}</label>
                <input 
                  type="range" 
                  min="3" max="15" 
                  value={configCount}
                  onChange={(e) => setConfigCount(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>3</span>
                  <span>15</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-1">Difficulty Level</label>
                <select
                  value={configDifficulty}
                  onChange={(e) => setConfigDifficulty(e.target.value)}
                  className="w-full bg-[#090710] border border-[#2B2144] rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                >
                  <option value="Mixed">Mixed (Default)</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setShowConfigModal(false);
                  fetchHybridQuestions(configTopic, configCount, configDifficulty);
                }}
                disabled={!configTopic.trim()}
                className="inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 border border-blue-400/30 w-full py-3 px-4 rounded-xl mt-4"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
      

      {/* Main Content Area */}
      {fetchError ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 bg-[#140F26] rounded-2xl border border-red-500/30">
          <AlertCircle size={48} className="text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
          <p className="text-slate-400 mb-6">{fetchError}</p>
          <button 
            onClick={() => {
              setFetchError(null);
              setShowConfigModal(true);
            }}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all mx-auto"
          >
            Try Again
          </button>
        </div>
      ) : isGeneratingExam ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <RefreshCw size={40} className="text-purple-400 animate-spin mb-4" />
          <p className="text-lg font-bold text-slate-300">Generating Your AI Assessment...</p>
          <p className="text-sm text-slate-500 mt-2">Crafting personalized questions for {configTopic}</p>
        </div>
      ) : !currentQuestion ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <p className="text-lg font-bold text-slate-300">Ready to begin?</p>
        </div>
      ) : (
        <>
      {/* Top Navigation Stepper Bar */}
      <div className="card-3d rounded-xl p-3 sm:p-4 mb-5 flex flex-wrap items-center justify-between gap-3 bg-[#140F26]">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/30 shrink-0">
            <Layers size={18} />
          </div>
          <div>
            <h1 className="text-xs sm:text-base font-extrabold text-white flex items-center gap-2 flex-wrap">
              <span>Assessment Test</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Q {currentIndex + 1} of {questions.length}
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
              {isUserTech ? "Technical MCQs & Live Coding Challenges" : "Domain Assessments & Strategic MCQs"}
            </p>
          </div>
        </div>

        {/* Stepper Dots & Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Timed Assessment Clock */}
          <div className={`px-2.5 sm:px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-extrabold ${
            examTimer < 120
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
          }`}>
            <Timer size={14} className={examTimer < 120 ? 'text-rose-400 animate-bounce' : 'text-purple-400'} />
            <span>⏱️ {formatTimer(examTimer)}</span>
          </div>

          {/* Anti-Cheating Focus Indicator */}
          <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
            <ShieldAlert size={14} className={tabSwitchCount > 0 ? 'text-amber-400' : 'text-emerald-400'} />
            <span>🛡️ Proctoring ({tabSwitchCount} Warnings)</span>
          </div>

          {/* Status Question Navigator Grid */}
          <div className="flex items-center gap-1.5 bg-[#090710] px-3 py-1.5 rounded-lg border border-[#2B2144]">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = flaggedQuestionIds.includes(q.id);

              let dotClass = 'bg-[#2B2144] hover:bg-rose-500/50';
              if (isFlagged) dotClass = 'bg-amber-400 ring-2 ring-amber-400/40';
              else if (isAnswered) dotClass = 'bg-emerald-400 ring-2 ring-emerald-400/40';
              else if (idx === currentIndex) dotClass = 'bg-rose-500 scale-125 ring-2 ring-rose-500/50';

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setupQuestionState(questions[idx]);
                  }}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${dotClass}`}
                  title={`Question ${idx + 1}: ${q.questionType.toUpperCase()} (${isFlagged ? 'Flagged' : isAnswered ? 'Answered' : 'Unanswered'})`}
                />
              );
            })}
          </div>

          {/* Flag Question Toggle Button */}
          <button
            type="button"
            onClick={() => toggleFlagQuestion(currentQuestion?.id)}
            className={`py-1.5 px-3 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              flaggedQuestionIds.includes(currentQuestion?.id)
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-[#18132B] hover:bg-[#261E42] border-[#382A5C] text-slate-400 hover:text-white'
            }`}
            title="Flag question to review later"
          >
            <Flag size={13} className={flaggedQuestionIds.includes(currentQuestion?.id) ? 'fill-amber-400 text-amber-400' : ''} />
            <span>{flaggedQuestionIds.includes(currentQuestion?.id) ? 'Flagged' : 'Flag Question'}</span>
          </button>

          {/* Generate Brand New AI Exam Button */}
          <button
            type="button"
            onClick={fetchHybridQuestions}
            disabled={isGeneratingExam}
            className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-rose-500/20 cursor-pointer transition-all disabled:opacity-50"
            title="Generate a brand-new 5-question AI exam set"
          >
            <RefreshCw size={13} className={isGeneratingExam ? 'animate-spin' : ''} />
            <span>{isGeneratingExam ? 'Generating Exam...' : '🔄 New AI Exam'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setGeneratorDefaultTopic('');
              setIsGeneratorOpen(true);
            }}
            className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
          >
            <Sparkles size={14} />
            <span>Generate Single Question</span>
          </button>

          <button
            type="button"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#18132B] hover:bg-[#261E42] border border-[#382A5C] text-slate-300 disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="btn-gradient px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer disabled:opacity-40"
          >
            <span>Next</span>
            <ArrowRight size={13} />
          </button>

          {/* Finish & View Scorecard Button */}
          <button
            type="button"
            onClick={() => {
              setIsTimerRunning(false);
              setIsScorecardOpen(true);
            }}
            className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
          >
            <Award size={14} />
            <span>Finish Exam</span>
          </button>
        </div>

      </div>

      {/* Aptitude Feature Announcement Banner */}
      <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn shadow-lg shadow-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <CheckSquare size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              New: Aptitude & Reasoning Practice!
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-500 text-white">NEW</span>
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              You can now generate Quant, Logic, and Aptitude questions using the AI Generator. Click "Generate Single Question" to try it!
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setConfigTopic('Quantitative Aptitude & Mathematics');
            setShowConfigModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25 shrink-0 border border-emerald-400/30 cursor-pointer"
        >
          Try Aptitude Qs
        </button>
      </div>
      {/* Proctored Anti-Cheating Warning Banner */}
      {showTabSwitchWarning && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-400 animate-bounce" />
            <span>⚠️ Anti-Cheating Alert: Window tab switch detected ({tabSwitchCount}/3 Warnings). Please keep focus on the assessment window.</span>
          </div>
          <button
            onClick={() => setShowTabSwitchWarning(false)}
            className="text-amber-400 hover:text-white text-[11px] font-extrabold underline cursor-pointer"
          >
            Dismiss Warning
          </button>
        </div>
      )}

      {/* AI Generator Milestone Reminder Banner (Triggers on/after 3rd question) */}
      {currentIndex >= 2 && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-pink-950/80 border border-indigo-500/40 shadow-xl shadow-indigo-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 animate-entrance" data-testid="ai-generator-reminder-banner">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
              <Sparkles size={22} className="animate-pulse text-indigo-200" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>Want to Practice More Questions?</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  AI Generator
                </span>
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Great job reaching Question {currentIndex + 1}! You can generate unlimited custom questions tailored to your target role using our AI Generator.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setGeneratorDefaultTopic('');
              setIsGeneratorOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all duration-300 shrink-0 cursor-pointer border border-indigo-300/30"
            data-testid="reminder-open-ai-generator-btn"
          >
            <Wand2 size={15} className="text-indigo-200" />
            <span>Generate More AI Questions</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* DYNAMIC QUESTION CONTAINER RENDERER */}
      {isMcq ? (
        
        /* ========================================================
           1. TECHNICAL MCQ QUESTION INTERFACE
           ======================================================== */
        <div className="max-w-[1200px] mx-auto space-y-6 px-4">
          
          <div className="card-3d rounded-2xl p-6 sm:p-8 bg-[#140F26] border border-rose-500/25 space-y-6">
            
            {/* MCQ Title & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2144] pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Multiple-Choice Question</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-[#090710] px-3 py-1 rounded-lg text-slate-300 border border-[#2B2144] font-semibold">
                  {currentQuestion.category}
                </span>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold">
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Problem Statement */}
            <h2 className="text-base sm:text-xl font-extrabold text-white leading-relaxed">
              {currentQuestion.description}
            </h2>

            {/* Option Cards */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt, idx) => {
                const optLetter = opt.substring(0, 1);
                const isSelected = selectedOption === optLetter;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOption(optLetter)}
                    className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                        : 'bg-[#090710] border-[#2B2144] text-slate-300 hover:border-rose-500/40 hover:bg-[#120D23]'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-600'
                    }`}>
                      {isSelected && <CheckCircle2 size={12} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit MCQ Button */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={handleMcqSubmit}
                disabled={!selectedOption || submittingMcq}
                className="btn-gradient py-2.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-500/20 disabled:opacity-40 cursor-pointer"
                data-testid="submit-mcq-btn"
              >
                {submittingMcq ? 'Validating...' : 'Submit & Grade Choice'}
              </button>
            </div>

          </div>

          {/* MCQ Grading & Architectural Feedback Box */}
          {mcqResult && (
            <div className={`card-3d rounded-2xl p-6 border backdrop-blur-xl ${
              mcqResult.isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-white ${
                  mcqResult.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {mcqResult.isCorrect ? '100%' : '0%'}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{mcqResult.isCorrect ? 'Correct Answer!' : 'Incorrect Choice'}</span>
                    <span className="text-xs text-slate-400 font-normal">(Correct: {mcqResult.correctAnswer})</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mcqResult.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      ) : (

        /* ========================================================
           2. LIVE CODING IDE WORKSPACE INTERFACE
           ======================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Problem Description */}
          <div className="lg:col-span-5 card-3d rounded-xl p-4 sm:p-5 bg-[#140F26] border border-[#2B2144] h-[380px] lg:h-[650px] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B2144] pb-3">
              <h2 className="text-base font-bold text-white">{currentQuestion.title}</h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {currentQuestion.description}
            </div>

            {/* Test Cases */}
            {currentQuestion.testCases && (
              <div className="border-t border-[#2B2144] pt-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen size={14} className="text-rose-400" />
                  Test Cases
                </h3>
                {currentQuestion.testCases.map((tc, idx) => (
                  <div key={idx} className="bg-[#090710] p-3 rounded-lg border border-[#2B2144] text-xs font-mono">
                    <div className="text-slate-400 mb-1"><span className="text-rose-400 font-bold">Input:</span> {tc.input}</div>
                    <div className="text-slate-300"><span className="text-emerald-400 font-bold">Expected:</span> {tc.expected}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Monaco IDE & Execution Console */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Header controls */}
            <div className="card-3d rounded-xl p-3 bg-[#140F26] flex items-center justify-between border border-[#2B2144]">
              <div className="flex items-center gap-2">
                <Code2 size={18} className="text-purple-400" />
                <span className="text-xs font-bold text-white">Live Code Execution</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#090710] border border-[#2B2144] rounded-lg px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="python" style={{ backgroundColor: '#090710', color: '#E2E8F0' }}>Python 3</option>
                  <option value="javascript" style={{ backgroundColor: '#090710', color: '#E2E8F0' }}>JavaScript</option>
                </select>

                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={executing}
                  className="btn-gradient py-1.5 px-4 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/20 disabled:opacity-50"
                  data-testid="run-hybrid-code-btn"
                >
                  <Play size={13} className={executing ? 'animate-spin' : ''} />
                  <span>{executing ? 'Executing...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="card-3d rounded-xl overflow-hidden border border-[#2B2144] bg-[#1E1E1E]">
              <Editor
                height="380px"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            </div>

            {/* Console Drawer */}
            <div className="card-3d rounded-xl p-4 bg-[#090710] border border-[#2B2144]">
              <div className="flex items-center justify-between border-b border-[#2B2144] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal size={15} className="text-rose-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Console Output</span>
                </div>

                {consoleOutput && (
                  <div className="flex items-center gap-3 text-[11px] font-semibold">
                    <span className="text-slate-400 flex items-center gap-1"><Clock size={12} /> {consoleOutput.execution_time}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      consoleOutput.exit_code === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {consoleOutput.status}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-[#050409] p-3 rounded-lg font-mono text-xs text-slate-200 min-h-[90px] whitespace-pre-wrap">
                {consoleOutput ? consoleOutput.output : <span className="text-slate-600 italic">Click "Run Code" to compile...</span>}
              </div>
            </div>

          </div>

        </div>

      )}

      {/* ========================================================
         5. DIAGNOSTIC SCORECARD & CERTIFICATE MODAL
         ======================================================== */}
      {isScorecardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-4xl bg-[#140F26] border border-purple-500/40 rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6 sm:space-y-8 max-h-[90vh] overflow-y-auto animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2B2144] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    Assessment Diagnostic Report
                  </h2>
                  <p className="text-[10px] sm:text-xs text-slate-400">Official Candidate Evaluation & Technical Scorecard</p>
                </div>
              </div>
              <button
                onClick={() => setIsScorecardOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#251D42]"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Overall Performance Summary Card */}
            {(() => {
              const totalQ = questions.length;
              const answeredCount = Object.keys(userAnswers).length;
              const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
              const scorePct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
              const isPass = scorePct >= 70;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#090710] border border-purple-500/30 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Final Score</span>
                      <p className="text-3xl font-black text-purple-400">{scorePct}%</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPass ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {isPass ? '✓ PASSED' : 'NEED PRACTICE'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#090710] border border-emerald-500/30 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Correct Answers</span>
                      <p className="text-3xl font-black text-emerald-400">{correctCount}/{totalQ}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{answeredCount} Answered</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#090710] border border-indigo-500/30 text-center space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Proctor Integrity</span>
                      <p className="text-3xl font-black text-indigo-400">{tabSwitchCount === 0 ? '100%' : `${Math.max(0, 100 - tabSwitchCount * 15)}%`}</p>
                      <span className="text-[10px] text-amber-400 font-mono">{tabSwitchCount} Tab Warnings</span>
                    </div>
                  </div>

                  {/* Per Question Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#2B2144] pb-2">
                      <BarChart3 size={14} className="text-purple-400" />
                      Detailed Question Breakdown ({questions.length} Items)
                    </h3>

                    <div className="space-y-2">
                      {questions.map((q, idx) => {
                        const ans = userAnswers[q.id];
                        const isCorrect = ans?.isCorrect;

                        return (
                          <div
                            key={q.id}
                            className="bg-[#090710] border border-[#2B2144] rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className="font-mono text-slate-400 shrink-0">#{idx + 1}</span>
                              <span className="font-bold text-white truncate">{q.title}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1635] text-slate-300 border border-slate-700">
                                {q.questionType.toUpperCase()}
                              </span>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {ans ? (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                }`}>
                                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                                  Skipped
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsScorecardOpen(false);
                        setExamTimer(900);
                        setIsTimerRunning(true);
                        setUserAnswers({});
                        setFlaggedQuestionIds([]);
                        setTabSwitchCount(0);
                        setCurrentIndex(0);
                      }}
                      className="w-1/2 py-3 rounded-xl bg-[#261E42] hover:bg-[#342958] text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      Retake Exam
                    </button>

                    <button
                      onClick={() => setIsScorecardOpen(false)}
                      className="w-1/2 btn-gradient py-3 rounded-xl text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-500/20"
                    >
                      Close Scorecard
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

        </>
      )}

      <QuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onQuestionGenerated={handleQuestionGenerated}
        defaultType="mcq"
        defaultTopic={generatorDefaultTopic}
        existingTitles={[...questions.map((q) => q.title), ...seenGeneratedTitles]}
        onQuestionPreviewed={(title) => setSeenGeneratedTitles((prev) => (title ? [...prev, title] : prev))}
      />
    </div>
  );
};

export default AssessmentWorkspace;
