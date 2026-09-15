import React from 'react';
import { motion } from 'motion/react';
import { Mic, Brain, Target } from 'lucide-react';

export const FeaturesGrid = () => {
  return (
    <section id="features" aria-labelledby="features-heading" className="w-full border-t border-slate-200 py-12 sm:py-16">
      <div className="site-container">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center"
        >
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
            CORE CAPABILITIES
          </span>
          <h2 id="features-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            Your Personal AI Interview Coach
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Everything you need to walk into any tech loop calm, prepared, and ready to impress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-rose-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Mic size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Real-Time Speech Feedback
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Speak naturally and get instant analysis of your tone, cadence, filler words, and delivery confidence as you answer.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-rose-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Brain size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Adaptive AI Interviewer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The AI dynamically adapts follow-up questions based on your responses — probing trade-offs just like a senior staff engineer.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-rose-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Target size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Role-Specific Question Banks
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Practice with curated question sets for 200+ roles — from Frontend and Backend to Distributed Systems and AI Engineering.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
