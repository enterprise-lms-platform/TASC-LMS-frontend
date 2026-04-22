import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Grid,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Visibility as ViewIcon,
  Receipt as InvoiceIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useInvoices } from '../../hooks/usePayments';
import { invoiceApi } from '../../services/payments.services';
import type { Invoice, PaginatedResponse } from '../../types/types';

const statusColors: Record<string, { bg: string; color: string }> = {
  paid: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  pending: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  overdue: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  draft: { bg: 'rgba(156,163,175,0.1)', color: '#71717a' },
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinanceInvoicesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const { data: invoices, isLoading } = useInvoices();
  const invoicesList: Invoice[] = Array.isArray(invoices)
    ? invoices
    : (invoices as PaginatedResponse<Invoice> | undefined)?.results ?? [];

  const filtered = invoicesList.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    const invoiceNumber = inv.invoice_number || '';
    const customerEmail = inv.customer_email || '';
    const customerName = inv.customer_name || '';
    const invoiceType = inv.invoice_type || '';
    const searchTerm = search.toLowerCase();
    if (
      search
      && !invoiceNumber.toLowerCase().includes(searchTerm)
      && !customerEmail.toLowerCase().includes(searchTerm)
      && !customerName.toLowerCase().includes(searchTerm)
      && !invoiceType.toLowerCase().includes(searchTerm)
    ) {
      return false;
    }
    return true;
  });

  const totalOutstanding = invoicesList.filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + (parseFloat(i.remaining_amount) || 0), 0);

  const handleEmailReceipt = async (id: number) => {
    try {
      await invoiceApi.emailReceipt(id);
    } catch {
      // silently fail
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Invoices</Typography>
              <Typography variant="body2" color="text.secondary">Create, manage and track invoices</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<ExportIcon />}
                onClick={() => {
                  const rows = filtered.map((inv) => [
                    inv.invoice_number,
                    inv.customer_name || '',
                    inv.customer_email || '',
                    inv.invoice_type,
                    inv.total_amount,
                    inv.paid_amount,
                    inv.currency,
                    inv.status,
                    inv.issue_date || '',
                    inv.due_date || '',
                    inv.paid_at || '',
                  ].join(','));
                  const csvData = [
                    'invoice_number,customer_name,customer_email,invoice_type,total_amount,paid_amount,currency,status,issue_date,due_date,paid_at',
                    ...rows,
                  ].join('\n');
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'invoices.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}>
                Export
              </Button>
            </Box>
          </Box>

          {/* Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Invoices', value: invoicesList.length.toString(), icon: <InvoiceIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Paid', value: invoicesList.filter((i) => i.status === 'paid').length.toString(), icon: <ViewIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Outstanding', value: totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), icon: <ExportIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Overdue', value: invoicesList.filter((i) => i.status === 'overdue').length.toString(), icon: <SendIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
            ].map((s) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={s.label}>
                <Paper elevation={0} sx={{
                  bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
                  position: 'relative', minHeight: { xs: 110, md: 160 }, display: 'flex',
                  flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}>
                  <Box sx={{
                    position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                    borderRadius: '50%', bgcolor: s.iconBg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white',
                    '& svg': { fontSize: 20 },
                  }}>{s.icon}</Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: s.color, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
                  <Typography variant="body2" sx={{ color: s.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>{s.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Search by invoice, customer, or type..." value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.02)' } }}
              />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Invoices List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>All Invoices</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} invoice{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No invoices found for the current filters.
                </Typography>
              </Box>
            ) : filtered.map((inv, i) => (
              <Box key={inv.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,164,36,0.1)', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <InvoiceIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700}>{inv.invoice_number}</Typography>
                    <Typography variant="body2" fontWeight={500} noWrap>— {inv.customer_email || inv.customer_name || 'No customer'}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {inv.invoice_type} · Issued {new Date(inv.issue_date).toLocaleDateString()} · Due {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'N/A'} · Paid {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>
                  {inv.total_amount} {inv.currency}
                </Typography>
                <Typography variant="caption" sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace', color: 'text.secondary' }}>
                  paid {inv.paid_amount}
                </Typography>
                <Chip label={inv.status} size="small" sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                  bgcolor: statusColors[inv.status]?.bg || 'rgba(0,0,0,0.05)',
                  color: statusColors[inv.status]?.color || 'text.secondary',
                }} />
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  {(inv.status === 'pending' || inv.status === 'overdue') && (
                    <IconButton size="small" title="Email receipt" onClick={() => handleEmailReceipt(inv.id)} sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
                      <SendIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  <IconButton size="small"
                    onClick={() => setSelectedInvoice(inv)}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
          {/* Invoice details modal */}
          <Dialog open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Invoice Details</DialogTitle>
            <DialogContent dividers>
              {selectedInvoice && (
                <Box sx={{ display: 'grid', gap: 1.25 }}>
                  <Typography variant="body2"><strong>Invoice:</strong> {selectedInvoice.invoice_number}</Typography>
                  <Typography variant="body2"><strong>Customer:</strong> {selectedInvoice.customer_name || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {selectedInvoice.customer_email || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {selectedInvoice.invoice_type}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {selectedInvoice.status}</Typography>
                  <Typography variant="body2"><strong>Total:</strong> {selectedInvoice.total_amount} {selectedInvoice.currency}</Typography>
                  <Typography variant="body2"><strong>Paid:</strong> {selectedInvoice.paid_amount} {selectedInvoice.currency}</Typography>
                  <Typography variant="body2"><strong>Issue Date:</strong> {new Date(selectedInvoice.issue_date).toLocaleDateString()}</Typography>
                  <Typography variant="body2"><strong>Due Date:</strong> {selectedInvoice.due_date ? new Date(selectedInvoice.due_date).toLocaleDateString() : 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Paid At:</strong> {selectedInvoice.paid_at ? new Date(selectedInvoice.paid_at).toLocaleString() : 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Linked Payment:</strong> {selectedInvoice.payment ? 'Yes' : 'No'}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedInvoice(null)} color="inherit">Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceInvoicesPage;
