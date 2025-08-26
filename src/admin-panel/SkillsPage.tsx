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
  Add as AddIcon,
  Search as SearchIcon,
  Psychology as SkillIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import type { Skill } from '../types';

/**
 * Modern SkillsPage with enhanced UI, loading states, and improved user experience.
 * Features card-based layout, better search, loading states, and smooth animations.
 */
const SkillsPage: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string }>({ name: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    // Filter skills based on search term
    const filtered = skills.filter(skill =>
      skill.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSkills(filtered);
  }, [skills, search]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.getSkills();
      setSkills(response);
      setError(null);
    } catch (err) {
      setError('Failed to load skills');
      showSnackbar('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenCreate = (): void => {
    setForm({ name: '' });
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
    if (!form.name.trim()) {
      showSnackbar('Please enter a skill name', 'error');
      return;
    }

    // Check if skill already exists
    if (skills.some(skill => skill.name.toLowerCase() === form.name.trim().toLowerCase())) {
      showSnackbar('Skill already exists', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.createSkill({ name: form.name.trim() });
      showSnackbar('Skill created successfully', 'success');
      setOpen(false);
      fetchSkills(); // Refresh the list
    } catch (err) {
      showSnackbar('Failed to create skill', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <SkillIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Skills Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage available skills for guard profiles
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 2,
            '&:hover': { boxShadow: 4 }
          }}
        >
          Add New Skill
        </Button>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search skills..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent',
                }
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Skills Statistics */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              {filteredSkills.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search ? 'Found Skills' : 'Total Skills'}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Skills Table */}
      <Card sx={{ boxShadow: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box p={4}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={fetchSkills} startIcon={<AddIcon />}>
              Retry
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Skill Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Guards Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSkills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        {search ? 'No skills found matching your search' : 'No skills available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSkills.map((skill) => (
                    <TableRow 
                      key={skill.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.primary.main, 0.02) 
                        },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.875rem' }}>#{skill.id}</TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {skill.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem' }}>
                        {skill.guardProfiles?.length || 0}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Create Skill Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Skill
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a new skill that guards can add to their profiles
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            autoFocus
            name="name"
            label="Skill Name"
            type="text"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Security Guard, Armed Security, Event Security"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.name.trim()}
            startIcon={saving ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            {saving ? 'Creating...' : 'Create Skill'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add skill"
        onClick={handleOpenCreate}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default SkillsPage;
