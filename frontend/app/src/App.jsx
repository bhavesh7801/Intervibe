import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Legal from './pages/Legal';
import './App.css';
import { isTechRole } from './utils/roleUtils';

// Lazy-loaded heavy routes for code-splitting & production bundle optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CodingWorkspace = lazy(() => import('./pages/CodingWorkspace'));
const InterviewSession = lazy(() => import('./pages/InterviewSession'));
const Results = lazy(() => import('./pages/Results'));
const AssessmentWorkspace = lazy(() => import('./pages/AssessmentWorkspace'));
const Profile = lazy(() => import('./pages/Profile'));
const FeedbackSupport = lazy(() => import('./pages/FeedbackSupport'));
const AICoachingPage = lazy(() => import('./pages/AICoachingPage'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));

// Protected Route wrapper
const ProtectedRoute = ({ children, redirectTo = "/register" }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060813] text-slate-200">
        <div className="text-xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to={redirectTo} replace />;
};

// Route wrapper for tech/software-specific modules (Coding IDE)
const TechRoute = ({ children }) => {
  const { user } = useAuth();
  if (user && !isTechRole(user.targetRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060813] text-slate-200">
        <div className="text-xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const PageLoader = () => (
  <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-[#060813] text-slate-200">
    <div className="text-sm font-bold text-purple-400 animate-pulse flex items-center gap-2">
      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
      Loading workspace module...
    </div>
  </div>
);

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />
              <Route path="/aura" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/feedback" element={<FeedbackSupport />} />
              <Route path="/verify/:certId" element={<CertificateVerification />} />
              <Route path="/legal" element={<Legal />} />
              
              {/* Protected Coding & Assessment Modules */}
              <Route path="/coding" element={<ProtectedRoute><CodingWorkspace /></ProtectedRoute>} />
              <Route path="/assessment" element={<ProtectedRoute><AssessmentWorkspace /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/coaching" element={<ProtectedRoute><AICoachingPage /></ProtectedRoute>} />
              <Route path="/interview/:sessionId" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
              <Route path="/results/:sessionId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              
              {/* Redirect to dashboard if logged in, else home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
}

export default App;