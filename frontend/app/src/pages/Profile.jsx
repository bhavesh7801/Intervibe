import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../apiClient";
import { ArrowRight, ChevronRight, CheckCircle2, Award, ExternalLink, ShieldCheck } from "lucide-react";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import StatsOverviewGrid from "../components/profile/StatsOverviewGrid";
import ResumeUploaderCard from "../components/profile/ResumeUploaderCard";
import RecentActivitySection from "../components/profile/RecentActivitySection";
import EditProfileModal from "../components/profile/EditProfileModal";
import CertificateModal from "../components/profile/CertificateModal";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [isCertOpen, setIsCertOpen] = useState(false);
  
  /* Edit Modal State */
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTargetRole, setEditTargetRole] = useState("");
  const [editExperienceLevel, setEditExperienceLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      try {
        const [statsRes, sessionsRes] = await Promise.all([
          api.getStats().catch(() => ({ data: null })),
          api.getSessions().catch(() => ({ data: [] })),
        ]);
        if (isMounted) {
          if (statsRes?.data) setStats(statsRes.data);
          if (sessionsRes?.data) setRecentSessions(sessionsRes.data);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    fetchProfileData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenEdit = () => {
    setEditName(user?.name || "");
    setEditTargetRole(user?.targetRole || "Software Engineer");
    setEditExperienceLevel(user?.experienceLevel || "Mid Level");
    setErrorMsg("");
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setErrorMsg("Candidate name cannot be empty.");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    try {
      const updatePayload = {
        name: editName.trim(),
        targetRole: editTargetRole,
        experienceLevel: editExperienceLevel,
      };
      const res = await api.updateProfile(updatePayload);
      const updatedUserData = res.data;
      if (setUser) {
        setUser((prev) => ({
          ...prev,
          name: updatedUserData.name,
          targetRole: updatedUserData.targetRole,
          experienceLevel: updatedUserData.experienceLevel,
        }));
      }
      setSuccessMsg("Candidate details updated successfully!");
      setIsEditOpen(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      if (setUser && user) {
        setUser((prev) => ({
          ...prev,
          name: editName.trim(),
          targetRole: editTargetRole,
          experienceLevel: editExperienceLevel,
        }));
        setSuccessMsg("Candidate details updated!");
        setIsEditOpen(false);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(
          err.response?.data?.detail ||
            "Failed to save changes. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#040714] text-slate-100 font-sans relative select-none"
      data-testid="profile-page"
    >
      {/* 3D COSMIC BACKGROUND & GLOWING MESH */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px), radial-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        />

        {/* Dynamic Glowing Nebula Spheres */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-cyan-600/15 blur-[160px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[160px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-10 left-1/3 w-[800px] h-[500px] rounded-full bg-indigo-700/15 blur-[180px]" />

        {/* Perspective 3D Grid Floor at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[350px] opacity-25 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.15)), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "bottom center",
          }}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="max-w-[1680px] mx-auto space-y-8">
          
          {/* NAVIGATION BREADCRUMB */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium">
              <button
                onClick={() => navigate(-1)}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <ArrowRight className="rotate-180" size={14} />
                <span>Back</span>
              </button>
              <ChevronRight size={12} className="text-slate-600" />
              <span className="text-cyan-300 font-bold">{user.name}</span>
              <span className="text-slate-500 font-normal">|</span>
              <span className="text-slate-400">Candidate Dashboard</span>
            </div>

            {successMsg && (
              <div className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-fade-in">
                <CheckCircle2 size={14} />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* 12-COLUMN MAIN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ================= LEFT PERSONA SIDEBAR (4 cols) ================= */}
            <ProfileSidebar
              user={user}
              handleOpenEdit={handleOpenEdit}
              logout={logout}
              getInitials={getInitials}
            />

            {/* ================= RIGHT METRICS & ACTIVITY COLUMN (8 cols) ================= */}
            <div className="col-span-1 lg:col-span-8 space-y-6 sm:space-y-8">
              
              {/* TOP 4 KPI CARDS */}
              <StatsOverviewGrid
                stats={stats}
                recentSessions={recentSessions}
                userTargetRole={user.targetRole}
              />

              {/* VERIFIABLE LINKEDIN CERTIFICATE BANNER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#070E28]/95 via-[#0C173F]/95 to-[#081232]/95 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/30 shrink-0">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                        Verified Technical Interview Credential
                      </h3>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                        <ShieldCheck size={11} />
                        VERIFIED
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Showcase your AI interview benchmark percentile directly on your LinkedIn profile with 1-click.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCertOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold whitespace-nowrap shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-300/30 shrink-0"
                >
                  <span>View & Share Certificate</span>
                  <ExternalLink size={13} />
                </button>
              </div>

              {/* AI RESUME SCANNER */}
              <ResumeUploaderCard user={user} />

              {/* RECENT SESSIONS (3-COLUMN CARDS) */}
              <RecentActivitySection
                recentSessions={recentSessions}
                userTargetRole={user.targetRole}
              />
            </div>
          </div>
        </div>

        {/* ===== VERIFIABLE CERTIFICATE MODAL ===== */}
        <CertificateModal
          isOpen={isCertOpen}
          onClose={() => setIsCertOpen(false)}
          user={user}
          userStats={stats}
        />

        {/* ===== EDIT CANDIDATE DETAILS MODAL ===== */}
        <EditProfileModal
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          editName={editName}
          setEditName={setEditName}
          editTargetRole={editTargetRole}
          setEditTargetRole={setEditTargetRole}
          editExperienceLevel={editExperienceLevel}
          setEditExperienceLevel={setEditExperienceLevel}
          handleSaveProfile={handleSaveProfile}
          saving={saving}
          errorMsg={errorMsg}
        />
      </div>
    </div>
  );
};

export default Profile;
