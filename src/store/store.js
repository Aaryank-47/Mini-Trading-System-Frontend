import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import marketReducer from './marketSlice'
import portfolioReducer from './portfolioSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    market: marketReducer,
    portfolio: portfolioReducer,
  },
})
