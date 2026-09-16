import React, { useState } from 'react';
import { Sparkles, Mic, Code2, ShieldCheck, Terminal, ArrowRight, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const InteractivePreview = () => {
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState('coding');

  return (
    <section id="preview" aria-labelledby="preview-heading" className="w-full py-12 sm:py-16">
      <div className="site-container">
        <div className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            INTERACTIVE EXPERIENCE
          </span>
          <h2 id="preview-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Simulate Real FAANG Technical Loops
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Switch between interview modes to see how Intervibe evaluates code complexity, speech pacing, and architecture trade-offs in real time.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-5 sm:p-8 space-y-6">
            
            {/* Top Mac Window Control Bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold ml-2 hidden sm:inline">
                  Intervibe Live Simulation • Staff Software Engineer
                </span>
              </div>

              {/* Status Pill & Timer */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AI Coach Active</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold border border-slate-200 dark:border-slate-700">
                  <Mic size={13} className="text-rose-600 dark:text-rose-400 animate-pulse" />
                  <span>03:12</span>
                </div>
              </div>
            </div>

            {/* Segmented Mode Selector Tabs */}
            <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveStage('coding')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeStage === 'coding'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Code2 size={14} />
                <span>01. Live Coding & AST</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('behavioral')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeStage === 'behavioral'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sparkles size={14} />
                <span>02. Behavioral (STAR)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('system')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  activeStage === 'system'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <ShieldCheck size={14} />
                <span>03. System Architecture</span>
              </button>
            </div>

            {/* Interaction Area Box */}
            <div className="space-y-4">
              
              {/* AI Interviewer Prompt Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>AI Interviewer (Voice Active)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    Google L5 Rubric
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-900 dark:text-white font-medium leading-relaxed">
                  {activeStage === 'coding' && '"Can you optimize your solution to achieve O(N) time complexity without allocating auxiliary hash maps? Walk me through your two-pointer technique."'}
                  {activeStage === 'behavioral' && '"Describe a high-stakes production outage you resolved. How did you coordinate with stakeholders under pressure?"'}
                  {activeStage === 'system' && '"How would you design an idempotent payment processing gateway handling 50,000 TPS with sub-10ms p99 latency?"'}
                </p>
              </div>

              {/* Candidate Stream Output Terminal */}
              <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-slate-100 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    <Terminal size={14} className="text-rose-400" />
                    <span>Live Candidate Audio & Code Stream</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    O(N) PROOF VERIFIED
                  </span>
                </div>
                <div className="font-mono text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed overflow-x-auto">
                  {activeStage === 'coding' && 'def trap_rain_water(height: list[int]) -> int: # 2-Pointer O(1) space runtime: 14ms'}
                  {activeStage === 'behavioral' && '"I initiated an incident war-room, isolated the redis connection pool leak, and restored 99.99% availability in 8 minutes."'}
                  {activeStage === 'system' && 'Topology: Cloudflare CDN -> Envoy API Gateway -> Kafka Partition Log -> Postgres Shard'}
                </div>
              </div>

              {/* Real-time Performance Metrics Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span>Clarity & Tone</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">9.4 / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span>Technical Depth</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">9.1 / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-slate-800 dark:bg-slate-300 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span>STAR Alignment</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">9.6 / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>

              {/* Bottom Conversion Action Bar */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
                  Practice with full voice dialog, automatic hints, and detailed grading rubrics.
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  {!user && (
                    <Link
                      to="/login"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                    >
                      <LogIn size={13} />
                      <span>Sign In</span>
                    </Link>
                  )}
                  <Link
                    to={user ? "/interview" : "/register"}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
                  >
                    <span>{user ? "Launch Interview" : "Try Free Session"}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePreview;
