import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FinalCta = () => {
  const scrollToPreview = () => {
    const elem = document.getElementById('preview');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full py-12 sm:py-16">
      <div className="site-container">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-rose-400 text-xs font-mono font-bold">
              <Sparkles size={13} />
              <span>Ready to Elevate Your Career?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-snug">
              Ace Your Next Tech Interview
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of software engineers who use Intervibe to practice realistic coding, architecture, and behavioral loops.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={scrollToPreview}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-95"
              >
                <span>Start Free Practice Now</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
