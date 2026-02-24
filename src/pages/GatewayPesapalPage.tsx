import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip, LinearProgress,
  Select, MenuItem, FormControl, InputLabel, IconButton,
} from '@mui/material';
import {
  Language as PesaPalIcon,
  FileDownload as ExportIcon,
  CheckCircle as SuccessIcon,
  Error as FailedIcon,
  HourglassEmpty as PendingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendIcon,
  CreditCard as CardIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

const transactions = [
  { id: 'PP-7801', method: 'Visa ****4521', name: 'Michael Adeyemi', amount: '$99.00', status: 'completed' as const, date: 'Feb 24, 2026 · 14:55', ref: 'PP-TXN-2X89P0' },
  { id: 'PP-7800', method: 'M-Pesa', name: 'Wanja Kariuki', amount: '$99.00', status: 'completed' as const, date: 'Feb 24, 2026 · 13:28', ref: 'PP-TXN-4A71M2' },
  { id: 'PP-7799', method: 'Mastercard ****8903', name: 'Chioma Nwosu', amount: '$20.00', status: 'pending' as const, date: 'Feb 24, 2026 · 12:12', ref: 'PP-TXN-8C32K5' },
  { id: 'PP-7798', method: 'MTN MoMo', name: 'Brian Ssekandi', amount: '$15.00', status: 'completed' as const, date: 'Feb 24, 2026 · 11:45', ref: 'PP-TXN-6E94J8' },
  { id: 'PP-7797', method: 'Visa ****2267', name: 'Aisha Bakari', amount: '$99.00', status: 'failed' as const, date: 'Feb 24, 2026 · 10:30', ref: 'PP-TXN-3H56L1' },
  { id: 'PP-7796', method: 'Airtel Money', name: 'Daniel Omondi', amount: '$20.00', status: 'completed' as const, date: 'Feb 23, 2026 · 16:18', ref: 'PP-TXN-7J28N4' },
  { id: 'PP-7795', method: 'Visa ****6190', name: 'Blessing Okafor', amount: '$25.00', status: 'completed' as const, date: 'Feb 23, 2026 · 15:42', ref: 'PP-TXN-1L60O7' },
  { id: 'PP-7794', method: 'Mastercard ****3478', name: 'Kevin Mutua', amount: '$99.00', status: 'completed' as const, date: 'Feb 23, 2026 · 14:15', ref: 'PP-TXN-5N92P0' },
];

const statusCfg = {
  completed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <SuccessIcon sx={{ fontSize: 14 }} /> },
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
  failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <FailedIcon sx={{ fontSize: 14 }} /> },
};

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

  const filtered = statusFilter === 'all' ? transactions : transactions.filter((t) => t.status === statusFilter);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
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
              <Chip label="Connected" size="small" icon={<SuccessIcon sx={{ fontSize: 14 }} />}
                sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', '& .MuiChip-icon': { color: '#10b981' } }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<RefreshIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
                Sync
              </Button>
              <Button size="small" variant="contained" startIcon={<ExportIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Export
              </Button>
            </Box>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Revenue', value: '$168K', icon: <PesaPalIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Transactions', value: '1,842', icon: <TrendIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Success Rate', value: '97.1%', icon: <SuccessIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Avg. Speed', value: '2.8s', icon: <SpeedIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
            ].map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                <Paper elevation={0} sx={{
                  bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
                  position: 'relative', minHeight: 160, display: 'flex',
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: s.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
                  <Typography variant="body2" sx={{ color: s.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>{s.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Gateway Health */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight={700}>Gateway Health</Typography>
                  <Chip label="Operational" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />
                </Box>
                <Box sx={{ p: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Uptime (30d)', value: '99.99%', bar: 99.99, color: '#10b981' },
                    { label: 'Avg Latency', value: '2.8s', bar: 28, color: '#6366f1' },
                    { label: 'Success Rate', value: '97.1%', bar: 97.1, color: '#ffa424' },
                    { label: 'Daily Volume', value: '~$4,800', bar: 48, color: '#8b5cf6' },
                  ].map((m) => (
                    <Box key={m.label} sx={{ flex: '1 1 120px', minWidth: 120 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={500} color="text.secondary">{m.label}</Typography>
                        <Typography variant="caption" fontWeight={700}>{m.value}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={m.bar} sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: m.color } }} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Payment Methods */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Payment Methods via PesaPal</Typography>
                </Box>
                {[
                  { method: 'Visa / Mastercard', share: '42%', volume: '$70,560', bar: 42, color: '#6366f1', icon: <CardIcon sx={{ fontSize: 16 }} /> },
                  { method: 'M-Pesa', share: '28%', volume: '$47,040', bar: 28, color: '#10b981', icon: <SuccessIcon sx={{ fontSize: 16 }} /> },
                  { method: 'MTN MoMo', share: '18%', volume: '$30,240', bar: 18, color: '#f59e0b', icon: <TrendIcon sx={{ fontSize: 16 }} /> },
                  { method: 'Airtel Money', share: '12%', volume: '$20,160', bar: 12, color: '#ef4444', icon: <SpeedIcon sx={{ fontSize: 16 }} /> },
                ].map((pm, i, arr) => (
                  <Box key={pm.method} sx={{
                    p: 2, px: 3,
                    borderBottom: i < arr.length - 1 ? 1 : 0, borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: pm.color }}>{pm.icon}</Box>
                        <Typography variant="body2" fontWeight={600}>{pm.method}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{pm.volume}</Typography>
                        <Chip label={pm.share} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: `${pm.color}18`, color: pm.color }} />
                      </Box>
                    </Box>
                    <LinearProgress variant="determinate" value={pm.bar} sx={{ height: 5, borderRadius: 3, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: pm.color } }} />
                  </Box>
                ))}
              </Paper>
            </Grid>
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
            {filtered.map((t, i) => {
              const cfg = statusCfg[t.status];
              return (
                <Box key={t.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                  borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography variant="body2" fontWeight={600}>{t.name}</Typography>
                      <Chip label={t.method} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 500, bgcolor: 'rgba(99,102,241,0.08)', color: '#6366f1' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">{t.id} · Ref: {t.ref} · {t.date}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ minWidth: 60, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>{t.amount}</Typography>
                  <Chip icon={cfg.icon} label={t.status} size="small" sx={{
                    height: 24, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                    bgcolor: cfg.bg, color: cfg.color, '& .MuiChip-icon': { color: cfg.color },
                  }} />
                  <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: '#ffa424' } }}><ViewIcon sx={{ fontSize: 18 }} /></IconButton>
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default GatewayPesapalPage;
