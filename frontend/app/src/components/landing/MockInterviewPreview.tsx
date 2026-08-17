import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, Sparkles } from 'lucide-react';

export const MockInterviewPreview: React.FC = () => {
  const [activeStage, setActiveStage] = useState<'intro' | 'behavioral' | 'coding' | 'system' | 'questions'>('coding');

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pb-16 flex justify-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-8 w-full max-w-5xl text-left"
      >
        <div className="rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-2xl shadow-blue-500/10 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          
          {/* Top Window Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between pb-5 border-b border-[#1a2642] gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs sm:text-sm font-mono text-slate-300 font-bold ml-2">Mock Interview • Senior Frontend Engineer</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
              <Mic size={15} className="text-blue-400 animate-pulse" />
              <span>02:47</span>
            </div>
          </div>

          {/* Main Content Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
            
            {/* Left Interview Stages Navigation Sidebar */}
            <div className="md:col-span-4 space-y-3 border-b md:border-b-0 md:border-r border-[#1a2642] pb-5 md:pb-0 md:pr-5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-4">INTERVIEW STAGES</div>
              <button
                onClick={() => setActiveStage('intro')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeStage === 'intro' ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/30 border border-blue-400/50' : 'text-slate-300 hover:text-white bg-[#080d1a] border border-[#162035]'}`}
              >
                • Intro & warmup
              </button>
              <button
                onClick={() => setActiveStage('behavioral')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeStage === 'behavioral' ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/30 border border-blue-400/50' : 'text-slate-300 hover:text-white bg-[#080d1a] border border-[#162035]'}`}
              >
                • Behavioral
              </button>
              <button
                onClick={() => setActiveStage('coding')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeStage === 'coding' ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/30 border border-blue-400/50' : 'text-slate-300 hover:text-white bg-[#080d1a] border border-[#162035]'}`}
              >
                • Coding
              </button>
              <button
                onClick={() => setActiveStage('system')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeStage === 'system' ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/30 border border-blue-400/50' : 'text-slate-300 hover:text-white bg-[#080d1a] border border-[#162035]'}`}
              >
                • System design
              </button>
              <button
                onClick={() => setActiveStage('questions')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeStage === 'questions' ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/30 border border-blue-400/50' : 'text-slate-300 hover:text-white bg-[#080d1a] border border-[#162035]'}`}
              >
                • Questions for you
              </button>
            </div>

            {/* Right Chat & Scores Panel */}
            <div className="md:col-span-8 space-y-5">
              
              {/* AI Interviewer Speech Bubble */}
              <div className="p-5 rounded-2xl bg-[#080d1a] border border-[#162035] text-slate-200 text-sm sm:text-base leading-loose space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Sparkles size={16} />
                  <span>AI Interviewer • Listening</span>
                </div>
                <p className="pt-1 text-slate-200">
                  "Let's talk about a time you had a disagreement with a teammate. Walk me through the situation, how you handled it, and what the outcome was."
                </p>
              </div>

              {/* Candidate Speech Bubble */}
              <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-100 text-sm sm:text-base leading-loose space-y-1.5 ml-auto max-w-xl shadow-md">
                <div className="text-xs font-mono text-blue-300 font-bold">Your answer</div>
                <p className="pt-1 text-slate-100">
                  "At my last role, my teammate and I disagreed on the API design for a payments service. I scheduled a whiteboard session to compare trade-offs objectively..."
                </p>
              </div>

              {/* Real-time Scores Meter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="p-4 rounded-2xl bg-[#05070e] border border-[#162035] text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-slate-300 font-mono text-xs">
                    <span>✨ Clarity</span>
                    <span className="text-blue-300 font-bold text-sm">8.5/10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#05070e] border border-[#162035] text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-slate-300 font-mono text-xs">
                    <span>📈 Confidence</span>
                    <span className="text-cyan-300 font-bold text-sm">7.2/10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#05070e] border border-[#162035] text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-slate-300 font-mono text-xs">
                    <span>⭐ Structure</span>
                    <span className="text-emerald-300 font-bold text-sm">9.0/10</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
