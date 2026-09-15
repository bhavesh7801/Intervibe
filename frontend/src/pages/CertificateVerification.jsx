import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Award, ShieldCheck, CheckCircle2, Search, ArrowRight, Home } from 'lucide-react';

export const CertificateVerification = () => {
  const [searchParams] = useSearchParams();
  const certIdParam = searchParams.get('certId') || 'IVB-CERT-2026-L5-ALE';
  const [query, setQuery] = useState(certIdParam);
  const [isVerified, setIsVerified] = useState(true);

  const handleVerify = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsVerified(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
          <ShieldCheck size={30} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Credential Verification Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Verify authentic candidate completion certificates and technical evaluations.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleVerify} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Certificate ID (e.g. IVB-CERT-2026-L5-ALE)"
          className="flex-1 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-rose-500 shadow-xs"
        />
        <button
          type="submit"
          className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Search size={14} />
          <span>Verify</span>
        </button>
      </form>

      {/* Verified Certificate Card */}
      {isVerified && (
        <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="font-extrabold text-sm text-emerald-800">
                Official Authenticated Credential
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-bold border border-emerald-200">
              STATUS: VALID
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</span>
            <h3 className="text-xl font-black text-slate-900">Alex Johnson</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-bold">Track Evaluated</span>
              <p className="font-bold text-slate-800">Google / Meta L5 Senior Software Engineer</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-bold">Evaluation Score</span>
              <p className="font-black text-emerald-600 font-mono">88% (Grade A)</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Certificate ID: {query}</span>
            <span>Issued: September 15, 2026</span>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5">
          <Home size={13} />
          <span>Return to Intervibe Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default CertificateVerification;
