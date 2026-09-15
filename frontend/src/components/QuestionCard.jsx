import React, { useState } from 'react';
import {
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Sparkles,
  Building2,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../utils/roleUtils.js';

// Helper to parse markdown description into sections if structured
function parseLeetCodeDescription(rawPrompt = '') {
  if (!rawPrompt) return { mainDesc: '', examples: [], constraints: [], followUp: '' };

  // If the prompt contains explicit Example/Constraint markdown headers
  const text = rawPrompt;
  let mainDesc = text;
  let examples = [];
  let constraints = [];
  let followUp = '';

  // Check for Constraints section
  const constraintsMatch = text.match(/(?:###\s*Constraints|Constraints:?)([\s\S]*?)(?:###\s*Follow-up|Follow-up:?|$)/i);
  if (constraintsMatch) {
    const rawConstraints = constraintsMatch[1].trim();
    constraints = rawConstraints
      .split('\n')
      .map((line) => line.replace(/^[\s*•\-–]+\s*/, '').trim())
      .filter((line) => line.length > 0 && !line.toLowerCase().startsWith('constraints'));
  }

  // Check for Follow-up section
  const followUpMatch = text.match(/(?:###\s*Follow-up|Follow-up:?)([\s\S]*?)$/i);
  if (followUpMatch) {
    followUp = followUpMatch[1].trim().replace(/^[:\s*–-]+/, '').trim();
  }

  // Extract examples: Example 1, Example 2, etc.
  const exampleBlocks = text.match(/Example \d+:?[\s\S]*?(?=(?:Example \d+:?|###\s*Constraints|Constraints:?|###\s*Follow-up|Follow-up:?|$))/gi);
  if (exampleBlocks && exampleBlocks.length > 0) {
    examples = exampleBlocks.map((block, idx) => {
      const inputMatch = block.match(/(?:Input|\*\*Input:\*\*)\s*:\s*`?([^\n`]+)`?/i) || block.match(/Input:\s*([^\n]+)/i);
      const outputMatch = block.match(/(?:Output|\*\*Output:\*\*)\s*:\s*`?([^\n`]+)`?/i) || block.match(/Output:\s*([^\n]+)/i);
      const explMatch = block.match(/(?:Explanation|\*\*Explanation:\*\*)\s*:\s*`?([^\n`]+)`?/i) || block.match(/Explanation:\s*([^\n]+)/i);

      return {
        id: idx + 1,
        raw: block.trim(),
        input: inputMatch ? inputMatch[1].replace(/`|\*\*/g, '').trim() : '',
        output: outputMatch ? outputMatch[1].replace(/`|\*\*/g, '').trim() : '',
        explanation: explMatch ? explMatch[1].replace(/`|\*\*/g, '').trim() : ''
      };
    });

    // Main description is everything before the first Example or Constraint
    const firstSplit = text.search(/Example 1|### Example 1|### Constraints|Constraints:/i);
    if (firstSplit !== -1) {
      mainDesc = text.substring(0, firstSplit).trim();
    }
  }

  return { mainDesc, examples, constraints, followUp };
}

export const QuestionCard = ({
  question,
  currentIndex = 1,
  totalQuestions = 3,
  onNext,
  onPrevious
}) => {
  const [showHints, setShowHints] = useState(false);
  const [openHintIndex, setOpenHintIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(1420 + Math.floor(Math.random() * 500));
  const [copied, setCopied] = useState(false);

  if (!question) return null;

  const diffBadge = DIFFICULTY_CONFIG[question.difficulty] || DIFFICULTY_CONFIG.Medium;
  const { mainDesc, examples, constraints, followUp } = parseLeetCodeDescription(question.prompt || question.description);

  // Extract or fallback topics
  const topics = question.topics || (question.category ? [question.category] : ['Algorithms', 'Data Structures']);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      if (disliked) setDisliked(false);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    }
  };

  const handleCopy = () => {
    const textToCopy = `${question.title}\n\n${question.prompt || question.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* Top LeetCode Metadata Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-black">
            #{question.id ? question.id.replace(/\D/g, '') || currentIndex : currentIndex}
          </span>
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : question.difficulty === 'Hard'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {question.difficulty || 'Medium'}
          </span>
          {question.company && (
            <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 size={12} className="text-slate-400" />
              <span>{question.company}</span>
            </span>
          )}
          {question.acceptance && (
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline-block">
              Acceptance <span className="font-bold text-slate-700">{question.acceptance}</span>
            </span>
          )}
        </div>

        {/* Action icons (Like, Dislike, Bookmark, Copy) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              liked
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ThumbsUp size={13} fill={liked ? 'currentColor' : 'none'} />
            <span>{likesCount}</span>
          </button>

          <button
            type="button"
            onClick={handleDislike}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              disliked
                ? 'bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title="Dislike"
          >
            <ThumbsDown size={13} fill={disliked ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
          >
            <Bookmark size={13} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Copy problem statement"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{question.title}</span>
        </h2>

        {/* Topics Pills */}
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {topics.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium flex items-center gap-1 hover:bg-slate-200/80 transition-colors cursor-default"
              >
                <Tag size={10} className="text-slate-400" />
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Problem Description */}
      <div className="text-[13.5px] leading-relaxed text-slate-700 font-normal space-y-4 break-words">
        {mainDesc ? (
          <div className="whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-slate-800">
            {mainDesc}
          </div>
        ) : (
          <div className="whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-slate-800">
            {question.prompt || question.description}
          </div>
        )}

        {/* Structured Examples Section (LeetCode Style Cards) */}
        {examples && examples.length > 0 ? (
          <div className="space-y-3.5 pt-2">
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs font-mono"
              >
                <div className="font-sans font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Example {ex.id}:</span>
                </div>

                {ex.input ? (
                  <div className="space-y-1 pl-2 text-slate-800">
                    <div>
                      <span className="font-bold text-slate-500">Input: </span>
                      <span className="text-slate-900 font-semibold">{ex.input}</span>
                    </div>
                    {ex.output && (
                      <div>
                        <span className="font-bold text-slate-500">Output: </span>
                        <span className="text-slate-900 font-semibold">{ex.output}</span>
                      </div>
                    )}
                    {ex.explanation && (
                      <div className="font-sans text-[11.5px] text-slate-600 pt-0.5">
                        <span className="font-bold text-slate-500 font-mono">Explanation: </span>
                        <span>{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-line text-slate-800 pl-2 font-mono text-[11px]">
                    {ex.raw}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : question.testCases && question.testCases.length > 0 ? (
          /* Fallback Examples from testCases array */
          <div className="space-y-3 pt-2">
            {question.testCases.slice(0, 3).map((tc, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 text-xs font-mono"
              >
                <div className="font-sans font-bold text-slate-900 text-xs">
                  Example {idx + 1}:
                </div>
                <div className="pl-2 space-y-1 text-slate-800">
                  <div>
                    <span className="font-bold text-slate-500">Input: </span>
                    <span className="text-slate-900 font-semibold">{tc.input}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500">Output: </span>
                    <span className="text-slate-900 font-semibold">{tc.expected}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Constraints Section */}
        {constraints && constraints.length > 0 && (
          <div className="pt-2 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Constraints:
            </h4>
            <ul className="space-y-1 bg-slate-50 border border-slate-100 rounded-2xl p-3.5 pl-4 text-xs font-mono text-slate-700">
              {constraints.map((c, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Section */}
        {followUp && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
            <Sparkles size={15} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900">Follow-up: </span>
              <span>{followUp}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hints Accordion */}
      {question.hints && question.hints.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-rose-600">
              <Lightbulb size={15} />
              <span>Hints ({question.hints.length})</span>
            </div>
            {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showHints && (
            <div className="mt-2 space-y-2 animate-in fade-in duration-150">
              {question.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5"
                >
                  <span className="font-black text-amber-700 shrink-0">💡 Hint {idx + 1}:</span>
                  <span className="flex-1 break-words">{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

