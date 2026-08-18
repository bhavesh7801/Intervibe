import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Award, CheckCircle2, ArrowLeft, Share2, Sparkles, Trophy } from 'lucide-react';

const CertificateVerification = () => {
  const { certId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const candidateName = searchParams.get('name') || user?.name || 'Alex Johnson';

  return (
    <div className="min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-center bg-[#060813] text-slate-200 py-8 px-4 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Platform
          </Link>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 size={14} className="text-emerald-400" /> Verified Credential
          </span>
        </div>

        {/* Certificate Card */}
        <div className="card-3d rounded-3xl p-5 sm:p-8 bg-gradient-to-b from-[#141A33] via-[#0E1326] to-[#070A14] border-2 border-amber-500/40 text-center relative overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 shadow-2xl shadow-amber-500/20">
            <Award size={36} />
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mb-1">
              Certificate of Completion
            </h1>
            <p className="text-xs font-bold text-amber-300 tracking-widest uppercase">
              FAANG Interview Intelligence Standard
            </p>
          </div>

          <div className="py-4 border-y border-[#1A253F] space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">This Credential Certificate Verifies That</p>
            <p className="text-xl sm:text-3xl font-black text-amber-300 tracking-wide break-words">{candidateName}</p>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto pt-1">
              Has successfully completed rigorous AI-driven technical evaluations and demonstrated competency in Software Engineering & System Architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left bg-[#070914] p-4 rounded-2xl border border-[#162035]">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-extrabold">Certificate ID</p>
              <p className="text-xs font-mono font-bold text-blue-400 break-all">{certId || 'CERT-8592-FAANG'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-extrabold">Verification Status</p>
              <p className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} /> Authenticated
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-center w-full">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto justify-center py-3 px-6 rounded-2xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              <Share2 size={16} /> Share Credential on LinkedIn
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateVerification;
