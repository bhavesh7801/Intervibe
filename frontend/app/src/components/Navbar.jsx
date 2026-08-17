import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, UserPlus, LogOut, LayoutDashboard, LayoutGrid, Gauge, Grid, Menu, X, Code2, Layers, Wand2, User, MessageSquare, MoreVertical, Compass, Trophy, ShieldCheck, Award, Flame } from 'lucide-react';
import QuestionGeneratorModal from './QuestionGeneratorModal';
import { isTechRole } from '../utils/roleUtils';

export const InterviewPrepLogo = ({ size = 32 }) => (
  <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
      <defs>
        <linearGradient id="ip-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5722" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="80%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="ip-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Outer 4-petal faceted geometric logo badge */}
      <path d="M 50,5 L 68,32 L 95,50 L 68,68 L 50,95 L 32,68 L 5,50 L 32,32 Z" fill="url(#ip-grad-1)" />
      <path d="M 50,18 L 62,38 L 82,50 L 62,62 L 50,82 L 38,62 L 18,50 L 38,38 Z" fill="url(#ip-grad-2)" opacity="0.9" />
      {/* Inner White Rocket Spark */}
      <path d="M 50,28 L 56,44 L 72,50 L 56,56 L 50,72 L 44,56 L 28,50 L 44,44 Z" fill="#FFFFFF" />
    </svg>
  </div>
);

