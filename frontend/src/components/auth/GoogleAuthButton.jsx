import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ExternalLink, Settings } from 'lucide-react';

export const GoogleAuthButton = ({ onSuccess, onError, text = 'Continue with Google', mode = 'signup' }) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '658426092732-l6odo2d5esndtljmu4brsvu31f3lp9kk.apps.googleusercontent.com';

  const handleGoogleClick = () => {
    setLoading(true);

    // 1. Redirect directly to Google's official OAuth consent screen
    if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=openid%20profile%20email&prompt=select_account`;

      console.log('Redirecting to Google OAuth:', { clientId, redirectUri, googleAuthUrl });
      
      // Redirect user directly to accounts.google.com
      window.location.href = googleAuthUrl;
      return;
    }

    // 2. Fallback config modal if client ID is missing
    setLoading(false);
    setShowConfigModal(true);
  };

  const handleDevLogin = async (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      if (onError) onError('Please enter a valid Google email address.');
      return;
    }
    setLoading(true);
    try {
      const user = await loginWithGoogle({
        email: customEmail.trim().toLowerCase(),
        name: customName.trim() || customEmail.split('@')[0].replace('.', ' '),
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${customEmail}`
      });
      setShowConfigModal(false);
      if (onSuccess) onSuccess(user);
    } catch (err) {
      if (onError) onError(err.message || 'Google authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="text-sm font-medium">{text}</span>
      </button>

      {/* Google OAuth Setup / Dev Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Google OAuth Setup</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Official Google Cloud Integration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Instruction Notice */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs space-y-1.5 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5">
                <Settings size={14} />
                <span>Google Client ID Required for Live Redirect:</span>
              </p>
              <p>
                To redirect candidates to <strong>accounts.google.com</strong>, add your free Google OAuth Client ID to <code className="px-1 py-0.5 bg-amber-200/60 dark:bg-amber-900/80 rounded font-mono font-bold">frontend/.env</code>:
              </p>
              <p className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-amber-200 dark:border-amber-800/80 select-all">
                VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
              </p>
            </div>

            {/* Instant Dev Mode Sign-in */}
            <form onSubmit={handleDevLogin} className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Test Sign-In (Developer Mode)
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Auto Verified</span>
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Instant Sign In'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
