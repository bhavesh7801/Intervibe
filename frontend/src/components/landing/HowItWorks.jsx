import React from 'react';
import { motion } from 'motion/react';

const STEPS = [
  {
    step: '01',
    title: 'Choose Target Role & Level',
    description: 'Select your track — Frontend, Backend, Full Stack, or System Design — and target company standard (L4, L5, or L6).'
  },
  {
    step: '02',
    title: 'Simulate Live Spoken Loop',
    description: 'Engage with our real-time voice & coding interviewer. Answer technical challenges, live coding algorithms, and STAR behavioral scenarios.'
  },
  {
    step: '03',
    title: 'Get Instant FAANG Scorecard',
    description: 'Receive detailed radar charts analyzing communication clarity, AST code complexity, speech pacing, and key strengths.'
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="w-full border-t border-slate-200 py-12 sm:py-16 relative z-10">
      <div className="site-container">
        <div className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
            HOW IT WORKS
          </span>
          <h2 id="how-it-works-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            Three Steps to Offer-Ready
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Our streamlined process mirrors actual top-tier technical hiring loops so you walk in confident.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-sm font-mono font-black shrink-0 shadow-xs">
                  {s.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
