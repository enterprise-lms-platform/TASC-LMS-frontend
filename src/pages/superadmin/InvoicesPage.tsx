import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton,
} from '@mui/material';
import {
  Receipt as InvoiceIcon, CheckCircle as PaidIcon, HourglassEmpty as PendingIcon,
  Warning as OverdueIcon, Visibility as ViewIcon, Download as DownloadIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Invoices', value: '3,245', icon: <InvoiceIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: '+156 this month' },
  { label: 'Paid', value: '$1.8M', icon: <PaidIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '92% collection' },
  { label: 'Pending', value: '$234K', icon: <PendingIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: '127 invoices' },
  { label: 'Overdue', value: '$45K', icon: <OverdueIcon />, gradient: 'linear-gradient(135deg, #ef4444, #f87171)', trend: '18 invoices' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Overdue: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  Cancelled: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const invoices = [
  { id: 'INV-3245', customer: 'John Kamau', email: 'john@acme.com', org: 'Acme Corporation', amount: '$2,499.00', issued: 'Feb 10, 2026', due: 'Mar 10, 2026', status: 'Paid' },
  { id: 'INV-3244', customer: 'Mary Wambui', email: 'mary@globaltech.com', org: 'Global Tech Inc', amount: '$1,899.00', issued: 'Feb 8, 2026', due: 'Mar 8, 2026', status: 'Pending' },
  { id: 'INV-3243', customer: 'Peter Ochieng', email: 'peter@innovate.com', org: 'Innovate Solutions', amount: '$49.99', issued: 'Feb 7, 2026', due: 'Feb 21, 2026', status: 'Overdue' },
  { id: 'INV-3242', customer: 'Grace Akinyi', email: 'grace@acme.com', org: 'Acme Corporation', amount: '$599.00', issued: 'Feb 5, 2026', due: 'Mar 5, 2026', status: 'Paid' },
  { id: 'INV-3241', customer: 'David Mwangi', email: 'david@future.com', org: 'Future Dynamics', amount: '$1,299.00', issued: 'Feb 3, 2026', due: 'Mar 3, 2026', status: 'Paid' },
  { id: 'INV-3240', customer: 'Sarah Nakamura', email: 'sarah@nextgen.com', org: 'NextGen Partners', amount: '$89.99', issued: 'Feb 1, 2026', due: 'Feb 15, 2026', status: 'Cancelled' },
  { id: 'INV-3239', customer: 'James Otieno', email: 'james@acme.com', org: 'Acme Corporation', amount: '$39.99', issued: 'Jan 28, 2026', due: 'Feb 11, 2026', status: 'Paid' },
  { id: 'INV-3238', customer: 'Faith Muthoni', email: 'faith@globaltech.com', org: 'Global Tech Inc', amount: '$749.00', issued: 'Jan 25, 2026', due: 'Feb 25, 2026', status: 'Pending' },
];

const InvoicesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = invoices.filter((i) => statusFilter === 'All' || i.status === statusFilter);

  return (
    <SuperadminLayout title="Invoices" subtitle="Invoice management and tracking">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px) scale(1.01)' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
              <Typography variant="body2" color="text.secondary">{k.trend}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search invoices..." sx={{ minWidth: 200, flex: 1 }} />
          <TextField size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
            {['All', 'Paid', 'Pending', 'Overdue', 'Cancelled'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
          <TextField size="small" type="date" label="From" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField size="small" type="date" label="To" slotProps={{ inputLabel: { shrink: true } }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead><TableRow>
              {['Invoice #', 'Customer', 'Organization', 'Amount', 'Issued', 'Due Date', 'Status', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow></TableHead>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{inv.id}</Typography></TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{inv.customer}</Typography>
                    <Typography variant="caption" color="text.secondary">{inv.email}</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{inv.org}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{inv.amount}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{inv.issued}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{inv.due}</Typography></TableCell>
                  <TableCell><Chip label={inv.status} size="small" sx={{ bgcolor: statusColors[inv.status]?.bg, color: statusColors[inv.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><DownloadIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SuperadminLayout>
  );
};

export default InvoicesPage;
