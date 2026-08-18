import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-300'
  },
  {
    id: 'meta',
    name: 'Meta',
    role: 'E5 Systems & Mobile Infrastructure',
    focus: 'Binary Trees, AST Code Optimization, System Architecture',
    questionsCount: '150+ Curated Problems',
    acceptanceRate: '92% Success Rate',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    role: 'SDE II / Senior Leadership Loop',
    focus: 'STAR Leadership Principles, Distributed Queues, Heap Algorithms',
    questionsCount: '210+ Curated Problems',
    acceptanceRate: '95% Success Rate',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    role: 'Staff Backend & Financial Infrastructure',
    focus: 'Low-Latency APIs, Idempotency, Concurrency Control',
    questionsCount: '120+ Curated Problems',
    acceptanceRate: '91% Success Rate',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
  }
];

export const CompanyTracks: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string>('google');

  return (
    <section aria-labelledby="tracks-heading" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 border-t border-[#162035]/60 relative z-10">
      <div className="text-center space-y-4 mb-16 flex flex-col items-center">
        <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">COMPANY TARGET TRACKS</span>
        <h2 id="tracks-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
          Tailored specifically for top-tier loops
        </h2>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-loose">
          Every company evaluates differently. Practice with company-specific question distributions and scoring rubrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {COMPANY_TRACKS.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            onClick={() => { setSelectedCompany(track.id); navigate('/assessment'); }}
            className={`p-5 sm:p-7 rounded-3xl bg-[#0e121f] border border-blue-500/20 shadow-xl space-y-5 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between ${selectedCompany === track.id ? 'ring-2 ring-blue-500/40 bg-blue-950/20' : ''}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-white group-hover:text-blue-300 transition-colors">{track.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${track.badgeBg}`}>
                  {track.acceptanceRate}
                </span>
              </div>

              <div className="text-xs font-mono text-blue-300 font-bold">{track.role}</div>

              <p className="text-xs sm:text-sm text-slate-400 leading-loose">
                <strong className="text-slate-200">Focus:</strong> {track.focus}
              </p>
            </div>

            <div className="pt-4 border-t border-[#162035] flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{track.questionsCount}</span>
              <ArrowRight size={15} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
