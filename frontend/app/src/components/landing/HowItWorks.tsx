import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section aria-labelledby="how-it-works-heading" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-t border-[#162035]/60 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-left space-y-4 mb-16"
      >
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">HOW IT WORKS</span>
        <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
          From nervous to natural<br className="hidden sm:inline" /> in three steps
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-loose">
          No scheduling, no waiting, no judgment. Just you and an AI that has interviewed thousands of candidates at top companies.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Left Column: 3 Step Steps */}
        <div className="lg:col-span-6 space-y-9">
          
          {/* Step 01 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-5 p-5 rounded-2xl hover:bg-[#0e121f] transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-mono font-black shrink-0 shadow-lg">
              01
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">Pick your target role</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-loose">
                Choose from 200+ roles and seniority levels, or paste a job description and PrepAI builds a custom interview plan.
              </p>
            </div>
          </motion.div>

          {/* Step 02 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-5 p-5 rounded-2xl hover:bg-[#0e121f] transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-mono font-black shrink-0 shadow-lg">
              02
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">Practice with the AI</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-loose">
                Talk through a full mock interview — behavioral, coding, system design. The AI listens, follows up, and pushes you like a real interviewer.
              </p>
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-5 p-5 rounded-2xl hover:bg-[#0e121f] transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-mono font-black shrink-0 shadow-lg">
              03
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">Review your scorecard</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-loose">
                Get instant scores across clarity, confidence, structure, and depth — with specific examples of what to say instead.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Live Session Scorecard Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-6"
        >
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-2xl space-y-7">
            <div className="flex items-center justify-between border-b border-[#162035] pb-5">
              <div>
                <h4 className="font-extrabold text-white text-lg">Session scorecard</h4>
                <span className="text-xs text-slate-400 font-mono">Senior Frontend Engineer • Mock #14</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-extrabold">
                Overall: 8.4/10
              </div>
            </div>

            {/* Scorecard Progress Metrics */}
            <div className="space-y-5 text-xs font-mono">
              
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Clarity & communication</span>
                  <span className="font-bold text-blue-300">8.7</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }} />
                </div>
                <div className="text-xs text-slate-400 font-sans">Strong, concise answers</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Confidence & tone</span>
                  <span className="font-bold text-cyan-300">7.8</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="text-xs text-slate-400 font-sans">Slight hesitation on follow-ups</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Structure (STAR method)</span>
                  <span className="font-bold text-indigo-300">9.1</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '91%' }} />
                </div>
                <div className="text-xs text-slate-400 font-sans">Excellent story framing</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 text-sm">
                  <span>Technical depth</span>
                  <span className="font-bold text-emerald-300">8.0</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '80%' }} />
                </div>
                <div className="text-xs text-slate-400 font-sans">Solid, could go deeper on trade-offs</div>
              </div>

            </div>

            {/* Bottom AI Tip Box */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs sm:text-sm leading-loose flex items-start gap-3">
              <CheckCircle2 size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-blue-300">AI tip:</strong> When discussing trade-offs, name 2–3 alternatives and why you ruled them out. This signals senior-level thinking.
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
