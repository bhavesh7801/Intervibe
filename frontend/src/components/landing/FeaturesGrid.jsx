import React from 'react';
import { motion } from 'motion/react';
import { Mic, Brain, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesGrid = () => {
  return (
    <section id="features" aria-labelledby="features-heading" className="w-full border-t border-slate-200 dark:border-slate-800 py-12 sm:py-16">
      <div className="site-container">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center"
        >
          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            CORE CAPABILITIES
          </span>
          <h2 id="features-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Your Personal AI Interview Coach
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
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
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Mic size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Real-Time Speech Feedback
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Brain size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Deep Code & Architecture Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive instant Big-O analysis, AST refactor recommendations, and step-by-step optimization hints across 10+ languages.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Target size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Role & Level Customization
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Target Google, Meta, or Stripe for Junior, Senior, or Staff roles with tailored rubrics that match company standards.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
