import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  Mic,
  Code2,
  Trophy
} from 'lucide-react';

const FONT_MONO = "'JetBrains Mono', ui-monospace, Menlo, monospace";

const TARGET_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'Engineering Manager',
  'Other / Non-technical'
];

/* ---------- Reveal-on-mount wrapper ---------- */
const Reveal = ({ children, delay = 0, y = 24, className = '' }) => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 40);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0'
      }`}
      style={{ transform: shown ? 'translateY(0)' : `translateY(${y}px)`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ---------- Password strength calculation ---------- */
const scorePassword = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score += 30;
  if (pwd.length >= 12) score += 15;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 20;
  if (/\d/.test(pwd)) score += 20;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
  return Math.min(100, score);
};

const getStrengthInfo = (score) => {
  if (score === 0) return { label: '', color: '#4B4468' };
  if (score < 40) return { label: 'Weak', color: '#FB7185' };
  if (score < 75) return { label: 'Fair', color: '#F59E0B' };
  return { label: 'Strong', color: '#10B981' };
};

const AuthPage = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const { login, register, verifyOTP, resendOTP, googleLogin } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    targetRole: TARGET_ROLES[0]
  });

  // OTP Verification State
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const passwordScore = scorePassword(form.password);
  const strengthInfo = getStrengthInfo(passwordScore);

  const switchMode = (next) => {
    setMode(next);
    setStep('form');
    setError(null);
    setSuccessMsg(null);
    if (next === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  const handleGoogleSignIn = () => {
    setError(null);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId.includes('your_client_id') || clientId.includes('YOUR_CLIENT_ID')) {
      setError("Google Client ID is set to a placeholder. Please update VITE_GOOGLE_CLIENT_ID in frontend/app/.env with your actual Client ID.");
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setError("Google login library is loading. Please try again in a few seconds.");
      return;
    }

    try {
      setLoading(true);
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (response) => {
          if (response.error) {
            setError(`Google OAuth failed: ${response.error_description || response.error}`);
            setLoading(false);
            return;
          }

          if (response.access_token) {
            try {
              await googleLogin(response.access_token, form.targetRole || null);
              navigate('/dashboard');
            } catch (err) {
              setError(err.response?.data?.detail || err.message || 'Failed to authenticate with Google');
              setLoading(false);
            }
          } else {
            setError('Failed to obtain Google access token');
            setLoading(false);
          }
        },
        error_callback: (err) => {
          setError(`Google OAuth error: ${err.message || 'Unknown error'}`);
          setLoading(false);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      setError("Failed to initialize Google login.");
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError("Those passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        navigate('/dashboard');
      } else {
        await register(form.name, form.email, form.password, form.targetRole, 'Mid Level');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!form.email) {
      setError('Please enter your email address in the Email field above to receive a reset code.');
      return;
    }

    setLoading(true);
    try {
      await resendOTP(form.email);
      setRegisteredEmail(form.email);
      setStep('otp');
      setSuccessMsg(`Password reset 6-digit code sent to ${form.email}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpInput];
      digits.forEach((d, idx) => {
        if (idx < 6) newOtp[idx] = d;
      });
      setOtpInput(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      otpRefs[nextFocus]?.current?.focus();
      return;
    }

    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const code = otpInput.join('');
    if (code.length < 6) {
      return setError('Please enter all 6 digits of your verification code');
    }

    setLoading(true);
    try {
      await verifyOTP(registeredEmail, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTPCode = async () => {
    setError(null);
    setSuccessMsg(null);
    setResending(true);
    try {
      await resendOTP(registeredEmail);
      setSuccessMsg('A new 6-digit verification code has been sent to your email!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#060813] text-slate-100 relative overflow-x-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-500/30 selection:text-white" data-testid="auth-page">
      {/* Background Ambient Radial Glows (Exact Screenshot Palette) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(20,32,66,0.8)_0%,transparent_75%)] blur-2xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(12,18,34,0.6)_0%,transparent_70%)] blur-3xl" />
      </div>

      <main className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center relative z-10 my-auto px-4 lg:px-8">
        
        {/* LEFT COLUMN — Brand & Feature Showcase */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-start space-y-8">
          {/* Prominent Left Hero Brand Header */}
          <Reveal>
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 border border-blue-400/30 group-hover:scale-105 transition-all">
                <Sparkles size={28} className="animate-pulse" />
              </div>
              <div>
                <span className="text-3xl font-black tracking-tight text-white block leading-none">
                  Interview Prep <span className="text-blue-400">AI</span>
                </span>
                <span className="text-xs font-bold text-slate-400 mt-1 block tracking-wider uppercase" style={{ fontFamily: FONT_MONO }}>
                  AI-Powered Interview Intelligence
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-4xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Ace your technical interviews <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent italic font-serif">
                in a single pass.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl">
              Practice realistic mock interviews with live voice AI, instant 4-dimension competency breakdown, and Monaco IDE code review.
            </p>
          </Reveal>

          {/* Feature Showcase Badges */}
          <Reveal delay={220} className="w-full max-w-2xl space-y-6">
            {[
              { icon: Mic, title: 'Voice AI Roleplay', desc: 'Simulate real FAANG interviewer pressure & speech pacing' },
              { icon: Code2, title: 'Monaco Code IDE', desc: 'AST time & space complexity analysis in Python, JS & C++' },
              { icon: Trophy, title: 'FAANG Benchmark', desc: 'Competency radar chart & exportable PDF evaluation report' }
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#0C1222] border border-[#1A253F] backdrop-blur-md hover:border-blue-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{f.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Metric Stats Footer Line */}
          <Reveal delay={300}>
            <div className="flex items-center gap-10 pt-8 border-t border-[#1A253F] w-full max-w-2xl">
              <div>
                <div className="text-3xl font-black text-white" style={{ fontFamily: FONT_MONO }}>10,000+</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">MOCK INTERVIEWS</div>
              </div>
              <div className="h-10 w-px bg-[#1A253F]" />
              <div>
                <div className="text-3xl font-black text-white" style={{ fontFamily: FONT_MONO }}>94%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">CANDIDATE PASS RATE</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* RIGHT COLUMN — Glassmorphic Auth Card */}
        <div className="lg:col-span-6 w-full max-w-[500px] mx-auto">
          <Reveal delay={120} y={30}>
            <div className="bg-[#0C1222] backdrop-blur-2xl border border-[#1A253F] rounded-3xl pt-9 pb-9 px-8 sm:px-10 shadow-[0_25px_90px_rgba(0,0,0,0.85),0_0_50px_rgba(37,99,235,0.15)] relative">

              {/* Prominent Card Top Logo Header */}
              <div className="flex items-center justify-center gap-3.5 mb-7 pt-1 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 border border-blue-400/25 group-hover:scale-105 transition-all">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                    Interview Prep <span className="text-blue-400">AI</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1" style={{ fontFamily: FONT_MONO }}>
                    Master Technical & Behavioral Rounds
                  </span>
                </div>
              </div>

              {/* Segmented Control Tab Switcher */}
              <div className="relative grid grid-cols-2 bg-[#080D1A] p-1.5 rounded-2xl border border-[#162035] mb-7">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`py-3 rounded-xl text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`py-3 rounded-xl text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-amber-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign up
                </button>
              </div>

              {/* Success Message Banner */}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-2.5">
                  <Sparkles size={16} className="text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Message Banner */}
              {error && (
                <div className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-medium animate-shake">
                  <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-5" data-testid="auth-form">
                  
                  {/* Full Name Field (Register Mode) */}
                  {mode === 'register' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative flex items-center group">
                        <User className="absolute left-4 z-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={set('name')}
                          placeholder="John Doe"
                          className="w-full h-13 bg-[#080D1A] border border-[#162035] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base text-white placeholder-slate-600 outline-none transition-all"
                          style={{ paddingLeft: '48px', paddingRight: '16px', textAlign: 'left' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative flex items-center group">
                      <Mail className="absolute left-4 z-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={set('email')}
                        placeholder="you@example.com"
                        className="w-full h-13 bg-[#080D1A] border border-[#162035] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base text-white placeholder-slate-600 outline-none transition-all"
                        style={{ paddingLeft: '48px', paddingRight: '16px', textAlign: 'left' }}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative flex items-center group">
                      <Lock className="absolute left-4 z-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={set('password')}
                        placeholder="••••••••"
                        className="w-full h-13 bg-[#080D1A] border border-[#162035] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base text-white placeholder-slate-600 outline-none transition-all"
                        style={{ paddingLeft: '48px', paddingRight: '48px', textAlign: 'left' }}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 z-10 text-slate-500 hover:text-slate-300 p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Meter (Register Mode) */}
                  {mode === 'register' && form.password && (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#080D1A] border border-[#162035]">
                      <div className="relative w-6 h-6 shrink-0">
                        <div
                          className="absolute inset-0 rounded-full transition-all duration-300"
                          style={{ background: `conic-gradient(${strengthInfo.color} ${passwordScore * 3.6}deg, #162035 ${passwordScore * 3.6}deg)` }}
                        />
                        <div className="absolute inset-[2px] rounded-full bg-[#080D1A]" />
                      </div>
                      <div className="flex-1 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-400">Strength:</span>
                        <span className="font-bold" style={{ color: strengthInfo.color }}>
                          {strengthInfo.label}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password Field (Register Mode) */}
                  {mode === 'register' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative flex items-center group">
                        <Lock className="absolute left-4 z-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          required
                          value={form.confirmPassword}
                          onChange={set('confirmPassword')}
                          placeholder="••••••••"
                          className="w-full h-13 bg-[#080D1A] border border-[#162035] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base text-white placeholder-slate-600 outline-none transition-all"
                          style={{ paddingLeft: '48px', paddingRight: '48px', textAlign: 'left' }}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 z-10 text-slate-500 hover:text-slate-300 p-1"
                        >
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Target Role Select Dropdown (Register Mode) */}
                  {mode === 'register' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                        Target Role
                      </label>
                      <div className="relative flex items-center group">
                        <Briefcase className="absolute left-4 z-10 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                        <select
                          value={form.targetRole}
                          onChange={set('targetRole')}
                          className="w-full h-13 bg-[#080D1A] border border-[#162035] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-base text-white appearance-none outline-none cursor-pointer transition-all"
                          style={{ paddingLeft: '48px', paddingRight: '48px', textAlign: 'left' }}
                        >
                          {TARGET_ROLES.map((r) => (
                            <option key={r} value={r} style={{ backgroundColor: '#080D1A', color: '#E2E8F0' }}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 z-10 w-5 h-5 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Remember Me Checkbox & Forgot Password Row (Login Mode) */}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                      <label className="flex items-center gap-2.5 text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button (Blue for Login, Green for Register) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-13 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60 mt-5 shadow-lg ${
                      mode === 'login'
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'
                    }`}
                    data-testid="auth-submit-btn"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{mode === 'login' ? 'Log in' : 'Create Account'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: 6-Digit Email OTP Verification Screen */
                <div className="flex flex-col items-center text-center space-y-6 py-2">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">Verify Your Email</h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      We've sent a 6-digit verification code to <span className="text-white font-bold">{registeredEmail}</span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="w-full space-y-6">
                    <div className="flex items-center justify-center gap-3 my-3">
                      {otpInput.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-12 h-14 text-center text-2xl font-extrabold bg-[#090612] border border-[#2C2148] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-white outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 rounded-xl font-extrabold text-base text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify & Activate Account</span>}
                    </button>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-4 border-t border-[#2C2148]/60">
                      <button
                        type="button"
                        onClick={handleResendOTPCode}
                        disabled={resending}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                        <span>{resending ? 'Sending...' : 'Resend Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep('form')}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Edit Details</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 'form' && (
                <>
                  {/* Divider */}
                  <div className="relative w-full my-6 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#2C2148]" />
                    </div>
                    <span className="relative px-3 bg-[#17112C] text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                      Or {mode === 'login' ? 'continue' : 'sign up'} with
                    </span>
                  </div>

                  {/* Social Login Buttons Grid (Matching Screenshot 1) */}
                  <div className="space-y-2.5">
                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full h-11 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-md"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                        <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.29 5.38l3.98-3.09z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
                      </svg>
                      <span>{mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                    </button>

                  </div>

                  {/* Switch Footer Link */}
                  <div className="pt-6 text-center text-xs sm:text-sm text-slate-400 border-t border-[#2C2148]/60 mt-7">
                    <span>{mode === 'login' ? "Don't have an account? " : "Already have an account? "}</span>
                    <button
                      type="button"
                      onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                      className="font-extrabold text-amber-400 hover:text-amber-300 ml-1 cursor-pointer transition-colors"
                    >
                      {mode === 'login' ? 'Create one for free' : 'Sign in'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
