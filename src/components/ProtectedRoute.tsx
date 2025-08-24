import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verifying admin access...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Redirect to login if user data is not loaded or user is not admin
  if (!userData || userData.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // User is authenticated and has admin role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
