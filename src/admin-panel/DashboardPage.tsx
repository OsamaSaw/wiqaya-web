import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Divider,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import AnimatedCounter from '../components/AnimatedCounter';
import api, { DashboardStats } from '../services/api';

/**
 * Comprehensive Dashboard page showing key metrics, charts, and analytics
 * for the Wiqayah security services platform admin panel.
 */
const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  // State management
  const [dashboardData, setDashboardData] = useState<(DashboardStats & {
    userGrowth: number;
    guardGrowth: number;
    bookingGrowth: number;
    revenueGrowth: number;
    averageRating: number;
    responseTime: number;
  }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats from API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await api.getDashboardStats();
        
        // Transform API data to match component structure
        setDashboardData({
          // All properties from DashboardStats
          totalUsers: stats.totalUsers,
          totalGuards: stats.totalGuards,
          totalClients: stats.totalClients,
          totalBookings: stats.totalBookings,
          completedBookings: stats.completedBookings,
          pendingBookings: stats.pendingBookings,
          cancelledBookings: stats.cancelledBookings,
          totalRevenue: stats.totalRevenue,
          monthlyRevenue: stats.monthlyRevenue,
          newUsersThisMonth: stats.newUsersThisMonth,
          activeGuards: stats.activeGuards,
          activeBookings: stats.activeBookings,
          completedToday: stats.completedToday,
          pendingApprovalGuards: stats.pendingApprovalGuards,
          // Additional calculated properties
          userGrowth: 12.5,
          guardGrowth: 8.3,
          bookingGrowth: 15.7,
          revenueGrowth: 18.2,
          averageRating: 4.8,
          responseTime: 95,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 85000, bookings: 2800 },
    { month: 'Feb', revenue: 92000, bookings: 3100 },
    { month: 'Mar', revenue: 98000, bookings: 3350 },
    { month: 'Apr', revenue: 108000, bookings: 3600 },
    { month: 'May', revenue: 115000, bookings: 3900 },
    { month: 'Jun', revenue: 125000, bookings: 4200 },
  ];

  const serviceTypeData = [
    { name: 'Personal Protection', value: 45, color: theme.palette.primary.main },
    { name: 'Event Security', value: 30, color: theme.palette.secondary.main },
    { name: 'Corporate Security', value: 25, color: theme.palette.success.main },
  ];

  const guardsPerformanceData = [
    { day: 'Mon', completed: 95, cancelled: 5 },
    { day: 'Tue', completed: 88, cancelled: 12 },
    { day: 'Wed', completed: 92, cancelled: 8 },
    { day: 'Thu', completed: 96, cancelled: 4 },
    { day: 'Fri', completed: 89, cancelled: 11 },
    { day: 'Sat', completed: 94, cancelled: 6 },
    { day: 'Sun', completed: 91, cancelled: 9 },
  ];

  const recentActivities = [
    { id: 1, type: 'booking', user: 'Ahmed Al-Rashid', guard: 'Omar Hassan', time: '2 minutes ago', status: 'confirmed' },
    { id: 2, type: 'payment', user: 'Sarah Al-Fahd', amount: '850 SAR', time: '5 minutes ago', status: 'completed' },
    { id: 3, type: 'guard_joined', guard: 'Mohammed Ali', time: '12 minutes ago', status: 'verified' },
    { id: 4, type: 'review', user: 'Khalid Ibrahim', rating: 5, time: '18 minutes ago', status: 'positive' },
    { id: 5, type: 'booking', user: 'Fatima Al-Zahra', guard: 'Ali Mahmoud', time: '23 minutes ago', status: 'in_progress' },
  ];

  const topGuards = [
    { id: 1, name: 'Omar Hassan', rating: 4.9, completedJobs: 128, revenue: '45,600 SAR', avatar: 'O' },
    { id: 2, name: 'Ali Mahmoud', rating: 4.8, completedJobs: 115, revenue: '42,300 SAR', avatar: 'A' },
    { id: 3, name: 'Mohammed Khalil', rating: 4.7, completedJobs: 102, revenue: '38,900 SAR', avatar: 'M' },
    { id: 4, name: 'Hassan Ahmed', rating: 4.9, completedJobs: 98, revenue: '36,200 SAR', avatar: 'H' },
  ];

  // Don't render metrics if data is not loaded
  const metrics = dashboardData ? [
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      growth: dashboardData.userGrowth,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Guards',
      value: dashboardData.activeGuards,
      growth: dashboardData.guardGrowth,
      icon: <SecurityIcon />,
      color: theme.palette.success.main,
    },
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings,
      growth: dashboardData.bookingGrowth,
      icon: <AssignmentIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Monthly Revenue',
      value: `${dashboardData.monthlyRevenue.toLocaleString()} SAR`,
      growth: dashboardData.revenueGrowth,
      icon: <PaymentIcon />,
      color: theme.palette.secondary.main,
    },
  ] : [];

  const quickStats = dashboardData ? [
    {
      title: 'Average Rating',
      value: dashboardData.averageRating,
      subtitle: 'Customer Satisfaction',
      icon: <StarIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Response Time',
      value: `${dashboardData.responseTime}%`,
      subtitle: 'Within 5 minutes',
      icon: <AccessTimeIcon />,
      color: theme.palette.info.main,
    },
    {
      title: 'Active Bookings',
      value: dashboardData.pendingBookings?.toString() || '0',
      subtitle: 'Currently pending',
      icon: <ScheduleIcon />,
      color: theme.palette.success.main,
    },
    {
      title: 'Completed Today',
      value: dashboardData.completedToday?.toString() || '0',
      subtitle: 'Successfully finished',
      icon: <CheckCircleIcon />,
      color: theme.palette.info.main,
    },
  ] : [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <AssignmentIcon />;
      case 'payment':
        return <PaymentIcon />;
      case 'guard_joined':
        return <SecurityIcon />;
      case 'review':
        return <StarIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'verified':
      case 'positive':
        return theme.palette.success.main;
      case 'in_progress':
        return theme.palette.warning.main;
      case 'pending':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Loading your dashboard data...
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={40} width="80%" sx={{ my: 1 }} />
                  <Skeleton variant="text" height={20} width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your security platform.
        </Typography>
      </Box>

      {/* Main Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {metric.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                      {metric.growth > 0 ? (
                        <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: metric.growth > 0 ? 'success.main' : 'error.main',
                          fontWeight: 600
                        }}
                      >
                        {metric.growth > 0 ? '+' : ''}{metric.growth}%
                      </Typography>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: alpha(metric.color, 0.1),
                      color: metric.color,
                    }}
                  >
                    {React.cloneElement(metric.icon, { sx: { fontSize: 24 } })}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Revenue & Bookings Trend
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Stack>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={theme.palette.primary.main}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                      name="Revenue (SAR)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bookings" 
                      stroke={theme.palette.secondary.main}
                      strokeWidth={2}
                      name="Bookings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Types Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Service Distribution
              </Typography>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {serviceTypeData.map((item, index) => (
                  <Stack key={index} direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color,
                        }}
                      />
                      <Typography variant="body2">{item.name}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.value}%
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '50%',
                      backgroundColor: alpha(stat.color, 0.1),
                      color: stat.color,
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activities
                </Typography>
                <Chip label="Live" color="success" size="small" />
              </Stack>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: alpha(getActivityColor(activity.status), 0.1),
                            color: getActivityColor(activity.status),
                            width: 32,
                            height: 32,
                          }}
                        >
                          {React.cloneElement(getActivityIcon(activity.type), { sx: { fontSize: 16 } })}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {activity.type === 'booking' && `New booking: ${activity.user} → ${activity.guard}`}
                            {activity.type === 'payment' && `Payment received from ${activity.user}`}
                            {activity.type === 'guard_joined' && `${activity.guard} joined as guard`}
                            {activity.type === 'review' && `${activity.user} left ${activity.rating}★ review`}
                          </Typography>
                        }
                        secondary={activity.time}
                      />
                      <Chip
                        label={activity.status}
                        size="small"
                        sx={{
                          backgroundColor: alpha(getActivityColor(activity.status), 0.1),
                          color: getActivityColor(activity.status),
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Guards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Top Performing Guards
              </Typography>
              <Stack spacing={2}>
                {topGuards.map((guard, index) => (
                  <Paper
                    key={guard.id}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          #{index + 1}
                        </Typography>
                        <Avatar
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            width: 32,
                            height: 32,
                            fontSize: '14px',
                          }}
                        >
                          {guard.avatar}
                        </Avatar>
                      </Stack>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {guard.name}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                            <Typography variant="body2">{guard.rating}</Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {guard.completedJobs} jobs
                          </Typography>
                        </Stack>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {guard.revenue}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
