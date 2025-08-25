import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  Fab,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api, { ApiUser, UsersResponse } from '../services/api';
import type { User } from '../types';
import UserDetailModal from './components/UserDetailModal';

/**
 * Modern UsersPage with enhanced UI, loading states, and improved user experience.
 * Features card-based layout, better search, loading states, and smooth animations.
 */
const UsersPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'guard' | 'admin'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [form, setForm] = useState<{ firstName: string; lastName: string; email: string; role: string }>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    role: 'client' 
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      
      const response: UsersResponse = await api.getUsers(params);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalUsers(response.total);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      showSnackbar('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenCreate = (): void => {
    setEditingUser(null);
    setForm({ firstName: '', lastName: '', email: '', role: 'client' });
    setOpen(true);
  };

  const handleOpenEdit = (user: ApiUser): void => {
    setEditingUser(user);
    setForm({ 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email,
      role: user.role
    });
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (): Promise<void> => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        // For now, role updates use the new API method
        await api.updateUserRole(editingUser.id, form.role as any);
        showSnackbar('User updated successfully', 'success');
      } else {
        // Create functionality would need to be implemented in backend
        showSnackbar('User creation not implemented yet', 'error');
        setOpen(false);
        setSaving(false);
        return;
      }
      setOpen(false);
      fetchUsers(); // Refresh the list
    } catch (err) {
      showSnackbar('Failed to save user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string, userName: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await api.deleteUser(userId);
        fetchUsers(); // Refresh the list
        showSnackbar('User deleted successfully', 'success');
      } catch (err) {
        showSnackbar('Failed to delete user', 'error');
      }
    }
  };

  const handleOpenUserDetail = (user: ApiUser): void => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleCloseUserDetail = (): void => {
    setDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserRoleUpdate = async (userId: string, role: 'client' | 'guard' | 'admin'): Promise<void> => {
    await api.updateUserRole(userId, role);
    fetchUsers(); // Refresh the list
    showSnackbar('User role updated successfully', 'success');
  };

  const handleUserStatusUpdate = async (userId: string, active: boolean): Promise<void> => {
    await api.updateUserStatus(userId, active);
    fetchUsers(); // Refresh the list
    showSnackbar('User status updated successfully', 'success');
  };

  // Users are already filtered by the API, no need to filter again locally
  const filteredUsers = users;

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
          {t('admin.users.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('admin.users.subtitle')}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main'
                }}
              >
                <PersonIcon />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: 'success.main'
                }}
              >
                <EmailIcon />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {users.filter(u => u.isVerified).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified Users
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.main'
                }}
              >
                <SearchIcon />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {users.filter(u => u.guardProfile).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Guards
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          {/* Search Bar */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <TextField
              placeholder="Search users by name or email..."
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
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{ minWidth: 140 }}
            >
              Add User
            </Button>
          </Stack>
          
          {/* Role Filter Buttons */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              Filter by Role:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant={roleFilter === 'all' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setRoleFilter('all');
                  setCurrentPage(1);
                }}
                sx={{ minWidth: 80 }}
              >
                All ({totalUsers})
              </Button>
              <Button
                variant={roleFilter === 'client' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setRoleFilter('client');
                  setCurrentPage(1);
                }}
                sx={{ minWidth: 80 }}
              >
                Clients
              </Button>
              <Button
                variant={roleFilter === 'guard' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setRoleFilter('guard');
                  setCurrentPage(1);
                }}
                sx={{ minWidth: 80 }}
              >
                Guards
              </Button>
              <Button
                variant={roleFilter === 'admin' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setRoleFilter('admin');
                  setCurrentPage(1);
                }}
                sx={{ minWidth: 80 }}
              >
                Admins
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Users Table */}
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={2}>
                      <PersonIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                      <Typography color="text.secondary">
                        {search ? 'No users found matching your search' : 'No users available'}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: ApiUser) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => handleOpenUserDetail(user)}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'primary.main',
                            fontWeight: 600
                          }}
                        >
                          {user.firstName.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {user.isVerified ? 'Verified' : 'Unverified'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={`#${user.id}`} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(user);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id, `${user.firstName} ${user.lastName}`);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1)
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        onClick={handleOpenCreate}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {editingUser ? 'Edit User' : 'Create New User'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Stack spacing={3}>
            <TextField
              label="First Name"
              placeholder="Enter user's first name"
              fullWidth
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              label="Last Name"
              placeholder="Enter user's last name"
              fullWidth
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            <TextField
              label="Email Address"
              placeholder="Enter user's email address"
              fullWidth
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : null}
            sx={{ minWidth: 100 }}
          >
            {saving ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Detail Modal */}
      <UserDetailModal
        open={detailModalOpen}
        onClose={handleCloseUserDetail}
        user={selectedUser}
        onUpdateRole={handleUserRoleUpdate}
        onUpdateStatus={handleUserStatusUpdate}
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

export default UsersPage;