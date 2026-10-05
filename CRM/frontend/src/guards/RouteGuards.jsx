import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Block terminated/suspended users
  if (user && !['ACTIVE'].includes(user.status)) {
    return <Navigate to="/login?reason=account_inactive" replace />;
  }

  return children;
}

export function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.status === 'ACTIVE') {
    // Redirect authenticated users to their dashboard
    const dashboardRoutes = {
      ADMIN: '/admin/dashboard',
      PROJECT_MANAGER: '/manager/dashboard',
      EMPLOYEE: '/employee/dashboard',
      CLIENT: '/client/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  return children;
}
