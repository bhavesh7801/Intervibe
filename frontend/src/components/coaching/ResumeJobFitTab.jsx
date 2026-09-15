import React, { useState } from 'react';
import { FileText, Target, CheckCircle2, AlertCircle, Sparkles, Upload } from 'lucide-react';

export const ResumeJobFitTab = () => {
  const [resumeText, setResumeText] = useState('Senior Full Stack Engineer with 5+ years experience building React, Node.js, TypeScript, PostgreSQL, and AWS microservices.');
  const [jobDescription, setJobDescription] = useState('Looking for a Staff Systems Engineer with Go, Distributed Caching (Redis), Kafka streaming, Kubernetes, and high-throughput systems design.');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = () => {
    setLoading(true);
    setTimeout(() => {
      setMatchResult({
        overallMatch: 78,
        matchingKeywords: ['TypeScript', 'AWS Microservices', 'PostgreSQL', 'High-throughput systems'],
        missingKeywords: ['Kafka Event Streaming', 'Kubernetes Orchestration', 'Golang Systems Programming'],
        recommendation: 'Highlight projects where you built streaming ingestion pipelines or managed container clusters to bridge the gap.'
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Target size={18} className="text-rose-600" />
          <span>Resume & Target Role Fit Analyzer</span>
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          Scan your background against the target company's job requirements for keyword gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            Your Resume Summary / Skills
          </label>
          <textarea
            rows={5}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            Target Job Description (JD)
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleMatch}
        disabled={loading}
        className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
      >
        <Sparkles size={15} />
        <span>{loading ? 'Analyzing Semantic Match...' : 'Calculate Job Fit Score'}</span>
      </button>

      {matchResult && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono text-rose-600">
                {matchResult.overallMatch}%
              </span>
              <span className="text-xs font-bold text-slate-800">
                JD Alignment Compatibility
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-600" />
                Matched Technical Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchingKeywords.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-2">
              <span className="font-bold text-rose-800 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-rose-600" />
                Missing Key Areas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingKeywords.map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium text-[11px]">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 italic">
            <strong>Pro Tip:</strong> {matchResult.recommendation}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeJobFitTab;
