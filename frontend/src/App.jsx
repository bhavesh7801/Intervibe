import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import InterviewSession from './pages/InterviewSession.jsx';
import CodingWorkspace from './pages/CodingWorkspace.jsx';
import AssessmentWorkspace from './pages/AssessmentWorkspace.jsx';
import Results from './pages/Results.jsx';
import AICoachingPage from './pages/AICoachingPage.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import CertificateVerification from './pages/CertificateVerification.jsx';
import FeedbackSupport from './pages/FeedbackSupport.jsx';
import Legal from './pages/Legal.jsx';
import LinkedInCallback from './pages/LinkedInCallback.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F1F5F9] font-sans antialiased selection:bg-rose-500 selection:text-white flex flex-col transition-colors duration-200">
              <Navbar />
              <main className="flex-1 pt-18">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/verify" element={<CertificateVerification />} />
                <Route path="/support" element={<FeedbackSupport />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/auth/callback/linkedin" element={<LinkedInCallback />} />

                {/* Protected Private Candidate Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview"
                  element={
                    <ProtectedRoute>
                      <InterviewSession />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/coding"
                  element={
                    <ProtectedRoute>
                      <CodingWorkspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment"
                  element={
                    <ProtectedRoute>
                      <AssessmentWorkspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/coaching"
                  element={
                    <ProtectedRoute>
                      <AICoachingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <Results />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Wildcard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
}
