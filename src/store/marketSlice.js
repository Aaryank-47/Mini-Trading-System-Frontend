import { createSlice } from '@reduxjs/toolkit'

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    prices: {},
    previousPrices: {},
    priceHistory: {},
    loading: false,
    connected: false,
  },
  reducers: {
    setPrices: (state, action) => {
      state.previousPrices = { ...state.prices }
      state.prices = action.payload
    },
    updatePrice: (state, action) => {
      const { symbol, price } = action.payload
      if (state.prices[symbol] !== undefined) {
        state.previousPrices[symbol] = state.prices[symbol]
      }
      state.prices[symbol] = price

      // Track price history for mini charts (keep last 30 points)
      if (!state.priceHistory[symbol]) {
        state.priceHistory[symbol] = []
      }
      state.priceHistory[symbol].push(price)
      if (state.priceHistory[symbol].length > 30) {
        state.priceHistory[symbol] = state.priceHistory[symbol].slice(-30)
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setConnected: (state, action) => {
      state.connected = action.payload
    },
  },
})

export const { setPrices, updatePrice, setLoading, setConnected } = marketSlice.actions
export default marketSlice.reducer
