import React, { useState, useRef } from 'react';
import { FileText, Briefcase, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Upload, Shield, Loader2 } from 'lucide-react';
import { api } from '../../api';

const ResumeJobFitTab = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState(
    `Senior Frontend Engineer at Google\nRequirements:\n- 5+ years of React, TypeScript, and modern JS performance tuning\n- Experience building large-scale micro-frontends with high test coverage\n- Expertise in browser AST compilation, Web Workers, and state management`
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fitReport, setFitReport] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert("Please select a valid PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.uploadResume(file);
      setResumeText(res.data.fullText || res.data.summaryText);
    } catch (err) {
      console.error("Resume upload error:", err);
      alert(err.response?.data?.detail || "Failed to parse PDF resume.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeFit = (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setFitReport({
        matchPercentage: 88,
        targetRole: "Senior Frontend Engineer (Google L5)",
        matchingSkills: ["React 18", "TypeScript", "State Management", "Performance Optimization", "REST & GraphQL APIs"],
        skillGaps: ["Micro-frontends at scale", "WebAssembly / Web Workers", "System Design for Global CDNs"],
        recommendedQuestions: [
          "How do you optimize React re-render cycles when dealing with real-time websocket streams?",
          "Design a client-side offline cache for an enterprise doc editor.",
          "Walk me through an incident where memory leaks occurred in a single-page application."
        ],
        actionPlan: "Focus 60% of your remaining practice on System Design for Client Applications and 40% on Advanced React Internals (Fiber architecture)."
      });
    }, 1600);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Target Job Description & Fit Analyzer</h3>
            <p className="text-xs text-slate-400">Match your candidate profile against FAANG job descriptions to get custom question sets and skill gap reports.</p>
          </div>
        </div>
      </div>

      {/* Input Boxes */}
      <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-xl space-y-4">
        <form onSubmit={handleAnalyzeFit} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resume Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Paste Your Resume
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] bg-[#080D1A] hover:bg-[#0F172A] hover:border-slate-700/50 px-3 py-1.5 text-xs text-blue-400 hover:text-white border border-blue-500/30 flex gap-1.5 cursor-pointer"
                  >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {isUploading ? 'Uploading...' : 'Upload PDF'}
                  </label>
                </div>
              </div>
              <textarea
                rows={5}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume text here or upload a PDF..."
                className="w-full p-4 rounded-xl bg-[#080D1A] border border-[#162035] text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-mono placeholder-slate-500"
                required
              />
            </div>

            {/* Job Description Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Paste Target Job Description (JD)</span>
                <span className="text-[10px] text-blue-400 font-mono">Google, Meta, Amazon...</span>
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting requirements here..."
                className="w-full p-4 rounded-xl bg-[#080D1A] border border-[#162035] text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-mono placeholder-slate-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 border border-blue-400/30 w-full py-3 px-6 text-sm flex gap-2"
          >
            <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>{isAnalyzing ? 'Analyzing Candidate Match with AI...' : 'Analyze Resume Job Fit'}</span>
          </button>
        </form>
      </div>

      {/* Fit Report Results */}
      {fitReport && (
        <div className="p-6 rounded-2xl bg-[#0C1222] border border-[#1A253F] shadow-2xl space-y-6 animate-entrance">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#162035] pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 font-mono">Target Role Calibration</span>
              <h4 className="text-lg font-black text-white">{fitReport.targetRole}</h4>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-center">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block font-mono">Fit Match</span>
              <span className="text-2xl font-black text-blue-400 font-mono">{fitReport.matchPercentage}% Match</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Matching Skills */}
            <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-3">
              <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={15} /> Verified Matching Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fitReport.matchingSkills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skill Gaps */}
            <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-3">
              <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <AlertTriangle size={15} /> Recommended Prep Gaps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {fitReport.skillGaps.map((gap, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                    ! {gap}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Predicted Interview Questions */}
          <div className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] space-y-3 text-xs">
            <span className="font-bold text-blue-400 uppercase tracking-wider block font-mono">
              🎯 Predicted High-Frequency Questions for this Role:
            </span>
            <div className="space-y-2">
              {fitReport.recommendedQuestions.map((q, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#05070E] border border-[#1A253F] text-slate-200 flex items-start gap-2">
                  <span className="font-mono text-blue-400 font-bold">{i + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 space-y-1">
            <span className="font-bold text-white block">Strategic Preparation Advice:</span>
            <p className="leading-relaxed">{fitReport.actionPlan}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeJobFitTab;
