import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

// ⚠️ SECURITY: Development-only auth bypass (NEVER enable in production)
// Only enabled when VITE_AUTH_BYPASS=true in .env.local AND in dev mode
// This should ONLY be used for local development. Never commit with this enabled externally.
const DEV_BYPASS_AUTH = import.meta.env.VITE_AUTH_BYPASS === 'true' && import.meta.env.DEV;

if (DEV_BYPASS_AUTH) {
  console.warn(
    '⚠️  SECURITY WARNING: Authentication is BYPASSED. This is only safe in local development.'
  );
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // ⚠️ Only bypass in local dev with explicit env var AND dev mode enabled
  if (DEV_BYPASS_AUTH) {
    return children;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#ffa424' }} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You do not have permission to access this page. Required role: {requiredRole}
        </Typography>
      </Box>
    );
  }

  // Check if user has one of the allowed roles
  if (allowedRoles && allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 2,
          px: 3,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;
