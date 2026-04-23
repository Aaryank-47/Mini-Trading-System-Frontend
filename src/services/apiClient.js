import axios from 'axios';
import { API_ROUTES } from '../api/routes';

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_BASE = isLocal 
  ? "http://localhost:8000" 
  : "https://mini-trading-system-backend.onrender.com";

let inMemoryAccessToken = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => {
  return inMemoryAccessToken;
};

export const clearAccessToken = () => {
  inMemoryAccessToken = null;
};

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
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
        // Note: We don't send the refresh_token in the body.
        // It relies on the HttpOnly cookie being automatically sent via withCredentials: true.
        const res = await axios.post(`${API_BASE}${API_ROUTES.USERS.REFRESH}`, {}, {
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
