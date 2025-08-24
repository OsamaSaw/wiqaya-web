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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api, { ApiUser, UsersResponse } from '../services/api';
import type { Guard } from '../types';

/**
 * GuardsPage manages the list of guards (users with role='guard') available in the system.
 * Displays guard information and allows admins to manage guard accounts.
 */
const GuardsPage: React.FC = () => {
  const [guards, setGuards] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<ApiUser | null>(null);
  const [form, setForm] = useState<{ name: string; phone: string }>({ name: '', phone: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuards = async () => {
      try {
        setLoading(true);
        const response: UsersResponse = await api.getGuards();
        setGuards(response.users);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch guards:', err);
        setError('Failed to load guards');
      } finally {
        setLoading(false);
      }
    };
    fetchGuards();
  }, []);

  const handleOpenCreate = (): void => {
    setEditing(null);
    setForm({ name: '', phone: '' });
    setOpen(true);
  };

  const handleOpenEdit = (guard: ApiUser): void => {
    setEditing(guard);
    setForm({ name: `${guard.firstName} ${guard.lastName}`, phone: guard.guardProfile?.locations.join(', ') || 'N/A' });
    setOpen(true);
  };

  const handleClose = (): void => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (): Promise<void> => {
    if (editing) {
      // Guard updates would use the user role update API
      alert('Guard update functionality not implemented yet');
    } else {
      // Guard creation would need backend implementation
      alert('Guard creation functionality not implemented yet');
    }
    setOpen(false);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await api.deleteUser(id);
      setGuards((prev: ApiUser[]) => prev.filter((g: ApiUser) => g.id !== id));
    } catch (err) {
      alert('Failed to delete guard');
    }
  };

  const filtered = guards.filter(
    (g) =>
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Guards
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleOpenCreate}>
          Add Guard
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((g: ApiUser) => (
              <TableRow key={g.id}>
                <TableCell>{g.id.slice(0, 8)}...</TableCell>
                <TableCell>{g.firstName} {g.lastName}</TableCell>
                <TableCell>{g.email}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenEdit(g)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(g.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Guard' : 'Add Guard'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Phone"
            name="phone"
            fullWidth
            value={form.phone}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GuardsPage;