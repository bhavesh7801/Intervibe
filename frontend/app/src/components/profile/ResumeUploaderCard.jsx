import { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Zap,
  FolderOpen
} from "lucide-react";
import { api } from "../../apiClient";

const ResumeUploaderCard = () => {
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeResult, setResumeResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const defaultExtractedSkills = [
    "Project Management",
    "Data Analysis",
    "Team Leadership",
    "System Architecture"
  ];

  const handleResumeUpload = async (file) => {
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

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleResumeUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleResumeUpload(file);
  };

  const displaySkills = resumeResult?.extractedSkills && resumeResult.extractedSkills.length > 0
    ? resumeResult.extractedSkills.slice(0, 4)
    : defaultExtractedSkills;

  return (
    <div className="bg-[#060D24]/90 border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_0_35px_rgba(6,182,212,0.15)] backdrop-blur-2xl space-y-4 sm:space-y-5">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>AI Resume Scanner</span>
            </h3>
          </div>
        </div>

        {resumeResult && (
          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 size={12} /> Ready
          </span>
        )}
      </div>

      {/* SPLIT SCANNER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* LEFT DROPZONE (7 COLS ON PC) */}
        <div className="lg:col-span-8">
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
            className={`w-full min-h-[150px] sm:min-h-[170px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer transition-all duration-300 ${
              isDragOver
                ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.5)] scale-[1.01]"
                : "bg-[#04091A]/90 border-cyan-500/40 hover:border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
            }`}
          >
            {/* ANIMATED GLOWING HORIZONTAL LASER SCAN BEAM */}
            <div
              className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_20px_#06b6d4,0_0_40px_#3b82f6] pointer-events-none"
              style={{
                top: "50%",
                animation: "pulse 2s infinite ease-in-out"
              }}
            />

            {/* Glowing Laser Center Core Sparkle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-8 bg-cyan-400/20 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <FolderOpen size={26} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-bounce" />
              <h4 className="text-sm sm:text-base font-extrabold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {resumeLoading ? "AI Scanning & Extracting AST Skills..." : "Drag & Drop Your Resume"}
              </h4>
              <p className="text-[11px] text-cyan-300/80 font-mono">
                Supports PDF (Max 15MB) • Instant ATS Keyword Extraction
              </p>
            </div>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={onFileInputChange}
              disabled={resumeLoading}
            />
          </label>
        </div>

        {/* RIGHT EXTRACTED SKILLS PANEL (4 COLS ON PC) */}
        <div className="lg:col-span-4 bg-[#04091A]/80 border border-cyan-500/25 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full min-h-[150px] sm:min-h-[170px] shadow-sm">
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles size={12} className="text-cyan-400" />
              <span>Extracted Skills:</span>
            </h4>

            <div className="space-y-1.5">
              {displaySkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#08122D] border border-cyan-500/30 text-xs font-bold text-cyan-200 shadow-sm"
                >
                  <Zap size={12} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <label className="w-full mt-3 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer transition-all active:scale-95">
            <Upload size={13} />
            <span>{resumeLoading ? "Uploading..." : "Upload New"}</span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={onFileInputChange}
              disabled={resumeLoading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploaderCard;

