import React from 'react';
import { Link } from 'react-router-dom';
import { InterviewPrepLogo } from '../Navbar.jsx';

export const Footer = () => {
  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 transition-colors">
      <div className="site-container space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <InterviewPrepLogo size={28} />
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-rose-600 transition-colors">Intervibe</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time AI interview intelligence platform. Master live coding, system architecture, and behavioral STAR loops with instant spoken feedback.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('preview')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Product Preview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('tracks')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Company Tracks
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  How it Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('reviews')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Candidate Reviews
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Auth */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">Candidate Portal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/login" className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors">
                  Create Account / Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Support & Help
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
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
