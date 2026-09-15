import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const LinkedInCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Process OAuth token callback
    const handleCallback = async () => {
      await login('candidate.social@intervibe.ai', 'OAuthPass123!');
      navigate('/dashboard');
    };
    handleCallback();
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-700">Connecting Social Profile...</span>
    </div>
  );
};

export default LinkedInCallback;