const Navbar = () => {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Scroll listener for smooth navbar background opacity transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close 3-dots dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation Interceptor helper: Redirect unauthenticated users to /register
  const handleProtectedNav = (e, path) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setNavDropdownOpen(false);
    if (!user) {
      navigate('/register');
    } else {
      navigate(path);
    }
  };

  const handleFeaturesClick = (e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setNavDropdownOpen(false);
    
    if (location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/home') {
      const elem = document.getElementById('features');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const elem = document.getElementById('features');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  const handleAiGeneratorClick = () => {
    setMobileMenuOpen(false);
    setNavDropdownOpen(false);
    if (!user) {
      navigate('/register');
    } else {
      setIsGeneratorOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setNavDropdownOpen(false);
    navigate('/login');
  };

  const handleQuestionGenerated = (newQ) => {
    if (newQ.questionType === 'coding') {
      navigate('/coding', { state: { newQuestion: newQ } });
    } else {
      navigate('/assessment', { state: { newQuestion: newQ } });
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 w-full backdrop-blur-md ${
          scrolled 
            ? 'bg-[#060813]/90 shadow-2xl border-b border-blue-500/20' 
            : 'bg-[#060813]/80 border-b border-slate-800/80'
        }`} 
        data-testid="navbar"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 h-[76px] flex items-center justify-between gap-4">
          
          {/* Left Side: Drawer Button & Brand Logo (Matching Screenshot) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className="p-2.5 rounded-xl bg-[#0F1422] border border-blue-500/30 hover:border-blue-400 text-slate-300 hover:text-white transition-all cursor-pointer group shadow-lg shadow-blue-500/10"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
              data-testid="left-youtube-menu-btn"
            >
              {navDropdownOpen ? <X size={18} className="text-cyan-400" /> : <Grid size={18} className="text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group shrink-0" data-testid="navbar-logo">
              <InterviewPrepLogo size={34} />
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                Intervibe
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Premium PC Design) */}
          <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#0A0E17]/60 border border-slate-700/50 shadow-inner backdrop-blur-xl">
            <a 
              href="#features" 
              onClick={handleFeaturesClick} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800/60"
            >
              <Compass size={14} className="text-blue-400 opacity-80" />
              <span className="tracking-wide">Features</span>
            </a>
            
            <a 
              href="/coding" 
              onClick={(e) => handleProtectedNav(e, '/coding')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive('/coding') 
                  ? 'bg-blue-500/15 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-blue-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Code2 size={14} className={isActive('/coding') ? "text-blue-400" : "text-blue-400 opacity-80"} />
              <span className="tracking-wide">Problems</span>
            </a>
            
            <a 
              href="/assessment" 
              onClick={(e) => handleProtectedNav(e, '/assessment')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive('/assessment') 
                  ? 'bg-purple-500/15 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)] border border-purple-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Layers size={14} className={isActive('/assessment') ? "text-purple-400" : "text-purple-400 opacity-80"} />
              <span className="tracking-wide">Mock Interviews</span>
            </a>
            
            <a 
              href="/leaderboard" 
              onClick={(e) => handleProtectedNav(e, '/leaderboard')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive('/leaderboard') 
                  ? 'bg-amber-500/15 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)] border border-amber-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Trophy size={14} className={isActive('/leaderboard') ? "text-amber-400" : "text-amber-400 opacity-80"} />
              <span className="tracking-wide">Leaderboard</span>
            </a>
            
            <button 
              onClick={(e) => handleProtectedNav(e, '/coaching')} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive('/coaching') 
                  ? 'bg-emerald-500/15 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)] border border-emerald-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <MessageSquare size={14} className={isActive('/coaching') ? "text-emerald-400" : "text-emerald-400 opacity-80"} />
              <span className="tracking-wide">AI Coaching</span>
            </button>
          </nav>

          {/* Right Side: Primary Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAiGeneratorClick}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-cyan-400/40"
                  data-testid="nav-ai-generator"
                >
                  <Wand2 size={15} className="text-cyan-100 animate-bounce" />
                  <span className="hidden sm:inline">AI Question Generator</span>
                  <span className="sm:hidden">AI Generator</span>
                </button>

                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-[#0F1422] border border-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  <LayoutGrid size={15} className="text-amber-400" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  data-testid="nav-login-link"
                >
                  <LogIn size={15} className="text-blue-400" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
                  data-testid="nav-register-link"
                >
                  <UserPlus size={15} className="text-white" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* YouTube-Style PC Left Sidebar Drawer & Overlay */}
      {navDropdownOpen && (
        <>
          {/* Dark Semi-Transparent Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setNavDropdownOpen(false)}
          />

          {/* Left Sliding Sidebar Drawer (Premium Glassmorphism) */}
          <aside 
            ref={dropdownRef}
            className="fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-[#060813]/85 backdrop-blur-2xl border-r border-slate-800/60 shadow-[10px_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col justify-between overflow-y-auto animate-slide-right"
            data-testid="youtube-pc-sidebar-drawer"
          >
            <div>
              {/* Drawer Top Header: Logo + Close Button */}
              <div className="h-[76px] px-5 flex items-center justify-between border-b border-slate-800/60 bg-transparent">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNavDropdownOpen(false)}
                    className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-all cursor-pointer"
                  >
                    <X size={18} className="text-cyan-400" />
                  </button>
                  <Link to="/" onClick={() => setNavDropdownOpen(false)} className="flex items-center gap-2.5">
                    <InterviewPrepLogo size={28} />
                    <span className="text-base font-extrabold text-white tracking-tight">
                      Interview Prep AI
                    </span>
                  </Link>
                </div>
              </div>

              {/* Navigation Items (Modern Glassmorphism Categories) */}
              <div className="p-4 space-y-6">
                
                {/* Main Navigation Section */}
                <div className="space-y-1.5">
                  <div className="px-3 pb-2 text-[11px] font-black uppercase tracking-widest text-blue-400 flex items-center justify-between">
                    <span>Main Workspace</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={(e) => handleProtectedNav(e, '/dashboard')}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3.5 transition-all group ${
                      isActive('/dashboard')
                        ? 'bg-gradient-to-r from-blue-600/20 to-transparent text-white border-l-4 border-l-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <LayoutGrid size={18} className={isActive('/dashboard') ? "text-blue-400" : "text-slate-500 group-hover:text-blue-300 transition-colors"} />
                    <span>Candidate Dashboard</span>
                  </Link>

                  <button
                    type="button"
                    onClick={(e) => handleProtectedNav(e, '/coding')}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3.5 transition-all text-left cursor-pointer group ${
                      isActive('/coding')
                        ? 'bg-gradient-to-r from-cyan-600/20 to-transparent text-white border-l-4 border-l-cyan-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <Code2 size={18} className={isActive('/coding') ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-300 transition-colors"} />
                    <span>Coding IDE Workspace</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleProtectedNav(e, '/assessment')}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3.5 transition-all text-left cursor-pointer group ${
                      isActive('/assessment')
                        ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-white border-l-4 border-l-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <Layers size={18} className={isActive('/assessment') ? "text-purple-400" : "text-slate-500 group-hover:text-purple-300 transition-colors"} />
                    <span>Mock Interview Assessments</span>
                  </button>

                  <Link
                    to="/leaderboard"
                    onClick={(e) => handleProtectedNav(e, '/leaderboard')}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3.5 transition-all group ${
                      isActive('/leaderboard')
                        ? 'bg-gradient-to-r from-amber-500/20 to-transparent text-white border-l-4 border-l-amber-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <Trophy size={18} className={isActive('/leaderboard') ? "text-amber-400" : "text-slate-500 group-hover:text-amber-300 transition-colors"} />
                    <span>Global Leaderboard</span>
                  </Link>

                  <Link
                    to="/feedback"
                    onClick={() => setNavDropdownOpen(false)}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3.5 transition-all group ${
                      isActive('/feedback')
                        ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-white border-l-4 border-l-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <MessageSquare size={18} className={isActive('/feedback') ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-300 transition-colors"} />
                    <span>Feedback & Support</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[#162035]" />

                {/* AI Tools Section */}
                <div className="space-y-2">
                  <div className="px-3 text-[11px] font-black uppercase tracking-widest text-cyan-400 flex items-center justify-between">
                    <span>AI Intelligence Hub</span>
                    <Sparkles size={13} className="text-cyan-400" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleProtectedNav(e, '/coaching')}
                    className={`w-full px-4 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3.5 transition-all text-left cursor-pointer group ${
                      isActive('/coaching')
                        ? 'bg-gradient-to-r from-rose-500/20 to-transparent text-white border-l-4 border-l-rose-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-4 border-transparent'
                    }`}
                  >
                    <Sparkles size={18} className={isActive('/coaching') ? "text-rose-400" : "text-slate-500 group-hover:text-rose-300 transition-colors"} />
                    <span>AI Career Coaching</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAiGeneratorClick}
                    className="w-full px-3.5 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-blue-500/25 flex items-center justify-between border border-cyan-400/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Wand2 size={18} className="text-white animate-bounce" />
                      <span>AI Generator Engine</span>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/20">PRO</span>
                  </button>
                </div>

                {/* Divider */}
                {user && <div className="h-[1px] bg-[#162035]" />}

                {/* Account Section */}
                {user && (
                  <div className="space-y-2">
                    <div className="px-3 text-[11px] font-black uppercase tracking-widest text-amber-400 flex items-center justify-between">
                      <span>Candidate Profile</span>
                      <ShieldCheck size={14} className="text-amber-400" />
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setNavDropdownOpen(false)}
                      className={`w-full p-3.5 rounded-2xl text-sm font-semibold flex items-center justify-between transition-all border ${
                        isActive('/profile')
                          ? 'bg-purple-900/30 text-white border-purple-500/50 shadow-lg shadow-purple-500/20'
                          : 'bg-[#0E1528] text-slate-300 hover:bg-[#151F3B] border-[#1E2C4B]'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md">
                          {user.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="font-extrabold text-white text-xs truncate">{user.name}</span>
                          <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 shrink-0">
                        Profile
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-3.5 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 text-rose-300 bg-rose-950/20 hover:bg-rose-950/50 border border-rose-800/40 hover:border-rose-500 transition-all cursor-pointer mt-2"
                    >
                      <LogOut size={16} className="text-rose-400" />
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10 text-center text-[11px] text-slate-500 bg-[#060813]/60 backdrop-blur-md">
              Interview Prep AI Enterprise v2.5
            </div>
          </aside>
        </>
      )}

      {/* Global AI Question Generator Modal */}
      <QuestionGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onQuestionGenerated={handleQuestionGenerated}
        defaultType="coding"
      />
    </>
  );
};

export default Navbar;