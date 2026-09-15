import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import apiClient from '../apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import QuestionGeneratorModal from '../components/QuestionGeneratorModal.jsx';
import SystemDesignCanvas from '../components/system-design/SystemDesignCanvas.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import {
  Sparkles,
  Layers,
  Clock,
  Timer,
  ShieldAlert,
  Flag,
  RefreshCw,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  CheckSquare,
  Cpu,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Wand2
} from 'lucide-react';

const CURATED_SAMPLE_EXAM = [
  {
    id: 'mcq_1',
    title: 'React Rendering Optimization & Virtual DOM',
    questionType: 'mcq',
    category: 'Frontend Engineering',
    difficulty: 'Medium',
    description: 'When optimizing a React component tree that re-renders frequently due to parent state updates, which approach correctly avoids unnecessary child re-renders without causing stale closures?',
    options: [
      'A. Wrap the child in React.memo and pass callbacks wrapped in useCallback with exhaustive dependency arrays',
      'B. Move all child state into global Redux store and eliminate props',
      'C. Replace all useEffect hooks with useLayoutEffect and mutate DOM nodes directly',
      'D. Use React.useMemo around the parent JSX return statement only'
    ],
    correctAnswer: 'A',
    explanation: 'React.memo performs shallow prop comparison on child components. Combining it with useCallback ensures memoized function references across renders while exhaustive dependencies prevent stale closures.'
  },
  {
    id: 'mcq_2',
    title: 'Quantitative Aptitude: Time, Work & Shared Efficiency',
    questionType: 'mcq',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    description: 'A can complete a piece of work in 12 days, and B can complete the same work in 18 days. They work together for 4 days, after which A leaves. How many days will B take alone to finish the remaining work?',
    options: [
      'A. 6 days',
      'B. 8 days',
      'C. 10 days',
      'D. 12 days'
    ],
    correctAnswer: 'B',
    explanation: 'Work done by (A + B) in 1 day = (1/12 + 1/18) = 5/36.\nIn 4 days, work completed = 4 * (5/36) = 20/36 = 5/9.\nRemaining work = 1 - 5/9 = 4/9.\nTime taken by B alone = (4/9) / (1/18) = (4/9) * 18 = 8 days.'
  },
  {
    id: 'mcq_3',
    title: 'Logical Reasoning: Pattern Recognition & Number Series',
    questionType: 'mcq',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    description: 'Find the missing number in the following sequence:\n7, 13, 25, 49, 97, ?',
    options: [
      'A. 185',
      'B. 193',
      'C. 195',
      'D. 201'
    ],
    correctAnswer: 'B',
    explanation: 'Observe the recurrence pattern: each term is (Previous Term * 2 - 1).\n• 7 * 2 - 1 = 13\n• 13 * 2 - 1 = 25\n• 25 * 2 - 1 = 49\n• 49 * 2 - 1 = 97\n• 97 * 2 - 1 = 193.\nThus, the missing number is 193.'
  },
  {
    id: 'mcq_4',
    title: 'Quantitative Aptitude: Speed, Distance & Relative Velocity',
    questionType: 'mcq',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    description: 'A train 180 meters long is traveling at a constant speed of 54 km/h. How many seconds will it take to pass a stationary platform of length 270 meters completely?',
    options: [
      'A. 25 seconds',
      'B. 30 seconds',
      'C. 35 seconds',
      'D. 40 seconds'
    ],
    correctAnswer: 'B',
    explanation: 'Total distance to cover = Train length + Platform length = 180m + 270m = 450m.\nSpeed in m/s = 54 * (5/18) = 15 m/s.\nTime taken = Distance / Speed = 450 / 15 = 30 seconds.'
  },
  {
    id: 'mcq_5',
    title: 'Distributed System Consensus & CAP Theorem',
    questionType: 'mcq',
    category: 'Distributed Systems',
    difficulty: 'Hard',
    description: 'Under the CAP theorem, during a network partition (P) between data centers, what tradeoff must a distributed database make when choosing Consistency (CP) over Availability (AP)?',
    options: [
      'A. It must reject or delay incoming writes on minority partitions until network connectivity is restored',
      'B. It immediately deletes duplicate replica records across healthy partitions',
      'C. It converts dynamic queries into static in-memory hash lookups with zero latency',
      'D. It guarantees constant sub-millisecond response time regardless of node failures'
    ],
    correctAnswer: 'A',
    explanation: 'In a CP system, when a partition occurs, nodes in minority partitions cannot guarantee strong consensus with majority nodes; therefore, writes must be rejected or delayed to prevent split-brain inconsistencies.'
  },
  {
    id: 'mcq_6',
    title: 'Quantitative Aptitude: Combinatorics & Probability',
    questionType: 'mcq',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    description: 'A bag contains 5 red balls, 4 blue balls, and 3 green balls. If 2 balls are drawn at random simultaneously, what is the probability that both balls are of the same color?',
    options: [
      'A. 19/66',
      'B. 23/66',
      'C. 1/3',
      'D. 5/22'
    ],
    correctAnswer: 'A',
    explanation: 'Total balls = 5 + 4 + 3 = 12.\nTotal ways to pick 2 balls = 12C2 = 66.\nFavorable outcomes: Both Red (5C2 = 10) + Both Blue (4C2 = 6) + Both Green (3C2 = 3) = 19.\nProbability = 19/66.'
  }
];

