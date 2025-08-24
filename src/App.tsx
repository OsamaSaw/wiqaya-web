import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import DashboardLayout from './admin-panel/DashboardLayout';
import DashboardPage from './admin-panel/DashboardPage';
import UsersPage from './admin-panel/UsersPage';
import GuardsPage from './admin-panel/GuardsPage';
import BookingsPage from './admin-panel/BookingsPage';
import PaymentsPage from './admin-panel/PaymentsPage';
import AdminsPage from './admin-panel/AdminsPage';
import ConversationsPage from './admin-panel/ConversationsPage';

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
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="guards" element={<GuardsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="admins" element={<AdminsPage />} />
            <Route path="conversations" element={<ConversationsPage />} />
          </Route>

          {/* Catch‑all routes redirect back to the landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;