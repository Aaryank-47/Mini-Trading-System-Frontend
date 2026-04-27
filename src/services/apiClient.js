import axios from 'axios';
import { API_ROUTES } from '../api/routes';

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const PROD_API_BASE = "https://mini-trading-system-backend.onrender.com";
const API_BASE = import.meta.env.VITE_API_BASE_URL || (isLocal ? "/api" : PROD_API_BASE);

console.log(`API Base URL set to: ${API_BASE}`);
let inMemoryAccessToken = null;
let inMemoryRefreshToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return inMemoryAccessToken;
};

export const setRefreshToken = (token) => {
  inMemoryRefreshToken = token || null;
};

export const getRefreshToken = () => {
  return inMemoryRefreshToken;
};

export const clearAccessToken = () => {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
};

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach access token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a 401 error, not a retry, and not the login/refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(API_ROUTES.USERS.REFRESH) &&
      !originalRequest.url.includes(API_ROUTES.USERS.LOGIN)
    ) {
      originalRequest._retry = true;

      try {
        // Attempt silent refresh
        // Prefer HttpOnly cookie; fallback to in-memory refresh token if needed.
        const refreshToken = getRefreshToken();
        const refreshBody = refreshToken ? { refresh_token: refreshToken } : {};

        const res = await axios.post(`${API_BASE}${API_ROUTES.USERS.REFRESH}`, refreshBody, {
          withCredentials: true
        });

        const newAccessToken = res.data.access_token;
        setAccessToken(newAccessToken);

        // Update the failed request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Silent refresh failed (e.g., refresh token expired/missing)
        clearAccessToken();
        
        // Dispatch a custom event to tell the AuthContext to log out
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
