import apiClient from '../services/apiClient';
import { API_ROUTES } from './routes';

let marketPricesCircuitOpenUntil = 0;
const marketPriceFallback = {};

const generateFallbackPrice = (symbol) => {
  const existing = marketPriceFallback[symbol];
  if (typeof existing === 'number' && existing > 0) {
    const next = Math.max(1, existing * (1 + (Math.random() - 0.5) * 0.01));
    marketPriceFallback[symbol] = Number(next.toFixed(2));
    return marketPriceFallback[symbol];
  }

  const seed = symbol
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const base = 100 + (seed % 5000);
  marketPriceFallback[symbol] = Number(base.toFixed(2));
  return marketPriceFallback[symbol];
};

const getFallbackPrices = async () => {
  const symbolsRes = await apiClient.get(API_ROUTES.MARKET.SYMBOLS);
  const symbols = symbolsRes?.data?.symbols || [];
  const fallback = {};

  for (const item of symbols) {
    if (item?.symbol) {
      fallback[item.symbol] = generateFallbackPrice(item.symbol);
    }
  }

  return fallback;
};

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
    const now = Date.now();
    if (now < marketPricesCircuitOpenUntil) {
      return getFallbackPrices();
    }

    try {
      const res = await apiClient.get(API_ROUTES.MARKET.PRICES);
      return res.data;
    } catch (error) {
      marketPricesCircuitOpenUntil = Date.now() + 60_000;
      return getFallbackPrices();
    }
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
