import React from 'react';
import { motion } from 'motion/react';
import { Mic, Brain, Target } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" aria-labelledby="features-heading" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-t border-[#162035]/60">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 flex flex-col items-center"
      >
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">FEATURES</span>
        <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
          Your personal AI interview coach
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-loose pt-1">
          Everything you need to walk into any interview calm, prepared, and ready to impress — not just memorize answers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
        
        {/* Feature 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -6 }}
          className="p-8 rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-xl space-y-5 hover:border-blue-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Mic size={24} />
          </div>
          <h3 className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">Real-time speech feedback</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-loose">
            Speak naturally and get instant analysis of your tone, pace, filler words, and confidence as you answer.
          </p>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -6 }}
          className="p-8 rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-xl space-y-5 hover:border-blue-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">Adaptive AI interviewer</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-loose">
            The AI adapts its questions based on your responses — drilling deeper where you are weak, just like a real interviewer.
          </p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -6 }}
          className="p-8 rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-xl space-y-5 hover:border-blue-500/50 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors">Role-specific questions</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-loose">
            Practice with curated question banks for 200+ roles — from software engineer to product manager to data scientist.
          </p>
        </motion.div>

      </div>
    </section>
  );
};
