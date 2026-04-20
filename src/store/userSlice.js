import { createSlice } from '@reduxjs/toolkit'

const savedUser = localStorage.getItem('tradeSysUser')

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: savedUser ? JSON.parse(savedUser) : null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
      localStorage.setItem('tradeSysUser', JSON.stringify(action.payload))
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
      localStorage.removeItem('tradeSysUser')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setCurrentUser, setUsers, clearUser, setLoading, setError } = userSlice.actions
export default userSlice.reducer
