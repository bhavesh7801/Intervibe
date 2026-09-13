import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Play, Star, Sparkles, Mic, Code2, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

const WatchDemoModal = lazy(() => import('./WatchDemoModal'));

const COMPANIES = [
  { name: 'Google', role: 'L5 / Senior SWE' },
  { name: 'Meta', role: 'E5 Systems' },
  { name: 'Amazon', role: 'SDE II Leadership' },
  { name: 'Netflix', role: 'Senior Platform' },
  { name: 'Stripe', role: 'Staff Backend' },
  { name: 'Airbnb', role: 'Full Stack' }
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<'coding' | 'behavioral' | 'system'>('coding');

  return (
    <section className="relative w-full flex flex-col items-center pt-6 sm:pt-10 lg:pt-14 pb-10 sm:pb-14 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/25 via-indigo-600/15 to-transparent rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[400px] bg-cyan-500/15 rounded-full blur-[130px] mix-blend-screen" />
        <div className="absolute top-[30%] -right-[10%] w-[500px] h-[400px] bg-purple-600/15 rounded-full blur-[130px] mix-blend-screen" />
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Main 2-Column Responsive Grid on Desktop / 1-Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* LEFT COLUMN: Hero Copy & Actions */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Top Feature Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md cursor-default hover:border-blue-400/60 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] mb-5"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wide uppercase bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                Next-Gen AI Interview Intelligence 2.5
              </span>
              <Zap size={12} className="text-cyan-400" />
            </motion.div>

            {/* Master Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1] font-heading"
            >
              Master your next interview with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                real-time AI feedback.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl font-normal leading-relaxed"
            >
              Simulate rigorous coding, system design, and behavioral loops with an adaptive AI coach that analyzes your speech cadence, code complexity, and communication clarity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-7 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              <button
                onClick={() => navigate('/assessment')}
                className="w-full sm:w-auto h-12 sm:h-13 px-7 sm:px-8 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-400/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 text-center"
              >
                <span>Start Free Mock Interview</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              <button
                onClick={() => setDemoOpen(true)}
                className="w-full sm:w-auto h-12 sm:h-13 px-7 sm:px-8 rounded-2xl text-sm sm:text-base font-semibold text-slate-200 bg-[#0B1124]/90 hover:bg-[#121b38] border border-slate-700/80 hover:border-slate-500 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 text-center backdrop-blur-md shadow-md"
              >
                <Play size={16} className="text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span>Watch 2-Min Demo</span>
              </button>
            </motion.div>

            {/* Social Proof & Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 flex flex-col sm:flex-row items-center gap-3.5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 backdrop-blur-sm shadow-sm">
                <div className="flex -space-x-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-white font-bold text-xs">4.9/5</span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-slate-300 text-xs font-medium">50,000+ placed</span>
              </div>

              <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-400">
                <CheckCircle2 size={14} className="text-cyan-400" />
                <span>100% Free • No CC Required</span>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Interactive Live Showcase Console */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-6 w-full"
          >
            <div className="rounded-3xl bg-[#090d1c]/95 border border-blue-500/25 shadow-[0_0_60px_rgba(37,99,235,0.18)] p-4 sm:p-6 backdrop-blur-2xl relative overflow-hidden">
              
              {/* Top Mac Window Control Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#1a2642] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                  <span className="text-[11px] sm:text-xs font-mono text-slate-300 font-bold ml-1.5 truncate max-w-[180px] sm:max-w-none">
                    Intervibe AI Session • Senior SWE
                  </span>
                </div>

                {/* Status Pill & Timer */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live AI</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-bold">
                    <Mic size={12} className="text-blue-400 animate-pulse" />
                    <span>03:12</span>
                  </div>
                </div>
              </div>

              {/* Interactive Mode Selector Tabs */}
              <div className="flex items-center gap-1.5 pt-3 pb-3 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveStage('coding')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                    activeStage === 'coding'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/50'
                      : 'text-slate-400 hover:text-white bg-[#0e1428] border border-[#162035]'
                  }`}
                >
                  <Code2 size={13} />
                  <span>01. Coding & AST</span>
                </button>
                <button
                  onClick={() => setActiveStage('behavioral')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                    activeStage === 'behavioral'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/50'
                      : 'text-slate-400 hover:text-white bg-[#0e1428] border border-[#162035]'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>02. Behavioral</span>
                </button>
                <button
                  onClick={() => setActiveStage('system')}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                    activeStage === 'system'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/50'
                      : 'text-slate-400 hover:text-white bg-[#0e1428] border border-[#162035]'
                  }`}
                >
                  <ShieldCheck size={13} />
                  <span>03. Architecture</span>
                </button>
              </div>

              {/* Simulated Live Interaction Dialogue */}
              <div className="space-y-3 pt-1">
                
                {/* AI Interviewer Prompt Bubble */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0e1428] border border-[#1c2948] text-slate-200 text-xs sm:text-sm leading-relaxed space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] font-mono">
                      <Sparkles size={13} />
                      <span>AI INTERVIEWER (SPEECH SYNTHESIS)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Google L5 Rubric</span>
                  </div>
                  <p className="text-slate-100 font-medium text-xs sm:text-sm">
                    {activeStage === 'coding' && '"Can you optimize your solution to achieve O(N) time complexity without allocating auxiliary hash maps? Walk me through your pointer technique."'}
                    {activeStage === 'behavioral' && '"Describe a high-stakes production outage you resolved. How did you coordinate with stakeholders under pressure?"'}
                    {activeStage === 'system' && '"How would you design an idempotent payment processing gateway handling 50,000 TPS with sub-10ms p99 latency?"'}
                  </p>
                </div>

                {/* Candidate Streamed Output / Code Snippet */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-blue-100 text-xs sm:text-sm leading-relaxed space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-blue-300 font-bold">CANDIDATE TRANSCRIPT & RUNTIME</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                      O(N) PROOF VERIFIED
                    </span>
                  </div>
                  <p className="text-slate-200 font-mono text-[11px] sm:text-xs">
                    {activeStage === 'coding' && 'def trap_rain_water(height: list[int]) -> int: # 2-Pointer O(1) space runtime: 14ms'}
                    {activeStage === 'behavioral' && '"I initiated an incident war-room, isolated the redis connection pool leak, and restored 99.99% availability in 8 minutes."'}
                    {activeStage === 'system' && 'Topology: Cloudflare CDN -> Envoy API Gateway -> Kafka Partition Log -> Postgres Shard'}
                  </p>
                </div>

                {/* Real-time Performance Metrics */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-[#060914] border border-[#162035] space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>Clarity</span>
                      <span className="text-cyan-400 font-bold">9.4/10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060914] border border-[#162035] space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>Depth</span>
                      <span className="text-blue-400 font-bold">9.1/10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#060914] border border-[#162035] space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-300">
                      <span>STAR</span>
                      <span className="text-emerald-400 font-bold">9.6/10</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>

        {/* Company Ribbon / Landed Offers spanning across bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-[#162035]/60 w-full flex flex-col items-center gap-4"
        >
          <span className="text-[11px] sm:text-xs text-slate-400 font-mono font-bold tracking-[0.2em] uppercase text-center">
            Candidates Landed Offers At Top Tech Companies
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 w-full max-w-5xl">
            {COMPANIES.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-2xl bg-[#0b1022]/80 border border-[#1a2544] hover:border-blue-500/40 hover:bg-blue-950/20 transition-all flex flex-col items-center justify-center text-center group cursor-default shadow-sm"
              >
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{c.name}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{c.role}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <Suspense fallback={null}>
        {demoOpen && (
          <WatchDemoModal 
            isOpen={demoOpen} 
            onClose={() => setDemoOpen(false)} 
            onLaunchPlayground={() => {
              setDemoOpen(false);
              navigate('/assessment');
            }}
          />
        )}
      </Suspense>
    </section>
  );
};