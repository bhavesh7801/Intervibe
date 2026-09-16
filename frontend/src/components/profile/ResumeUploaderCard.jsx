import React, { useState } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, 
  ArrowRight, ShieldAlert, Target, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../apiClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const ResumeUploaderCard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowed = ['.pdf', '.docx', '.doc', '.txt'];
    const nameLower = selected.name.toLowerCase();
    const isAllowed = allowed.some((ext) => nameLower.endsWith(ext));

    if (!isAllowed) {
      setError('Please upload a PDF (.pdf), Word (.docx), or Text (.txt) resume.');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError('');
    setFile(selected);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selected);
      formData.append('target_role', user?.targetRole || 'Full Stack Engineer');

      const res = await apiClient.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setAnalysis(res.data?.analysis || null);
      showToast('Resume parsed and synchronized with AI model!', 'success');
    } catch (err) {
      console.error('Resume upload error:', err);
      const msg = err.response?.data?.detail || 'Failed to analyze resume document.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-rose-600 dark:text-rose-400" />
            <span>Resume & Skill Gap Parser</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Upload your resume to automatically tailor questions and detect missing skill gaps for {user?.targetRole || 'your target role'}.
          </p>
        </div>

        {analysis && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold">
              {analysis.overallScore || 0}% Fit
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {!file ? (
        <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Upload size={20} />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Click to upload or drag and drop your resume
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">PDF, DOCX, TXT up to 10MB</span>
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {file.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  {uploading ? (
                    <>
                      <RefreshCw size={11} className="animate-spin text-rose-600" />
                      <span>Parsing skills & evaluating role gaps...</span>
                    </>
                  ) : (
                    <span>Parsed & synchronized with interview intelligence model</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!uploading && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Ready</span>
                </span>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Remove resume"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Quick Missing Skills & Matched Summary */}
          {analysis && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    <ShieldAlert size={14} />
                    <span>Missing Skills for {user?.targetRole || 'Target Role'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingSkills.map((item, idx) => {
                      const name = typeof item === 'string' ? item : item.skill;
                      return (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-medium"
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {analysis.matchedSkills?.length || 0} Matched competencies found
                </span>
                <Link
                  to="/coaching"
                  className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <span>Open Full Gap Analyzer</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploaderCard;
