import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';
import { ApiBooking } from '../../services/api';

interface BookingDetailModalProps {
  open: boolean;
  onClose: () => void;
  booking: ApiBooking | null;
  onUpdateStatus: (bookingId: string, status: string, notes?: string) => Promise<void>;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  open,
  onClose,
  booking,
  onUpdateStatus,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!booking) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      setError('');
      await onUpdateStatus(booking.id, newStatus, notes || undefined);
      onClose();
    } catch (err) {
      setError('Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPeriod = (periodString: string) => {
    try {
      const period = JSON.parse(periodString);
      if (Array.isArray(period) && period.length === 2) {
        const start = new Date(period[0]).toLocaleString();
        const end = new Date(period[1]).toLocaleString();
        return `${start} - ${end}`;
      }
      return periodString;
    } catch {
      return periodString;
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

  const canConfirm = booking.status === 'pending';
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const isReadOnly = ['completed', 'cancelled'].includes(booking.status);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon color="primary" fontSize="large" />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Booking #{booking.id}
                </Typography>
                <Chip 
                  label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')} 
                  color={getStatusColor(booking.status) as any}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Client Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Client Information
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">
                    {booking.user.first_name} {booking.user.last_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{booking.user.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Client ID</Typography>
                  <Typography variant="body1">#{booking.user.id}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Guard Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                Guard Information
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">
                    {booking.guardProfile.user.first_name} {booking.guardProfile.user.last_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{booking.guardProfile.user.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Guard ID</Typography>
                  <Typography variant="body1">#{booking.guardProfile.user.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Hourly Rate</Typography>
                  <Typography variant="body1">${booking.guardProfile.hourly_rate}/hour</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="primary" />
                Booking Details
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                    <Typography variant="body1">{booking.location}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTimeIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Service Period</Typography>
                    <Typography variant="body1">{formatPeriod(booking.period)}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MoneyIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pricing</Typography>
                    <Typography variant="body1">
                      ${booking.hourly_rate}/hour • Total: ${booking.total_amount}
                    </Typography>
                  </Box>
                </Box>

                {booking.special_instructions && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <NotesIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Special Instructions</Typography>
                      <Typography variant="body1">{booking.special_instructions}</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" />
                Timeline
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Created</Typography>
                  <Typography variant="body1">{formatDate(booking.created_at)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">{formatDate(booking.updated_at)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          {!isReadOnly && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  Admin Actions
                </Typography>
                
                <Stack spacing={3}>
                  {/* Notes for admin action */}
                  <TextField
                    label="Admin Notes (optional)"
                    placeholder="Add any notes about this status change..."
                    multiline
                    rows={3}
                    fullWidth
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    variant="outlined"
                  />

                  {/* Action buttons */}
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {canConfirm && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate('confirmed')}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                      >
                        Confirm Booking
                      </Button>
                    )}
                    
                    {canCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleStatusUpdate('cancelled')}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <CancelIcon />}
                      >
                        Cancel Booking
                      </Button>
                    )}

                    {booking.status === 'confirmed' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStatusUpdate('in_progress')}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <InfoIcon />}
                      >
                        Mark In Progress
                      </Button>
                    )}

                    {booking.status === 'in_progress' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate('completed')}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </Stack>

                  {/* Status explanation */}
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      {booking.status === 'pending' && 'This booking is awaiting confirmation. You can confirm or cancel it.'}
                      {booking.status === 'confirmed' && 'This booking is confirmed. You can cancel it or mark it as in progress.'}
                      {booking.status === 'in_progress' && 'This booking is currently active. You can mark it as completed.'}
                      {booking.status === 'completed' && 'This booking has been completed.'}
                      {booking.status === 'cancelled' && 'This booking has been cancelled.'}
                    </Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Read-only status info */}
          {isReadOnly && (
            <Alert severity="info">
              <Typography variant="body2">
                This booking is {booking.status} and cannot be modified.
              </Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDetailModal;
