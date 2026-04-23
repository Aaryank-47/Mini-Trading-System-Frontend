import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/paths';

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
          <div className="w-12 h-12 border-4 border-(--color-surface-4) border-t-(--color-accent) rounded-full animate-spin" />
          <p className="text-(--color-text-muted) font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  // 2. If not authenticated after check, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 3. If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
