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
  Avatar,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { ApiUser } from '../../services/api';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: ApiUser | null;
  onUpdateRole: (userId: string, role: 'client' | 'guard' | 'admin') => Promise<void>;
  onUpdateStatus: (userId: string, active: boolean) => Promise<void>;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  open,
  onClose,
  user,
  onUpdateRole,
  onUpdateStatus,
}) => {
  const [selectedRole, setSelectedRole] = useState<'client' | 'guard' | 'admin'>('client');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const handleRoleUpdate = async () => {
    if (selectedRole === user.role) return;

    try {
      setLoading(true);
      setError('');
      await onUpdateRole(user.id, selectedRole);
    } catch (err) {
      setError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      setLoading(true);
      setError('');
      const newStatus = user.status !== 'active';
      await onUpdateStatus(user.id, newStatus);
    } catch (err) {
      setError('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'guard': return 'warning';
      case 'client': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

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
            <Avatar
              sx={{
                width: 64,
                height: 64,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                bgcolor: 'primary.main',
              }}
            >
              {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User ID: #{user.id}
              </Typography>
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
          {/* Basic Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" />
                Basic Information
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BadgeIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Role</Typography>
                    <Chip 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SecurityIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip 
                      label={user.status === 'active' ? 'Active' : 'Suspended'} 
                      color={getStatusColor(user.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Verification</Typography>
                    <Chip 
                      label={user.isVerified ? 'Verified' : 'Unverified'} 
                      color={user.isVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Guard Profile (if applicable) */}
          {user.guardProfile && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  Guard Profile
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Guard Verification</Typography>
                      <Chip 
                        label={user.guardProfile.isVerified ? 'Verified Guard' : 'Pending Verification'} 
                        color={user.guardProfile.isVerified ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTimeIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Experience</Typography>
                      <Typography variant="body1">{user.guardProfile.experienceYears} years</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MoneyIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Hourly Rate</Typography>
                      <Typography variant="body1">${user.guardProfile.hourlyRate}/hour</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationIcon color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Service Locations</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                        {user.guardProfile.locations.map((location, index) => (
                          <Chip key={index} label={location} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Activity Information */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="primary" />
                Activity Information
              </Typography>
              
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">{formatDate(user.updatedAt)}</Typography>
                </Box>

                {user.lastLoginAt && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">Last Login</Typography>
                    <Typography variant="body1">{formatDate(user.lastLoginAt)}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                Admin Actions
              </Typography>
              
              <Stack spacing={3}>
                {/* Role Management */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Change User Role</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={selectedRole}
                        label="Role"
                        onChange={(e) => setSelectedRole(e.target.value as any)}
                        disabled={loading}
                      >
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="guard">Guard</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      onClick={handleRoleUpdate}
                      disabled={loading || selectedRole === user.role}
                      startIcon={loading ? <CircularProgress size={16} /> : null}
                    >
                      Update Role
                    </Button>
                  </Stack>
                </Box>

                {/* Status Management */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Account Status</Typography>
                  <Button
                    variant={user.status === 'active' ? 'outlined' : 'contained'}
                    color={user.status === 'active' ? 'error' : 'success'}
                    onClick={handleStatusToggle}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : (user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />)}
                  >
                    {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
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

export default UserDetailModal;
