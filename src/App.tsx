import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import theme from './theme';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import DashboardLayout from './admin-panel/DashboardLayout';

// Lazy load admin pages for code splitting
const DashboardPage = React.lazy(() => import('./admin-panel/DashboardPage'));
const UsersPage = React.lazy(() => import('./admin-panel/UsersPage'));
const GuardsPage = React.lazy(() => import('./admin-panel/GuardsPage'));
const BookingsPage = React.lazy(() => import('./admin-panel/BookingsPage'));
const PaymentsPage = React.lazy(() => import('./admin-panel/PaymentsPage'));
const AdminsPage = React.lazy(() => import('./admin-panel/AdminsPage'));
const ConversationsPage = React.lazy(() => import('./admin-panel/ConversationsPage'));

// Loading component for code split pages
const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
    <CircularProgress size={60} />
  </Box>
);

/**
 * App is the root component responsible for declaring the routes of the
 * application.  The landing page is publicly accessible at `/`, while
 * administrative pages live under `/admin`.  The dashboard layout wraps
 * individual admin pages and provides shared navigation.  Unknown routes
 * redirect back to the landing page.
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin login page */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin dashboard with nested routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard route */}
            <Route index element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            } />
            <Route path="users" element={
              <Suspense fallback={<PageLoader />}>
                <UsersPage />
              </Suspense>
            } />
            <Route path="guards" element={
              <Suspense fallback={<PageLoader />}>
                <GuardsPage />
              </Suspense>
            } />
            <Route path="bookings" element={
              <Suspense fallback={<PageLoader />}>
                <BookingsPage />
              </Suspense>
            } />
            <Route path="payments" element={
              <Suspense fallback={<PageLoader />}>
                <PaymentsPage />
              </Suspense>
            } />
            <Route path="admins" element={
              <Suspense fallback={<PageLoader />}>
                <AdminsPage />
              </Suspense>
            } />
            <Route path="conversations" element={
              <Suspense fallback={<PageLoader />}>
                <ConversationsPage />
              </Suspense>
            } />
          </Route>

          {/* Catch‑all routes redirect back to the landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;