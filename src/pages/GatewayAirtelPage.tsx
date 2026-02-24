import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip, LinearProgress,
  Select, MenuItem, FormControl, InputLabel, IconButton,
} from '@mui/material';
import {
  Wifi as AirtelIcon,
  FileDownload as ExportIcon,
  CheckCircle as SuccessIcon,
  Error as FailedIcon,
  HourglassEmpty as PendingIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

const transactions = [
  { id: 'AIR-4301', phone: '+254 73***890', name: 'Amina Wanjiku', amount: 'KES 12,800', usd: '$99.00', status: 'completed' as const, date: 'Feb 24, 2026 · 14:12', ref: 'AIR2X89P0Q' },
  { id: 'AIR-4300', phone: '+255 68***456', name: 'Joseph Mwangi', amount: 'KES 12,800', usd: '$99.00', status: 'completed' as const, date: 'Feb 24, 2026 · 12:48', ref: 'AIR4A71M2R' },
  { id: 'AIR-4299', phone: '+254 73***234', name: 'Fatuma Abdi', amount: 'TZS 52,000', usd: '$20.00', status: 'pending' as const, date: 'Feb 24, 2026 · 11:30', ref: 'AIR8C32K5S' },
  { id: 'AIR-4298', phone: '+256 75***678', name: 'Peter Odhiambo', amount: 'UGX 57,000', usd: '$15.00', status: 'completed' as const, date: 'Feb 24, 2026 · 10:18', ref: 'AIR6E94J8T' },
  { id: 'AIR-4297', phone: '+254 73***112', name: 'Hawa Juma', amount: 'KES 12,800', usd: '$99.00', status: 'failed' as const, date: 'Feb 23, 2026 · 16:55', ref: 'AIR3H56L1U' },
  { id: 'AIR-4296', phone: '+255 68***890', name: 'Samuel Kamau', amount: 'TZS 52,000', usd: '$20.00', status: 'completed' as const, date: 'Feb 23, 2026 · 15:22', ref: 'AIR7J28N4V' },
  { id: 'AIR-4295', phone: '+254 73***345', name: 'Rose Achieng', amount: 'KES 3,225', usd: '$25.00', status: 'completed' as const, date: 'Feb 23, 2026 · 14:08', ref: 'AIR1L60O7W' },
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

const GatewayAirtelPage: React.FC = () => {
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
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AirtelIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>Airtel Money</Typography>
                <Typography variant="body2" color="text.secondary">Airtel Money payment gateway</Typography>
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
              { label: 'Total Revenue', value: '$288K', icon: <AirtelIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#7f1d1d', subColor: '#991b1b' },
              { label: 'Transactions', value: '2,146', icon: <TrendIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Success Rate', value: '93.2%', icon: <SuccessIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Avg. Speed', value: '4.8s', icon: <SpeedIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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

          {/* Gateway Health */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Gateway Health</Typography>
              <Chip label="Operational" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />
            </Box>
            <Box sx={{ p: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                { label: 'Uptime (30d)', value: '99.68%', bar: 99.68, color: '#10b981' },
                { label: 'Avg Latency', value: '4.8s', bar: 48, color: '#ef4444' },
                { label: 'Success Rate', value: '93.2%', bar: 93.2, color: '#6366f1' },
                { label: 'Daily Volume', value: '~KES 820K', bar: 42, color: '#8b5cf6' },
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
                      <Typography variant="caption" color="text.disabled">{t.phone}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{t.id} · Ref: {t.ref} · {t.date}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', minWidth: 80, display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="body2" fontWeight={700}>{t.amount}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.usd}</Typography>
                  </Box>
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

export default GatewayAirtelPage;
