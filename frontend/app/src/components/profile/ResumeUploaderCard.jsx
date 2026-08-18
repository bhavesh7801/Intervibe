import React, { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  BookOpen,
  Zap,
} from "lucide-react";
import { api } from "../../apiClient";

const ResumeUploaderCard = ({ user }) => {
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeResult, setResumeResult] = useState(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }
    setResumeLoading(true);
    try {
      const res = await api.uploadResume(file);
      setResumeResult(res.data);
    } catch (err) {
      console.error("Resume upload error:", err);
      alert(err.response?.data?.detail || "Failed to parse PDF resume.");
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div className="bg-[#080D1A]/80 border-2 border-indigo-500/40 rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 backdrop-blur-xl transform-gpu will-change-filter shadow-[0_0_25px_rgba(99,102,241,0.15)] flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 w-full">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#162035] text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-black text-white truncate">
              AI Resume Parser & Skill Extractor
            </h3>
            <p className="text-[11px] leading-snug text-slate-400 mt-0.5">
              Upload your resume to extract skills and personalize AI coding questions.
            </p>
          </div>
        </div>
        <label className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap">
          <Upload size={16} />
          <span>{resumeLoading ? "Parsing..." : "Upload PDF Resume"}</span>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleResumeUpload}
            disabled={resumeLoading}
          />
        </label>
      </div>

      {resumeResult && (
        <div className="bg-[#050A18] p-6 rounded-2xl border border-[#1A253F] space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A253F] pb-3 text-sm text-blue-300 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={24} className="text-emerald-400" /> Processed: {resumeResult.filename}
            </span>
            <span className="text-emerald-400 font-mono text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Analysis Ready
            </span>
          </div>

          {resumeResult.analysis && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#080D1A] border border-[#1A253F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-extrabold uppercase tracking-wider text-blue-400 font-mono">
                    Resume Alignment
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {resumeResult.analysis.overallSummary}
                  </h4>
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-mono font-black text-lg shrink-0">
                  Score: {resumeResult.analysis.matchScore}/100
                </div>
              </div>

              {resumeResult.analysis.skillsToLearn && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <BookOpen size={14} className="text-cyan-400" /> 📚 Skills You Should Learn Next
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {resumeResult.analysis.skillsToLearn.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl text-sm font-extrabold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                        <Zap size={12} className="text-cyan-400" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ResumeUploaderCard;
