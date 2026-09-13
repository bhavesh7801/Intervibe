import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login'; 
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Auth init failed:', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [logout]);

  const register = async (name, email, password, targetRole, experienceLevel) => {
    const response = await api.register(name, email, password, targetRole, experienceLevel);
    const { token, user: userData } = response.data;
    if (token) {
      localStorage.setItem('token', token);
      setUser(userData);
    }
    return userData;
  };

  const login = async (email, password) => {
    const response = await api.login(email, password);
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const googleLogin = async (token, targetRole = null, experienceLevel = null) => {
    const response = await api.googleLogin(token, targetRole, experienceLevel);
    const { token: appToken, user: userData } = response.data;
    localStorage.setItem('token', appToken);
    setUser(userData);
    return userData;
  };

  const verifyOTP = async (email, otp) => {
    const response = await api.verifyOTP(email, otp);
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const resendOTP = async (email) => {
    const response = await api.resendOTP(email);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, googleLogin, register, verifyOTP, resendOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);