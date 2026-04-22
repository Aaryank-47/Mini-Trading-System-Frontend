import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser, clearUser } from '../store/userSlice';
import apiClient, { setAccessToken, clearAccessToken } from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    try {
      // Optional: Call backend logout if it exists to clear the refresh cookie
      // await apiClient.post('/users/logout');
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      clearAccessToken();
      setIsAuthenticated(false);
      dispatch(clearUser());
    }
  }, [dispatch]);

  // Handle initialization on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Attempt silent refresh using HttpOnly cookie
        // No body needed as refresh token is in the cookie
        const res = await apiClient.post('/users/token/refresh', {});
        
        const token = res.data.access_token;
        setAccessToken(token);
        
        // 2. Fetch full user profile using the new access token
        const userRes = await apiClient.get('/users/profile');
        dispatch(setCurrentUser(userRes.data));
        setIsAuthenticated(true);
        
        console.log('✓ Session restored successfully');
      } catch (error) {
        // Silent refresh failed, user is not logged in or session expired
        console.log('ℹ No active session found.');
        clearAccessToken();
        setIsAuthenticated(false);
        dispatch(clearUser());
      } finally {
        // Initialization complete - allow UI to render
        setIsInitializing(false);
      }
    };

    initAuth();

    // Listen for forced logouts from the interceptor (e.g., refresh token expired)
    const onLogoutEvent = () => handleLogout();
    window.addEventListener('auth:logout', onLogoutEvent);
    
    return () => {
      window.removeEventListener('auth:logout', onLogoutEvent);
    };
  }, [dispatch, handleLogout]);

  const login = async (credentials) => {
    try {
      const res = await apiClient.post('/users/login', credentials);
      // Access token stored in memory
      setAccessToken(res.data.access_token);
      
      // Fetch full profile
      const userRes = await apiClient.get('/users/profile');
      dispatch(setCurrentUser(userRes.data));
      setIsAuthenticated(true);
      return userRes.data;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.post('/users/register', userData);
      // Access token stored in memory
      setAccessToken(res.data.access_token);
      
      // Fetch profile
      const userRes = await apiClient.get('/users/profile');
      dispatch(setCurrentUser(userRes.data));
      setIsAuthenticated(true);
      return userRes.data;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitializing, login, register, logout: handleLogout }}>
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
