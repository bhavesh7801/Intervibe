import React from 'react';
import { X, Award, ShieldCheck, Download, Share2, Check } from 'lucide-react';
import CopyButton from '../CopyButton.jsx';

export const CertificateModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  const certId = 'IVB-CERT-2026-L5-' + (user?.name ? user.name.substring(0, 3).toUpperCase() : 'CAND');
  const verifyUrl = `${window.location.origin}/verify?certId=${certId}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Award size={18} />
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Verified Interview Readiness Certificate
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

        {/* Certificate Card Frame */}
        <div className="border-4 border-double border-amber-300/80 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center space-y-4 relative overflow-hidden shadow-inner">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Award size={24} />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">
              Certificate of Technical Competency
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              {user?.name || 'Alex Johnson'}
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Has successfully passed rigorous simulated FAANG algorithm, distributed architecture, and leadership evaluation loops with an average score of <strong className="text-slate-900">88% (A-)</strong>.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-amber-200 text-[10px] text-slate-500 font-mono">
            <span>ID: {certId}</span>
            <span>Issued: September 2026</span>
          </div>
        </div>

        {/* Verification Link & Share */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Shareable Public Verification Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={verifyUrl}
              className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono"
            />
            <CopyButton text={verifyUrl} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            alert('Downloading Certificate PDF...');
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Download size={15} />
          <span>Download Official PDF Certificate</span>
        </button>
      </div>
    </div>
  );
};

export default CertificateModal;
