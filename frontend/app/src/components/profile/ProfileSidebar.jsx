import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Briefcase,
  CheckCircle2,
  Edit3,
  LayoutDashboard,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
const ProfileSidebar = ({ user, handleOpenEdit, logout, getInitials }) => {
  const navigate = useNavigate();
  return (
    <div className="col-span-1 lg:col-span-4 xl:col-span-4 space-y-6 sm:space-y-8">
      
      {/* HERO PROFILE CARD */}
      <div className="card-3d bg-[#080D1A]/80 border-2 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)] rounded-[2rem] p-6 sm:p-10 backdrop-blur-xl transform-gpu will-change-filter relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col items-center text-center gap-4 relative">
          
          {/* Avatar Badge */}
          <div className="relative shrink-0">
            
            <div className="w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-[#050A18] border border-blue-500/30 p-1.5 shadow-[0_0_25px_rgba(59,130,246,0.2)]">
              
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-3xl sm:text-5xl font-black text-white tracking-wider font-mono">
                
                {getInitials(user.name)}
              </div>
            </div>
            <span
              className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-[#080D1A] flex items-center justify-center text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              title="Active Account"
            >
              
              <CheckCircle2 size={12} />
            </span>
          </div>
          {/* Main Info */}
          <div className="flex-1 text-center space-y-3 w-full">
            
            <div className="flex flex-col items-center gap-2">
              
              <h1
                className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight break-words max-w-full"
                data-testid="profile-name"
              >
                
                {user.name}
              </h1>
              <span className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-[12px] font-black bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] uppercase tracking-widest">
                
                Verified Candidate
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300 mt-2">
              
              <span
                className="flex items-center gap-1.5 text-slate-300 break-all text-xs"
                data-testid="profile-email"
              >
                
                <Mail size={14} className="text-slate-400 shrink-0" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wide text-xs">
                
                <Briefcase size={14} className="text-emerald-500" />
                {user.targetRole || "Software Engineer"}
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-2 leading-relaxed px-4">
              
              Preparing for AI mock interviews, live coding, and
              multidimensional feedback reporting.
            </p>
            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              
              <button
                onClick={handleOpenEdit}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                data-testid="edit-profile-btn"
              >
                
                <Edit3 size={13} /> <span>Edit Details</span>
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-200 bg-[#162035] hover:bg-[#1E293B] border border-slate-700/50 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                
                <LayoutDashboard size={13} className="text-emerald-400" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-[#162035] hover:bg-rose-900/30 border border-slate-700/50 hover:border-rose-500/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer group"
              >
                
                <LogOut
                  size={13}
                  className="group-hover:text-rose-400 transition-colors"
                />
                <span className="group-hover:text-rose-400 transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* CANDIDATE DETAILS CARD */}
      <div className="card-3d bg-[#080D1A]/80 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)] rounded-[1.5rem] p-8 backdrop-blur-xl transform-gpu will-change-filter group">
        
        <div className="flex items-center justify-between border-b border-[#1A253F] pb-5 mb-6">
          
          <div className="flex items-center gap-2">
            
            <User
              size={18}
              className="text-blue-400 group-hover:text-blue-300 transition-colors"
            />
            <h2 className="text-base font-bold text-white">
              Candidate Details
            </h2>
          </div>
          <button
            onClick={handleOpenEdit}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-800/50 px-2.5 py-1 rounded-md transition-colors hover:bg-slate-700/50"
          >
            
            <Edit3 size={12} /> <span>Edit</span>
          </button>
        </div>
        <div className="space-y-6 text-sm font-medium">
          
          <div className="flex items-center justify-between">
            
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Full Name
            </span>
            <span className="font-bold text-slate-200">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Email Address
            </span>
            <span className="font-bold text-slate-200">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Target Role Track
            </span>
            <span className="font-bold text-emerald-400">
              {user.targetRole || "Software Engineer"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Account Status
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
              
              <CheckCircle2 size={12} /> Active Candidate
            </span>
          </div>
        </div>
      </div>
      {/* TECHNICAL SKILLS & MASTERY CLOUD */}
      <div className="card-3d bg-[#0B1124]/90 border border-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.1)] rounded-[1.5rem] p-6 sm:p-8 backdrop-blur-xl transform-gpu will-change-filter">
        <div className="flex items-center justify-between border-b border-[#1A253F] pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              Target Skills & Stack
            </h2>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
            Verified
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Python', 'React', 'Algorithms', 'System Design', 'FastAPI', 'Docker', 'SQL', 'Git'].map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.15)] hover:border-indigo-400 hover:text-white transition-all cursor-default"
            >
              ⚡ {skill}
            </span>
          ))}
          <button
            type="button"
            onClick={handleOpenEdit}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#162035] hover:bg-[#202E4C] border border-[#2B3B60] text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <span>+ Add Skill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileSidebar;
