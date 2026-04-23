import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser, clearUser } from '../store/userSlice';
import apiClient, { setAccessToken, clearAccessToken } from '../services/apiClient';
import { API_ROUTES } from '../api/routes';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  const applySession = useCallback((token, user) => {
    setAccessToken(token);
    dispatch(setCurrentUser(user));
    setIsAuthenticated(true);
  }, [dispatch]);

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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiClient.post(API_ROUTES.USERS.REFRESH, {});

        applySession(res.data.access_token, {
          id: res.data.user_id,
          name: res.data.name || 'Trader',
          email: res.data.email || '',
        });

        console.log('✓ Session restored successfully');
      } catch (error) {
        console.log('ℹ No active session found.');
        clearAccessToken();
        setIsAuthenticated(false);
        dispatch(clearUser());
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();

    const onLogoutEvent = () => handleLogout();
    window.addEventListener('auth:logout', onLogoutEvent);
    
    return () => {
      window.removeEventListener('auth:logout', onLogoutEvent);
    };
  }, [applySession, dispatch, handleLogout]);

  const login = async (credentials) => {
    try {
      const res = await apiClient.post(API_ROUTES.USERS.LOGIN, credentials);
      const user = {
        id: res.data.user_id,
        name: res.data.name || 'Trader',
        email: res.data.email || credentials.email,
      };

      applySession(res.data.access_token, user);
      return user;
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.post(API_ROUTES.USERS.REGISTER, userData);
      const user = {
        id: res.data.user_id,
        name: res.data.name || userData.name || 'Trader',
        email: res.data.email || userData.email,
      };

      applySession(res.data.access_token, user);
      return user;
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
