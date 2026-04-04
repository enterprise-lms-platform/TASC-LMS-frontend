import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, CircularProgress, Button,
} from '@mui/material';
import {
  Receipt as InvoiceIcon, CheckCircle as PaidIcon, HourglassEmpty as PendingIcon,
  Warning as OverdueIcon, Visibility as ViewIcon, Download as DownloadIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useInvoiceStats } from '../../services/learning.services';
import { useInvoices } from '../../hooks/usePayments';
import KPICard from '../../components/superadmin/KPICard';
import { exportApi } from '../../services/superadmin.services';

const statusColors: Record<string, { bg: string; color: string }> = {
  paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  overdue: { bg: 'rgba(255, 164, 36, 0.1)', color: '#e65100' },
  cancelled: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
  draft: { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
};

const InvoicesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const { data: stats } = useInvoiceStats();
  const { data: invoices = [], isLoading } = useInvoices(
    statusFilter !== 'All' ? { status: statusFilter } : undefined
  );

  const kpis = [
    { label: 'Total Invoices', value: String(stats?.total ?? '—'), icon: <InvoiceIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { label: 'Paid', value: String(stats?.paid ?? '—'), icon: <PaidIcon />, bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20' },
    { label: 'Pending', value: String(stats?.pending ?? '—'), icon: <PendingIcon />, bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00' },
    { label: 'Overdue', value: String(stats?.overdue ?? '—'), icon: <OverdueIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
  ];

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SuperadminLayout title="Invoices" subtitle="Invoice management and tracking">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <KPICard title={k.label} value={k.value} icon={k.icon} bgColor={k.bgColor} badgeColor={k.badgeColor} valueColor={k.valueColor} labelColor={k.labelColor} index={index} />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search invoices..." sx={{ minWidth: 200, flex: 1 }} />
          <TextField size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
            {['All', 'paid', 'pending', 'overdue', 'cancelled', 'draft'].map((v) => (
              <MenuItem key={v} value={v}>{v === 'All' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}</MenuItem>
            ))}
          </TextField>
          <TextField size="small" type="date" label="From" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField size="small" type="date" label="To" slotProps={{ inputLabel: { shrink: true } }} />
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => exportApi.invoices()}
            sx={{ textTransform: 'none', fontWeight: 600, ml: 'auto' }}
          >
            Export CSV
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead><TableRow>
                {['Invoice #', 'Customer', 'Organization', 'Amount', 'Issued', 'Due Date', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                ))}
              </TableRow></TableHead>
              <TableBody>
                {invoices.map((inv: any) => (
                  <TableRow key={inv.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{inv.invoice_number}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{inv.customer_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{inv.customer_email}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2">{inv.organization_name || '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{inv.currency} {inv.total_amount}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{formatDate(inv.issue_date)}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{formatDate(inv.due_date)}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={inv.status?.charAt(0).toUpperCase() + inv.status?.slice(1)}
                        size="small"
                        sx={{ bgcolor: statusColors[inv.status]?.bg, color: statusColors[inv.status]?.color, fontWeight: 500, fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                        <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><DownloadIcon fontSize="small" /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No invoices found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </SuperadminLayout>
  );
};

export default InvoicesPage;
