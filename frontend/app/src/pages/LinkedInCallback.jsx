import React, { useEffect } from 'react';

/**
 * LinkedIn OAuth Callback Page
 * LinkedIn redirects here after the user approves.
 * This page reads the ?code= param and sends it to the parent window (popup flow),
 * then closes itself.
 */
const LinkedInCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('linkedin_error');

    if (window.opener) {
      // Send result to opener (the popup's parent window)
      window.opener.postMessage(
        { type: 'LINKEDIN_AUTH', code, error },
        window.location.origin
      );
      window.close();
    } else {
      // Fallback: if not a popup, store code in sessionStorage and redirect
      if (code) {
        sessionStorage.setItem('linkedin_code', code);
      }
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center text-white">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Completing LinkedIn sign-in...</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;
