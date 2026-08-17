import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';
import { api } from '../../api';

const BEHAVIORAL_PROMPTS = [
  "Tell me about a time when you led a critical project under a tight deadline.",
  "Describe a situation where your initial technical hypothesis turned out to be incorrect.",
  "How do you handle working with a cross-functional partner who pushes back on scope?",
  "Give an example of how you prioritized technical debt vs shipping new user features."
];

const StarEvaluatorTab = () => {
  const [prompt, setPrompt] = useState(BEHAVIORAL_PROMPTS[0]);
  const [situation, setSituation] = useState("During Q3 at my previous startup, our primary payment gateway experienced frequent timeout spikes during peak user traffic.");
  const [task, setTask] = useState("I was tasked with leading the reliability overhaul to reduce checkout error rate below 0.01% before Black Friday.");
  const [action, setAction] = useState("I implemented an asynchronous retry queue with exponential backoff and circuit breaker patterns, while adding fallback routing to a secondary payment processor.");
  const [result, setResult] = useState("We successfully processed over 250,000 transactions with 99.99% success rate and zero downtime, saving an estimated $180k in lost revenue.");

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!situation.trim() || !task.trim() || !action.trim() || !result.trim()) {
      alert("Please fill out all STAR fields.");
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await api.evaluateStar({
        prompt,
        situation,
        task,
        action,
        result
      });
      if (response.data?.evaluation) {
        setEvaluation(response.data.evaluation);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Failed to evaluate STAR response. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Award size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Behavioral STAR Method Evaluator</h3>
            <p className="text-xs text-slate-400">Structure your story using **Situation, Task, Action, Result** for real-time quantitative AI scoring.</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Select Behavioral Interview Prompt</label>
          <select
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#080D1A] border border-[#162035] rounded-xl p-3 text-white text-xs font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {BEHAVIORAL_PROMPTS.map((p) => (
              <option key={p} value={p} style={{ backgroundColor: '#080D1A', color: '#E2E8F0' }}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleEvaluate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Situation */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#080D1A] border border-[#162035]">
              <label className="font-bold text-blue-400 uppercase tracking-wider block font-mono">S — Situation (Context)</label>
              <textarea
                rows={3}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#05070E] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 font-sans"
                placeholder="What was the background context?"
              />
            </div>

            {/* Task */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#080D1A] border border-[#162035]">
              <label className="font-bold text-cyan-400 uppercase tracking-wider block font-mono">T — Task (Your Responsibility)</label>
              <textarea
                rows={3}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#05070E] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 font-sans"
                placeholder="What was your specific goal or challenge?"
              />
            </div>

            {/* Action */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#080D1A] border border-[#162035]">
              <label className="font-bold text-emerald-400 uppercase tracking-wider block font-mono">A — Action (Steps You Took)</label>
              <textarea
                rows={3}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#05070E] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 font-sans"
                placeholder="What technical/leadership steps did you execute?"
              />
            </div>

            {/* Result */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#080D1A] border border-[#162035]">
              <label className="font-bold text-amber-400 uppercase tracking-wider block font-mono">R — Result (Quantitative Impact)</label>
              <textarea
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#05070E] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 font-sans"
                placeholder="What were the business metrics/outcomes?"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} className={isEvaluating ? 'animate-spin' : ''} />
            <span>{isEvaluating ? 'Evaluating STAR Answer with AI...' : 'Evaluate STAR Response'}</span>
          </button>
        </form>
      </div>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-2xl space-y-6 animate-entrance">
          <div className="flex items-center justify-between border-b border-[#162035] pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={22} className="text-emerald-400" />
              <h4 className="text-lg font-black text-white">STAR Evaluation Scorecard</h4>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-base font-black font-mono">
              Overall Score: {evaluation.overallScore}/100
            </div>
          </div>

          {/* Breakdown Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#080D1A] border border-[#162035]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Situation</span>
              <span className="text-lg font-black text-blue-400 font-mono">{evaluation.situationScore}/100</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080D1A] border border-[#162035]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Task</span>
              <span className="text-lg font-black text-cyan-400 font-mono">{evaluation.taskScore}/100</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080D1A] border border-[#162035]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Action</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{evaluation.actionScore}/100</span>
            </div>
            <div className="p-3 rounded-xl bg-[#080D1A] border border-[#162035]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Result</span>
              <span className="text-lg font-black text-amber-400 font-mono">{evaluation.resultScore}/100</span>
            </div>
          </div>

          {/* Quantitative Metrics Highlight */}
          <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2 text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wider block font-mono">
              📊 Extracted Business Impact Metrics:
            </span>
            <div className="flex flex-wrap gap-2">
              {evaluation.quantitativeMetricsFound.map((m, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} /> Answer Strengths
              </span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <AlertCircle size={14} /> Refinement Tip
              </span>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {evaluation.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StarEvaluatorTab;
