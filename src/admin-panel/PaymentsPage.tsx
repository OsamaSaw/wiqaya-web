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
import type { Payment } from '../types';

/**
 * PaymentsPage lists payment records associated with bookings.  Each entry
 * includes the order ID, amount, date and status.  Administrators can
 * create new payments and edit or delete existing ones.
 */
const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [form, setForm] = useState<{ orderId: string; amount: string; date: string; status: string }>({
    orderId: '',
    amount: '',
    date: '',
    status: '',
  });

  useEffect(() => {
    const fetchPayments = async () => {
      const data = await api.getPayments();
      setPayments(data);
    };
    fetchPayments();
  }, []);

  const handleOpenCreate = (): void => {
    setEditing(null);
    setForm({ orderId: '', amount: '', date: '', status: '' });
    setOpen(true);
  };
  const handleOpenEdit = (payment: Payment): void => {
    setEditing(payment);
    setForm({ orderId: String(payment.orderId), amount: payment.amount, date: payment.date, status: payment.status });
    setOpen(true);
  };
  const handleClose = (): void => setOpen(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSave = async (): Promise<void> => {
    if (editing) {
      const updated = await api.updatePayment(editing.id, {
        orderId: Number(form.orderId),
        amount: form.amount,
        date: form.date,
        status: form.status,
      });
      setPayments((prev: Payment[]) => prev.map((p: Payment) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await api.createPayment({
        orderId: Number(form.orderId),
        amount: form.amount,
        date: form.date,
        status: form.status,
      });
      setPayments((prev: Payment[]) => [...prev, created]);
    }
    setOpen(false);
  };
  const handleDelete = async (id: number): Promise<void> => {
    await api.deletePayment(id);
    setPayments((prev: Payment[]) => prev.filter((p: Payment) => p.id !== id));
  };
  const filtered = payments.filter(
    (p) =>
      p.orderId.toString().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Payments
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={handleOpenCreate}>
          Add Payment
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((payment: Payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.orderId}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenEdit(payment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(payment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            label="Order ID"
            name="orderId"
            fullWidth
            value={form.orderId}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Amount"
            name="amount"
            fullWidth
            value={form.amount}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Date"
            type="date"
            name="date"
            fullWidth
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            label="Status"
            name="status"
            fullWidth
            value={form.status}
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

export default PaymentsPage;