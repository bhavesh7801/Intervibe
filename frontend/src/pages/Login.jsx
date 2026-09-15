import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { InterviewPrepLogo } from '../components/Navbar.jsx';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton.jsx';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleGoogleSuccess = () => {
    setSuccessMsg('Successfully authenticated with Google! Redirecting...');
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password);
      setSuccessMsg('Successfully logged in! Redirecting to workspace...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-rose-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-8 flex flex-col items-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <InterviewPrepLogo size={38} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
            Welcome back
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sign in to continue your technical interview preparation
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-3xl p-6 sm:p-8 space-y-6 transition-colors">
          
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

          {/* Google Sign-In Button */}
          <GoogleAuthButton
            text="Continue with Google"
            mode="login"
            onSuccess={handleGoogleSuccess}
            onError={(err) => setError(err)}
          />

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
              or with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98 mt-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Intervibe'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

        </div>

        {/* Bottom Switcher */}
        <div className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
