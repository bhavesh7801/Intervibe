import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const COMPANY_TRACKS = [
  {
    id: 'google',
    name: 'Google',
    role: 'L5 Senior Software Engineer',
    focus: 'Graphs, Dynamic Programming, System Scalability',
    questionsCount: '180+ Curated Problems',
    acceptanceRate: '94% Success Rate',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400'
  },
  {
    id: 'meta',
    name: 'Meta',
    role: 'E5 Systems & Mobile Infrastructure',
    focus: 'Binary Trees, AST Code Optimization, System Architecture',
    questionsCount: '150+ Curated Problems',
    acceptanceRate: '92% Success Rate',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/60 text-sky-800 dark:text-sky-300'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    role: 'SDE II / Senior Leadership Loop',
    focus: 'STAR Leadership Principles, Distributed Queues, Heap Algorithms',
    questionsCount: '210+ Curated Problems',
    acceptanceRate: '95% Success Rate',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    role: 'Staff Backend & Financial Infrastructure',
    focus: 'Low-Latency APIs, Idempotency, Concurrency Control',
    questionsCount: '120+ Curated Problems',
    acceptanceRate: '91% Success Rate',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60 text-purple-800 dark:text-purple-300'
  }
];

export const CompanyTracks = () => {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState('google');

  return (
    <section id="tracks" aria-labelledby="tracks-heading" className="w-full border-t border-slate-200 dark:border-slate-800 py-12 sm:py-16 relative z-10">
      <div className="site-container">
        <div className="text-center space-y-3 mb-10 sm:mb-12 flex flex-col items-center">
          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            COMPANY TARGET TRACKS
          </span>
          <h2 id="tracks-heading" className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            Tailored for Top-Tier Tech Loops
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
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
              onClick={() => setSelectedCompany(track.id)}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${selectedCompany === track.id ? 'ring-2 ring-rose-500/30' : ''}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{track.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${track.badgeBg}`}>
                    {track.acceptanceRate}
                  </span>
                </div>

                <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">{track.role}</div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">Focus:</strong> {track.focus}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>{track.questionsCount}</span>
                <Link
                  to={user ? "/interview" : "/register"}
                  className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <span>Start</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyTracks;
