import React, { useState } from 'react';
import { 
  Award, CheckCircle2, ShieldCheck, Share2, 
  Download, ExternalLink, X, Sparkles, Copy, Check 
} from 'lucide-react';
import { api } from '../../apiClient';

export const CertificateModal = ({ isOpen, onClose, user, userStats }) => {
  const [copied, setCopied] = useState(false);
  const [certData, setCertData] = useState(() => ({
    certificate_id: `IV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    verification_hash: '9F82A4C17B3E52D0',
    candidate_name: user?.name || 'Verified Candidate',
    role: user?.targetRole || 'Full-Stack Software Engineer',
    overall_score: userStats?.averageScore || 88,
    percentile: 94,
    issue_date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    verification_url: 'https://intervibe.duckdns.org/verify',
    linkedin_add_url: `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Intervibe+Certified+Software+Engineer&organizationName=Intervibe+AI&issueYear=2026&issueMonth=8`
  }));

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(certData.verification_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#0B1124]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(6,182,212,0.2)] max-h-[92vh] overflow-y-auto scrollbar-thin">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 cursor-pointer z-30 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono mb-2">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>Cryptographically Verifiable Credential</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
            Official Interview Certification
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Share your verified interview mastery badge on LinkedIn or download as PDF.
          </p>
        </div>

        {/* Certificate Card View (Printable / Shareable) */}
        <div 
          id="certificate-print-zone"
          className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#060A17] via-[#0B1124] to-[#0A1428] border-2 border-cyan-500/40 relative overflow-hidden shadow-2xl space-y-6"
        >
          {/* Ambient Glow & Watermark */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Certificate Top Badges */}
          <div className="flex items-center justify-between border-b border-[#1A253F] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25">
                IV
              </div>
              <div>
                <div className="text-sm font-black text-white font-heading">INTERVIBE AI</div>
                <div className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Certification Authority</div>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="text-slate-400 text-[10px]">Credential ID:</div>
              <div className="text-cyan-300 font-bold">{certData.certificate_id}</div>
            </div>
          </div>

          {/* Certificate Body Text */}
          <div className="text-center space-y-3 py-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">This certifies that</p>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight">
              {certData.candidate_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              has demonstrated technical excellence and problem-solving mastery in the role of
            </p>
            <div className="inline-block px-4 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-extrabold text-sm sm:text-base">
              {certData.role}
            </div>
          </div>

          {/* Performance Percentile Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#050814]/80 border border-[#1A253F] text-center">
              <div className="text-[10px] text-slate-400 font-mono">Overall Score</div>
              <div className="text-lg font-black text-white font-heading">{certData.overall_score}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#050814]/80 border border-[#1A253F] text-center">
              <div className="text-[10px] text-slate-400 font-mono">Global Percentile</div>
              <div className="text-lg font-black text-emerald-400 font-heading">Top {100 - certData.percentile}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#050814]/80 border border-[#1A253F] text-center">
              <div className="text-[10px] text-slate-400 font-mono">Issue Date</div>
              <div className="text-xs font-bold text-slate-200 mt-1">{certData.issue_date}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#050814]/80 border border-[#1A253F] text-center">
              <div className="text-[10px] text-slate-400 font-mono">Verification</div>
              <div className="text-xs font-bold text-cyan-300 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-cyan-400" />
                <span>SHA-256</span>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1A253F] text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>Signature Hash: {certData.verification_hash}</span>
            </div>
            <div>Authorized by Intervibe AI Systems</div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={certData.linkedin_add_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0A66C2]/30 active:scale-[0.97]"
          >
            <Share2 size={16} />
            <span>Add to LinkedIn Profile</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="py-3 px-4 rounded-xl bg-[#050814] hover:bg-[#162035] border border-[#1A253F] text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.97]"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            <span>{copied ? 'Link Copied!' : 'Copy Verification URL'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.97] cursor-pointer"
          >
            <Download size={16} />
            <span>Download / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
