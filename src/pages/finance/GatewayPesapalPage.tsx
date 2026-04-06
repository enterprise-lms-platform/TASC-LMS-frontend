import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip,
  Select, MenuItem, FormControl, InputLabel, IconButton, CircularProgress,
} from '@mui/material';
import {
  Language as PesaPalIcon,
  FileDownload as ExportIcon,
  CheckCircle as SuccessIcon,
  Error as FailedIcon,
  HourglassEmpty as PendingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendIcon,
  AttachMoney as MoneyIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useTransactions } from '../../hooks/usePayments';
import { apiClient } from '../../utils/config';

const statusCfg = {
  completed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <SuccessIcon sx={{ fontSize: 14 }} /> },
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
  failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <FailedIcon sx={{ fontSize: 14 }} /> },
} as const;

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const GatewayPesapalPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const { data: transactions = [], isLoading, refetch } = useTransactions(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const handleExport = async () => {
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await apiClient.get('/api/v1/payments/transactions/export-csv/', {
        responseType: 'blob',
        params,
      });
      const url = URL.createObjectURL(response.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silently fail — export is best-effort
    }
  };

  // Compute stats from real data
  const totalRevenue = transactions.reduce((sum: number, t: any) => {
    if (t.status === 'completed') return sum + parseFloat(t.amount || '0');
    return sum;
  }, 0);
  const completed = transactions.filter((t: any) => t.status === 'completed').length;
  const successRate = transactions.length > 0 ? Math.round((completed / transactions.length) * 1000) / 10 : 0;

  const kpis = [
    { label: 'Total Revenue', value: totalRevenue > 0 ? `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : '—', icon: <MoneyIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
    { label: 'Transactions', value: transactions.length > 0 ? transactions.length.toLocaleString() : '—', icon: <TrendIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Success Rate', value: transactions.length > 0 ? `${successRate}%` : '—', icon: <SuccessIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Avg. Speed', value: '—', icon: <SpeedIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PesaPalIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>PesaPal</Typography>
                <Typography variant="body2" color="text.secondary">PesaPal multi-method payment gateway</Typography>
              </Box>
              <Chip label="Active" size="small" icon={<SuccessIcon sx={{ fontSize: 14 }} />}
                sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', '& .MuiChip-icon': { color: '#10b981' } }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={() => refetch()}
                sx={{ textTransform: 'none', borderRadius: 2, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
                Sync
              </Button>
              <Button size="small" variant="contained" startIcon={<ExportIcon />} onClick={handleExport}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Export CSV
              </Button>
            </Box>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((s) => (
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

          {/* Transactions */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Recent Transactions</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
            ) : transactions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <MoneyIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                <Typography variant="body2">No transactions found</Typography>
              </Box>
            ) : (
              transactions.map((t: any, i: number) => {
                const cfg = statusCfg[t.status as keyof typeof statusCfg] ?? statusCfg.pending;
                return (
                  <Box key={t.id} sx={{
                    display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                    borderBottom: i < transactions.length - 1 ? 1 : 0, borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                  }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="body2" fontWeight={600}>{t.user_name}</Typography>
                        {t.payment_method && (
                          <Chip label={t.payment_method} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 500, bgcolor: 'rgba(99,102,241,0.08)', color: '#6366f1' }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {t.transaction_id}{t.gateway_transaction_id ? ` · Ref: ${t.gateway_transaction_id}` : ''} · {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} sx={{ minWidth: 60, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>{t.currency} {t.amount}</Typography>
                    <Chip icon={cfg.icon} label={t.status} size="small" sx={{
                      height: 24, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                      bgcolor: cfg.bg, color: cfg.color, '& .MuiChip-icon': { color: cfg.color },
                    }} />
                    <IconButton size="small"
                      onClick={() => setSelectedTransaction(t)}
                      sx={{ color: 'text.disabled', '&:hover': { color: '#ffa424' } }}>
                      <ViewIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                );
              })
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default GatewayPesapalPage;
