import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('bookcycle_token');
      const cachedUser = localStorage.getItem('bookcycle_user');

      if (token && cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          // Refresh user data from API in the background
          const freshUser = await authApi.getMe();
          setUser(freshUser);
          localStorage.setItem('bookcycle_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Auth token expired or invalid:', err);
          logout(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('bookcycle_token', data.access_token);
      localStorage.setItem('bookcycle_user', JSON.stringify(data.user));
      setUser(data.user);
      showSuccess(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      showError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      localStorage.setItem('bookcycle_token', data.access_token);
      localStorage.setItem('bookcycle_user', JSON.stringify(data.user));
      setUser(data.user);
      showSuccess(`Welcome to BookCycle, ${data.user.name.split(' ')[0]}!`);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
      showError(msg);
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updated = await authApi.updateProfile(profileData);
      setUser(updated);
      localStorage.setItem('bookcycle_user', JSON.stringify(updated));
      showSuccess('Profile updated successfully!');
      return { success: true, user: updated };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile.';
      showError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = (notify = true) => {
    localStorage.removeItem('bookcycle_token');
    localStorage.removeItem('bookcycle_user');
    setUser(null);
    if (notify) {
      showInfo('You have logged out.');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
