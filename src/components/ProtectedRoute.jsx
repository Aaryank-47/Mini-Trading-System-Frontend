import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * ✅ FIXED: Respects isInitializing to prevent UI flicker on reload
 * ✅ FIXED: Redirects to /login if not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  // 1. If we are still checking the session, show nothing or a specific loader
  // This prevents the "flash" of the login page
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0E11]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--color-surface-4)] border-t-[var(--color-accent)] rounded-full animate-spin" />
          <p className="text-[var(--color-text-muted)] font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  // 2. If not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
