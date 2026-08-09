import { createSlice } from '@reduxjs/toolkit'

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    portfolio: null,
    orders: [],
    balance: null,
    portfolioLoaded: false,
    ordersLoaded: false,
    loading: false,
    error: null,
  },
  reducers: {
    setPortfolio: (state, action) => {
      state.portfolio = action.payload
      state.portfolioLoaded = true
      if (action.payload && typeof action.payload === 'object' && 'wallet_balance' in action.payload) {
        state.balance = action.payload.wallet_balance
      }
    },
    setOrders: (state, action) => {
      state.orders = action.payload
      state.ordersLoaded = true
    },
    addOrder: (state, action) => {
      state.orders = [action.payload, ...state.orders]
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setPortfolioLoaded: (state, action) => {
      state.portfolioLoaded = action.payload
    },
    setOrdersLoaded: (state, action) => {
      state.ordersLoaded = action.payload
    },
  },
})

export const { setPortfolio, setOrders, addOrder, setBalance, setLoading, setError, setPortfolioLoaded, setOrdersLoaded } = portfolioSlice.actions
export default portfolioSlice.reducer
