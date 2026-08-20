import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section aria-labelledby="testimonials-heading" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-t border-[#162035]/60">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 flex flex-col items-center"
      >
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">VOICES</span>
        <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
          Loved by candidates & engineers who ship
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-loose pt-1">
          From solo candidates to senior engineers — here is what people say after practicing with Interview Prep AI.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Testimonial 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#0B1124]/90 border border-blue-500/15 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic">
              "Landed my Google L5 offer! The real-time speech feedback and AST complexity scorecards gave me total confidence."
            </p>
          </div>

          <div className="flex items-center gap-3.5 pt-4 border-t border-[#162035]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 border border-blue-400/40 text-white font-black flex items-center justify-center text-xs shadow-md">
              MC
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Maya Chen</div>
              <div className="text-xs text-slate-400">Head of Product, Lumen</div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#0B1124]/90 border border-blue-500/15 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic">
              "Our candidate prep time dropped drastically. The AI interviewer drills into trade-offs just like a real Meta interviewer."
            </p>
          </div>

          <div className="flex items-center gap-3.5 pt-4 border-t border-[#162035]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 border border-cyan-400/40 text-white font-black flex items-center justify-center text-xs shadow-md">
              SV
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Sofia Vargas</div>
              <div className="text-xs text-slate-400">Eng Lead, Northwind</div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#0B1124]/90 border border-blue-500/15 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 space-y-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1"
        >
          <div className="space-y-4">
            <div className="flex text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic">
              "The custom question generator is unmatched. Practiced 50+ deep system design scenarios tailored exactly to Uber's stack."
            </p>
          </div>

          <div className="flex items-center gap-3.5 pt-4 border-t border-[#162035]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-400/40 text-white font-black flex items-center justify-center text-xs shadow-md">
              RK
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Rohan Kapoor</div>
              <div className="text-xs text-slate-400">Staff Architect, Scale</div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
