// roleUtils.js - Interview roles, tiers, company tracks, and score metrics

export const ROLES = [
  'Full Stack Engineer',
  'Frontend Specialist (React/TS)',
  'Backend Systems Engineer (Python/Go/Java)',
  'Distributed Systems Architect',
  'Machine Learning / AI Engineer',
  'Engineering Manager / Tech Lead',
  'Data Engineer & ETL Specialist',
  'Mobile Engineer (React Native / iOS)'
];

export const EXPERIENCE_LEVELS = [
  { id: 'junior', label: 'Junior (0-2 yrs)', badge: 'L3 / Junior', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'mid', label: 'Mid-Level (2-5 yrs)', badge: 'L4 / Mid', color: 'text-sky-700 bg-sky-50 border-sky-200' },
  { id: 'senior', label: 'Senior (5-8 yrs)', badge: 'L5 / Senior', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { id: 'staff', label: 'Staff / Principal (8+ yrs)', badge: 'L6+ / Staff', color: 'text-rose-700 bg-rose-50 border-rose-200' }
];

export const COMPANY_TRACKS = [
  {
    id: 'google',
    name: 'Google',
    logo: '🔴',
    style: 'Deep DSA, Scalable Distributed Systems & Googleyness',
    difficulty: 'High',
    color: 'from-blue-500/10 via-red-500/10 to-amber-500/10 border-blue-200',
    questionsCount: 140,
    tags: ['DSA', 'System Design', 'Googliness', 'Go / C++ / Python']
  },
  {
    id: 'meta',
    name: 'Meta',
    logo: '🔵',
    style: 'Fast-paced coding speed, high-throughput systems & Product Sense',
    difficulty: 'High',
    color: 'from-blue-600/10 via-indigo-500/10 to-cyan-500/10 border-indigo-200',
    questionsCount: 165,
    tags: ['Graph Algorithms', 'Live Coding', 'Product Architecture', 'React']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '🟡',
    style: '16 Leadership Principles (LP) & Pragmatic System Architecture',
    difficulty: 'Medium-High',
    color: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-amber-200',
    questionsCount: 190,
    tags: ['Leadership Principles', 'STAR Method', 'AWS Architecture', 'Java / Python']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🟢',
    style: 'Design patterns, Object-Oriented principles, and cloud engineering',
    difficulty: 'Medium',
    color: 'from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-emerald-200',
    questionsCount: 130,
    tags: ['OOP / SOLID', 'Azure Cloud', 'System Architecture', 'C# / TypeScript']
  },
  {
    id: 'apple',
    name: 'Apple',
    logo: '⚪',
    style: 'Low-level performance, memory management, and meticulous UX design',
    difficulty: 'High',
    color: 'from-slate-500/10 via-zinc-400/10 to-slate-300/10 border-slate-300',
    questionsCount: 110,
    tags: ['Concurrency', 'Memory Leaks', 'Clean Architecture', 'Swift / C++']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: '🔴',
    style: 'Culture memo alignment, high-concurrency microservices, and resilience',
    difficulty: 'Very High',
    color: 'from-rose-600/10 via-red-600/10 to-rose-900/10 border-rose-300',
    questionsCount: 95,
    tags: ['Chaos Engineering', 'High Concurrency', 'Culture Memo', 'Distributed Tracing']
  }
];

export const DIFFICULTY_CONFIG = {
  Easy: {
    label: 'Easy',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pill: 'bg-emerald-500 text-white'
  },
  Medium: {
    label: 'Medium',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    pill: 'bg-amber-500 text-white'
  },
  Hard: {
    label: 'Hard',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    pill: 'bg-rose-500 text-white'
  }
};

export const getScoreColor = (score) => {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-sky-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-rose-600';
};

export const getScoreBadge = (score) => {
  if (score >= 90) return { label: 'Top 5% Ready', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (score >= 75) return { label: 'Interview Ready', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
  if (score >= 60) return { label: 'Needs Polish', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
  return { label: 'Practice Required', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
};
