import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const FinalCta: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-8 sm:p-12 lg:p-16 rounded-[36px] bg-[#0A0F1D] border border-blue-500/20 shadow-[0_0_80px_rgba(37,99,235,0.15)] flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden"
      >
        <div className="space-y-4 max-w-2xl relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Crush Your Next Interview?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 leading-loose font-normal px-4">
            Join 50,000+ candidates preparing for FAANG and top-tier tech offers. 100% free access.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-black text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer group hover:scale-[1.03] active:scale-95 whitespace-nowrap"
          >
            <span>Start practicing free</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-white shrink-0" />
          </button>

          <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider uppercase font-bold pt-1 max-w-[280px]">
            INSTANT ACCESS • NO CREDIT CARD REQUIRED
          </span>
        </div>
      </motion.div>
    </section>
  );
};
