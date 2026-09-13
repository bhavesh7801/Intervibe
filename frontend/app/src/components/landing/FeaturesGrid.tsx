import React from 'react';
import { motion } from 'motion/react';
import { Mic, Brain, Target } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" aria-labelledby="features-heading" className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#162035]/60">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center"
      >
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">CORE CAPABILITIES</span>
        <h2 id="features-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
          Your Personal AI Interview Coach
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
          Everything you need to walk into any tech loop calm, prepared, and ready to impress.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Feature 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0e121f]/90 border border-blue-500/20 shadow-xl space-y-4 hover:border-blue-500/50 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Mic size={22} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">Real-Time Speech Feedback</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Speak naturally and get instant analysis of your tone, cadence, filler words, and delivery confidence as you answer.
            </p>
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0e121f]/90 border border-blue-500/20 shadow-xl space-y-4 hover:border-blue-500/50 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Brain size={22} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">Adaptive AI Interviewer</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The AI dynamically adapts follow-up questions based on your responses — probing trade-offs just like a senior staff engineer.
            </p>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
          className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0e121f]/90 border border-blue-500/20 shadow-xl space-y-4 hover:border-blue-500/50 transition-all group flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Target size={22} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">Role-Specific Question Banks</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Practice with curated question sets for 200+ roles — from Frontend and Backend to Distributed Systems and AI Engineering.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
