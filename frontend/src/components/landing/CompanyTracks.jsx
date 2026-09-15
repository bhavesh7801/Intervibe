import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const COMPANY_TRACKS = [
  {
    id: 'google',
    name: 'Google',
    role: 'L5 Senior Software Engineer',
    focus: 'Graphs, Dynamic Programming, System Scalability',
    questionsCount: '180+ Curated Problems',
    acceptanceRate: '94% Success Rate',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-700'
  },
  {
    id: 'meta',
    name: 'Meta',
    role: 'E5 Systems & Mobile Infrastructure',
    focus: 'Binary Trees, AST Code Optimization, System Architecture',
    questionsCount: '150+ Curated Problems',
    acceptanceRate: '92% Success Rate',
    badgeBg: 'bg-sky-50 border-sky-200 text-sky-800'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    role: 'SDE II / Senior Leadership Loop',
    focus: 'STAR Leadership Principles, Distributed Queues, Heap Algorithms',
    questionsCount: '210+ Curated Problems',
    acceptanceRate: '95% Success Rate',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-800'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    role: 'Staff Backend & Financial Infrastructure',
    focus: 'Low-Latency APIs, Idempotency, Concurrency Control',
    questionsCount: '120+ Curated Problems',
    acceptanceRate: '91% Success Rate',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-800'
  }
];

export const CompanyTracks = () => {
  const [selectedCompany, setSelectedCompany] = useState('google');

  const scrollToPreview = () => {
    const elem = document.getElementById('preview');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tracks" aria-labelledby="tracks-heading" className="w-full border-t border-slate-200 py-12 sm:py-16 relative z-10">
      <div className="site-container">
        <div className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-widest">
            COMPANY TARGET TRACKS
          </span>
          <h2 id="tracks-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
            Tailored for Top-Tier Tech Loops
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
            Practice with company-specific question distributions, evaluation rubrics, and architecture expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANY_TRACKS.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => { setSelectedCompany(track.id); scrollToPreview(); }}
              className={`p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${selectedCompany === track.id ? 'ring-2 ring-rose-500/30' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">{track.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${track.badgeBg}`}>
                    {track.acceptanceRate}
                  </span>
                </div>

                <div className="text-xs font-mono text-rose-600 font-bold">{track.role}</div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Focus:</strong> {track.focus}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{track.questionsCount}</span>
                <ArrowRight size={15} className="text-rose-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyTracks;
