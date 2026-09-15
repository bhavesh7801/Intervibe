import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [statusText, setStatusText] = useState('Verifying Google credentials...');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Parse token from URL fragment (implicit flow #access_token=...) or query param
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash || window.location.search);
        
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');
        const token = accessToken || idToken;

        if (!token) {
          throw new Error('No authentication token received from Google.');
        }

        setStatusText('Signing you into Intervibe...');
        await loginWithGoogle(token);
        setStatusText('Success! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      } catch (err) {
        console.error('Google callback error:', err);
        setError(err.message || 'Failed to complete Google authentication.');
      }
    };

    handleAuth();
  }, [loginWithGoogle, navigate]);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl space-y-4">
        {error ? (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Failed</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connecting with Google</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{statusText}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
