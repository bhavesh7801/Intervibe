import axios from 'axios';

// Empty string = relative URL → nginx proxies to backend on EC2
// In dev, Vite proxy handles /auth, /api etc → localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('intervibe_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clean stale credentials if unauthorized
      localStorage.removeItem('intervibe_user');
      localStorage.removeItem('intervibe_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
