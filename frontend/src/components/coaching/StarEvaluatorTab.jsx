import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Award, ArrowRight } from 'lucide-react';
import { coachingApi } from '../../api/index.js';

export const StarEvaluatorTab = () => {
  const [situation, setSituation] = useState('Our payment service was failing 4% of checkout transactions during Black Friday peak traffic.');
  const [task, setTask] = useState('I was tasked with identifying the root cause within 2 hours and preventing cascading checkout failures.');
  const [action, setAction] = useState('I isolated the deadlocked Redis lock, implemented exponential backoff with jitter, and enabled circuit breaking with Resilience4j.');
  const [result, setResult] = useState('Failure rate dropped to 0.01% within 45 minutes, saving an estimated $240,000 in at-risk revenue.');

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const combined = `Situation: ${situation}\nTask: ${task}\nAction: ${action}\nResult: ${result}`;
      const res = await coachingApi.evaluateStar(combined);
      setEvaluation(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles size={18} className="text-rose-600" />
          <span>STAR Behavioral Story Evaluator</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Structure and grade your behavioral examples for FAANG Leadership Principles.
        </p>
      </div>

      <form onSubmit={handleEvaluate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              [S] Situation
            </label>
            <textarea
              rows={3}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              [T] Task
            </label>
            <textarea
              rows={3}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              [A] Action
            </label>
            <textarea
              rows={3}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              [R] Result
            </label>
            <textarea
              rows={3}
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Award size={15} />
          <span>{loading ? 'Evaluating Story with AI...' : 'Grade STAR Response'}</span>
        </button>
      </form>

      {/* Evaluation Results */}
      {evaluation && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="font-extrabold text-sm text-slate-900">
                Score: {evaluation.score}/100 ({evaluation.overallRating})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['situation', 'task', 'action', 'result'].map((part) => {
              const item = evaluation[part];
              if (!item) return null;
              return (
                <div key={part} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold capitalize text-slate-800">
                    <span>{part}</span>
                    <span className="text-emerald-600 font-mono">{item.score}%</span>
                  </div>
                  <p className="text-slate-600 leading-normal">{item.comment}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StarEvaluatorTab;
