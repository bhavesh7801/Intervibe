import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  return (
    <section id="reviews" aria-labelledby="testimonials-heading" className="w-full border-t border-slate-200 py-12 sm:py-16">
      <div className="site-container">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center"
        >
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
            CANDIDATE VOICES
          </span>
          <h2 id="testimonials-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            Loved by Engineers Who Land Offers
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            From solo practice to staff-level engineering loops — what candidates achieve with Intervibe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                "Landed my Google L5 offer! The real-time speech feedback and AST complexity scorecards gave me total confidence."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                MC
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Maya Chen</div>
                <div className="text-xs text-slate-500">Software Engineer, Google L5</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                "Our candidate prep time dropped drastically. The AI interviewer drills into trade-offs just like a real Meta interviewer."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-black flex items-center justify-center text-xs shadow-xs">
                SV
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Sofia Vargas</div>
                <div className="text-xs text-slate-500">Systems Engineer, Meta E5</div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial 3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                "The custom question generator is unmatched. Practiced 50+ deep system design scenarios tailored exactly to Uber's stack."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-black flex items-center justify-center text-xs shadow-xs">
                DK
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm">David Kim</div>
                <div className="text-xs text-slate-500">Staff Engineer, Stripe</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
