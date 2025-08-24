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
import api from '../services/api';
import type { Admin } from '../types';

/**
 * AdminsPage manages administrators of the system.  Each record includes
 * name, email and role.  The same CRUD pattern used elsewhere is applied.
 */
const AdminsPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; role: string }>({ name: '', email: '', role: '' });

  useEffect(() => {
    const fetchAdmins = async () => {
      const data = await api.getAdmins();
      setAdmins(data);
    };
    fetchAdmins();
  }, []);

  const handleOpenCreate = (): void => {
    setEditing(null);
    setForm({ name: '', email: '', role: '' });
    setOpen(true);
  };
  const handleOpenEdit = (admin: Admin): void => {
    setEditing(admin);
    setForm({ name: admin.name, email: admin.email, role: admin.role });
    setOpen(true);
  };
  const handleClose = (): void => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async (): Promise<void> => {
    if (editing) {
      const updated = await api.updateAdmin(editing.id, form);
      setAdmins((prev: Admin[]) => prev.map((a: Admin) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await api.createAdmin(form);
      setAdmins((prev: Admin[]) => [...prev, created]);
    }
    setOpen(false);
  };
  const handleDelete = async (id: number): Promise<void> => {
    await api.deleteAdmin(id);
    setAdmins((prev: Admin[]) => prev.filter((a: Admin) => a.id !== id));
  };
  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.role || '').toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Administrators
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleOpenCreate}>
          Add Admin
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((admin: Admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenEdit(admin)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(admin.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Admin' : 'Add Admin'}</DialogTitle>
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
            label="Email"
            name="email"
            fullWidth
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Role"
            name="role"
            fullWidth
            value={form.role}
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

export default AdminsPage;