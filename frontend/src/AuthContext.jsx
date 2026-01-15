import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Helper function to get initial state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      // Set axios default header for all subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { token, user, isAuthenticated: true };
    }
  } catch (error) {
    // Malformed data in localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null, isAuthenticated: false };
};

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getInitialState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token, ...user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setAuthState({ token, user, isAuthenticated: true });
      setLoading(false);
      return true; // Success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      return false; // Failure
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, ...user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setAuthState({ token, user, isAuthenticated: true });
      setLoading(false);
      return true; // Success
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      return false; // Failure
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({ token: null, user: null, isAuthenticated: false });
  };

  // The value to be passed to consuming components
  const value = {
    ...authState,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};