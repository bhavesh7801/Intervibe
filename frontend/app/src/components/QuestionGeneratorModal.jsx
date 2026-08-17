import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, X, CheckCircle2, Loader2, Code2, HelpCircle, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { isTechRole } from '../utils/roleUtils';

const DSA_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack & Queue',
  'Linked List',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Strings',
  'Backtracking',
  'Greedy'
];

// How many times to silently re-request generation if the AI hands back a
// title that's already been seen, before giving up and showing it anyway
// with a warning.
const MAX_DEDUPE_ATTEMPTS = 3;

// Titles like "1. Two Sum" and "Two Sum" should count as the same question —
// strip leading numbering and normalize case/whitespace before comparing.
const normalizeTitle = (title) =>
  (title || '').trim().toLowerCase().replace(/^\d+[.)]\s*/, '');

const isDuplicateTitle = (title, avoidList) => {
  if (!title) return false;
  const normalized = normalizeTitle(title);
  return avoidList.some((t) => normalizeTitle(t) === normalized);
};

const QuestionGeneratorModal = ({
  isOpen,
  onClose,
  onQuestionGenerated,
  defaultType = 'coding',
  defaultTopic = '',
  existingTitles = [],
  onQuestionPreviewed,
  resumeContext = null,
}) => {
  const { user } = useAuth();
  const isUserTech = isTechRole(user?.targetRole);

  const initialType = !isUserTech ? 'mcq' : defaultType;
  const initialTopic = !isUserTech
    ? (user?.targetRole ? `${user.targetRole} Core Concepts` : 'General Management & Strategy')
    : 'Arrays & Hashing';

  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [topic, setTopic] = useState(defaultTopic || initialTopic);
  const [dsaTopic, setDsaTopic] = useState('Arrays & Hashing');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState(initialType);
  const [language, setLanguage] = useState('python');
  const [targetCompany, setTargetCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isPossibleRepeat, setIsPossibleRepeat] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setError(null);
      setLoading(false);
      setIsPossibleRepeat(false);
      
      const freshTopic = DSA_TOPICS[Math.floor(Math.random() * DSA_TOPICS.length)];
      setDsaTopic(freshTopic);

      if (defaultTopic) {
        setQuestionType('mcq');
        setTopic(defaultTopic);
      } else if (!isUserTech) {
        setQuestionType('mcq');
        setTopic(user?.targetRole ? `${user.targetRole} Core Concepts` : 'General Management & Strategy');
      } else {
        setQuestionType(defaultType);
        setTopic(defaultType === 'coding' ? freshTopic : initialTopic);
      }
    }
  }, [user?.targetRole, isUserTech, defaultType, defaultTopic, isOpen]);

  const handleRandomTopic = () => {
    const randomTopic = DSA_TOPICS[Math.floor(Math.random() * DSA_TOPICS.length)];
    setDsaTopic(randomTopic);
    setTopic(randomTopic);
  };

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    const targetTopic = questionType === 'coding' ? dsaTopic : topic;
    if (!targetTopic.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setIsPossibleRepeat(false);

    const activeQuestionType = !isUserTech ? 'mcq' : questionType;
    const combinedExcluded = [...new Set([...(existingTitles || []), ...generatedTitles])];

    try {
      const payload = {
        type: activeQuestionType === 'coding' ? 'dsa' : 'mcq',
        question_type: activeQuestionType,
        topic: targetTopic.trim(),
        difficulty,
        language: activeQuestionType === 'coding' ? language : undefined,
        target_company: targetCompany.trim() || undefined,
        exclude_titles: combinedExcluded,
        resume_text: resumeContext || undefined
      };

      // Same topic + difficulty tends to produce the same handful of common
      // problems (Two Sum keeps coming back for "Arrays & Hashing", for
      // example). Retry a few times if what comes back matches something
      // already seen — including questions the user generated earlier and
      // rejected without adding — before giving up and showing it anyway.
      let data = null;
      let title = null;
      let attempts = 0;

      while (attempts < MAX_DEDUPE_ATTEMPTS) {
        const res = await api.generateQuestion(payload);
        if (!res.data) throw new Error("No data returned from AI Generator");
        data = res.data;
        title = data.coding?.title || data.mcq?.title;
        attempts++;
        if (!isDuplicateTitle(title, combinedExcluded)) break;
      }

      setResult(data);

      if (title) {
        setGeneratedTitles((prev) => (prev.includes(title) ? prev : [...prev, title]));
        onQuestionPreviewed?.(title);
      }

      if (title && isDuplicateTitle(title, combinedExcluded)) {
        setIsPossibleRepeat(true);
      }
    } catch (err) {
      console.error("Failed to generate question:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to generate question using AI.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!result) return;

    let formatted = null;
    const genId = `ai-${Date.now()}`;
    const activeCategory = questionType === 'coding' ? dsaTopic : topic;

    if (result.coding) {
      formatted = {
        id: genId,
        slug: genId,
        title: result.coding.title,
        difficulty,
        category: activeCategory,
        questionType: 'coding',
        isAiGenerated: true,
        description: result.coding.description,
        starterCode: result.coding.starter_code || { [language]: `class Solution:\n    def solve(self) -> None:\n        # Write your solution for ${activeCategory} here\n        pass` },
        testCases: result.coding.test_cases || []
      };
    } else if (result.mcq) {
      formatted = {
        id: genId,
        title: result.mcq.title,
        questionType: 'mcq',
        category: activeCategory,
        difficulty,
        isAiGenerated: true,
        description: result.mcq.description,
        options: result.mcq.options,
        correctAnswer: result.mcq.correct_answer,
        explanation: result.mcq.explanation
      };
    }

    if (formatted && onQuestionGenerated) {
      onQuestionGenerated(formatted);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060813]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0C1222] border border-[#1A253F] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#162035] bg-[#080D1A]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Generate AI Question
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  Google Gemini AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">Create targeted interview questions on-demand</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#162035] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Question Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Question Type
              </label>
              {isUserTech ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setQuestionType('coding'); setTopic(dsaTopic); }}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all border cursor-pointer ${
                      questionType === 'coding'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10 font-bold'
                        : 'bg-[#080D1A] border-[#162035] text-slate-400 hover:bg-[#0F172A]'
                    }`}
                  >
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span>Coding Challenge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionType('mcq')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all border cursor-pointer ${
                      questionType === 'mcq'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10 font-bold'
                        : 'bg-[#080D1A] border-[#162035] text-slate-400 hover:bg-[#0F172A]'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>Multiple Choice (MCQ)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-blue-600/20 border border-blue-500/40 rounded-xl flex items-center justify-between text-blue-200">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold">
                    <HelpCircle className="w-4 h-4 text-blue-400" />
                    <span>Domain MCQ & Scenario Assessment</span>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-blue-500/30 text-blue-300">
                    {user?.targetRole || 'Non-Software'}
                  </span>
                </div>
              )}
            </div>

            {/* Dynamic DSA Topic Selector step for Coding Challenges */}
            {questionType === 'coding' ? (
              <div className="space-y-3 p-4 rounded-2xl bg-[#080D1A] border border-[#162035]">
                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    Which DSA topic would you like to solve?
                  </span>
                  <span className="text-[10px] text-blue-300 font-semibold px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                    Targeted Algorithm
                  </span>
                </label>

                {/* Popular DSA Topic Quick Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleRandomTopic}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 cursor-pointer flex items-center gap-1 transition-all"
                    title="Pick a random DSA topic"
                  >
                    <span>🎲 Random Topic</span>
                  </button>
                  {DSA_TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setDsaTopic(t); setTopic(t); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                        dsaTopic === t
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/25 scale-105 font-bold'
                          : 'bg-[#05070E] border-[#1A253F] text-slate-300 hover:border-blue-500/50 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Select DSA Topic:
                    </label>
                    <select
                      value={dsaTopic}
                      onChange={(e) => { setDsaTopic(e.target.value); setTopic(e.target.value); }}
                      className="w-full bg-[#05070E] border border-[#1A253F] rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {DSA_TOPICS.map((t) => (
                        <option key={t} value={t} style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Custom Topic Input:
                    </label>
                    <input
                      type="text"
                      value={dsaTopic}
                      onChange={(e) => { setDsaTopic(e.target.value); setTopic(e.target.value); }}
                      placeholder="e.g. Binary Search, Dynamic Programming"
                      className="w-full bg-[#05070E] border border-[#1A253F] rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Topic Input for MCQ */
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React Hooks, System Design, Operating Systems, SQL Indexes"
                  className="w-full bg-[#05070E] border border-[#1A253F] rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            )}

            {/* Target Company (Manual Entry) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Target Company (Optional)</span>
                <span className="text-[10px] text-amber-400 font-bold">Custom Tailoring</span>
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Google, Amazon, Uber, Stripe, Tesla, Airbnb, Startup..."
                className="w-full bg-[#05070E] border border-[#1A253F] focus:border-amber-500/50 rounded-xl px-4 py-2 text-white placeholder-slate-500 text-xs focus:outline-none transition-colors"
              />
            </div>

            {/* Difficulty & Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-[#05070E] border border-[#1A253F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Easy" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>Easy</option>
                  <option value="Medium" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>Medium</option>
                  <option value="Hard" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>Hard</option>
                </select>
              </div>

              {questionType === 'coding' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#05070E] border border-[#1A253F] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="python" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>Python</option>
                    <option value="javascript" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>JavaScript</option>
                    <option value="cpp" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>C++</option>
                    <option value="java" style={{ backgroundColor: '#05070E', color: '#E2E8F0' }}>Java</option>
                  </select>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 disabled:opacity-50 flex items-center justify-center space-x-2 transition-all mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating with Google Gemini AI...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Question</span>
                </>
              )}
            </button>
          </form>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Soft warning when the AI kept returning something already seen */}
          {isPossibleRepeat && result && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <span>⚠️ This looks similar to a question you've already seen. Try a different topic, difficulty, or hit Generate again.</span>
            </div>
          )}

          {/* Generated Result Preview */}
          {result && (
            <div className="p-5 rounded-xl bg-[#05070E] border border-[#162035] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#162035] pb-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  AI Question Generated Successfully!
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#080D1A] border border-[#162035] text-slate-300 font-medium">
                  {difficulty}
                </span>
              </div>

              {result.coding && (
                <div className="space-y-3 text-left">
                  <h3 className="text-base font-bold text-white">{result.coding.title}</h3>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{result.coding.description}</p>
                </div>
              )}

              {result.mcq && (
                <div className="space-y-3 text-left">
                  <h3 className="text-base font-bold text-white">{result.mcq.title}</h3>
                  <p className="text-xs text-slate-300">{result.mcq.description}</p>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {result.mcq.options?.map((opt, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#080D1A] border border-[#162035] text-xs text-slate-200">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-2 transition-all mt-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Add Question & Solve Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default QuestionGeneratorModal;