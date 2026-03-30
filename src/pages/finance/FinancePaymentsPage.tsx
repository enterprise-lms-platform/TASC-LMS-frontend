import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Avatar, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Grid,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Visibility as ViewIcon,
  CreditCard as CardIcon,
  PhoneAndroid as MpesaIcon,
  SimCard as MtnIcon,
  Wifi as AirtelIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useTransactions } from '../../hooks/usePayments';

const statusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
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

  const { data: transactions, isLoading } = useTransactions();

  const filtered = (transactions || []).filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    const name = p.user_email || '';
    const id = p.transaction_id || '';
    if (search && !name.toLowerCase().includes(search.toLowerCase()) && !id.toLowerCase().includes(search.toLowerCase())) return false;
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
              <Typography variant="body2" color="text.secondary">Manage and track all payment transactions</Typography>
            </Box>
            <Button size="small" variant="contained" startIcon={<ExportIcon />}
              sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              Export CSV
            </Button>
          </Box>

          {/* Status Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Payments', value: (transactions || []).length.toString(), icon: <CardIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Completed', value: (transactions || []).filter((p) => p.status === 'completed').length.toString(), icon: <ViewIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Pending', value: (transactions || []).filter((p) => p.status === 'pending').length.toString(), icon: <MpesaIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Failed', value: (transactions || []).filter((p) => p.status === 'failed').length.toString(), icon: <AirtelIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
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
                size="small" placeholder="Search by email or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Payments List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Transactions</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
            ) : filtered.map((p, i) => (
              <Box key={p.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                  {(p.user_email || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{p.user_email}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.transaction_id} · {p.provider}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 90 }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </Typography>
                <Chip icon={getMethodIcon(p.provider)} label={p.provider} size="small" variant="outlined" sx={{
                  display: { xs: 'none', md: 'flex' }, height: 24, fontSize: '0.7rem', fontWeight: 500,
                }} />
                <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>
                  ${p.amount}
                </Typography>
                <Chip label={p.status} size="small" sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                  bgcolor: statusColors[p.status]?.bg || 'rgba(0,0,0,0.05)',
                  color: statusColors[p.status]?.color || 'text.secondary',
                }} />
                <IconButton size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinancePaymentsPage;
