import React from 'react';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

export const Legal = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Terms of Service & Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: September 15, 2026
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-rose-600" />
            <span>1. Candidate Privacy & Audio Telemetry</span>
          </h2>
          <p>
            Intervibe processes candidate audio and video streams solely in-browser and through secure ephemeral AI inference endpoints for the express purpose of technical evaluation scoring. We never sell candidate telemetry data to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Lock size={16} className="text-rose-600" />
            <span>2. Intellectual Property & AI Questions</span>
          </h2>
          <p>
            All generated coding questions, system design rubrics, and feedback reports are provided for personal educational use and interview preparation simulation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={16} className="text-rose-600" />
            <span>3. Authenticated Credential Verification</span>
          </h2>
          <p>
            Intervibe verified readiness certificates represent benchmark performance against simulated FAANG interview standards and may be independently verified using our public registry.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Legal;
