import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Play, Star } from 'lucide-react';

// Lazy load the WatchDemoModal so it isn't part of the initial bundle
const WatchDemoModal = lazy(() => import('./WatchDemoModal'));

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Netflix', 'Stripe', 'Airbnb'];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative w-full flex flex-col items-center">
      {/* Ambient Mesh Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[25%] -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/25 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute top-[10%] right-[15%] w-[500px] h-[350px] bg-cyan-500/20 rounded-full blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <header className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 text-center flex flex-col items-center z-10">
        
        {/* Top Pill Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 cursor-default hover:bg-blue-500/20 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-blue-300 tracking-wide uppercase">Real-Time AI Voice Feedback & AST Code Analysis</span>
          <ArrowRight size={14} className="text-cyan-400" />
        </motion.div>

        {/* Massive 3D Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl px-2 font-heading"
        >
          Ace your next{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            tech interview.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed px-2"
        >
          Practice with an adaptive AI interviewer that asks real questions, analyzes your code complexity, and delivers instant, actionable feedback.
        </motion.p>

        {/* Primary Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto px-4 sm:px-0"
        >
          <button
            onClick={() => navigate('/assessment')}
            className="w-full sm:w-auto h-13 sm:h-14 px-8 sm:px-10 rounded-2xl text-base sm:text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 border border-blue-400/40 flex items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 text-center"
          >
            <span>Start a mock interview</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            onClick={() => setDemoOpen(true)}
            className="w-full sm:w-auto h-13 sm:h-14 px-8 sm:px-10 rounded-2xl text-base sm:text-lg font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-slate-700/80 hover:border-slate-500 flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 text-center backdrop-blur-sm"
          >
            <Play size={18} className="text-slate-300 group-hover:text-white shrink-0" />
            <span>Watch 2-min demo</span>
          </button>
        </motion.div>

        {/* Trust Indicators / Social Proof directly under buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-5 flex items-center gap-2.5 text-xs sm:text-sm text-slate-400 font-medium"
        >
          <div className="flex -space-x-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={15} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" />
            ))}
          </div>
          <span className="text-white font-semibold">4.9/5</span>
          <span>from 50,000+ candidates</span>
        </motion.div>

        {/* Company Marquee / Landed offers at */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-[#162035]/60 w-full flex flex-col items-center gap-4"
        >
          <span className="text-[11px] text-slate-500 font-sans font-bold tracking-[0.15em] uppercase">Candidates landed offers at</span>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#1e2d4a] text-xs sm:text-sm font-mono font-semibold text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors cursor-default"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>

      </header>

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