"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api/axios-client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      let token = localStorage.getItem('token');
      if (!token) {
        // Try to get a new access token using refresh cookie
        try {
          const refreshResp = await api.post('/auth/refresh');
          token = refreshResp.data?.token;
          if (token) localStorage.setItem('token', token);
        } catch (e) {
          // No valid session
          setLoading(false);
          return;
        }
      }

      const response = await api.get('/auth/profile');
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Check if response indicates success
      if (!response.data.success) {
        return { 
          success: false, 
          error: response.data.error || 'Login failed' 
        };
      }
      
      const { token, user } = response.data;
      
      if (!token || !user) {
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Login failed. Please check your credentials and try again.';
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user, requiresApproval } = response.data;
      
      // If requires approval, don't login automatically
      if (requiresApproval) {
        return { 
          success: true, 
          requiresApproval: true,
          user,
          message: response.data.message || 'Registration successful. Your account is pending admin approval.'
        };
      }
      
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isBroker = () => {
    return user?.role === 'broker';
  };

  const canManageProperties = () => {
    return hasAnyRole(['admin', 'broker']);
  };

  const canManageUsers = () => {
    return isAdmin();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin,
    isBroker,
    canManageProperties,
    canManageUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
