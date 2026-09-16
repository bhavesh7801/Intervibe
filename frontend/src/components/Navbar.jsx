import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Menu, X, ArrowRight, LogOut, User, LayoutDashboard, Bot, Trophy, Sun, Moon } from 'lucide-react';

export const InterviewPrepLogo = ({ size = 32 }) => (
  <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_2px_8px_rgba(225,29,72,0.25)]">
      <defs>
        <linearGradient id="nav-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E11D48" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="nav-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BE123C" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      <path d="M 50,5 L 68,32 L 95,50 L 68,68 L 50,95 L 32,68 L 5,50 L 32,32 Z" fill="url(#nav-grad-1)" />
      <path d="M 50,18 L 62,38 L 82,50 L 62,62 L 50,82 L 38,62 L 18,50 L 38,38 Z" fill="url(#nav-grad-2)" opacity="0.9" />
      <path d="M 50,28 L 56,44 L 72,50 L 56,56 L 50,72 L 44,56 L 28,50 L 44,44 Z" fill="#FFFFFF" />
    </svg>
  </div>
);

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs py-3'
          : 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 py-3.5'
      }`}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none" aria-label="Intervibe Home">
          <InterviewPrepLogo size={34} />
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
            Intervibe
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300" aria-label="Main Navigation">
          {user ? (
            <>
              <Link to="/dashboard" className={`flex items-center gap-1.5 transition-colors ${location.pathname === '/dashboard' ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'}`}>
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </Link>
              <Link to="/interview" className={`transition-colors ${location.pathname === '/interview' ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'}`}>
                Mock Interview
              </Link>
              <Link to="/coding" className={`transition-colors ${location.pathname === '/coding' ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'}`}>
                IDE Workspace
              </Link>
              <Link to="/assessment" className={`transition-colors ${location.pathname === '/assessment' ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'}`}>
                System Design
              </Link>
              <Link to="/coaching" className={`flex items-center gap-1.5 transition-colors ${location.pathname === '/coaching' ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'}`}>
                <Bot size={14} />
                <span>AI Coaching</span>
              </Link>
              <Link to="/leaderboard" className={`flex items-center gap-1.5 transition-colors ${location.pathname === '/leaderboard' ? 'text-rose-600 font-extrabold' : 'hover:text-rose-600'}`}>
                <Trophy size={14} />
                <span>Leaderboard</span>
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('preview')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Product Preview
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('tracks')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Company Tracks
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                How it Works
              </button>
              <Link to="/leaderboard" className="hover:text-rose-600 transition-colors">
                Leaderboard
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user.name || 'Candidate'}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm shadow-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-600" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 px-4 py-6 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-2.5 font-bold text-slate-700 dark:text-slate-200 text-xs">
            {user ? (
              <>
                <Link to="/dashboard" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Dashboard</Link>
                <Link to="/interview" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Mock Interview</Link>
                <Link to="/coding" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">IDE Workspace</Link>
                <Link to="/assessment" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">System Design</Link>
                <Link to="/coaching" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">AI Coaching</Link>
                <Link to="/profile" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Profile & Certs</Link>
                <Link to="/leaderboard" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">Leaderboard</Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('preview')}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Product Preview
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('tracks')}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Company Tracks
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  How it Works
                </button>
                <Link to="/leaderboard" className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                  Leaderboard
                </Link>
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="w-full py-2.5 text-center font-bold text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center font-bold text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 text-center font-bold text-xs rounded-xl bg-rose-600 text-white shadow-sm"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
