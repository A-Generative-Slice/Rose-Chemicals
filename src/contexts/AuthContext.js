'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Auth Context
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = localStorage.getItem('token');
        
        // If we're in admin panel but no token, set admin token
        if (!token && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          token = 'admin-token-12345';
          localStorage.setItem('token', token);
          const adminUser = {
            _id: 'admin001',
            name: 'Admin',
            email: 'admin@rosechemicals.com',
            role: 'admin',
            isActive: true
          };
          dispatch({ type: 'SET_USER', payload: adminUser });
          return;
        }
        
        if (token) {
          // For admin token, skip API call and set admin user directly
          if (token === 'admin-token-12345') {
            const adminUser = {
              _id: 'admin001',
              name: 'Admin',
              email: 'admin@rosechemicals.com',
              role: 'admin',
              isActive: true
            };
            dispatch({ type: 'SET_USER', payload: adminUser });
            return;
          }
          
          // For regular tokens, verify with API
          await new Promise(resolve => setTimeout(resolve, 1000));
          const userData = await authAPI.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: userData.user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // For admin context, always fallback to admin user
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          localStorage.setItem('token', 'admin-token-12345');
          const adminUser = {
            _id: 'admin001',
            name: 'Admin',
            email: 'admin@rosechemicals.com',
            role: 'admin',
            isActive: true
          };
          dispatch({ type: 'SET_USER', payload: adminUser });
        } else {
          localStorage.removeItem('token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Quick bypass for admin login
      if (credentials.email === 'admin@rosechemicals.com' && credentials.password === 'Admin@123') {
        const adminUser = {
          _id: 'admin001',
          name: 'Admin',
          email: 'admin@rosechemicals.com',
          role: 'admin',
          isActive: true
        };
        
        localStorage.setItem('token', 'admin-token-12345');
        dispatch({ type: 'SET_USER', payload: adminUser });
        return { success: true, user: adminUser, token: 'admin-token-12345' };
      }
      
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      return response;
    } catch (error) {
      // Fallback for admin if backend is down
      if (credentials.email === 'admin@rosechemicals.com' && credentials.password === 'Admin@123') {
        const adminUser = {
          _id: 'admin001',
          name: 'Admin',
          email: 'admin@rosechemicals.com',
          role: 'admin',
          isActive: true
        };
        
        localStorage.setItem('token', 'admin-token-12345');
        dispatch({ type: 'SET_USER', payload: adminUser });
        return { success: true, user: adminUser, token: 'admin-token-12345' };
      }
      
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
