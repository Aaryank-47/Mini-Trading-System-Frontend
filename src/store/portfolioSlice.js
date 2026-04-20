import { createSlice } from '@reduxjs/toolkit'

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    portfolio: null,
    orders: [],
    balance: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPortfolio: (state, action) => {
      state.portfolio = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
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
  },
})

export const { setPortfolio, setOrders, addOrder, setBalance, setLoading, setError } = portfolioSlice.actions
export default portfolioSlice.reducer
