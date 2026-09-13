import { useState } from "react";
import {
  Mail,
  Briefcase,
  CheckCircle2,
  Edit3,
  LogOut,
  Sparkles,
  Plus,
  X,
  FileDown,
  Building2,
  Clock
} from "lucide-react";

const ProfileSidebar = ({ user, handleOpenEdit, logout, getInitials }) => {
  // Dynamic Skill Management State
  const [skills, setSkills] = useState(() => {
    try {
      const saved = localStorage.getItem("candidate_skills");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore storage error */
    }
    return [
      "Python",
      "React",
      "SQL",
      "Machine Learning",
      "Product Strategy",
      "AWS",
      "System Design",
      "FastAPI"
    ];
  });

  const [newSkillInput, setNewSkillInput] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      try {
        localStorage.setItem("candidate_skills", JSON.stringify(updated));
      } catch {
        /* ignore storage error */
      }
    }
    setNewSkillInput("");
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    try {
      localStorage.setItem("candidate_skills", JSON.stringify(updated));
    } catch {
      /* ignore storage error */
    }
  };

  const handleExportReport = () => {
    const reportData = {
      candidateName: user?.name || "Candidate",
      email: user?.email,
      targetRole: user?.targetRole || "Software Engineer",
      experienceLevel: user?.experienceLevel || "Senior L5",
      skills,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(user?.name || "candidate").toLowerCase().replace(/\s+/g, "_")}_evaluation_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="col-span-1 lg:col-span-4 xl:col-span-4 space-y-6">
      {/* 3D HOLOGRAPHIC CANDIDATE PERSONA CARD */}
      <div className="bg-[#060D24]/90 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.18),inset_0_0_25px_rgba(6,182,212,0.05)] rounded-[2rem] p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden flex flex-col items-center text-center">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-0 w-48 h-48 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* 3D FLOATING AVATAR WITH DUAL NEON ORBIT RINGS */}
        <div className="relative my-3 flex items-center justify-center">
          {/* Outer Holographic Orbit Ring */}
          <div
            className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.8),inset_0_0_20px_rgba(59,130,246,0.6)] animate-pulse pointer-events-none"
            style={{
              transform: "rotateX(68deg) rotateY(12deg)",
              boxShadow: "0 0 30px #06b6d4, inset 0 0 20px #3b82f6"
            }}
          />

          {/* Secondary Counter Orbit Ring */}
          <div
            className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.5)] pointer-events-none"
            style={{
              transform: "rotateX(72deg) rotateY(-18deg)"
            }}
          />

          {/* Main Avatar Core */}
          <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#08122D] border-2 border-cyan-400/50 p-1.5 shadow-[0_0_35px_rgba(6,182,212,0.45)]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0D1B44] via-[#091432] to-[#040B1E] flex flex-col items-center justify-center text-3xl sm:text-4xl font-black text-white font-mono tracking-wider shadow-inner">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                {getInitials(user?.name)}
              </span>
            </div>

            {/* Active Status Badge */}
            <span
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#060D24] flex items-center justify-center text-white shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              title="Verified Active Candidate"
            >
              <CheckCircle2 size={13} />
            </span>
          </div>
        </div>

        {/* CANDIDATE NAME & LEVEL BADGE */}
        <div className="mt-4 space-y-2 w-full">
          <h1
            className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            data-testid="profile-name"
          >
            {user?.name || "Candidate Name"}
          </h1>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border border-blue-400/50 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>Senior Candidate L5</span>
          </div>
        </div>

        {/* 3 META PILL CHIPS ROW */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full text-xs font-bold text-slate-200">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#091536] border border-cyan-500/40 text-cyan-300 shadow-sm">
            <Briefcase size={12} className="text-cyan-400" />
            <span className="truncate max-w-[140px]">{user?.targetRole || "Product Manager"}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#091536] border border-blue-500/40 text-blue-300 shadow-sm">
            <Clock size={12} className="text-blue-400" />
            <span>{user?.experienceLevel || "6+ Years"}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#091536] border border-indigo-500/40 text-indigo-300 shadow-sm">
            <Building2 size={12} className="text-indigo-400" />
            <span>Google</span>
          </div>
        </div>

        {/* SKILL CLOUD SECTION */}
        <div className="w-full mt-6 pt-5 border-t border-cyan-500/20">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 font-bold">
            <span className="w-8 h-px bg-cyan-500/30" />
            <span>Skill Cloud</span>
            <span className="w-8 h-px bg-cyan-500/30" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center items-center">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#0A163B] border border-cyan-500/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:border-cyan-300 hover:scale-105 transition-all cursor-default group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-rose-500/20 transition-colors ml-0.5 cursor-pointer"
                  title={`Remove ${skill}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}

            {isAddingSkill ? (
              <form onSubmit={handleAddSkill} className="inline-flex items-center gap-1.5 animate-fadeIn">
                <input
                  type="text"
                  autoFocus
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="e.g. AWS, GraphQL..."
                  className="px-3 py-1 text-xs rounded-full bg-[#040A1E] border border-cyan-400 text-white placeholder-slate-500 focus:outline-none w-32 shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsAddingSkill(false);
                  }}
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={13} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingSkill(true)}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#071330] hover:bg-[#0B1E48] border border-cyan-500/30 text-cyan-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <Plus size={12} className="text-cyan-400" />
                <span>Add Skill</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 BOTTOM ACTION BUTTONS */}
        <div className="w-full space-y-2.5 mt-6 pt-5 border-t border-cyan-500/20">
          {/* Edit Profile Button */}
          <button
            onClick={handleOpenEdit}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600/30 via-cyan-600/30 to-blue-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 hover:text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all cursor-pointer active:scale-95"
            data-testid="edit-profile-btn"
          >
            <Edit3 size={15} className="text-cyan-400" />
            <span>Edit Profile</span>
          </button>

          {/* Export Report Button */}
          <button
            onClick={handleExportReport}
            className="w-full h-11 rounded-xl bg-[#08122D] hover:bg-[#0E1E46] border border-blue-500/30 hover:border-blue-400 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <FileDown size={15} className="text-blue-400" />
            <span>Export Report</span>
          </button>

          {/* Log Out Button */}
          <button
            onClick={logout}
            className="w-full h-11 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-400 text-rose-300 hover:text-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileSidebar;
