import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const FinalCta: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#0A0F1D] border border-blue-500/20 shadow-[0_0_80px_rgba(37,99,235,0.15)] flex flex-col items-center justify-center text-center gap-6 relative overflow-hidden"
      >
        <div className="space-y-3 max-w-2xl relative z-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-normal px-2">
            Join 50,000+ candidates preparing for FAANG and high-growth engineering offers. 100% free access.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-[270px] lg:w-[290px] h-13 sm:h-14 px-6 sm:px-8 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:brightness-110 shadow-[0_0_35px_rgba(37,99,235,0.45)] border border-blue-400/40 flex items-center justify-center gap-3 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 text-center"
          >
            <span>Start Practicing Free</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-white shrink-0" />
          </button>

          <span className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
            INSTANT ACCESS • NO CREDIT CARD REQUIRED
          </span>
        </div>
      </motion.div>
    </section>
  );
};
