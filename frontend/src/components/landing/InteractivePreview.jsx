import React, { useState } from 'react';
import { Sparkles, Mic, Code2, ShieldCheck, Terminal } from 'lucide-react';

export const InteractivePreview = () => {
  const [activeStage, setActiveStage] = useState('coding');

  return (
    <section id="preview" aria-labelledby="preview-heading" className="w-full py-12 sm:py-16">
      <div className="site-container">
        <div className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
            INTERACTIVE EXPERIENCE
          </span>
          <h2 id="preview-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            Simulate Real FAANG Technical Loops
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Switch between interview modes to see how Intervibe evaluates code complexity, speech pacing, and architecture trade-offs in real time.
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 p-5 sm:p-8 space-y-6">
            
            {/* Top Mac Window Control Bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                <span className="text-xs font-mono text-slate-500 font-semibold ml-2 hidden sm:inline">
                  Intervibe Live Simulation • Staff Software Engineer
                </span>
              </div>

              {/* Status Pill & Timer */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AI Coach Active</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                  <Mic size={13} className="text-rose-600 animate-pulse" />
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
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200'
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
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200'
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
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <ShieldCheck size={14} />
                <span>03. System Architecture</span>
              </button>
            </div>

            {/* Interaction Area Box */}
            <div className="space-y-4">
              
              {/* AI Interviewer Prompt Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs font-mono uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>AI Interviewer (Voice Active)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    Google L5 Rubric
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed">
                  {activeStage === 'coding' && '"Can you optimize your solution to achieve O(N) time complexity without allocating auxiliary hash maps? Walk me through your two-pointer technique."'}
                  {activeStage === 'behavioral' && '"Describe a high-stakes production outage you resolved. How did you coordinate with stakeholders under pressure?"'}
                  {activeStage === 'system' && '"How would you design an idempotent payment processing gateway handling 50,000 TPS with sub-10ms p99 latency?"'}
                </p>
              </div>

              {/* Candidate Stream Output Terminal */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 space-y-3 shadow-inner">
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
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-600">
                    <span>Clarity & Tone</span>
                    <span className="text-rose-600 font-bold">9.4 / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-600">
                    <span>Technical Depth</span>
                    <span className="text-slate-800 font-bold">9.1 / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-600">
                    <span>STAR Alignment</span>
                    <span className="text-emerald-600 font-bold">9.6 / 10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
                  </div>
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
