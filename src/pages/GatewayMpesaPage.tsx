import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip, LinearProgress,
  Select, MenuItem, FormControl, InputLabel, IconButton,
} from '@mui/material';
import {
  PhoneAndroid as MpesaIcon,
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
  { id: 'MPE-9201', phone: '0712***890', name: 'Sarah Chen', amount: 'KES 12,800', usd: '$99.00', status: 'completed' as const, date: 'Feb 24, 2026 · 14:32', ref: 'QKL2XY89P0' },
  { id: 'MPE-9200', phone: '0723***456', name: 'James Wilson', amount: 'KES 12,800', usd: '$99.00', status: 'completed' as const, date: 'Feb 24, 2026 · 13:18', ref: 'RPN4AB71M2' },
  { id: 'MPE-9199', phone: '0701***234', name: 'Maria Garcia', amount: 'KES 2,580', usd: '$20.00', status: 'pending' as const, date: 'Feb 24, 2026 · 12:45', ref: 'WQT8CD32K5' },
  { id: 'MPE-9198', phone: '0745***678', name: 'Alex Kim', amount: 'KES 1,935', usd: '$15.00', status: 'completed' as const, date: 'Feb 24, 2026 · 11:20', ref: 'FMH6EG94J8' },
  { id: 'MPE-9197', phone: '0733***112', name: 'David Ochieng', amount: 'KES 12,800', usd: '$99.00', status: 'failed' as const, date: 'Feb 24, 2026 · 10:05', ref: 'BVX3HI56L1' },
  { id: 'MPE-9196', phone: '0722***890', name: 'Priya Patel', amount: 'KES 2,580', usd: '$20.00', status: 'completed' as const, date: 'Feb 23, 2026 · 16:42', ref: 'CNY7JK28N4' },
  { id: 'MPE-9195', phone: '0711***345', name: 'Omar Hassan', amount: 'KES 3,225', usd: '$25.00', status: 'completed' as const, date: 'Feb 23, 2026 · 15:10', ref: 'DPZ1LM60O7' },
  { id: 'MPE-9194', phone: '0740***567', name: 'Lisa Wang', amount: 'KES 1,935', usd: '$15.00', status: 'pending' as const, date: 'Feb 23, 2026 · 14:03', ref: 'GQA5NO92P0' },
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

const GatewayMpesaPage: React.FC = () => {
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
              <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MpesaIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>M-Pesa</Typography>
                <Typography variant="body2" color="text.secondary">Safaricom M-Pesa payment gateway</Typography>
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
              { label: 'Total Revenue', value: '$624K', icon: <MpesaIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Transactions', value: '4,821', icon: <TrendIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Success Rate', value: '96.4%', icon: <SuccessIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Avg. Speed', value: '3.2s', icon: <SpeedIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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
                { label: 'Uptime (30d)', value: '99.97%', bar: 99.97, color: '#10b981' },
                { label: 'Avg Latency', value: '3.2s', bar: 32, color: '#6366f1' },
                { label: 'Success Rate', value: '96.4%', bar: 96.4, color: '#ffa424' },
                { label: 'Daily Volume', value: '~KES 1.2M', bar: 72, color: '#8b5cf6' },
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

          {/* Filter + Transactions */}
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

export default GatewayMpesaPage;
