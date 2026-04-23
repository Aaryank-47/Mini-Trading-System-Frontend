import React, { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'
import { ROUTES } from './paths'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Market = lazy(() => import('../pages/Market'))
const Portfolio = lazy(() => import('../pages/Portfolio'))
const Orders = lazy(() => import('../pages/Orders'))
const Trade = lazy(() => import('../pages/Trade'))
const Login = lazy(() => import('../pages/Login'))
const Settings = lazy(() => import('../pages/Settings'))
const Support = lazy(() => import('../pages/Support'))
const Notifications = lazy(() => import('../pages/Notifications'))

export default function AppRoutes({ isAuthenticated }) {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={!isAuthenticated ? <Login /> : <Navigate to={ROUTES.HOME} replace />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Dashboard />} />
          <Route path={ROUTES.MARKET} element={<Market />} />
          <Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.TRADE} element={<Trade />} />
          <Route path={ROUTES.TRADE_SYMBOL} element={<Trade />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.SUPPORT} element={<Support />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  )
}
