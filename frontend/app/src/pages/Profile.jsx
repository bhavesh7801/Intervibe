import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../apiClient";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [isCertOpen, setIsCertOpen] = useState(false);
  /* Edit Modal State */ const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTargetRole, setEditTargetRole] = useState("");
  const [editExperienceLevel, setEditExperienceLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    fetchProfileData();
  }, []);
  const fetchProfileData = async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        api.getStats().catch(() => ({ data: null })),
        api.getSessions().catch(() => ({ data: [] })),
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (sessionsRes?.data) setRecentSessions(sessionsRes.data);
    } catch (err) {
      console.error("Error loading profile data:", err);
    } finally {
      setLoading(false);
    }
  };
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
            "Failed to save changes. Please try again.",
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
      className="min-h-screen bg-[#050A18] text-slate-100 py-10 px-4 sm:px-6 lg:py-14 lg:px-10 relative overflow-x-hidden font-sans bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
      data-testid="profile-page"
    >
      
      {/* Deep Space Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-blue-900/20 blur-[150px]" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[800px] rounded-full bg-purple-900/15 blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[150px]" />
      </div>
      <div className="max-w-[1800px] mx-auto space-y-10 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            
            <button
              onClick={() => navigate(-1)}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              
              <ArrowRight className="rotate-180" size={14} /> Back
            </button>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-blue-300 font-semibold">{user.name}</span>
            <span className="text-slate-500 font-normal">
              | User Profile
            </span>
          </div>
          {successMsg && (
            <div className="px-3.5 py-1.5 rounded-full text-sm font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1.5 shadow-md animate-fade-in">
              
              <CheckCircle2 size={14} /> <span>{successMsg}</span>
            </div>
          )}
        </div>
        {/* 12-Column CSS Grid Layout for High Performance Desktop Scaling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* ================= LEFT COLUMN ================= */}
          <ProfileSidebar
            user={user}
            handleOpenEdit={handleOpenEdit}
            logout={logout}
            getInitials={getInitials}
          />
          {/* ================= RIGHT COLUMN ================= */}
          <div className="col-span-1 lg:col-span-8 xl:col-span-8 space-y-6 sm:space-y-10">
            
            <StatsOverviewGrid
              stats={stats}
              recentSessions={recentSessions}
              userTargetRole={user.targetRole}
            />

            {/* Verifiable LinkedIn Certificate Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-[#0C1222] to-cyan-950/50 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/25 shrink-0">
                  🏆
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Verified Technical Interview Credential</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Share your verified performance badge directly to your LinkedIn profile with 1-click.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCertOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl btn-primary text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                View & Share Certificate
              </button>
            </div>

            <ResumeUploaderCard user={user} />
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
  );
};
export default Profile;
