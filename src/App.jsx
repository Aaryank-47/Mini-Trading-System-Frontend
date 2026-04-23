import React, { useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setPrices, updatePrice, setConnected } from './store/marketSlice'
import { useAuth } from './context/AuthContext'
import api from './api'
import wsManager from './api/websocket'
import AppRoutes from './routes/AppRoutes'

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
  const { isAuthenticated, isInitializing } = useAuth()
  const user = useSelector((s) => s.user.currentUser)

  // Fetch initial prices & start WebSocket
  useEffect(() => {
    // Only fetch if authenticated or we don't care about auth for public market data
    const fetchPrices = async () => {
      try {
        const prices = await api.getPrices()
        dispatch(setPrices(prices))
      } catch (e) {
        console.error('Failed to fetch prices:', e)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 5000)

    return () => clearInterval(interval)
  }, [dispatch])

  // WebSocket connection
  useEffect(() => {
    // Only connect if fully authenticated and user profile is loaded
    if (!isAuthenticated || !user) return

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
  }, [isAuthenticated, user, dispatch])

  // While checking session on refresh, don't render anything to avoid flashes
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0E11]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--color-surface-4)] border-t-[var(--color-accent)] rounded-full animate-spin" />
          <p className="text-[var(--color-text-muted)] font-medium">Restoring Session...</p>
        </div>
      </div>
    )
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutes isAuthenticated={isAuthenticated} />
    </Suspense>
  )
}
