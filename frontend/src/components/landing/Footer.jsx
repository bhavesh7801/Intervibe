import React from 'react';
import { InterviewPrepLogo } from '../Navbar.jsx';

export const Footer = () => {
  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 py-12">
      <div className="site-container space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <InterviewPrepLogo size={28} />
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Intervibe</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Real-time AI interview intelligence platform. Master live coding, system architecture, and behavioral STAR loops with instant spoken feedback.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('preview')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Product Preview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('tracks')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Company Tracks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  How it Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('reviews')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Candidate Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Intervibe Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
