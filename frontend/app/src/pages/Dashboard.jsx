import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { PlayCircle, Award, Clock, CheckCircle2, TrendingUp, Sparkles, Plus, ArrowRight, X, HelpCircle, Zap, Target, Trophy, Settings2, Flame, Activity, FileText, Upload, Star, BookOpen, ShieldCheck, Share2, RefreshCw } from 'lucide-react';
import QuickActionPillCards from '../components/dashboard/QuickActionPillCards';
import ReadinessPassportCard from '../components/dashboard/ReadinessPassportCard';
import ActivityHeatmap from '../components/ActivityHeatmap';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSessions: 0, completedSessions: 0, totalQuestionsAnswered: 0, averageScore: 0, practiceStreak: 0, solvedChallenges: 0, activityDates: [] });

  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(false);
  
  // Pre-Session Question Prompt Modal State
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [questionCount, setQuestionCount] = useState(10); // Default 10 questions
  const [customCountInput, setCustomCountInput] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [interviewerPersona, setInterviewerPersona] = useState('Standard');
  const [creating, setCreating] = useState(false);

  // Resume-Based Session State
  const [useResumeQuestions, setUseResumeQuestions] = useState(false);
  const [modalResumeInfo, setModalResumeInfo] = useState(null);
  const [modalResumeLoading, setModalResumeLoading] = useState(false);

  useEffect(() => {
    fetchData();

    // Automatically shut down & release active camera and microphone hardware when on Dashboard
    if (window.activeWebcamStream) {
      try {
        window.activeWebcamStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      } catch (e) {}
      window.activeWebcamStream = null;
    }
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.allSettled([
        api.getStats(),
        api.getSessions()
      ]);
      
      const statsData = statsRes.status === 'fulfilled' ? statsRes.value?.data : null;
      const sessionsData = sessionsRes.status === 'fulfilled' ? sessionsRes.value?.data : [];

      const finalStats = statsData || { totalSessions: 0, completedSessions: 0, totalQuestionsAnswered: 0, averageScore: 0, practiceStreak: 0, solvedChallenges: 0, activityDates: [] };
      const finalSessions = Array.isArray(sessionsData) ? sessionsData : [];

      setStats(finalStats);
      setSessions(finalSessions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModalResumeLoading(true);
    try {
      const res = await api.uploadResume(file);
      setModalResumeInfo(res.data);
      setUseResumeQuestions(true);
    } catch (err) {
      console.error("Error uploading resume in modal:", err);
      alert(err.response?.data?.detail || "Failed to parse PDF resume.");
    } finally {
      setModalResumeLoading(false);
    }
  };

  const handleOpenPrompt = (prefilledRole = null) => {
    setTargetRole(prefilledRole || user?.targetRole || 'Software Engineer');
    setTargetCompany('');
    setQuestionCount(10);
    setIsCustomMode(false);
    setCustomCountInput('');
    setUseResumeQuestions(false);
    setInterviewerPersona('Standard');
    setShowPromptModal(true);
  };

  const handleStartSession = async () => {
    if (!targetRole.trim()) return;
    
    // Determine effective practice question count (between 1 and 50)
    let countToPractice = 10;
    if (isCustomMode && customCountInput) {
      const parsed = parseInt(customCountInput, 10);
      countToPractice = Math.max(1, Math.min(50, parsed || 10));
    } else {
      countToPractice = questionCount;
    }
    
    setCreating(true);
    try {
      let finalRole = targetRole.trim();
      if (targetCompany.trim()) {
        finalRole += ` at ${targetCompany.trim()}`;
      }
      if (useResumeQuestions) {
        finalRole += ' (Resume AI Scan)';
      }
      const response = await api.createSession(finalRole, countToPractice, interviewerPersona);
      setShowPromptModal(false);
      navigate(`/interview/${response.data.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to start interview session. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getCalculatedStreak = () => {
    return stats?.practiceStreak || 0;
  };

  const getCalculatedSolvedChallenges = () => {
    return stats?.solvedChallenges || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0C1B] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-rose-400 font-semibold text-base sm:text-lg animate-pulse">
          <Sparkles size={22} />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#060813] text-slate-200 py-6 sm:py-10 overflow-x-hidden" data-testid="dashboard-page">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mockup Redesign Header Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#0D121F] border border-blue-500/20 shadow-2xl relative overflow-hidden animate-entrance">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
            <Sparkles size={16} className="animate-pulse text-blue-400" />
            <span>Interview Prep AI Dashboard</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" data-testid="dashboard-title">
                Welcome Back, <span className="text-blue-400">{user?.name || 'Alex'}</span>!
              </h1>
              <p className="text-sm text-slate-400 mt-1">Your FAANG Interview Practice Awaits.</p>
            </div>

            <button
              onClick={() => handleOpenPrompt()}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer border border-blue-400/30"
              data-testid="start-new-session-btn"
            >
              <Plus size={18} />
              <span>Start Practice Session</span>
            </button>
          </div>

          {/* 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Card 1: Problems Solved */}
            <div className="p-4 rounded-xl bg-[#141A2B] border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Problems Solved</span>
              <span className="text-3xl font-extrabold text-white">{stats?.solvedChallenges ?? 0}</span>
            </div>

            {/* Card 2: Success Rate */}
            <div className="p-4 rounded-xl bg-[#141A2B] border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Success Rate</span>
              <span className="text-3xl font-extrabold text-emerald-400">{stats?.totalQuestionsAnswered > 0 ? `${stats.averageScore}%` : '0%'}</span>
            </div>

            {/* Card 3: Daily Streak */}
            <div className="p-4 rounded-xl bg-[#141A2B] border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Daily Streak</span>
              <span className="text-3xl font-extrabold text-amber-400">{stats?.practiceStreak ?? 0} <span className="text-sm font-semibold text-amber-300">Days</span></span>
            </div>

            {/* Card 4: AI Review Score */}
            <div className="p-4 rounded-xl bg-[#0C1427] border border-cyan-500/30 text-center shadow-lg shadow-cyan-500/10">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">AI Review Score</span>
              <span className="text-3xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">{stats?.totalQuestionsAnswered > 0 ? stats.averageScore : 0}</span>
            </div>
          </div>
        </div>

        {/* Recommended Topics & Recent Challenges Row (Matching Screenshot 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recommended Topics Box */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span>Recommended Topics</span>
            </h3>
            <div className="space-y-2">
              {[
                { title: 'Arrays & Strings', icon: '✉️' },
                { title: 'Graphs & Trees', icon: '☁️' },
                { title: 'Dynamic Programming', icon: '🧱' }
              ].map((topic, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/coding')}
                  className="p-3 rounded-xl bg-[#141A2B] border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer flex items-center gap-3 text-xs font-bold text-slate-200"
                >
                  <span className="text-base">{topic.icon}</span>
                  <span>{topic.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Challenges Box */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-500" />
              <span>Recent Challenges</span>
            </h3>
            <div className="space-y-2">
              {[
                { name: '1. Two Sum', diff: 'Easy', color: 'text-emerald-400' },
                { name: '2. Binary Search', diff: 'Medium', color: 'text-amber-400' },
                { name: '3. Decode String', diff: 'Hard', color: 'text-rose-400' }
              ].map((ch, i) => (
                <div
                  key={i}
                  onClick={() => navigate('/coding')}
                  className="p-3 rounded-xl bg-[#141A2B] border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between text-xs font-bold"
                >
                  <span className="text-slate-200">{ch.name}</span>
                  <span className={ch.color}>{ch.diff}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Growth Trend Line Chart */}
        <div className="mb-8 p-6 rounded-2xl bg-[#0D121F] border border-blue-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A253F] pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <TrendingUp size={16} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Monthly Candidate Performance Growth</h3>
                <p className="text-[11px] text-slate-400">Score progress trajectory across technical & behavioral interview sessions</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              +18% Improvement
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Week 1', score: 68 },
                { month: 'Week 2', score: 74 },
                { month: 'Week 3', score: 79 },
                { month: 'Week 4', score: 85 },
                { month: 'Current', score: stats?.averageScore || 88 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#162035" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0F1D', borderColor: '#2563EB', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#60A5FA' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mock Interview Simulation Section */}
        <div className="mb-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D121F] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Zap size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">Mock Interview Simulation</h3>
              </div>
              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                Get instant AI feedback in a timed interview scenario with live voice audio, AST complexity checks, and speech-to-text evaluation.
              </p>
            </div>
            <button
              onClick={() => handleOpenPrompt()}
              className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-8 rounded-xl font-bold text-base w-full sm:w-auto shadow-xl shadow-blue-500/30 shrink-0 cursor-pointer border border-blue-400/30 transition-all duration-200 active:scale-[0.98]"
            >
              Start Mock Interview
            </button>
          </div>
        </div>

        {/* Bottom Quick Action Cards (4 Pill Cards) */}
        <QuickActionPillCards onNavigate={navigate} onOpenPrompt={handleOpenPrompt} />

        {/* 365-Day Practice Activity Heatmap Card */}
        <ActivityHeatmap userStats={stats} streakCount={getCalculatedStreak()} user={user} />

        {/* FAANG Readiness Passport & Percentile Benchmark Card */}
        <ReadinessPassportCard stats={stats} onStartMock={() => handleOpenPrompt('Senior Full Stack Engineer')} />

        {/* Daily Challenge Banner */}
        <div className="p-5 rounded-2xl mb-8 border border-blue-500/30 bg-[#0D121F] flex flex-col md:flex-row items-center justify-between gap-4 animate-entrance shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Zap className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Daily Challenge</span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">🔥 7-Day Streak Active</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">Recommended: Technical System Design & DSA Sprint</h3>
              <p className="text-xs text-slate-400">Sharpen your algorithm efficiency and state architecture skills today.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/coding')}
            className="btn-gradient py-2.5 px-5 rounded-xl text-xs font-bold text-white shrink-0 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <span>Start Practice</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Charts Grid: Trajectory & Skill Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-10">
          {/* Progress Analytics Chart */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0D121F] border border-slate-800 animate-entrance stagger-4 shadow-lg" data-testid="progress-chart">
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Performance Trajectory</h3>
                  <p className="text-[11px] text-slate-400">Score trends across recent sessions</p>
                </div>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.progressData && stats.progressData.length > 0 ? stats.progressData : [{ session: 'S1', score: 70 }, { session: 'S2', score: 85 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B2144" vertical={false} />
                  <XAxis dataKey="session" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171227',
                      borderColor: '#F43F5E',
                      borderRadius: '12px',
                      color: '#FFF',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#F43F5E"
                    strokeWidth={3}
                    dot={{ fill: '#F43F5E', r: 5, strokeWidth: 2, stroke: '#171227' }}
                    activeDot={{ r: 8, fill: '#FB7185' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Radar Chart */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0D121F] border border-slate-800 animate-entrance stagger-4 shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Target size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Skill Proficiency Breakdown</h3>
                  <p className="text-[11px] text-slate-400">Multi-domain competency Radar</p>
                </div>
              </div>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={[
                  { subject: 'DSA', score: Math.min(100, Math.round(((stats?.averageScore || 75) * 1.05))) },
                  { subject: 'System Design', score: Math.min(100, Math.round(((stats?.averageScore || 75) * 0.90))) },
                  { subject: 'Web Arch', score: Math.min(100, Math.round(((stats?.averageScore || 75) * 1.10))) },
                  { subject: 'Behavioral', score: Math.min(100, Math.round(((stats?.averageScore || 75) * 1.15))) },
                  { subject: 'Algorithms', score: Math.min(100, Math.round(((stats?.averageScore || 75) * 1.00))) }
                ]}>
                  <PolarGrid stroke="#2B2144" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar name="Candidate Skill" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Starred / Bookmarked Questions Section */}
        <div className="p-5 rounded-2xl mb-8 border border-slate-800 bg-[#0D121F] animate-entrance shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Star size={18} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Starred Questions</h3>
                <p className="text-[11px] text-slate-400">Personalized review queue from your coding sessions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/coding')}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <span>Practice All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {(() => {
            try {
              const starred = JSON.parse(localStorage.getItem('starredQuestions') || '[]');
              if (starred.length === 0) {
                return (
                  <p className="text-xs text-slate-400 italic text-center py-4 bg-[#090710] rounded-xl border border-[#2B2144]">
                    ⭐ No starred questions yet. Click the star icon next to any problem in the Coding IDE to save it here for targeted review.
                  </p>
                );
              }
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {starred.map((qId) => (
                    <div
                      key={qId}
                      onClick={() => navigate('/coding')}
                      className="p-3.5 rounded-xl bg-[#090710] border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen size={16} className="text-amber-400 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors capitalize">
                            {qId.replace(/-/g, ' ')}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">Click to solve</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              );
            } catch (e) { return null; }
          })()}
        </div>

        {/* Recent Sessions List */}
        <div className="p-4 sm:p-8 rounded-2xl bg-[#0D121F] border border-slate-800 animate-entrance stagger-5 shadow-lg" data-testid="recent-sessions-list">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-white">Recent Interview Sessions</h3>
            <span className="text-xs font-semibold text-slate-400">{sessions.length} total</span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-10 sm:py-12">
              <p className="text-sm text-slate-400 mb-4">You haven't completed any mock interviews yet.</p>
              <button
                onClick={() => handleOpenPrompt()}
                className="btn-3d py-3 px-5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Start Your First Interview</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 sm:space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => navigate(session.status === 'completed' ? `/results/${session.id}` : `/interview/${session.id}`)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#090710] hover:bg-[#1A142D] border border-[#2B2144] hover:border-rose-500/40 transition-all duration-300 cursor-pointer group"
                  data-testid="session-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                      <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base group-hover:text-rose-300 transition-colors" data-testid="session-role">
                        {session.role}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5" data-testid="session-date">
                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {session.questions?.length || 10} Questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E1735]">
                    {session.status === 'completed' ? (
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block">Overall Score</span>
                        <span className="text-base sm:text-lg font-black text-rose-400" data-testid="session-score">
                          {session.overallScore ?? 'N/A'}/100
                        </span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        In Progress
                      </span>
                    )}

                    <div className="w-8 h-8 rounded-lg bg-[#2B2144] group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Pre-Session Question Prompt Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl card-3d rounded-2xl sm:rounded-3xl p-5 sm:p-10 relative border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPromptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Prompt Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-pink-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/20">
                <HelpCircle size={24} className="animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                How many questions do you want to practice?
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Select a quick preset or enter your custom count to customize your session.
              </p>
            </div>

            <div className="space-y-5">
              {/* Target Position Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Position / Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Developer, Frontend Engineer"
                  className="w-full px-4 py-3 input-3d rounded-xl placeholder-slate-600 text-sm text-center min-h-[46px]"
                  data-testid="session-role-input"
                />

                <div className="flex flex-wrap gap-2 pt-2">
                  {['Aptitude Assessment', 'Business Analyst', 'Data Scientist', 'ECE (Electronics)', 'Electrical (EE)', 'Embedded Systems', 'Mechanical (ME)', 'Product Manager', 'Software Engineer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#090710] hover:bg-[#1A142D] border border-[#2B2144] hover:border-rose-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      + {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Company / Firm Manual Input & Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Target Company / Firm Name (Optional)
                  </label>
                  <span className="text-[10px] text-amber-400 font-bold">Custom Firm Supported</span>
                </div>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="Type any company: e.g. Microsoft, Apple, Uber, Netflix, Tesla, TCS"
                  className="w-full px-4 py-2.5 input-3d rounded-xl placeholder-slate-600 text-xs sm:text-sm text-center mb-2.5 min-h-[42px]"
                  data-testid="target-company-input"
                />

                <div className="flex flex-wrap gap-2" data-testid="company-presets">
                  {[
                    'Amazon', 'Google', 'Meta', 'McKinsey', 'Goldman Sachs', 'Microsoft', 'Apple', 'Tesla', 'Netflix'
                  ].map((firmName) => (
                    <button
                      key={firmName}
                      type="button"
                      onClick={() => setTargetCompany(firmName)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                        targetCompany === firmName
                          ? 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 border-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-[#090710] border-[#2B2144] text-slate-300 hover:border-amber-500/40 hover:text-white'
                      }`}
                    >
                      🏢 {firmName}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Resume-Based Questions Toggle Card */}
              <div
                onClick={() => setUseResumeQuestions(!useResumeQuestions)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  useResumeQuestions
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-[#090710] border-[#2B2144] text-slate-400 hover:border-slate-600'
                }`}
                data-testid="toggle-resume-questions"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                    <FileText size={18} />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-extrabold text-white block">Generate Questions Based on Resume</span>
                    <span className="text-[10px] text-slate-400">Personalize questions using your PDF resume skills & experience</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useResumeQuestions}
                  onChange={(e) => setUseResumeQuestions(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500 cursor-pointer"
                />
              </div>

              {useResumeQuestions && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-2 text-xs animate-entrance">
                  <div className="flex items-center justify-between text-indigo-300 font-bold">
                    <span>PDF Resume Parser Active</span>
                    <label className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer flex items-center gap-1">
                      <Upload size={12} />
                      <span>{modalResumeLoading ? 'Parsing PDF...' : 'Upload / Change PDF'}</span>
                      <input type="file" accept=".pdf" className="hidden" onChange={handleModalResumeUpload} disabled={modalResumeLoading} />
                    </label>
                  </div>
                  {modalResumeInfo ? (
                    <p className="text-[11px] text-slate-300">
                      ✅ Loaded: <strong>{modalResumeInfo.filename}</strong> ({modalResumeInfo.extractedSkills?.slice(0, 4).join(', ') || 'Skills Extracted'})
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      Click 'Upload PDF' above or upload your resume in Profile to extract your actual project experience.
                    </p>
                  )}
                </div>
              )}

              {/* Interactive Quick-Select Preset Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Question Count</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                  {/* Preset 5 */}
                  <button
                    type="button"
                    onClick={() => { setQuestionCount(5); setIsCustomMode(false); }}
                    className={`p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                      !isCustomMode && questionCount === 5
                        ? 'bg-gradient-to-b from-rose-500/30 to-purple-600/30 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105'
                        : 'bg-[#090710] border-[#2B2144] text-slate-400 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <Zap size={18} className="text-amber-400 mb-1" />
                    <span className="text-sm font-black block">5 Questions</span>
                    <span className="text-[10px] text-slate-400">Quick Practice</span>
                  </button>

                  {/* Preset 10 (Default) */}
                  <button
                    type="button"
                    onClick={() => { setQuestionCount(10); setIsCustomMode(false); }}
                    className={`p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                      !isCustomMode && questionCount === 10
                        ? 'bg-gradient-to-b from-rose-500/30 to-purple-600/30 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105'
                        : 'bg-[#090710] border-[#2B2144] text-slate-400 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <Target size={18} className="text-rose-400 mb-1" />
                    <span className="text-sm font-black block">10 Questions</span>
                    <span className="text-[10px] text-rose-400 font-bold">Standard</span>
                  </button>

                  {/* Preset 15 */}
                  <button
                    type="button"
                    onClick={() => { setQuestionCount(15); setIsCustomMode(false); }}
                    className={`p-3.5 rounded-xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                      !isCustomMode && questionCount === 15
                        ? 'bg-gradient-to-b from-rose-500/30 to-purple-600/30 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105'
                        : 'bg-[#090710] border-[#2B2144] text-slate-400 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <Trophy size={18} className="text-purple-400 mb-1" />
                    <span className="text-sm font-black block">15 Questions</span>
                    <span className="text-[10px] text-slate-400">Deep-Dive</span>
                  </button>
                </div>

                {/* Custom Count Toggle & Input */}
                {!isCustomMode ? (
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer flex items-center gap-1 mt-1"
                  >
                    <Settings2 size={13} />
                    <span>Or enter a custom number of questions (Max 50)</span>
                  </button>
                ) : (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={50}
                        inputMode="numeric"
                        value={customCountInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') return setCustomCountInput('');
                          const parsed = parseInt(val, 10);
                          if (parsed > 50) {
                            setCustomCountInput('50');
                          } else {
                            setCustomCountInput(val);
                          }
                        }}
                        placeholder="Enter custom count (1 - 50)"
                        className="flex-1 px-4 py-2.5 input-3d rounded-xl text-xs sm:text-sm text-center min-h-[42px]"
                      />
                      <button
                        type="button"
                        onClick={() => { setIsCustomMode(false); setCustomCountInput(''); }}
                        className="px-3.5 py-2.5 bg-[#2B2144] hover:bg-[#3D2C60] rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    <p className="text-[10px] text-rose-400 font-medium mt-1">Note: Maximum limit is 50 questions per session.</p>
                  </div>
                )}
              </div>

              {/* Interviewer Persona Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interviewer Persona</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {[
                    { id: 'Standard', label: 'Standard', desc: 'Balanced & professional' },
                    { id: 'Google (FAANG Strict)', label: 'FAANG Strict', desc: 'Deep algorithms & edge cases' },
                    { id: 'Amazon (Leadership)', label: 'Amazon Style', desc: 'Leadership principles & STAR' },
                    { id: 'Startup (Agile & Scrappy)', label: 'Startup Lead', desc: 'Fast-paced & product-focused' },
                    { id: 'The Grill Master (Stress Test)', label: 'Grill Master', desc: 'Aggressive pushback & pressure' }
                  ].map((persona) => (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => setInterviewerPersona(persona.id)}
                      className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        interviewerPersona === persona.id
                          ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/20 border-rose-500 text-white shadow-md shadow-rose-500/20'
                          : 'bg-[#090710] border-[#2B2144] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-sm font-bold block">{persona.label}</span>
                      <span className="text-[10px] text-slate-500">{persona.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowPromptModal(false)}
                className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-slate-300 bg-[#090710] border border-[#2B2144] hover:bg-[#1A142D] hover:text-white transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSession}
                disabled={creating || !targetRole.trim() || (isCustomMode && (!customCountInput || parseInt(customCountInput) < 1))}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 transition-colors shadow-lg shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                data-testid="start-session-button"
              >
                {creating ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    Preparing...
                  </>
                ) : (
                  <>
                    <PlayCircle size={18} />
                    Start Mock Interview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
