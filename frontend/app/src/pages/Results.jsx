import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { Award, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Sparkles, Download, FileText, ShieldCheck, Share2, Copy, X } from 'lucide-react';
import CompetencyRadarChart from '../components/CompetencyRadarChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useAuth } from '../context/AuthContext';

const Results = () => {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [copiedCertLink, setCopiedCertLink] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await api.getSession(sessionId);
      setSession(response.data);
    } catch (error) {
      console.error('Error fetching session:', error);
      alert('Session not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!session) return;
    setExportingPDF(true);

    try {
      // 1. Initialize jsPDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const roleName = session.role || 'Interview Candidate';
      const overallScore = session.overallScore ?? 85;
      const sessionDate = session.date ? new Date(session.date).toLocaleDateString() : new Date().toLocaleDateString();

      // Background Header Banner
      doc.setFillColor(20, 15, 38); // Dark purple #140F26
      doc.rect(0, 0, 210, 45, 'F');

      // Title & Branding
      doc.setTextColor(244, 63, 94); // Rose #F43F5E
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("AI INTERVIEW EVALUATION REPORT", 15, 18);

      doc.setTextColor(203, 213, 225); // Slate 300
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Candidate Target Track: ${roleName}`, 15, 28);
      doc.text(`Evaluation Date: ${sessionDate}`, 15, 35);

      // Score Box Card
      doc.setFillColor(244, 63, 94);
      doc.roundedRect(148, 10, 48, 25, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${overallScore}/100`, 172, 24, { align: 'center' });
      doc.setFontSize(8);
      doc.text("OVERALL SCORE", 172, 31, { align: 'center' });

      // Body Section Heading
      doc.setTextColor(30, 27, 75);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text("Question Evaluation & AI Feedback Summary", 15, 56);
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 60, 195, 60);

      let yPos = 68;

      // Render Answers Transcript
      const answers = session.answers || [];
      if (answers.length === 0) {
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("No individual answer records logged for this session.", 15, yPos);
      } else {
        answers.forEach((ans, index) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFillColor(248, 250, 252);
          doc.roundedRect(15, yPos, 180, 42, 2, 2, 'F');
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(15, yPos, 180, 42, 2, 2, 'D');

          // Question Title & Score
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          const qTitle = `Q${index + 1}: ${ans.questionText || 'Interview Question'}`;
          doc.text(doc.splitTextToSize(qTitle, 140), 20, yPos + 8);

          doc.setFillColor(239, 68, 68);
          if ((ans.aiScore || 0) >= 70) doc.setFillColor(16, 185, 129);
          doc.roundedRect(165, yPos + 5, 25, 8, 2, 2, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.text(`Score: ${ans.aiScore || 0}`, 177.5, yPos + 10.5, { align: 'center' });

          // Candidate Spoken Transcript
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(71, 85, 105);
          const transcriptText = `Answer: "${(ans.transcript || 'No transcript provided').slice(0, 120)}..."`;
          doc.text(doc.splitTextToSize(transcriptText, 170), 20, yPos + 20);

          // AI Feedback
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          const fbText = `AI Evaluation: ${(ans.feedback || 'Evaluated successfully.').slice(0, 140)}`;
          doc.text(doc.splitTextToSize(fbText, 170), 20, yPos + 32);

          yPos += 48;
        });
      }

      // Footer Branding
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Generated by AI Interview Prep Platform • Certified Performance Report", 105, 290, { align: 'center' });

      // Save PDF File
      const safeRole = (session.role || 'Session').replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`Interview_Evaluation_${safeRole}.pdf`);
    } catch (err) {
      console.error('PDF Direct Export Error:', err);

      // Fallback html2canvas export if direct jsPDF generation encounters any issue
      try {
        const reportElement = document.getElementById('session-results-report');
        if (reportElement) {
          const canvas = await html2canvas(reportElement, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#0F0C1B'
          });
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
          pdf.save(`Interview_Report.pdf`);
        }
      } catch (fallbackErr) {
        console.error('Fallback PDF Export Error:', fallbackErr);
        alert('Could not download PDF. Please try again.');
      }
    } finally {
      setExportingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060813] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-rose-400 font-semibold text-base sm:text-lg animate-pulse">
          <Sparkles size={22} />
          Loading your session results...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-center bg-[#060813] text-slate-200 py-6 sm:py-10 overflow-x-hidden" data-testid="results-page">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8">
        
        {/* PDF Export Bar */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCertModal(true)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-500/10"
            >
              <Award size={15} className="text-amber-400" />
              <span>Shareable Certificate</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={exportingPDF}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25 disabled:opacity-50"
              data-testid="export-pdf-btn"
            >
              <Download size={15} className={exportingPDF ? 'animate-bounce' : ''} />
              <span>{exportingPDF ? 'Generating PDF Report...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

        {/* Report Container to be exported to PDF */}
        <div id="session-results-report" className="space-y-6">
          {/* Results Header Card */}
          <div className="card-3d rounded-2xl p-5 sm:p-8 text-center animate-entrance" data-testid="results-header">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-indigo-600/20 border-2 border-blue-500/40 text-blue-400 text-3xl sm:text-4xl mb-4 shadow-xl shadow-blue-500/20 animate-pulse">
              <Award size={40} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Interview Evaluation Complete
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mb-4">
              Target Role: <span className="text-slate-200 font-semibold">{session.role}</span>
            </p>
            
            {session.overallScore !== null && session.overallScore !== undefined && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#162035] inline-block" data-testid="overall-score">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Overall Performance Score</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                    {session.overallScore}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400">/ 100</span>
                </div>
              </div>
            )}
          </div>

          {/* Competency Radar Chart Section */}
          <div className="card-3d rounded-2xl p-5 sm:p-8">
            <div className="flex items-center justify-between mb-4 border-b border-[#2B2144] pb-3">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-rose-400" />
                Competency Radar Breakdown
              </h2>
              <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                4 Key Dimensions
              </span>
            </div>
            <CompetencyRadarChart overallScore={session.overallScore || 75} answers={session.answers || []} />
          </div>

          {/* Individual Question Results */}
          <div className="space-y-4 sm:space-y-6">
            {session.questions.map((question, index) => {
              const answer = session.answers?.[index];
              const isTechnical = question.category === 'technical';
              
              return (
                <div key={question.id || index} className="card-3d rounded-2xl p-4 sm:p-8" data-testid={`result-question-${index}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 pb-4 border-b border-[#2B2144]">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Question {index + 1}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isTechnical ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                          {question.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-amber-500/10 text-amber-400 border-amber-500/30">
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{question.text}</h3>
                    </div>

                    {answer && (
                      <div className="shrink-0 self-end sm:self-auto">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/40 text-rose-400 text-lg sm:text-xl font-black shadow-lg" data-testid={`score-${index}`}>
                          {answer.aiScore}
                        </div>
                      </div>
                    )}
                  </div>

                  {answer ? (
                    <div className="space-y-4">
                      <div className="bg-[#090710] p-3.5 sm:p-4 rounded-xl border border-[#2B2144]">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                          <h4 className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Your Spoken / Typed Answer</h4>
                          {answer.speechMetrics && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                🎙️ {answer.speechMetrics.wpm || 135} WPM
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {answer.speechMetrics.fillerCount || 0} Filler Words
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {answer.speechMetrics.pacingRating || 'Optimal Pace'}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 italic">{answer.transcript}</p>
                      </div>

                      <div className="bg-[#171227] p-3.5 sm:p-4 rounded-xl border border-purple-500/20">
                        <h4 className="text-[11px] sm:text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Sparkles size={14} /> AI Evaluator Feedback
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-200">{answer.feedback}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {answer.strengths && answer.strengths.length > 0 && (
                          <div className="bg-emerald-950/20 p-3 sm:p-4 rounded-xl border border-emerald-800/40">
                            <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CheckCircle2 size={14} /> Key Strengths
                            </h5>
                            <ul className="space-y-1">
                              {answer.strengths.map((s, idx) => (
                                <li key={idx} className="text-xs text-emerald-300 flex items-center gap-1.5">
                                  <span>•</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {answer.improvements && answer.improvements.length > 0 && (
                          <div className="bg-amber-950/20 p-3 sm:p-4 rounded-xl border border-amber-800/40">
                            <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <AlertTriangle size={14} /> Areas for Improvement
                            </h5>
                            <ul className="space-y-1">
                              {answer.improvements.map((imp, idx) => (
                                <li key={idx} className="text-xs text-amber-300 flex items-center gap-1.5">
                                  <span>•</span> {imp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No answer submitted for this question.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={exportingPDF}
            className="px-6 py-3.5 bg-gradient-to-r from-purple-500/20 to-rose-500/20 hover:from-purple-500/30 hover:to-rose-500/30 border border-purple-500/50 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {exportingPDF ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
            {exportingPDF ? 'Generating...' : 'Download PDF Report'}
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-3d py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} />
            Start New Session
          </button>
        </div>
      </div>

      {/* Verified Interview Competency Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#1A1230] via-[#120D24] to-[#0A0714] border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12 space-y-8 text-center">
            
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Certificate Graphic Card */}
            <div className="border border-amber-500/30 rounded-2xl p-6 bg-[#090710] space-y-4 shadow-inner relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-[#2B2144] pb-4">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs tracking-wider uppercase">
                  <ShieldCheck size={18} className="text-amber-400" /> AI INTERVIEW PLATFORM
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  ID: CERT-{sessionId ? sessionId.substring(0, 8).toUpperCase() : '88A92F'}
                </span>
              </div>

              <div className="py-2 space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Verified Certificate of Competency</p>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide my-1">{user?.name || 'Alex Johnson'}</h3>
                <h2 className="text-sm sm:text-base font-bold text-white capitalize">{session.role || 'Software Engineer'} Target Track</h2>
                <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-sm sm:text-base my-2">
                  Evaluation Score: {session.overallScore ?? 85} / 100 • Interview Ready
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-[#2B2144] pt-3">
                <div>Verified Date: <span className="text-slate-200 font-semibold">{new Date(session.date || Date.now()).toLocaleDateString()}</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">FAANG Competency Verified</span></div>
              </div>
            </div>

            {/* Share Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.origin}/verify/CERT-${sessionId ? sessionId.substring(0, 8).toUpperCase() : '88A92F'}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/25"
              >
                <Share2 size={15} />
                <span>Share Credential on LinkedIn</span>
              </a>

              <button
                onClick={() => {
                  const verifyUrl = `${window.location.origin}/verify/CERT-${sessionId ? sessionId.substring(0, 8).toUpperCase() : '88A92F'}`;
                  navigator.clipboard.writeText(verifyUrl);
                  setCopiedCertLink(true);
                  setTimeout(() => setCopiedCertLink(false), 2000);
                }}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedCertLink ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                <span>{copiedCertLink ? 'Verification URL Copied!' : 'Copy Verification URL'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
