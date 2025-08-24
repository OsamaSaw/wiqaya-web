import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  InputAdornment,
  Button,
  Stack,
  IconButton,
  Snackbar,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  PlayArrow as StartIcon,
} from '@mui/icons-material';
import api, { ApiBooking, BookingsResponse } from '../services/api';
import BookingDetailModal from './components/BookingDetailModal';

/**
 * BookingsPage manages all bookings in the admin dashboard.
 * Displays bookings in a tabular format with filtering and status updates.
 */
const BookingsPage: React.FC = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 50,
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response: BookingsResponse = await api.getBookings(params);
      setBookings(response.bookings);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenBookingDetail = (booking: ApiBooking): void => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const handleCloseBookingDetail = (): void => {
    setDetailModalOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: string, notes?: string): Promise<void> => {
    try {
      await api.updateBookingStatus(bookingId, status, notes);
      fetchBookings(); // Refresh the list
      showSnackbar('Booking status updated successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to update booking status', 'error');
      throw err;
    }
  };

  const handleQuickStatusUpdate = async (booking: ApiBooking, newStatus: string, event: React.MouseEvent): Promise<void> => {
    event.stopPropagation();
    try {
      await api.updateBookingStatus(booking.id, newStatus);
      fetchBookings();
      showSnackbar(`Booking ${newStatus} successfully`, 'success');
    } catch (err) {
      showSnackbar(`Failed to ${newStatus} booking`, 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Bookings are already filtered by the API
  const filteredBookings = bookings;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bookings Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all booking requests and their status
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          {/* Search Bar */}
          <TextField
            placeholder="Search bookings by client, guard, or location..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{ width: '100%', maxWidth: 400 }}
          />
          
          {/* Status Filter Buttons */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Status:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant={statusFilter === 'all' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setStatusFilter('all')}
                sx={{ minWidth: 80 }}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setStatusFilter('pending')}
                sx={{ minWidth: 80 }}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'confirmed' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setStatusFilter('confirmed')}
                sx={{ minWidth: 80 }}
              >
                Confirmed
              </Button>
              <Button
                variant={statusFilter === 'in_progress' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setStatusFilter('in_progress')}
                sx={{ minWidth: 80 }}
              >
                In Progress
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setStatusFilter('completed')}
                sx={{ minWidth: 80 }}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'cancelled' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setStatusFilter('cancelled')}
                sx={{ minWidth: 80 }}
              >
                Cancelled
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Bookings Table */}
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Guard</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {search ? 'No bookings found matching your search' : 'No bookings available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking, index) => (
                  <TableRow 
                    key={booking.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleOpenBookingDetail(booking)}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        #{booking.id.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {`${booking.user.first_name} ${booking.user.last_name}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {`${booking.guardProfile.user.first_name} ${booking.guardProfile.user.last_name}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${booking.hourly_rate}/hr
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')} 
                        color={getStatusColor(booking.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ${booking.total_amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(booking.created_at).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {/* View Details */}
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBookingDetail(booking);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        
                        {/* Quick Actions based on status */}
                        {booking.status === 'pending' && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={(e) => handleQuickStatusUpdate(booking, 'confirmed', e)}
                              title="Confirm booking"
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.success.main, 0.1)
                                }
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => handleQuickStatusUpdate(booking, 'cancelled', e)}
                              title="Cancel booking"
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                                }
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => handleQuickStatusUpdate(booking, 'in_progress', e)}
                              title="Start booking"
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                }
                              }}
                            >
                              <StartIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => handleQuickStatusUpdate(booking, 'cancelled', e)}
                              title="Cancel booking"
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.1)
                                }
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                        
                        {booking.status === 'in_progress' && (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={(e) => handleQuickStatusUpdate(booking, 'completed', e)}
                            title="Complete booking"
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.success.main, 0.1)
                              }
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Booking Detail Modal */}
      <BookingDetailModal
        open={detailModalOpen}
        onClose={handleCloseBookingDetail}
        booking={selectedBooking}
        onUpdateStatus={handleBookingStatusUpdate}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookingsPage;
