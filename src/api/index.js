import apiClient from '../services/apiClient';

const api = {
  // ── Auth & Users ─────────────────────────────
  createUser: async (data) => {
    const res = await apiClient.post(`/users/register`, data);
    return res.data;
  },

  login: async (data) => {
    const res = await apiClient.post(`/users/login`, data);
    // console.log("response from login : ", res);
    console.log("data from login : ", res.data);
    return res.data;
  },

  getUser: async (userId) => {
    const res = await apiClient.get(`/users/${userId}`);
    return res.data;
  },

  getAllUsers: async (skip = 0, limit = 100) => {
    const res = await apiClient.get(`/users?skip=${skip}&limit=${limit}`);
    return res.data;
  },

  // ── Market ─────────────────────────────────
  getPrices: async () => {
    const res = await apiClient.get(`/market/prices`);
    return res.data;
  },

  getSymbolPrice: async (symbol) => {
    const res = await apiClient.get(`/market/price/${symbol}`);
    return res.data;
  },

  // ── Orders ─────────────────────────────────
  placeOrder: async (data) => {
    const res = await apiClient.post(`/orders`, data);
    return res.data;
  },

  getOrderHistory: async (userId, skip = 0, limit = 50) => {
    const res = await apiClient.get(`/orders/${userId}?skip=${skip}&limit=${limit}`);
    return res.data;
  },

  getOrderCount: async (userId) => {
    const res = await apiClient.get(`/orders/${userId}/count`);
    return res.data;
  },

  // ── Portfolio ──────────────────────────────
  getPortfolio: async (userId) => {
    const res = await apiClient.get(`/portfolio/${userId}`);
    return res.data;
  },

  getPositions: async (userId) => {
    const res = await apiClient.get(`/portfolio/${userId}/positions`);
    return res.data;
  },

  getBalance: async (userId) => {
    const res = await apiClient.get(`/portfolio/${userId}/balance`);
    return res.data;
  },

  // ── Health ─────────────────────────────────
  healthCheck: async () => {
    const res = await apiClient.get(`/health`);
    return res.data;
  },
};

export default api;
