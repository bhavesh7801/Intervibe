import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import CompetencyRadarChart from '../components/CompetencyRadarChart.jsx';
import CertificateModal from '../components/profile/CertificateModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Award, ArrowLeft, Download, Share2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCert, setShowCert] = useState(false);

  const evaluation = location.state?.evaluation || {
    overallScore: 88,
    grade: 'A',
    summary: 'Outstanding structured performance. Clear communication of Big-O trade-offs and robust handling of distributed caching and edge conditions.',
    strengths: [
      'Identified O(N) linear time and O(1) space optimal pattern early',
      'Structured response using the STAR behavioral framework',
      'Articulated Redis caching invalidation strategies clearly'
    ],
    improvements: [
      'Proactively state 64-bit integer overflow edge-cases',
      'Mention multi-region database replication latency'
    ],
    competencies: {
      problemSolving: 92,
      codeQuality: 86,
      systemDesign: 84,
      communication: 90,
      speed: 88
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Interview Performance Report
          </h1>
          <p className="text-xs text-slate-500">
            Session evaluated on September 15, 2026 • FAANG L5 Benchmark
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCert(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Award size={14} className="text-amber-400" />
            <span>Generate Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/interview')}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Practice Another Loop</span>
          </button>
        </div>
      </div>

      {/* Main Feedback Breakdown */}
      <FeedbackPanel feedback={evaluation} />

      {/* Competencies Breakdown Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Candidate Competency Radar
          </h3>
          <p className="text-xs text-slate-500">
            Your performance benchmarked against Google & Meta L5 candidate percentiles.
          </p>
          <CompetencyRadarChart />
        </div>

        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Recommended Next Practice Steps
            </h3>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-rose-600 block">1. System Design Deep Dive</span>
                <p className="text-slate-600">Practice sharding & distributed rate limiting with sliding window logs.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-indigo-600 block">2. Behavioral STAR Polish</span>
                <p className="text-slate-600">Refine conflict resolution stories with quantitative dollar/latency metrics.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Readiness Score Updated:</span>
            <span className="text-sm font-black font-mono text-emerald-600">+4% Increased to 88%</span>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        user={user}
      />
    </div>
  );
};

export default Results;
