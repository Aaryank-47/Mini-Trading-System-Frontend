import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser, clearUser } from '../store/userSlice';
import apiClient, {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAccessToken,
} from '../services/apiClient';
import { API_ROUTES } from '../api/routes';

const AuthContext = createContext(null);
const SESSION_HINT_KEY = 'ts.hasSession';

const toAuthError = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;
  const message = typeof detail === 'string' && detail.trim() ? detail : fallbackMessage;
  return new Error(message);
};

export const AuthProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  const applySession = useCallback((token, user) => {
    setAccessToken(token);
    dispatch(setCurrentUser(user));
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_HINT_KEY, '1');
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
      localStorage.removeItem(SESSION_HINT_KEY);
    }
  }, [dispatch]);

  useEffect(() => {
    const initAuth = async () => {
      const hasSessionHint = localStorage.getItem(SESSION_HINT_KEY) === '1';

      // Avoid noisy refresh requests for first-time visitors.
      if (!hasSessionHint && !getRefreshToken()) {
        setIsInitializing(false);
        return;
      }

      try {
        const refreshToken = getRefreshToken();
        const res = await apiClient.post(
          API_ROUTES.USERS.REFRESH,
          refreshToken ? { refresh_token: refreshToken } : {}
        );

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
        localStorage.removeItem(SESSION_HINT_KEY);
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
      console.log('Login data : ',res.data);
      if (res.data.refresh_token) {
        setRefreshToken(res.data.refresh_token);
      }

      const user = {
        id: res.data.user_id,
        name: res.data.name || 'Trader',
        email: res.data.email || credentials.email,
      };

      applySession(res.data.access_token, user);
      return user;
    } catch (error) {
      setIsAuthenticated(false);
      throw toAuthError(error, 'Login failed. Please verify your email and password.');
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.post(API_ROUTES.USERS.REGISTER, userData);
      if (res.data.refresh_token) {
        setRefreshToken(res.data.refresh_token);
      }

      const user = {
        id: res.data.user_id,
        name: res.data.name || userData.name || 'Trader',
        email: res.data.email || userData.email,
      };

      applySession(res.data.access_token, user);
      return user;
    } catch (error) {
      setIsAuthenticated(false);
      throw toAuthError(error, 'Registration failed. Please check your details and try again.');
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
