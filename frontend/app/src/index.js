import axios from 'axios';

const BACKEND_URL =import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = BACKEND_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: (email, password) => 
    axios.post(`${API}/auth/login`, { email, password }),
  
  register: (name, email, password, targetRole, experienceLevel) =>
    axios.post("https://mock-interview-ai-115.preview.emergentagent.com/api/auth/register", { 
  name, email, password, targetRole, experienceLevel 
}),
  
  getCurrentUser: () =>
    axios.get(`${API}/auth/me`, { headers: getAuthHeader() }),
  
  // Sessions
  createSession: (role, numQuestions = 5) =>
    axios.post(`${API}/sessions`, { role, numQuestions }, { headers: getAuthHeader() }),
  
  getSessions: () =>
    axios.get(`${API}/sessions`, { headers: getAuthHeader() }),
  
  getSession: (sessionId) =>
    axios.get(`${API}/sessions/${sessionId}`, { headers: getAuthHeader() }),
  
  // Answers
  submitAnswer: (questionId, questionText, transcript, sessionId) =>
    axios.post(`${API}/answers`, { questionId, questionText, transcript, sessionId }, { headers: getAuthHeader() }),
  
  // Stats
  getStats: () =>
    axios.get(`${API}/stats`, { headers: getAuthHeader() })
};
