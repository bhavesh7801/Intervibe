import axios from 'axios';

const getBackendUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL && import.meta.env.VITE_BACKEND_URL.trim() !== '') {
    return import.meta.env.VITE_BACKEND_URL;
  }
  return ''; // Relative path through Nginx reverse proxy
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
  streamEvaluateAnswer: (payload, onToken, onComplete, onError) => {
    return streamEvaluateAnswer(payload, onToken, onComplete, onError);
  },
  transcribeAudio: (audioBlob) => {
    return transcribeAudio(audioBlob);
  }
};

export const streamEvaluateAnswer = async (payload, onToken, onComplete, onError) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BACKEND_URL}/api/stream/evaluate-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Server returned status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.replace('data: ', '');
          try {
            const data = JSON.parse(jsonStr);
            if (data.done) {
              if (onComplete) onComplete(data);
              return;
            } else if (data.token) {
              if (onToken) onToken(data.token);
            }
          } catch (parseErr) {
            console.warn("SSE token parse warning:", parseErr);
          }
        }
      }
    }
  } catch (err) {
    console.error("Stream reader error:", err);
    if (onError) onError(err);
  }
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BACKEND_URL}/api/audio/transcribe`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Audio transcription failed (${response.status}): ${errText}`);
  }

  return await response.json();
};

export default apiClient;