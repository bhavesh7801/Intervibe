import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
console.log("Current Backend URL:", BACKEND_URL);

if (!BACKEND_URL) {
  console.error("CRITICAL: VITE_BACKEND_URL is not defined in your .env file!");
}

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
}, (error) => Promise.reject(error));

export const checkBackendConnection = async () => {
  try {
    const response = await apiClient.get('/redis-status');
    console.log("✅ Backend is connected!", response.data);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed!", error);
    return false;
  }
};

/**
 * Stream SSE tokens progressively from backend AI endpoint.
 * @param {Object} payload { question_text, transcript, role, session_id }
 * @param {Function} onToken Callback(token: string) for each token chunk
 * @param {Function} onComplete Callback(finalData: object) when streaming finishes
 * @param {Function} onError Callback(error: any) on stream or network failure
 */
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
      buffer = lines.pop() || ''; // Keep incomplete trailing chunk

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

export const api = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  googleLogin: (token, targetRole = null, experienceLevel = null) =>
    apiClient.post('/auth/google', { token, targetRole, experienceLevel }),
  register: (name, email, password, targetRole, experienceLevel) =>
    apiClient.post('/auth/register', { name, email, password, targetRole, experienceLevel }),
  verifyOTP: (email, otp) => apiClient.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => apiClient.post('/auth/resend-otp', { email }),
  getCurrentUser: () => apiClient.get('/auth/me'),
  createSession: (role, numQuestions = 10, persona = "Standard") =>
    apiClient.post('/sessions', { role, numQuestions, questionLimit: numQuestions, persona }),
  getSessions: () => apiClient.get('/sessions'),
  getSession: (sessionId) => apiClient.get(`/sessions/${sessionId}`),
  submitAnswer: (questionId, questionText, transcript, sessionId) =>
    apiClient.post('/answers', { questionId, questionText, transcript, sessionId }),
  getStats: () => apiClient.get('/stats'),
  getCodingQuestions: () => apiClient.get('/api/code/questions'),
  runCode: (language, sourceCode, stdin = "") => apiClient.post('/api/code/run', { language, sourceCode, stdin }),
  analyzeComplexity: (language, sourceCode, questionTitle = "") => apiClient.post('/api/code/analyze-complexity', { language, sourceCode, questionTitle }),
  getHint: (language, sourceCode, questionTitle, hintTier = 1) => apiClient.post('/api/code/hint', { language, sourceCode, questionTitle, hintTier }),
  getHybridQuestions: () => apiClient.get('/assessment/hybrid-questions'),
  generateAssessmentExam: (target_role, num_questions, difficulty) => apiClient.post('/api/assessment/generate-exam', { target_role, num_questions, difficulty }),
  generateQuestion: (payload) => apiClient.post('/api/questions/generate', payload),
  evaluateStar: (payload) => apiClient.post('/api/evaluate/star', payload),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  streamEvaluateAnswer,
  transcribeAudio
};