import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Play, Star, Sparkles, Mic, Code2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const WatchDemoModal = lazy(() => import('./WatchDemoModal'));

const COMPANIES = [
  { name: 'Google', role: 'L5 / Senior SWE', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Meta', role: 'E5 Systems', color: 'from-cyan-500/20 to-blue-600/10' },
  { name: 'Amazon', role: 'SDE II Leadership', color: 'from-amber-500/20 to-orange-600/10' },
  { name: 'Netflix', role: 'Senior Platform', color: 'from-rose-500/20 to-red-600/10' },
  { name: 'Stripe', role: 'Staff Backend', color: 'from-indigo-500/20 to-purple-600/10' },
  { name: 'Airbnb', role: 'Full Stack', color: 'from-pink-500/20 to-rose-600/10' }
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<'coding' | 'behavioral' | 'system'>('coding');

  return (
    <section className="relative w-full flex flex-col items-center pt-8 sm:pt-12 lg:pt-16 pb-12 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/30 via-indigo-600/20 to-transparent rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[400px] bg-cyan-500/15 rounded-full blur-[130px] mix-blend-screen" />
        <div className="absolute top-[30%] -right-[10%] w-[500px] h-[400px] bg-purple-600/15 rounded-full blur-[130px] mix-blend-screen" />
      </div>

      <div className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center z-10">
        
        {/* Top Feature Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md cursor-default hover:border-blue-400/60 transition-all shadow-[0_0_25px_rgba(59,130,246,0.2)] mb-6 sm:mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-xs font-mono font-bold tracking-wide uppercase bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
            Next-Gen AI Interview Intelligence 2.5
          </span>
          <Zap size={13} className="text-cyan-400" />
        </motion.div>

        {/* Master Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl font-heading"
        >
          Master your next interview with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]">
            real-time AI feedback.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-7 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed"
        >
          Simulate rigorous coding, system design, and behavioral loops with an adaptive AI coach that analyzes your speech cadence, code complexity, and communication clarity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => navigate('/assessment')}
            className="w-full sm:w-auto h-13 sm:h-14 px-8 sm:px-10 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 shadow-[0_0_35px_rgba(37,99,235,0.45)] border border-blue-400/40 flex items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 text-center"
          >
            <span>Start Free Mock Interview</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            onClick={() => setDemoOpen(true)}
            className="w-full sm:w-auto h-13 sm:h-14 px-8 sm:px-10 rounded-2xl text-base font-semibold text-slate-200 bg-[#0B1124]/90 hover:bg-[#121b38] border border-slate-700/80 hover:border-slate-500 flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 text-center backdrop-blur-md shadow-lg"
          >
            <Play size={18} className="text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <span>Watch 2-Min Demo</span>
          </button>
        </motion.div>

        {/* Social Proof Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md"
        >
          <div className="flex -space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-white font-bold text-xs sm:text-sm">4.9/5 Rating</span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-slate-300 text-xs sm:text-sm font-medium">50,000+ candidates placed</span>
        </motion.div>

        {/* Live Interactive Product Showcase Console */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 w-full max-w-5xl text-left"
        >
          <div className="rounded-3xl bg-[#090d1c]/90 border border-blue-500/25 shadow-[0_0_80px_rgba(37,99,235,0.2)] p-5 sm:p-7 backdrop-blur-2xl relative overflow-hidden">
            
            {/* Top Mac Window Control Bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1a2642] gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                <span className="text-xs font-mono text-slate-300 font-bold ml-2 hidden sm:inline">
                  Intervibe AI Session • Senior Full Stack Engineer
                </span>
              </div>

              {/* Status Pill & Waveform */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Coach Active</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
                  <Mic size={13} className="text-blue-400 animate-pulse" />
                  <span>03:12</span>
                </div>
              </div>
            </div>

            {/* Interactive Mode Selector Tabs */}
            <div className="flex items-center gap-2 pt-4 pb-4 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveStage('coding')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 ${
                  activeStage === 'coding'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50'
                    : 'text-slate-400 hover:text-white bg-[#0e1428] border border-[#162035]'
                }`}
              >
                <Code2 size={14} />
                <span>01. Live Coding & AST</span>
              </button>
              <button
                onClick={() => setActiveStage('behavioral')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 ${
                  activeStage === 'behavioral'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50'
                    : 'text-slate-400 hover:text-white bg-[#0e1428] border border-[#162035]'
                }`}
              >
                <Sparkles size={14} />
                <span>02. Behavioral (STAR)</span>
              </button>
              <button
                onClick={() => setActiveStage('system')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 ${
                  activeStage === 'system'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/50'
                    : 'text-slate-400 hover:text-white bg-[#0e1428] border border-[#162035]'
                }`}
              >
                <ShieldCheck size={14} />
                <span>03. System Architecture</span>
              </button>
            </div>

            {/* Simulated Live Interaction Area */}
            <div className="space-y-4 pt-1">
              
              {/* AI Interviewer Bubble */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1428] border border-[#1c2948] text-slate-200 text-xs sm:text-sm leading-relaxed space-y-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                    <Sparkles size={14} />
                    <span>AI INTERVIEWER (VOICE SYNTHESIS ACTIVE)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Google L5 Rubric</span>
                </div>
                <p className="text-slate-100 font-medium">
                  {activeStage === 'coding' && '"Can you optimize your solution to achieve O(N) time complexity without allocating auxiliary hash maps? Walk me through your pointer technique."'}
                  {activeStage === 'behavioral' && '"Describe a high-stakes production outage you resolved. How did you coordinate with stakeholders under pressure?"'}
                  {activeStage === 'system' && '"How would you design an idempotent payment processing gateway handling 50,000 TPS with sub-10ms p99 latency?"'}
                </p>
              </div>

              {/* Candidate Streamed Output / Code Snippet */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-blue-100 text-xs sm:text-sm leading-relaxed space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-300 font-bold">CANDIDATE AUDIO TRANSCRIPT & LIVE RUNTIME</span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    O(N) PROOF VERIFIED
                  </span>
                </div>
                <p className="text-slate-200 font-mono text-xs">
                  {activeStage === 'coding' && 'def trap_rain_water(height: list[int]) -> int: # 2-Pointer O(1) space runtime: 14ms'}
                  {activeStage === 'behavioral' && '"I initiated an incident war-room, isolated the redis connection pool leak, and restored 99.99% availability in 8 minutes."'}
                  {activeStage === 'system' && 'Topology: Cloudflare CDN -> Envoy API Gateway -> Kafka Partition Log -> Postgres Shard'}
                </p>
              </div>

              {/* Real-time Performance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#060914] border border-[#162035] space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Clarity & Tone</span>
                    <span className="text-cyan-400 font-bold">9.4/10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060914] border border-[#162035] space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Technical Depth</span>
                    <span className="text-blue-400 font-bold">9.1/10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#060914] border border-[#162035] space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>STAR Alignment</span>
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

        {/* Company Ribbon / Landed Offers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 sm:mt-18 pt-8 border-t border-[#162035]/60 w-full flex flex-col items-center gap-5"
        >
          <span className="text-xs text-slate-400 font-mono font-bold tracking-[0.2em] uppercase">
            Candidates Landed Offers At Top Tech Companies
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-5xl">
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