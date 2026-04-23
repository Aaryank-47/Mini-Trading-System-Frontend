import { createSlice } from '@reduxjs/toolkit'

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    prices: {},
    symbolNames: {},
    symbolCatalog: [],
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
    setSymbols: (state, action) => {
      const catalog = Array.isArray(action.payload) ? action.payload : []
      state.symbolCatalog = catalog
      state.symbolNames = catalog.reduce((acc, item) => {
        if (item?.symbol) {
          acc[item.symbol] = item.name || item.symbol
        }
        return acc
      }, {})
    },
    updatePrice: (state, action) => {
      const { symbol, price, name } = action.payload
      if (state.prices[symbol] !== undefined) {
        state.previousPrices[symbol] = state.prices[symbol]
      }
      state.prices[symbol] = price
      if (name) {
        state.symbolNames[symbol] = name
      }

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

export const { setPrices, setSymbols, updatePrice, setLoading, setConnected } = marketSlice.actions
export default marketSlice.reducer
