import React, { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setPrices, updatePrice, setConnected } from './store/marketSlice'
import { setCurrentUser } from './store/userSlice'
import api from './api'
import wsManager from './api/websocket'
import Layout from './components/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Market = lazy(() => import('./pages/Market'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Orders = lazy(() => import('./pages/Orders'))
const Trade = lazy(() => import('./pages/Trade'))
const Login = lazy(() => import('./pages/Login'))
const Settings = lazy(() => import('./pages/Settings'))
const Support = lazy(() => import('./pages/Support'))
const Notifications = lazy(() => import('./pages/Notifications'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[var(--color-surface-4)] border-t-[var(--color-accent)] rounded-full animate-spin" />
        <p className="text-[var(--color-text-muted)] text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.user.currentUser)

  // Fetch initial prices & start WebSocket
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const prices = await api.getPrices()
        dispatch(setPrices(prices))
      } catch (e) {
        console.error('Failed to fetch prices:', e)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 5000) // poll every 5s as fallback

    return () => clearInterval(interval)
  }, [dispatch])

  // WebSocket connection
  useEffect(() => {
    if (!user) return

    wsManager.connect(user.id)

    const unsubPrice = wsManager.on('price_update', (data) => {
      dispatch(updatePrice({ symbol: data.symbol, price: data.price }))
    })

    const unsubConn = wsManager.on('connection', (data) => {
      dispatch(setConnected(data.status === 'connected'))
    })

    return () => {
      unsubPrice()
      unsubConn()
      wsManager.disconnect()
    }
  }, [user, dispatch])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/market" element={<Market />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/trade/:symbol" element={<Trade />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}
