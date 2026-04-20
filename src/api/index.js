const API_BASE = "https://mini-trading-system-backend.onrender.com";

const api = {
  // ── Users ──────────────────────────────────
  createUser: async (data) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to create user");
    }
    return res.json();
  },

  getUser: async (userId) => {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) throw new Error("User not found");
    return res.json();
  },

  getAllUsers: async (skip = 0, limit = 100) => {
    const res = await fetch(`${API_BASE}/users?skip=${skip}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  // ── Market ─────────────────────────────────
  getPrices: async () => {
    const res = await fetch(`${API_BASE}/market/prices`);
    if (!res.ok) throw new Error("Failed to fetch prices");
    return res.json();
  },

  getSymbolPrice: async (symbol) => {
    const res = await fetch(`${API_BASE}/market/price/${symbol}`);
    if (!res.ok) throw new Error(`Price not found for ${symbol}`);
    return res.json();
  },

  // ── Orders ─────────────────────────────────
  placeOrder: async (data) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Order failed");
    }
    return res.json();
  },

  getOrderHistory: async (userId, skip = 0, limit = 50) => {
    const res = await fetch(
      `${API_BASE}/orders/${userId}?skip=${skip}&limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },

  getOrderCount: async (userId) => {
    const res = await fetch(`${API_BASE}/orders/${userId}/count`);
    if (!res.ok) throw new Error("Failed to fetch order count");
    return res.json();
  },

  // ── Portfolio ──────────────────────────────
  getPortfolio: async (userId) => {
    const res = await fetch(`${API_BASE}/portfolio/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    return res.json();
  },

  getPositions: async (userId) => {
    const res = await fetch(`${API_BASE}/portfolio/${userId}/positions`);
    if (!res.ok) throw new Error("Failed to fetch positions");
    return res.json();
  },

  getBalance: async (userId) => {
    const res = await fetch(`${API_BASE}/portfolio/${userId}/balance`);
    if (!res.ok) throw new Error("Failed to fetch balance");
    return res.json();
  },

  // ── Health ─────────────────────────────────
  healthCheck: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
};

export default api;
