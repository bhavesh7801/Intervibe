import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../apiClient';
import {
  MessageSquare, AlertCircle, Sparkles, Send, Star,
  CheckCircle2, HelpCircle, ShieldAlert, History, Filter, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeedbackSupport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState('General Feedback');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
    fetchFeedbackHistory();
  }, [user]);

  const fetchFeedbackHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.getFeedbacks();
      setMyFeedbacks(res.data || []);
    } catch (err) {
      console.error("Failed to load feedback tickets:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessTicket(null);

    if (!subject.trim() || !description.trim()) {
      return setErrorMsg('Please fill in both subject and detailed description');
    }

    setLoading(true);
    try {
      const payload = {
        category,
        subject: subject.trim(),
        description: description.trim(),
        rating,
        name: name.trim(),
        email: email.trim()
      };

      const res = await api.submitFeedback(payload);
      setSuccessTicket(res.data.ticketId || 'FB-SUCCESS');
      setSubject('');
      setDescription('');
      fetchFeedbackHistory();
    } catch (err) {
      console.error("Submit feedback error:", err);
      setErrorMsg(err.response?.data?.detail || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = [
    { id: 'General Feedback', label: 'General Feedback', icon: MessageSquare, desc: 'Ideas, compliments, or suggestions' },
    { id: 'Bug Report', label: 'Bug / Technical Issue', icon: AlertCircle, desc: 'Voice recorder, IDE, or UI issues' },
    { id: 'Complaint', label: 'Complaint / Appeal', icon: ShieldAlert, desc: 'Dispute AI scoring or question content' },
    { id: 'Feature Request', label: 'Feature Request', icon: Sparkles, desc: 'Suggest new roles, languages, or modules' }
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#060813] text-slate-200 py-8 px-4 sm:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-[1200px] mx-auto space-y-8 px-4">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#162035]">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">User Support & Feedback Desk</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-indigo-600/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
            <MessageSquare size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            User Feedback & Support Center
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl mx-auto">
            We value your experience! Report a bug, file a inquiry regarding AI evaluation, or request exciting new features.
          </p>
        </div>

        {/* Success Ticket Modal / Banner */}
        {successTicket && (
          <div className="mb-8 p-6 bg-[#080D1A] border border-emerald-500/50 rounded-2xl animate-entrance shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-300">Ticket Created Successfully!</h3>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                  Your reference ID is <strong className="text-white font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">{successTicket}</strong>. Our support team will review your report shortly.
                </p>
              </div>
              <button
                onClick={() => setSuccessTicket(null)}
                className="text-xs font-semibold text-emerald-400 hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs sm:text-sm text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Submission Form Card */}
        <div className="card-3d p-6 sm:p-8 rounded-2xl mb-12 bg-[#0C1222] border border-[#1A253F]" data-testid="feedback-form">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Category Selection Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                1. Select Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-[1.01]'
                          : 'bg-[#080D1A] border-[#162035] text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-[#05070E] text-slate-400'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{cat.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Platform Experience Rating
              </label>
              <div className="flex items-center gap-2 bg-[#080D1A] p-3.5 rounded-xl border border-[#162035] w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }
                    />
                  </button>
                ))}
                <span className="ml-3 text-xs font-bold text-slate-300">
                  {rating === 5 ? ' Excellent (5/5)' : rating === 4 ? ' Good (4/5)' : rating === 3 ? ' Average (3/5)' : rating === 2 ? ' Poor (2/5)' : ' Terrible (1/5)'}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-[#080D1A] border border-[#162035] text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 min-h-[46px]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-[#080D1A] border border-[#162035] text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 min-h-[46px]"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject / Title</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. AI Score appeal for session #3 or Voice recorder issue"
                className="w-full px-4 py-3 bg-[#080D1A] border border-[#162035] text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 min-h-[46px]"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detailed Message / Complaint</label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your feedback, issue, or complaint in detail..."
                className="w-full px-4 py-3 bg-[#080D1A] border border-[#162035] text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 min-h-[120px]"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading || !subject.trim() || !description.trim()}
              className="w-full py-4 px-6 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 transition-all min-h-[48px]"
            >
              <Send size={18} />
              <span>{loading ? 'Submitting Support Ticket...' : 'Submit Feedback / Ticket'}</span>
            </button>
          </form>
        </div>

        {/* History / Previous Submitted Tickets List */}
        <div className="card-3d p-6 sm:p-8 rounded-2xl bg-[#0C1222] border border-[#1A253F]">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#162035]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <History size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Your Support & Feedback History</h3>
                <p className="text-[11px] text-slate-400">Track status of your submitted complaints and requests</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">{myFeedbacks.length} tickets</span>
          </div>

          {loadingHistory ? (
            <div className="text-center py-8 text-xs text-slate-400 animate-pulse">
              Loading support history...
            </div>
          ) : myFeedbacks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 italic">
              You haven't submitted any feedback or complaints yet.
            </div>
          ) : (
            <div className="space-y-3.5">
              {myFeedbacks.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#080D1A] border border-[#162035] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                        {item.ticketId}
                      </span>
                      <span className="text-xs font-bold text-white">{item.subject}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Category: {item.category}</span>
                      <span>•</span>
                      <span>Rating: {item.rating}/5 ★</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      item.status === 'resolved'
                        ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                        : 'bg-amber-950/50 border-amber-800 text-amber-300'
                    }`}>
                      {item.status || 'open'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FeedbackSupport;
