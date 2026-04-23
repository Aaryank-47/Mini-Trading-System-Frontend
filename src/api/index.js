import apiClient from '../services/apiClient';
import { API_ROUTES } from './routes';

const api = {
  // ── Auth & Users ─────────────────────────────
  createUser: async (data) => {
    const res = await apiClient.post(API_ROUTES.USERS.REGISTER, data);
    return res.data;
  },

  login: async (data) => {
    const res = await apiClient.post(API_ROUTES.USERS.LOGIN, data);
    // console.log("response from login : ", res);
    console.log("data from login : ", res.data);
    return res.data;
  },

  getUser: async (userId) => {
    const res = await apiClient.get(API_ROUTES.USERS.BY_ID(userId));
    return res.data;
  },

  getAllUsers: async (skip = 0, limit = 100) => {
    const res = await apiClient.get(API_ROUTES.USERS.LIST(skip, limit));
    return res.data;
  },

  // ── Market ─────────────────────────────────
  getPrices: async () => {
    const res = await apiClient.get(API_ROUTES.MARKET.PRICES);
    return res.data;
  },

  getSymbols: async () => {
    const res = await apiClient.get(API_ROUTES.MARKET.SYMBOLS);
    return res.data;
  },

  getSymbolPrice: async (symbol) => {
    const res = await apiClient.get(API_ROUTES.MARKET.SYMBOL_PRICE(symbol));
    return res.data;
  },

  // ── Orders ─────────────────────────────────
  placeOrder: async (data) => {
    const res = await apiClient.post(API_ROUTES.ORDERS.ROOT, data);
    return res.data;
  },

  getOrderHistory: async (userId, skip = 0, limit = 50) => {
    const res = await apiClient.get(API_ROUTES.ORDERS.HISTORY(userId, skip, limit));
    return res.data;
  },

  getOrderCount: async (userId) => {
    const res = await apiClient.get(API_ROUTES.ORDERS.COUNT(userId));
    return res.data;
  },

  // ── Portfolio ──────────────────────────────
  getPortfolio: async (userId) => {
    const res = await apiClient.get(API_ROUTES.PORTFOLIO.ROOT(userId));
    return res.data;
  },

  getPositions: async (userId) => {
    const res = await apiClient.get(API_ROUTES.PORTFOLIO.POSITIONS(userId));
    return res.data;
  },

  getBalance: async (userId) => {
    const res = await apiClient.get(API_ROUTES.PORTFOLIO.BALANCE(userId));
    return res.data;
  },

  // ── Health ─────────────────────────────────
  healthCheck: async () => {
    const res = await apiClient.get(API_ROUTES.HEALTH.ROOT);
    return res.data;
  },
};

export default api;
