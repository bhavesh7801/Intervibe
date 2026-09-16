import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Star, Zap, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const COMPANIES = [
  { name: 'Google', role: 'L5 / Senior SWE' },
  { name: 'Meta', role: 'E5 Systems' },
  { name: 'Amazon', role: 'SDE II Leadership' },
  { name: 'Netflix', role: 'Senior Platform' },
  { name: 'Stripe', role: 'Staff Backend' },
  { name: 'Airbnb', role: 'Full Stack' }
];

export const HeroSection = () => {
  const { user } = useAuth();

  const scrollToPreview = () => {
    const elem = document.getElementById('preview');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full flex flex-col items-center pt-8 sm:pt-14 pb-12 overflow-hidden">
      {/* Subtle Ambient Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-rose-500/15 via-purple-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-[30%] -left-[10%] w-[400px] h-[300px] bg-sky-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="site-container text-center flex flex-col items-center relative z-10">
        
        {/* Top Feature Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs mb-6 sm:mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <span className="text-xs font-mono font-bold tracking-wide uppercase text-rose-700 dark:text-rose-400">
            Next-Gen AI Interview Intelligence
          </span>
          <Zap size={13} className="text-rose-600 dark:text-rose-400" />
        </motion.div>

        {/* Master Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] max-w-4xl mx-auto font-heading"
        >
          Master your next interview with{' '}
          <span className="text-rose-600 dark:text-rose-500">
            real-time AI feedback.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 sm:mt-7 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Simulate rigorous coding, system design, and behavioral loops with an adaptive AI coach that analyzes your speech cadence, code complexity, and communication clarity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-4 w-full sm:w-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to={user ? "/interview" : "/register"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all cursor-pointer group flex items-center justify-center gap-2.5 active:scale-95"
            >
              <span>{user ? "Go to Mock Interview" : "Start Free Mock Interview"}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={scrollToPreview}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <Play size={17} className="text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Try Interactive Demo</span>
            </button>
          </div>

          {!user && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Already have an account?</span>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <span>Sign In</span>
                <LogIn size={13} />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Social Proof Capsule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
        >
          <div className="flex -space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm">4.9/5 Rating</span>
          <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
          <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">50,000+ candidates placed</span>
        </motion.div>

        {/* Company Offers Ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 sm:mt-18 pt-8 border-t border-slate-200 dark:border-slate-800 w-full flex flex-col items-center gap-5"
        >
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold tracking-[0.2em] uppercase">
            Candidates Landed Offers At Top Tech Companies
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {COMPANIES.map((c) => (
              <div
                key={c.name}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 transition-all flex flex-col items-center justify-center text-center group cursor-default shadow-xs"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{c.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{c.role}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
