import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { InterviewPrepLogo } from '../components/Navbar.jsx';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, 
  CheckCircle2, AlertCircle, ShieldCheck, RefreshCw, 
  ArrowLeft, Check
} from 'lucide-react';
import { ROLES, EXPERIENCE_LEVELS } from '../utils/roleUtils.js';

export const Register = () => {
  const navigate = useNavigate();
  const { register, verifyOtp, resendOtp, loading } = useAuth();

  // Step 1: form details, Step 2: OTP verification
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState(ROLES[0]);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[1].label);
  const [showPassword, setShowPassword] = useState(false);

  // OTP State (6 individual digit boxes)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  // UI state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Password strength
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty', color: 'bg-slate-200 dark:bg-slate-700' };
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;

    if (s <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500' };
    if (s <= 3) return { score: 2, text: 'Good', color: 'bg-amber-500' };
    return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(password);

  // Resend Timer Countdown
  useEffect(() => {
    let timer;
    if (step === 2 && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Focus first OTP input on step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Step 1: Submit Details & Trigger SendGrid OTP
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await register({ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password, 
        targetRole, 
        experienceLevel 
      });
      setStep(2);
      setResendCooldown(60);
      setSuccessMsg(res.message || `Verification code sent to ${email}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // OTP Input Changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    
    if (cleanVal.length > 1) {
      handlePasteValue(cleanVal);
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setError('');

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Key Down (Backspace & Arrow Navigation)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Clipboard Paste across all 6 boxes
  const handlePasteValue = (pasted) => {
    const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');
    const newDigits = [...otpDigits];
    digits.forEach((d, i) => {
      if (i < 6) newDigits[i] = d;
    });
    setOtpDigits(newDigits);
    setError('');
    const focusIdx = Math.min(digits.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePasteValue(pastedData);
  };

  // Step 2: Verify OTP
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccessMsg('');

    try {
      await verifyOtp({
        email: email.trim().toLowerCase(),
        otp: fullOtp,
        pendingUserData: { name, targetRole, experienceLevel }
      });
      setSuccessMsg('Email verified successfully! Setting up your interview workspace...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code or request a new one.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP via SendGrid
  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const msg = await resendOtp(email.trim().toLowerCase());
      setSuccessMsg(msg || 'A fresh verification code was sent to your email.');
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-8 flex flex-col items-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <InterviewPrepLogo size={38} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
            {step === 1 ? 'Start Your Interview Prep' : 'Verify Your Email Address'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
            {step === 1 
              ? 'Create your account and practice realistic FAANG loops with real-time AI feedback'
              : 'Enter the 6-digit security code sent to your email to activate your workspace'
            }
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-3xl p-6 sm:p-8 space-y-5 transition-colors">
          
          {/* Feedback Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {/* ================= STEP 1: Registration Form ================= */}
          {step === 1 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {password && (
                  <div className="pt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">{strength.text}</span>
                  </div>
                )}
              </div>

              {/* Target Role & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Target Role
                  </label>
                  <div className="relative">
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors appearance-none cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Seniority Level
                  </label>
                  <div className="relative">
                    <select
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors appearance-none cursor-pointer"
                    >
                      {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.label}>{lvl.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 mt-3"
              >
                <span>{loading ? 'Sending Verification Code...' : 'Create Account & Send Code'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ================= STEP 2: SendGrid OTP Verification ================= */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Back to details pill */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Edit Account Info</span>
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-[11px] font-mono font-bold">
                  <ShieldCheck size={13} />
                  <span>Email Verification</span>
                </div>
              </div>

              {/* Email Badge Info */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verification OTP dispatched to
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Mail size={15} className="text-rose-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{email}</span>
                </div>
              </div>

              {/* 6-Digit Code Form */}
              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div>
                  <label className="block text-center text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                    Enter 6-Digit Code
                  </label>
                  
                  {/* Segmented Inputs */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 sm:w-12 h-14 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono rounded-2xl border transition-all duration-200 focus:outline-none ${
                          digit 
                            ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20' 
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Action Bar */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Didn't receive the email?
                  </span>
                  {resendCooldown > 0 ? (
                    <span className="font-mono text-slate-400 dark:text-slate-500 font-medium">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="inline-flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={isResending ? 'animate-spin' : ''} />
                      <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                    </button>
                  )}
                </div>

                {/* Verify Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join('').length < 6}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  <span>{isVerifying ? 'Verifying Code...' : 'Verify Email & Launch Workspace'}</span>
                  <Check size={16} />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Bottom Switcher */}
        <div className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
