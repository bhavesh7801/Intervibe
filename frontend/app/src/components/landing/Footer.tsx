import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewPrepLogo } from '../Navbar';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#04060d] border-t border-[#141b2d] pt-20 pb-16 text-base text-slate-400">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 gap-y-10 sm:gap-10">
          
          {/* Column 1: Brand & Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <InterviewPrepLogo size={32} />
              <span className="text-2xl font-black text-white">Intervibe</span>
            </div>
            <p className="text-base text-slate-400 max-w-sm leading-relaxed font-medium">
              AI-powered mock assessments engineered to get you hired at FAANG and top-tier tech companies worldwide.
            </p>
          </div>

          {/* Column 2: PRODUCT */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-sm font-mono">PRODUCT</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button className="opacity-50 cursor-not-allowed">Features <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-1">Soon</span></button></li>
              <li><button onClick={() => navigate('/coding')} className="hover:text-white transition-colors cursor-pointer">Pricing</button></li>
              <li><button onClick={() => navigate('/assessment')} className="hover:text-white transition-colors cursor-pointer">Changelog</button></li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-sm font-mono">RESOURCES</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button className="opacity-50 cursor-not-allowed">Blog <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-1">Soon</span></button></li>
              <li><button className="opacity-50 cursor-not-allowed">Documentation</button></li>
              <li><button className="opacity-50 cursor-not-allowed">Community</button></li>
            </ul>
          </div>

          {/* Column 4: COMPANY */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-sm font-mono">COMPANY</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button className="opacity-50 cursor-not-allowed">About</button></li>
              <li><button className="opacity-50 cursor-not-allowed">Careers</button></li>
              <li><button onClick={() => navigate('/feedback')} className="hover:text-white transition-colors cursor-pointer">Contact</button></li>
            </ul>
          </div>

          {/* Column 5: LEGAL */}
          <div className="space-y-5">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-sm font-mono">LEGAL</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button className="opacity-50 cursor-not-allowed">Privacy Policy</button></li>
              <li><button className="opacity-50 cursor-not-allowed">Terms of Service</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Social Icons Row */}
        <div className="pt-10 border-t border-[#141b2d] flex flex-col sm:flex-row items-center justify-between gap-6 text-base text-slate-400 font-medium">
          <div>© 2026 Intervibe AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
