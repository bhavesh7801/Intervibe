import React, { useState, useRef } from 'react';
import { 
  FileText, Target, CheckCircle2, AlertCircle, Sparkles, Upload, 
  Trash2, ArrowRight, BookOpen, Layers, Lightbulb, TrendingUp,
  Cpu, Building2, ShieldAlert, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const TARGET_ROLES = [
  'Senior Backend Engineer',
  'Senior Frontend Engineer',
  'Full Stack Software Engineer',
  'Staff Distributed Systems Architect',
  'DevOps & Site Reliability Engineer (SRE)',
  'Machine Learning & AI Engineer',
  'Data Platform Engineer',
  'Mobile iOS/Android Engineer'
];

const COMPANY_PRESETS = [
  {
    name: 'Google (L5 Senior)',
    role: 'Senior Backend Engineer',
    jd: 'Requires deep mastery of distributed systems, O(1)/O(N) algorithmic efficiency, concurrent Go/Java/Python backend services, Bigtable/Spanner, and gRPC microservice communication under high-scale loads.'
  },
  {
    name: 'Meta (E5 Systems)',
    role: 'Staff Distributed Systems Architect',
    jd: 'Looking for systems expertise in low-latency C++/Rust/Go services, Kafka partition logs, Memcached/Redis caching topologies, GraphQL federation, and multi-region database sharding.'
  },
  {
    name: 'Amazon (SDE II)',
    role: 'Full Stack Software Engineer',
    jd: 'Requires full-stack ownership across React/TypeScript, AWS Serverless (Lambda, DynamoDB, SQS, ECS), microservice resilience, CI/CD pipeline automation, and operational metrics telemetry.'
  },
  {
    name: 'Stripe (Staff Infra)',
    role: 'Senior Backend Engineer',
    jd: 'Demands absolute precision in idempotent payment processing, double-entry ledger design, PostgreSQL replication, high-throughput message streaming, and sub-10ms p99 SLA guarantees.'
  }
];

export const ResumeJobFitTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const fileInputRef = useRef(null);
  const [activeInputMode, setActiveInputMode] = useState('upload'); // 'upload' | 'text'
  
  // File State
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Form State
  const [targetRole, setTargetRole] = useState(user?.targetRole || TARGET_ROLES[0]);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState(
    'Senior Software Engineer with 5+ years of experience building scalable backend APIs in Python and Node.js. Experience with PostgreSQL, Redis caching, Docker containerization, RESTful architecture, and Git.'
  );

  // Processing & Results
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleApplyPreset = (preset) => {
    setTargetRole(preset.role);
    setJobDescription(preset.jd);
    toast.info?.(`Loaded ${preset.name} rubric preset`);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ['.pdf', '.docx', '.doc', '.txt'];
    const nameLower = file.name.toLowerCase();
    const isAllowed = allowed.some((ext) => nameLower.endsWith(ext));

    if (!isAllowed) {
      setError('Please upload a PDF (.pdf), Word (.docx), or Text (.txt) file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum supported size is 10MB.');
      return;
    }

    setError('');
    setSelectedFile(file);
    toast.success?.(`Attached ${file.name}`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);

    try {
      let response;
      if (activeInputMode === 'upload' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('target_role', targetRole);
        if (jobDescription.trim()) {
          formData.append('job_description', jobDescription.trim());
        }

        response = await apiClient.post('/resume/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data?.fullText) {
          setResumeText(response.data.fullText);
        }
        setAnalysisResult(response.data.analysis);
      } else {
        if (!resumeText.trim() || resumeText.trim().length < 20) {
          setError('Please provide more details in your resume summary.');
          setLoading(false);
          return;
        }

        response = await apiClient.post('/resume/analyze-text', {
          resume_text: resumeText.trim(),
          target_role: targetRole,
          job_description: jobDescription.trim()
        });

        setAnalysisResult(response.data.analysis);
      }

      toast.success?.('Resume compatibility analysis complete!');
    } catch (err) {
      console.error('Resume Analysis Error:', err);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to complete resume analysis.';
      setError(errMsg);
      toast.error?.(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 65) return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-950/40';
  };

  const getImportanceBadge = (importance) => {
    const imp = (importance || '').toLowerCase();
    if (imp.includes('high') || imp.includes('critical')) {
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
    }
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-heading">
              <Target size={20} className="text-rose-600 dark:text-rose-400" />
              <span>Resume Document & Missing Skill Gap Analyzer</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Upload your resume (PDF, Word, TXT) to evaluate alignment against target engineering roles, identify unavailable skills, and receive an interview preparation roadmap.
            </p>
          </div>
        </div>

        {/* Company Target Presets Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Building2 size={13} className="text-rose-600 dark:text-rose-400" />
            <span>Quick Target Rubric Presets</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMPANY_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {preset.role}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Target Role & JD Config (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <Cpu size={15} className="text-rose-600 dark:text-rose-400" />
            <span>Target Role Specification</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Target Engineering Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Job Description / Tech Stack (Optional)
              </label>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste specific job requirements, key company standards, or desired tech stack (e.g., Kafka, Kubernetes, Go, Redis, AWS)..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* Right Col: Resume Document Uploader & Text Input (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              <FileText size={15} className="text-rose-600 dark:text-rose-400" />
              <span>Resume Input</span>
            </div>

            {/* Switch Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveInputMode('upload')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeInputMode === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveInputMode('text')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeInputMode === 'text'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {/* Mode 1: Document Upload Dropzone */}
          {activeInputMode === 'upload' ? (
            <div className="space-y-3">
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer ${
                    dragOver
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-rose-400 dark:hover:border-rose-600 hover:bg-rose-50/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Upload size={22} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      Click to upload or drag & drop your Resume
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                      Supports PDF (.pdf), Word (.docx), and Plain Text (.txt) up to 10MB
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                        {selectedFile.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready for Analysis
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
                    title="Remove file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Direct Resume Text Input */
            <div className="space-y-1.5">
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content, technical work experience, projects, languages, frameworks, and architecture background..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors leading-relaxed"
              />
            </div>
          )}

          {/* Action Trigger Button */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || (activeInputMode === 'upload' && !selectedFile && !resumeText)}
            className="w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <Sparkles size={16} />
            <span>{loading ? 'Analyzing Skills & Gaps with AI...' : `Calculate Fit Score for ${targetRole}`}</span>
          </button>
        </div>

      </div>

      {/* Results Section */}
      {analysisResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in duration-300">
          
          {/* Header Score Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                <Award size={14} />
                <span>AI Compatibility Audit</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                {analysisResult.role || targetRole} Evaluation
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {analysisResult.experienceSummary}
              </p>
            </div>

            {/* Score Pill Card */}
            <div className={`px-6 py-4 rounded-3xl border text-center flex flex-col items-center justify-center shrink-0 ${getScoreColor(analysisResult.overallScore || 75)}`}>
              <span className="text-4xl font-black font-mono tracking-tight">
                {analysisResult.overallScore || 0}%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider mt-1">
                {analysisResult.fitVerdict || 'Scorecard'}
              </span>
            </div>
          </div>

          {/* MISSING SKILLS WARNING SECTION (Featured Key Requirement) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <ShieldAlert size={16} />
                <span>Skills Not Available in Resume for this Role ({analysisResult.missingSkills?.length || 0})</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Identified for {targetRole}
              </span>
            </div>

            {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.missingSkills.map((item, idx) => {
                  const skillName = typeof item === 'string' ? item : item.skill;
                  const category = typeof item === 'object' ? item.category : 'Required Competency';
                  const importance = typeof item === 'object' ? item.importance : 'High';
                  const reason = typeof item === 'object' ? item.reason : 'Crucial for real-world loop questions and architectural depth.';

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span className="text-sm font-black text-rose-900 dark:text-rose-200 truncate">
                            {skillName}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getImportanceBadge(importance)}`}>
                          {importance} Priority
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                        Category: {category}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>No major skill gaps identified! Your profile demonstrates complete coverage for this role.</span>
              </div>
            )}
          </div>

          {/* Matched Skills & Strengths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* Matched Skills Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 size={15} />
                <span>Matched Skills Confirmed ({analysisResult.matchedSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.matchedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Strengths Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <TrendingUp size={15} className="text-rose-600 dark:text-rose-400" />
                <span>Key Experience Highlights</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {analysisResult.strengths?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Actionable Learning Roadmap & Project Suggestions */}
          {analysisResult.actionableSuggestions && analysisResult.actionableSuggestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <Lightbulb size={16} className="text-amber-500" />
                <span>Actionable Steps to Bridge Skill Gaps</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.actionableSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.skill || 'Recommended Action'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.action}
                    </p>
                    {item.studyTopic && (
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        <strong>Study Topic:</strong> {item.studyTopic}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Mock Interview Call-to-Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
              Want to practice verbal follow-ups on these missing areas before real hiring managers evaluate you?
            </div>
            <button
              type="button"
              onClick={() => navigate('/interview')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Practice Mock Interview for {targetRole}</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ResumeJobFitTab;
