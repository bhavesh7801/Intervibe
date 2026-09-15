import React from 'react';
import { User, Mail, Briefcase, Target, Award, Calendar, Edit3, ShieldCheck } from 'lucide-react';
import { getScoreBadge } from '../../utils/roleUtils.js';

export const ProfileSidebar = ({ user, onEditProfile, onOpenCertificate }) => {
  const badge = getScoreBadge(user?.readinessScore || 78);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Avatar & Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 p-1 shadow-md">
            <img
              src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'candidate'}`}
              alt={user?.name || 'Candidate'}
              className="w-full h-full rounded-full bg-white object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white border-2 border-white shadow-xs">
            <ShieldCheck size={14} />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {user?.name || 'Alex Johnson'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {user?.email || 'candidate@intervibe.ai'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${badge.bg}`}>
            {badge.label}
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            {user?.experienceLevel || 'Senior / L5'}
          </span>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Target Details */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold">
            <Briefcase size={14} className="text-slate-400" />
            <span>Target Role</span>
          </span>
          <span className="font-bold text-slate-900">{user?.targetRole || 'Full Stack Engineer'}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold">
            <Target size={14} className="text-slate-400" />
            <span>Target Company</span>
          </span>
          <span className="font-bold text-slate-900">{user?.targetCompany || 'Google'}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold">
            <Calendar size={14} className="text-slate-400" />
            <span>Member Since</span>
          </span>
          <span className="font-bold text-slate-900">September 2026</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onEditProfile}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit3 size={14} />
          <span>Edit Profile & Targets</span>
        </button>

        <button
          type="button"
          onClick={onOpenCertificate}
          className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
        >
          <Award size={14} />
          <span>View Verified Certificate</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
