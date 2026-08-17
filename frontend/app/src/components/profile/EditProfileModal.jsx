import React from "react";
import { X, AlertCircle, Save } from "lucide-react";
import { COMMON_ROLE_TRACKS } from "../../utils/roleUtils";
const ROLE_OPTIONS = COMMON_ROLE_TRACKS;
const EXPERIENCE_OPTIONS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Staff / Lead",
];
const EditProfileModal = ({
  isEditOpen,
  setIsEditOpen,
  editName,
  setEditName,
  editTargetRole,
  setEditTargetRole,
  editExperienceLevel,
  setEditExperienceLevel,
  handleSaveProfile,
  saving,
  errorMsg,
}) => {
  if (!isEditOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      
      <div className="card-3d bg-[#080D1A] border border-blue-500/20 rounded-[2rem] p-6 sm:p-10 max-w-2xl w-full shadow-[0_0_30px_rgba(59,130,246,0.1)] space-y-6 relative">
        
        <button
          onClick={() => setIsEditOpen(false)}
          className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-white bg-[#162035] hover:bg-slate-700 transition-colors cursor-pointer"
        >
          
          <X size={16} />
        </button>
        <div className="space-y-1 text-center">
          
          <h2 className="text-xl font-black text-white">
            Edit Candidate Details
          </h2>
          <p className="text-xs text-slate-400">
            
            Update your name, primary target interview track, and experience
            level.
          </p>
        </div>
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3 animate-fade-in">
            
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        <form
          onSubmit={handleSaveProfile}
          className="space-y-4 text-xs font-medium"
        >
          
          <div className="space-y-1.5">
            
            <label className="block text-slate-400">
              Full Candidate Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-[#050A18] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              required
            />
          </div>
          <div className="space-y-1.5">
            
            <label className="block text-slate-400">
              Target Interview Role
            </label>
            <select
              value={editTargetRole}
              onChange={(e) => setEditTargetRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#050A18] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner cursor-pointer"
            >
              
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            
            <label className="block text-slate-400">
              Experience Level
            </label>
            <select
              value={editExperienceLevel}
              onChange={(e) => setEditExperienceLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#050A18] border border-[#1A253F] text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner cursor-pointer"
            >
              
              {EXPERIENCE_OPTIONS.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-4 flex items-center justify-end gap-4">
            
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-5 py-2.5 rounded-full text-slate-300 bg-[#162035] hover:bg-[#1E293B] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
            >
              
              <Save size={14} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditProfileModal;
