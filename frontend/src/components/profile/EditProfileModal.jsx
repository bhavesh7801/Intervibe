import React, { useState } from 'react';
import { X, User, Briefcase, Target, Check } from 'lucide-react';
import { ROLES, COMPANY_TRACKS, EXPERIENCE_LEVELS } from '../../utils/roleUtils.js';

export const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState(user?.name || 'Candidate');
  const [targetRole, setTargetRole] = useState(user?.targetRole || ROLES[0]);
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || 'Google');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Senior / L5');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, targetRole, targetCompany, experienceLevel });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <User size={18} />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Edit Candidate Profile
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition-colors cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target Dream Company
            </label>
            <select
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-rose-500 focus:bg-white transition-colors cursor-pointer"
            >
              {COMPANY_TRACKS.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-rose-600/20 mt-2"
          >
            <Check size={15} />
            <span>Save Profile Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
