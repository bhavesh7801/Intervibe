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

      <header className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 lg:pt-28 pb-20 lg:pb-28 text-center flex flex-col items-center z-10">
        
        {/* Top Pill Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 cursor-default hover:bg-blue-500/20 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-blue-300 tracking-wide uppercase">Now with real-time AI speech feedback & O(N) AST analysis</span>
          <ArrowRight size={14} className="text-cyan-400" />
        </motion.div>

        {/* Massive 3D Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight sm:leading-snug max-w-5xl px-2 font-heading break-words"
        >
          Ace your next{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            interview.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-slate-300 max-w-3xl font-medium leading-relaxed px-2"
        >
          Practice with an AI interviewer that asks real questions, listens to your answers, and gives you instant, actionable feedback — for any role, any company, any time.
        </motion.p>

        {/* Reliable Spacer Div to guarantee spacing regardless of CSS margin collapse */}
        <div className="h-10 sm:h-16 w-full shrink-0" />

        {/* Primary Call to Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-2 sm:px-0 max-w-md sm:max-w-none"
        >
          <button
            onClick={() => navigate('/assessment')}
            className="w-full sm:w-auto min-h-[54px] sm:h-[72px] px-6 sm:px-12 rounded-full text-base sm:text-2xl font-black text-white bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-500/40 border border-blue-400/50 flex items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.03] active:scale-95 text-center leading-normal"
          >
            <span>Start a mock interview</span>
            <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
          </button>

          <button
            onClick={() => setDemoOpen(true)}
            className="w-full sm:w-auto min-h-[54px] sm:h-[72px] px-6 sm:px-12 rounded-full text-base sm:text-2xl font-bold text-slate-300 bg-transparent hover:bg-white/5 border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.03] active:scale-95 text-center leading-normal"
          >
            <Play size={20} className="text-slate-400 group-hover:text-white shrink-0" />
            <span>Watch 2-min demo</span>
          </button>
        </motion.div>

        {/* Reliable Spacer Div */}
        <div className="h-12 sm:h-16 w-full shrink-0" />

        {/* Trust Indicators / Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-16 flex items-center gap-2.5 text-sm text-slate-400 font-bold"
        >
          <div className="flex -space-x-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={17} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            ))}
          </div>
          <span className="text-white">4.9/5</span>
          <span>from 50,000+ candidates</span>
        </motion.div>

        {/* Company Marquee — pill-separated chips instead of a flat wall of
            text, so each name reads as a distinct logo-slot rather than
            blurring into one long uppercase string. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 sm:mt-20 pt-10 border-t border-[#162035] w-full flex flex-col items-center gap-5"
        >
          <span className="text-[11px] text-slate-500 font-sans font-extrabold tracking-[0.15em] uppercase">Landed offers at</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {COMPANIES.map((c) => (
              <span
                key={c}
                className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#1e2d4a] text-xs sm:text-sm font-mono font-bold text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors cursor-default"
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