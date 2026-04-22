import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Avatar, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Grid,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert, Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Visibility as ViewIcon,
  CreditCard as CardIcon,
  PhoneAndroid as MpesaIcon,
  SimCard as MtnIcon,
  Wifi as AirtelIcon,
  Undo as RefundIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useFinancePayments } from '../../hooks/usePayments';
import { financePaymentApi, type FinancePaymentRecord } from '../../services/payments.services';
import type { PaginatedResponse } from '../../types/types';

const statusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  refunded: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
};

const getMethodIcon = (method: string) => {
  const m = (method || '').toLowerCase();
  if (m.includes('card')) return <CardIcon sx={{ fontSize: 16 }} />;
  if (m.includes('mpesa')) return <MpesaIcon sx={{ fontSize: 16 }} />;
  if (m.includes('mtn')) return <MtnIcon sx={{ fontSize: 16 }} />;
  return <AirtelIcon sx={{ fontSize: 16 }} />;
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinancePaymentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionTarget, setActionTarget] = useState<{ type: 'refund'; payment: FinancePaymentRecord } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: payments, isLoading } = useFinancePayments();
  const paymentsList: FinancePaymentRecord[] = Array.isArray(payments)
    ? payments
    : (payments as PaginatedResponse<FinancePaymentRecord> | undefined)?.results ?? [];

  const refundMutation = useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) => financePaymentApi.refund(id, remarks).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'payments'] });
      setSnackbar({ open: true, message: 'Refund requested successfully.', severity: 'success' });
      setActionTarget(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to request refund.', severity: 'error' });
      setActionTarget(null);
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const rows = filtered.map((p) => [
        p.id,
        p.user_email || '',
        p.amount,
        p.currency,
        p.status,
        p.payment_method,
        p.provider_order_id || '',
        p.provider_payment_id || '',
        p.created_at,
        p.completed_at || '',
      ]);
      const csvData = [
        ['Payment ID', 'User Email', 'Amount', 'Currency', 'Status', 'Payment Method', 'Provider Order ID', 'Provider Payment ID', 'Created At', 'Completed At'],
        ...rows,
      ].map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payments.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  const filtered = paymentsList.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    const name = p.user_email || '';
    const id = p.id || '';
    const providerOrder = p.provider_order_id || '';
    const providerPayment = p.provider_payment_id || '';
    const term = search.toLowerCase();
    if (
      search
      && !name.toLowerCase().includes(term)
      && !id.toLowerCase().includes(term)
      && !providerOrder.toLowerCase().includes(term)
      && !providerPayment.toLowerCase().includes(term)
    ) return false;
    return true;
  });

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
              <Typography variant="h5" fontWeight={700}>All Payments</Typography>
              <Typography variant="body2" color="text.secondary">Manage and track payment attempts and outcomes</Typography>
            </Box>
            <Button size="small" variant="contained" startIcon={<ExportIcon />}
              onClick={() => exportMutation.mutate()}
              disabled={exportMutation.isPending}
              sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
            </Button>
          </Box>

          {/* Status Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Payments', value: paymentsList.length.toString(), icon: <CardIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Completed', value: paymentsList.filter((p) => p.status === 'completed').length.toString(), icon: <ViewIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Pending', value: paymentsList.filter((p) => p.status === 'pending').length.toString(), icon: <MpesaIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Failed', value: paymentsList.filter((p) => p.status === 'failed').length.toString(), icon: <AirtelIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
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
              <TextField
                size="small" placeholder="Search by email, payment ID, provider refs..." value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.02)' } }}
              />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Payments List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Payment Events</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No payments found.</Typography>
              </Box>
            ) : filtered.map((p, i) => (
              <Box key={p.id} sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 120px 120px 100px 80px',
                alignItems: 'center',
                columnGap: 2,
                p: 2, px: 3,
                borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                  <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                    {(p.user_email || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{p.user_email}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.provider_order_id || p.provider_payment_id || p.id} · {p.payment_method}</Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', whiteSpace: 'nowrap' }}
                >
                  {new Date(p.created_at).toLocaleString()}
                </Typography>
                <Chip icon={getMethodIcon(p.payment_method)} label={p.payment_method} size="small" variant="outlined" sx={{
                  display: { xs: 'none', md: 'flex' }, height: 24, fontSize: '0.7rem', fontWeight: 500,
                }} />
                <Typography variant="body2" fontWeight={700} sx={{ textAlign: 'right', fontFamily: 'monospace' }}>
                  {`${p.currency} ${p.amount}`}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Chip label={p.status} size="small" sx={{
                    height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                    bgcolor: statusColors[p.status]?.bg || 'rgba(0,0,0,0.05)',
                    color: statusColors[p.status]?.color || 'text.secondary',
                  }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  {p.status === 'completed' && p.payment_method === 'pesapal' && (
                    <Tooltip title="Refund payment">
                      <IconButton size="small" onClick={() => setActionTarget({ type: 'refund', payment: p })}
                        sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}>
                        <RefundIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton size="small"
                    onClick={() => navigate(`/finance/payments/${p.id}`)}
                    sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' }, '&:hover': { color: 'primary.main' } }}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
      </Paper>
      </Box>
      </Box>

      <Dialog open={!!actionTarget} onClose={() => setActionTarget(null)}>
        <DialogTitle>Refund Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Request a refund for payment ${actionTarget?.payment.id}? This will revoke the associated enrollment/subscription access.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={() => {
              if (!actionTarget) return;
              refundMutation.mutate({ id: actionTarget.payment.id });
            }}
            color="error"
            variant="contained"
            disabled={refundMutation.isPending}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {refundMutation.isPending ? 'Refunding...' : 'Refund'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar((s) => ({ ...s, open: false }))} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    );
};

export default FinancePaymentsPage;
