export const API_ROUTES = {
  USERS: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    PROFILE: '/users/profile',
    REFRESH: '/users/token/refresh',
    BY_ID: (userId) => `/users/${userId}`,
    LIST: (skip = 0, limit = 100) => `/users?skip=${skip}&limit=${limit}`,
  },
  MARKET: {
    PRICES: '/market/prices',
    SYMBOL_PRICE: (symbol) => `/market/price/${symbol}`,
  },
  ORDERS: {
    ROOT: '/orders',
    HISTORY: (userId, skip = 0, limit = 50) => `/orders/${userId}?skip=${skip}&limit=${limit}`,
    COUNT: (userId) => `/orders/${userId}/count`,
  },
  PORTFOLIO: {
    ROOT: (userId) => `/portfolio/${userId}`,
    POSITIONS: (userId) => `/portfolio/${userId}/positions`,
    BALANCE: (userId) => `/portfolio/${userId}/balance`,
  },
  HEALTH: {
    ROOT: '/health',
  },
}
