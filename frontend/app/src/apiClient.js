import axios from 'axios';

const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL.trim() !== '') {
    return import.meta.env.VITE_BACKEND_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:8000`;
  }
  return 'http://localhost:8000';
};

const BACKEND_URL = getBackendUrl();

console.log("Using Backend URL:", BACKEND_URL);
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkBackendConnection = async () => {
  try {
    const response = await apiClient.get('/');
    console.log("✅ Server responded:", response.status);
    return true;
  } catch (error) {
    if (error.response) {
      console.log("❌ Server reachable, but returned error:", error.response.status);
    } else {
      console.log("❌ Server unreachable:", error.message);
    }
    return false;
  }
};

export const api = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  googleLogin: (token, targetRole = null, experienceLevel = null) =>
    apiClient.post('/auth/google', { token, targetRole, experienceLevel }),
  register: (name, email, password, targetRole, experienceLevel) =>
    apiClient.post('/auth/register', { name, email, password, targetRole, experienceLevel }),
  verifyOTP: (email, otp) => apiClient.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => apiClient.post('/auth/resend-otp', { email }),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/me', data),
  createSession: (role, numQuestions = 10, persona = "Standard") => apiClient.post('/sessions', { role, numQuestions, questionLimit: numQuestions, persona }),
  getSessions: () => apiClient.get('/sessions'),
  getSession: (sessionId) => apiClient.get(`/sessions/${sessionId}`),
  submitAnswer: (questionId, questionText, transcript, sessionId) =>
    apiClient.post('/answers', { questionId, questionText, transcript, sessionId }),
  getStats: () => apiClient.get('/stats'),
  getLeaderboard: () => apiClient.get('/user/leaderboard'),
  getCodingQuestions: () => apiClient.get('/api/code/questions'),
  runCode: (language, sourceCode, stdin = "") => apiClient.post('/api/code/run', { language, sourceCode, stdin }),
  analyzeComplexity: (language, sourceCode, questionTitle = "") => apiClient.post('/api/code/analyze-complexity', { language, sourceCode, questionTitle }),
  getHint: (language, sourceCode, questionTitle, hintTier = 1) => apiClient.post('/api/code/hint', { language, sourceCode, questionTitle, hintTier }),
  getHybridQuestions: () => apiClient.get('/assessment/hybrid-questions'),
  generateAssessmentExam: (target_role, num_questions, difficulty) => apiClient.post('/api/assessment/generate-exam', { target_role, num_questions, difficulty }),
  generateQuestion: (payload) => apiClient.post('/api/questions/generate', payload),
  evaluateStar: (payload) => apiClient.post('/api/evaluate/star', payload),
  submitFeedback: (payload) => apiClient.post('/feedback', payload),
  getFeedbacks: () => apiClient.get('/feedback'),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  submitMCQ: (questionId, selectedOption) =>
    apiClient.post('/assessment/submit-mcq', { questionId, selectedOption }),
};