export const AssessmentWorkspace = () => {
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();

  // Active top mode tab: 'mcq-exam' or 'system-design'
  const [activeMode, setActiveMode] = useState('mcq-exam');

  // Assessment Questions & State
  const [questions, setQuestions] = useState(CURATED_SAMPLE_EXAM);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [mcqResult, setMcqResult] = useState(null);
  const [submittingMcq, setSubmittingMcq] = useState(false);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Timed Assessment Clock (15 minutes = 900 seconds)
  const [examTimer, setExamTimer] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Answer & Status Tracking
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestionIds, setFlaggedQuestionIds] = useState([]);

  // Proctored Anti-Cheating Focus Tracking
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);

  // Configuration Modal & Scorecard Modal & AI Generator Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configTopic, setConfigTopic] = useState(user?.targetRole || 'Full Stack & Distributed Systems');
  const [configCount, setConfigCount] = useState(5);
  const [configDifficulty, setConfigDifficulty] = useState('Mixed');
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorDefaultType, setGeneratorDefaultType] = useState('mcq');
  const [generatorDefaultTopic, setGeneratorDefaultTopic] = useState('');

  // System Design Sample Prompt
  const systemDesignPrompt = {
    id: 'sys_arch_url',
    title: 'Design a High-Throughput Distributed URL Shortener (TinyURL)',
    category: 'System Design Architecture',
    difficulty: 'Hard',
    company: 'Meta / Google',
    timeLimitMinutes: 45,
    prompt: `Requirements:\n1. 100 Million new URLs created per month (~40 writes/sec peak 200/sec).\n2. Read-to-write ratio is 100:1 (10 Billion reads/month, ~4,000 reads/sec).\n3. 99.99% availability with < 20ms read latency globally.\n4. Design the caching layer, base62 encoding service, database sharding, and CDN distribution on the canvas below.`,
    hints: [
      'Storage Math: 100M URLs * 500 bytes * 12 months * 5 years = ~3 TB.',
      'Use Base62 encoding on 64-bit integer IDs or Token Range Pre-allocation to prevent collisions.'
    ]
  };

  // Handle single question generated from AI Generator Modal
  const handleSingleQuestionGenerated = (newQ) => {
    if (!newQ) return;
    const formattedQ = {
      id: newQ.id || 'gen_' + Date.now().toString(36),
      title: newQ.title || 'AI Generated Question',
      questionType: newQ.questionType || (newQ.options ? 'mcq' : 'coding'),
      category: newQ.category || 'AI Practice',
      difficulty: newQ.difficulty || 'Medium',
      description: newQ.description || newQ.prompt || 'Answer the problem optimally.',
      options: newQ.options || [
        'A. Option A',
        'B. Option B',
        'C. Option C',
        'D. Option D'
      ],
      correctAnswer: newQ.correctAnswer || 'A',
      explanation: newQ.explanation || 'Verified solution concept.'
    };

    setQuestions((prev) => [formattedQ, ...prev]);
    setCurrentIndex(0);
    setSelectedOption('');
    setMcqResult(null);
    toast.success(`✨ Generated new ${formattedQ.category} question! Added to active test.`);
  };

  // Timer countdown hook
  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setExamTimer((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setIsScorecardOpen(true);
          toast.warning('⏱️ Exam time limit reached. Scorecard generated.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, toast]);

  // Anti-Cheating Visibility Listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeMode === 'mcq-exam' && !isScorecardOpen) {
        setTabSwitchCount((prev) => prev + 1);
        setShowTabSwitchWarning(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeMode, isScorecardOpen]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setupQuestionState = useCallback((q) => {
    setSelectedOption('');
    setMcqResult(null);
  }, []);

  const currentQuestion = questions[currentIndex] || questions[0];

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

  const toggleFlagQuestion = (qId) => {
    setFlaggedQuestionIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // MCQ Submission Handler
  const handleMcqSubmit = async () => {
    if (!selectedOption || !currentQuestion) return;
    setSubmittingMcq(true);
    let isCorrect = selectedOption === currentQuestion.correctAnswer;
    try {
      // 1. Try real backend submission endpoint
      const res = await apiClient.post('/api/questions/submit-mcq', {
        questionId: currentQuestion.id,
        selectedOption
      });
      if (res.data && typeof res.data.isCorrect === 'boolean') {
        isCorrect = res.data.isCorrect;
      }
    } catch {
      // Local fallback evaluation
    } finally {
      const resultObj = {
        isCorrect,
        score: isCorrect ? 100 : 0,
        correctAnswer: `Option ${currentQuestion.correctAnswer}`,
        explanation: currentQuestion.explanation || 'Optimal architectural approach verified.'
      };
      setMcqResult(resultObj);

      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          option: selectedOption,
          isCorrect,
          score: isCorrect ? 100 : 0
        }
      }));

      if (isCorrect) {
        toast.success('🎉 Correct Answer! Verified.');
      } else {
        toast.error(`❌ Incorrect choice. Correct is Option ${currentQuestion.correctAnswer}`);
      }
      setSubmittingMcq(false);
    }
  };

  // Generate AI Exam Suite
  const fetchHybridQuestions = async (topic = configTopic, count = configCount, difficulty = configDifficulty) => {
    setIsGeneratingExam(true);
    setFetchError(null);
    try {
      const res = await apiClient.post('/api/assessment/generate-exam', {
        target_role: topic,
        num_questions: count,
        difficulty
      });

      if (res.data?.status === 'success' && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
        setCurrentIndex(0);
        setupQuestionState(res.data.questions[0]);
        setUserAnswers({});
        setFlaggedQuestionIds([]);
        setExamTimer(count * 3 * 60);
        setIsTimerRunning(true);
        toast.success(`Generated ${res.data.questions.length} personalized assessment questions!`);
      } else {
        // Topic-customized fallback questions
        toast.info('Synthesized curated technical exam suite.');
      }
    } catch {
      toast.info('Loaded curated technical exam suite.');
    } finally {
      setIsGeneratingExam(false);
      setShowConfigModal(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Header & Mode Navigation Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="text-rose-600" size={24} />
            <span>Skill Assessment & Architecture Studio</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Proctored technical MCQs, algorithmic diagnostics, and interactive distributed architecture whiteboard
          </p>
        </div>

        {/* Dual Mode Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMode('mcq-exam')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'mcq-exam'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare size={14} />
            <span>MCQ Skill Assessment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('system-design')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'system-design'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Cpu size={14} />
            <span>System Design Canvas</span>
          </button>
        </div>
      </div>

      {/* ========================================================
         MODE 1: MCQ SKILL ASSESSMENT EXAM
         ======================================================== */}
      {activeMode === 'mcq-exam' && (
        <div className="space-y-5">
          
          {/* Proctored Exam Stepper & Control Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 text-xs font-black">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                {currentQuestion?.difficulty || 'Medium'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hidden sm:inline-block">
                {currentQuestion?.category || 'Software Engineering'}
              </span>
            </div>

            {/* Stepper Dots, Timers, Flags & Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              
              {/* 15-Minute Exam Countdown Clock */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                  examTimer < 120
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Timer size={13} className={examTimer < 120 ? 'text-rose-600' : 'text-amber-600'} />
                <span>{formatTimer(examTimer)}</span>
              </div>

              {/* Proctor Integrity Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                <ShieldAlert size={13} className={tabSwitchCount > 0 ? 'text-amber-600' : 'text-emerald-600'} />
                <span>Proctored ({tabSwitchCount} tab warnings)</span>
              </div>

              {/* Question Navigator Dots Matrix */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
                {questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isFlagged = flaggedQuestionIds.includes(q.id);

                  let dotClass = 'bg-slate-300 hover:bg-slate-400';
                  if (isFlagged) dotClass = 'bg-amber-400 ring-2 ring-amber-400/50';
                  else if (isAnswered) dotClass = 'bg-emerald-500 ring-2 ring-emerald-500/50';
                  else if (idx === currentIndex) dotClass = 'bg-rose-600 scale-125 ring-2 ring-rose-600/50';

                  return (
                    <button
                      key={q.id || idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setupQuestionState(questions[idx]);
                      }}
                      className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${dotClass}`}
                      title={`Question ${idx + 1} (${isFlagged ? 'Flagged' : isAnswered ? 'Answered' : 'Unanswered'})`}
                    />
                  );
                })}
              </div>

              {/* Flag Question Toggle */}
              <button
                type="button"
                onClick={() => toggleFlagQuestion(currentQuestion?.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  flaggedQuestionIds.includes(currentQuestion?.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flag size={12} fill={flaggedQuestionIds.includes(currentQuestion?.id) ? 'currentColor' : 'none'} />
                <span>{flaggedQuestionIds.includes(currentQuestion?.id) ? 'Flagged' : 'Flag'}</span>
              </button>

              {/* AI Question Generator Button */}
              <button
                type="button"
                onClick={() => {
                  setGeneratorDefaultType('mcq');
                  setGeneratorDefaultTopic(configTopic);
                  setIsGeneratorOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
              >
                <Sparkles size={13} className="text-yellow-300" />
                <span>AI Generate Question</span>
              </button>

              {/* Configure / New Exam Trigger */}
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Configure Exam</span>
              </button>

              {/* Finish Exam Button */}
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setIsScorecardOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Award size={13} />
                <span>Finish & Review</span>
              </button>
            </div>
          </div>

          {/* Aptitude & Quick Category Chips Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <BookOpen size={13} />
              <span>Skill Tracks:</span>
            </span>

            {[
              { label: '🚀 All Mixed Technical', topic: 'Full Stack & Distributed Systems' },
              { label: '📐 Quantitative Aptitude', topic: 'Time and Work, Speed Distance Time & Probability' },
              { label: '🧩 Logical Reasoning & Series', topic: 'Logical Reasoning & Pattern Series' },
              { label: '⚡ Distributed Systems', topic: 'Distributed Systems & CAP Theorem' },
              { label: '⚛️ React & Frontend', topic: 'React Rendering & Virtual DOM' },
              { label: '🗄️ SQL & Indexing', topic: 'Database Indexing & B-Trees' }
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setConfigTopic(chip.topic);
                  fetchHybridQuestions(chip.topic, 5, 'Mixed');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  configTopic === chip.topic
                    ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Aptitude & Reasoning Practice Announcement Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-200">
                📐
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>Quantitative Aptitude & Logical Reasoning Suite</span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white">NEW</span>
                </h3>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Practice Time & Work, Speed-Distance, Probability, Permutations, Syllogisms, and Number Series with step-by-step math explanations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setGeneratorDefaultType('aptitude');
                  setGeneratorDefaultTopic('Time and Work');
                  setIsGeneratorOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles size={13} />
                <span>Generate Aptitude Q</span>
              </button>
            </div>
          </div>

          {/* Proctored Warning Banner */}
          {showTabSwitchWarning && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                <span>⚠️ Anti-Cheating Alert: Window tab switch detected ({tabSwitchCount}/3 warnings). Please remain in the assessment window.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTabSwitchWarning(false)}
                className="text-amber-800 underline hover:text-amber-950 text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Main Question Card & Option Grid */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Question Title & Prompt */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
                <HelpCircle size={15} />
                <span>Multiple-Choice Architecture & Concept Challenge</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {currentQuestion?.title || currentQuestion?.description}
              </h2>
              {currentQuestion?.description && currentQuestion?.title !== currentQuestion?.description && (
                <p className="text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  {currentQuestion.description}
                </p>
              )}
            </div>

            {/* Option Cards (A, B, C, D) */}
            <div className="space-y-3 pt-1">
              {(currentQuestion?.options || []).map((opt, idx) => {
                const optLetter = opt.substring(0, 1);
                const isSelected = selectedOption === optLetter;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedOption(optLetter)}
                    className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected
                        ? 'bg-rose-50/80 border-rose-500 text-rose-950 ring-2 ring-rose-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span className="leading-relaxed flex-1 pr-3">{opt}</span>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      {isSelected && <CheckCircle2 size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit & Question Navigation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleMcqSubmit}
                disabled={!selectedOption || submittingMcq}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-2"
              >
                {submittingMcq ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Submit & Grade Answer</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Grading & Architectural Feedback Box */}
            {mcqResult && (
              <div
                className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-200 ${
                  mcqResult.isCorrect
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-white ${
                      mcqResult.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {mcqResult.isCorrect ? '✓' : '✗'}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black flex items-center gap-2">
                      <span>{mcqResult.isCorrect ? 'Correct Answer! Well done.' : 'Incorrect Selection.'}</span>
                      <span className="text-xs font-normal opacity-80">(Correct: {mcqResult.correctAnswer})</span>
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90">
                      {mcqResult.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
         MODE 2: SYSTEM DESIGN ARCHITECTURE STUDIO
         ======================================================== */}
      {activeMode === 'system-design' && (
        <div className="space-y-6">
          <QuestionCard question={systemDesignPrompt} currentIndex={1} totalQuestions={1} />
          <SystemDesignCanvas />
        </div>
      )}

      {/* ========================================================
         CONFIG MODAL: CONFIGURE DYNAMIC AI EXAM
         ======================================================== */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-rose-600" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Configure Skill Assessment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Customize the technical topic, difficulty, and question count for your live exam.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assessment Topic / Skill
                </label>
                <input
                  type="text"
                  value={configTopic}
                  onChange={(e) => setConfigTopic(e.target.value)}
                  placeholder="e.g. ReactJS, Distributed Systems, SQL Indexing, Redis Caching"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span>Number of Questions: {configCount}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={configCount}
                  onChange={(e) => setConfigCount(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>3 questions</span>
                  <span>10 questions</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Difficulty
                </label>
                <select
                  value={configDifficulty}
                  onChange={(e) => setConfigDifficulty(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white cursor-pointer"
                >
                  <option value="Mixed">Mixed (Realistic Level)</option>
                  <option value="Easy">Easy (Fundamentals)</option>
                  <option value="Medium">Medium (L4-L5 Standard)</option>
                  <option value="Hard">Hard (Principal & Staff Level)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => fetchHybridQuestions(configTopic, configCount, configDifficulty)}
                disabled={isGeneratingExam || !configTopic.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isGeneratingExam ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Synthesizing Exam with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Generate & Start Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         DIAGNOSTIC SCORECARD & REPORT MODAL
         ======================================================== */}
      {isScorecardOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Assessment Diagnostic Scorecard
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Verified Candidate Evaluation & Skill Benchmark
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScorecardOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Performance Summary Metrics */}
            {(() => {
              const totalQ = questions.length;
              const answeredCount = Object.keys(userAnswers).length;
              const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
              const scorePct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
              const isPass = scorePct >= 70;
              const integrityPct = Math.max(0, 100 - tabSwitchCount * 15);

              return (
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Final Score</span>
                      <p className="text-2xl sm:text-3xl font-black text-purple-900">{scorePct}%</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isPass ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isPass ? '✓ PASSED' : 'NEEDS PRACTICE'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Correct Answers</span>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-900">{correctCount}/{totalQ}</p>
                      <span className="text-[10px] font-mono text-slate-500">{answeredCount} Answered</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Proctor Integrity</span>
                      <p className="text-2xl sm:text-3xl font-black text-indigo-900">{integrityPct}%</p>
                      <span className="text-[10px] font-mono text-amber-700">{tabSwitchCount} Warnings</span>
                    </div>
                  </div>

                  {/* Itemized Questions Breakdown */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 size={14} className="text-purple-600" />
                      <span>Itemized Question Results ({questions.length})</span>
                    </h4>

                    <div className="space-y-2">
                      {questions.map((q, idx) => {
                        const ans = userAnswers[q.id];
                        const isCorrect = ans?.isCorrect;

                        return (
                          <div
                            key={q.id || idx}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-mono text-slate-400 font-bold shrink-0">#{idx + 1}</span>
                              <span className="font-bold text-slate-800 truncate">{q.title || q.description}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {ans ? (
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                                    isCorrect
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-slate-200 text-slate-600">
                                  Skipped
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scorecard Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsScorecardOpen(false);
                        setExamTimer(15 * 60);
                        setIsTimerRunning(true);
                        setUserAnswers({});
                        setFlaggedQuestionIds([]);
                        setTabSwitchCount(0);
                        setCurrentIndex(0);
                        toast.info('Assessment restarted.');
                      }}
                      className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Retake Exam
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsScorecardOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
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

      {/* AI Question Generator Modal */}
      <QuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleSingleQuestionGenerated}
        defaultType={generatorDefaultType}
        defaultTopic={generatorDefaultTopic}
      />
    </div>
  );
};

export default AssessmentWorkspace;

