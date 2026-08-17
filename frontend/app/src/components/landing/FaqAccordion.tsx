import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: "Is Interview Prep AI completely free to use?",
    answer: "Yes, 100%! All candidates get free access to our coding workspace, AST complexity analyzer, system design whiteboard, and AI mock interview simulations with zero credit card required."
  },
  {
    question: "How does the AST (Abstract Syntax Tree) complexity analysis work?",
    answer: "Our Python/JS parser compiles your submitted code into a structural Abstract Syntax Tree. It inspects loop nest levels, recursion depth, and auxiliary data structures to provide guaranteed O(N) time and O(1) space runtime proofs."
  },
  {
    question: "Which target tech companies and roles are covered?",
    answer: "We offer tailored question banks and mock interviewer personalities for Google, Meta, Amazon, Apple, Stripe, Netflix, Microsoft, and Uber across Software Engineering, Systems Engineering, and Engineering Management."
  },
  {
    question: "What programming languages are supported in the Monaco IDE?",
    answer: "Full IntelliSense autocomplete, syntax highlighting, and testcase verification are active for Python, JavaScript, TypeScript, C++, Java, and Go."
  }
];

export const FaqAccordion: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-t border-[#162035]/60">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 flex flex-col items-center"
      >
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">FREQUENTLY ASKED QUESTIONS</span>
        <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
          Got questions? We've got answers.
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-5">
        {FAQS.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className={`rounded-2xl border overflow-hidden shadow-lg transition-all ${
                isOpen ? 'bg-[#151c30] border-blue-500/50' : 'bg-[#0e121f] border-blue-500/20'
              }`}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-5 font-bold text-base sm:text-lg text-white hover:text-blue-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <span>{faq.question}</span>
                <ChevronDown size={22} className={`text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${idx}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 sm:px-7 pb-7 text-xs sm:text-sm text-slate-300 leading-loose border-t border-[#162035] pt-5"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
