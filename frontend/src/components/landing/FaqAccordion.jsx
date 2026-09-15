import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'How does Intervibe differ from LeetCode or Pramp?',
    answer: 'Traditional platforms only test if your code passes test cases. Intervibe tests everything real interviewers look for: how you communicate your thought process, how clearly you explain trade-offs, code complexity (AST analysis), and live follow-up questions from the AI interviewer.'
  },
  {
    question: 'Can I practice both live coding and system design?',
    answer: 'Yes! Intervibe includes an interactive code workspace with real-time test execution and AST complexity analysis, an interactive System Design whiteboard canvas, and STAR method behavioral evaluation.'
  },
  {
    question: 'What speech metrics are analyzed during verbal answers?',
    answer: 'Our Groq-powered AI pipeline assesses words per minute (WPM), filler word frequency (e.g. "um", "like"), delivery pacing, and the structured depth of your answer according to company-specific rubrics.'
  },
  {
    question: 'Can I generate custom questions for specific job descriptions?',
    answer: 'Absolutely. You can paste any job description or tech stack, and our AI will generate tailored technical scenarios, architecture challenges, and behavioral prompts.'
  }
];

export const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="w-full border-t border-slate-200 py-12 sm:py-16">
      <div className="site-container">
        <div className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 id="faq-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            Everything You Need to Know
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left font-bold text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:text-rose-600 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-rose-600' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
