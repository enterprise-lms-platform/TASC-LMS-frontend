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

import KPICard from '../../components/superadmin/KPICard';

const kpis = [
  { 
    label: 'Total Invoices', 
    value: '3,245', 
    icon: <InvoiceIcon />, 
    // Light Cyan Theme
    bgColor: '#e0f7fa', badgeColor: '#4dd0e1', valueColor: '#00838f', labelColor: '#006064'
  },
  { 
    label: 'Paid', 
    value: '$1.8M', 
    icon: <PaidIcon />, 
    // Mint Green Theme
    bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
  },
  { 
    label: 'Pending', 
    value: '$234K', 
    icon: <PendingIcon />, 
    // Light Amber Theme
    bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
  },
  { 
    label: 'Overdue', 
    value: '$45K', 
    icon: <OverdueIcon />, 
    // Soft Rose Theme
    bgColor: '#fce4ec', badgeColor: '#f06292', valueColor: '#ad1457', labelColor: '#880e4f'
  },
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
        {kpis.map((k, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <KPICard
              title={k.label}
              value={k.value}
              icon={k.icon}
              bgColor={k.bgColor}
              badgeColor={k.badgeColor}
              valueColor={k.valueColor}
              labelColor={k.labelColor}
              index={index}
            />
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
