import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Briefcase,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  FileText,
  X
} from 'lucide-react';

export default function AuthLayout({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const { login, register, verifyOTP, resendOTP, googleLogin } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [registerStep, setRegisterStep] = useState('form'); // 'form' | 'otp'
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    targetRole: 'Software Engineer',
    experienceLevel: 'Entry Level',
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // OTP State
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Common UI State
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccessMsg('');
    if (tab === 'login') {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'Strong', color: 'text-emerald-400', stroke: '#10B981', dash: '85, 100' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score <= 25) return { label: 'Weak', color: 'text-rose-400', stroke: '#F43F5E', dash: '25, 100' };
    if (score <= 50) return { label: 'Fair', color: 'text-amber-400', stroke: '#F59E0B', dash: '50, 100' };
    if (score <= 75) return { label: 'Good', color: 'text-cyan-400', stroke: '#22D3EE', dash: '75, 100' };
    return { label: 'Strong', color: 'text-emerald-400', stroke: '#10B981', dash: '90, 100' };
  };

  const strengthInfo = getPasswordStrength(registerData.password);

  // Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Register Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (registerData.password !== registerData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!acceptedTerms) {
      return setError('You must accept the Terms & Conditions');
    }

    setLoading(true);
    try {
      await register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.targetRole,
        registerData.experienceLevel
      );
      setRegisteredEmail(registerData.email);
      setRegisterStep('otp');
      setSuccessMsg(`Verification code sent to ${registerData.email}`);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // OTP Change
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
    setError('');
    setSuccessMsg('');

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
    setError('');
    setSuccessMsg('');
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

  // Google OAuth Handler
  const handleGoogleSignIn = () => {
    setError('');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId.includes('your_client_id') || clientId.includes('YOUR_CLIENT_ID')) {
      setError("Google Client ID is set to a placeholder. Please update VITE_GOOGLE_CLIENT_ID in frontend/app/.env with your actual Client ID from Google Cloud Console.");
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setError("Google login library is still loading. Please try again in a few seconds.");
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
              await googleLogin(response.access_token, registerData.targetRole || null, registerData.experienceLevel || null);
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

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#08040e] text-white relative overflow-x-hidden overflow-y-auto flex items-center justify-center px-4 sm:px-8 md:px-12 py-12 sm:py-20 selection:bg-[#EC4899]/30">
      {/* Background Radial Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.14)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute top-[15%] left-[8%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_60%)] blur-3xl" />
      </div>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 my-auto">
        
        {/* LEFT COLUMN — Hero & Brand Messaging */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-7 lg:pr-6">
          {/* Eyebrow Pill Tag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#150B24]/90 border border-[#EC4899]/35 text-[#EC4899] font-mono text-[11px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <span>+</span>
            <span>INTERVIEW PREP AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            <span>Every answer,</span>
            <span
              className="block font-serif italic font-normal bg-gradient-to-r from-[#EC4899] via-[#D946EF] to-[#FACC15] bg-clip-text text-transparent mt-1.5 pb-1"
              style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
            >
              scored and explained
            </span>
          </h1>

          {/* Body Paragraph */}
          <p className="text-[#A098B5] text-sm sm:text-base leading-relaxed max-w-lg">
            Sign in to pick up your practice history, saved competency scores, and PDF reports — or create an account to start your first mock interview.
          </p>

          {/* Divider Line */}
          <div className="w-full border-t border-[#26173b] my-6" />

          {/* Metric Stats Row */}
          <div className="grid grid-cols-2 gap-10 w-full pt-2">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">10,000+</div>
              <div className="text-[11px] font-bold text-[#8B7C9E] uppercase tracking-wider mt-1.5">
                MOCK INTERVIEWS
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">94%</div>
              <div className="text-[11px] font-bold text-[#8B7C9E] uppercase tracking-wider mt-1.5">
                PASS RATE
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Auth Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="w-full max-w-[450px] bg-[#0d0716]/95 backdrop-blur-2xl border border-[#D946EF]/30 rounded-3xl p-7 sm:p-10 shadow-[0_0_80px_rgba(217,70,239,0.15)] relative">
            
            {/* Segmented Tab Switcher Bar */}
            <div className="grid grid-cols-2 rounded-2xl bg-[#06030B] p-1.5 border border-[#1e1133] mb-8 shadow-inner">
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-[#E63980] via-[#D946EF] to-[#A855F7] text-white shadow-[0_0_20px_rgba(230,57,128,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('signup')}
                className={`py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'bg-gradient-to-r from-[#E63980] via-[#D946EF] to-[#A855F7] text-white shadow-[0_0_20px_rgba(230,57,128,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-2xl text-xs font-medium animate-shake text-center">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 bg-emerald-950/70 border border-emerald-800 text-emerald-300 rounded-2xl text-xs font-medium text-center flex items-center justify-center gap-2">
                <Sparkles size={15} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOG IN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="relative flex items-center group">
                  <Mail className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-12 pl-11 pr-4 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                  />
                </div>

                {/* Password Field */}
                <div className="relative flex items-center group">
                  <Lock className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-11 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs py-1.5 px-0.5">
                  <label className="flex items-center gap-2.5 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#EC4899] focus:ring-[#EC4899] accent-[#EC4899] cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setError("Please contact support or sign in with Google to reset password.");
                    }}
                    className="text-[#EC4899] hover:text-[#f472b6] font-semibold transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 py-3.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-[#E63980] via-[#D946EF] to-[#A855F7] hover:opacity-95 shadow-[0_0_25px_rgba(230,57,128,0.35)] hover:shadow-[0_0_35px_rgba(230,57,128,0.5)] flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-70 mt-3"
                >
                  <span>{loading ? 'Logging in...' : 'Log in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="relative w-full my-7 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#231538]" />
                  </div>
                  <span className="relative px-4 bg-[#0d0716] text-[11px] font-black uppercase tracking-widest text-slate-500">
                    OR
                  </span>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full h-12 py-3 rounded-2xl bg-[#090512] border border-[#27173b] hover:border-[#4d297a] hover:bg-[#120a1f] text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-center gap-3 cursor-pointer transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with <span className="font-bold text-white">Google</span></span>
                </button>

                {/* Footer Toggle Text */}
                <div className="pt-6 text-center text-xs text-slate-400 border-t border-[#1f1236]/50 mt-4">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('signup')}
                    className="font-bold text-[#EC4899] hover:text-[#f472b6] ml-1.5 cursor-pointer transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SIGN UP FORM */}
            {activeTab === 'signup' && (
              registerStep === 'form' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="relative flex items-center group">
                    <User className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Full name"
                      className="w-full h-12 pl-11 pr-4 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative flex items-center group">
                    <Mail className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full h-12 pl-11 pr-4 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative flex items-center group">
                    <Lock className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-11 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                    >
                      {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Gauge */}
                  <div className="flex items-center gap-2.5 py-1 px-1">
                    <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path
                          style={{ stroke: strengthInfo.stroke }}
                          strokeDasharray={strengthInfo.dash}
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                    <span className={`text-xs font-bold ${strengthInfo.color}`}>
                      {strengthInfo.label}
                    </span>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative flex items-center group">
                    <Lock className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full h-12 pl-11 pr-4 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                    />
                  </div>

                  {/* Role Select Dropdown */}
                  <div className="relative flex items-center group">
                    <Briefcase className="absolute left-4 w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors pointer-events-none" />
                    <select
                      value={registerData.targetRole}
                      onChange={(e) => setRegisterData({ ...registerData, targetRole: e.target.value })}
                      className="w-full h-12 pl-11 pr-11 bg-[#080410] border border-[#26173a] group-hover:border-[#3c235c] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/20 rounded-2xl text-sm text-white appearance-none outline-none cursor-pointer transition-all shadow-inner"
                    >
                      <option value="Software Engineer" style={{ backgroundColor: '#090512', color: '#FFF' }}>Software Engineer</option>
                      <option value="Product Manager" style={{ backgroundColor: '#090512', color: '#FFF' }}>Product Manager</option>
                      <option value="Data Scientist" style={{ backgroundColor: '#090512', color: '#FFF' }}>Data Scientist</option>
                      <option value="Engineering Manager" style={{ backgroundColor: '#090512', color: '#FFF' }}>Engineering Manager</option>
                    </select>
                    <ChevronDown className="absolute right-4 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 py-3.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-[#E63980] via-[#D946EF] to-[#A855F7] hover:opacity-95 shadow-[0_0_25px_rgba(230,57,128,0.35)] hover:shadow-[0_0_35px_rgba(230,57,128,0.5)] flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-70 mt-3"
                  >
                    <span>{loading ? 'Creating account...' : 'Create account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Divider */}
                  <div className="relative w-full my-6 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#231538]" />
                    </div>
                    <span className="relative px-4 bg-[#0d0716] text-[11px] font-black uppercase tracking-widest text-slate-500">
                      OR
                    </span>
                  </div>

                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-12 py-3 rounded-2xl bg-[#090512] border border-[#27173b] hover:border-[#4d297a] hover:bg-[#120a1f] text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-center gap-3 cursor-pointer transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with <span className="font-bold text-white">Google</span></span>
                  </button>

                  {/* Footer Toggle Text */}
                  <div className="pt-6 text-center text-xs text-slate-400 border-t border-[#1f1236]/50 mt-4">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('login')}
                      className="font-bold text-[#EC4899] hover:text-[#f472b6] ml-1.5 cursor-pointer transition-colors"
                    >
                      Log in
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: 6-Digit Email OTP Verification Screen */
                <div className="flex flex-col items-center text-center space-y-6 py-2">
                  <div className="w-14 h-14 rounded-2xl bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/30 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.2)]">
                    <ShieldCheck className="w-7 h-7 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">Check your email</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      We've sent a 6-digit verification code to <span className="text-white font-bold">{registeredEmail}</span>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="w-full space-y-6">
                    <div className="flex items-center justify-center gap-2.5 my-2">
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
                          className="w-11 h-13 text-center text-2xl font-extrabold bg-[#080410] border border-[#241538] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/30 rounded-2xl text-white outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-13 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#E63980] via-[#D946EF] to-[#A855F7] shadow-[0_0_25px_rgba(230,57,128,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      {loading ? 'Verifying...' : 'Verify & Activate Account'}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#1f1236]/50">
                      <button
                        type="button"
                        onClick={handleResendOTPCode}
                        disabled={resending}
                        className="text-[#EC4899] hover:text-[#f472b6] font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                        <span>{resending ? 'Sending...' : 'Resend Code'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegisterStep('form')}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                    </div>
                  </form>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#12081f] border border-[#2c1747] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileText className="text-[#EC4899]" size={18} />
                <span>Terms of Service & Privacy Policy</span>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="font-semibold text-[#EC4899] mb-1">1. User Agreement & Practice Terms</h4>
                <p>
                  By creating an account on the AI Interview Prep Platform, you agree to utilize our platform solely for personal career development and technical interview preparation.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="font-semibold text-[#EC4899] mb-1">2. Privacy & Voice AI Processing</h4>
                <p>
                  Your privacy is paramount. Audio streams captured during voice mock interviews are processed in real-time to analyze speech pacing (WPM) and clarity. Transcripts and candidate metrics are stored securely in encrypted databases.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E63980] to-[#D946EF] text-white font-bold text-xs cursor-pointer shadow-md transition-all hover:opacity-95"
              >
                I Agree & Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
