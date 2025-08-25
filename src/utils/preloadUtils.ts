/**
 * Preload utilities for better performance
 */

// Preload critical admin pages when user logs in
export const preloadAdminPages = () => {
  // Only preload on login to avoid affecting landing page performance
  import('../admin-panel/DashboardPage');
  import('../admin-panel/UsersPage');
};

// Preload heavy libraries only when needed
export const preloadChartLibraries = () => {
  import('recharts');
  import('@mui/x-charts');
};
