import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Avatar, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
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
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

interface Payment {
  id: string;
  user: { name: string; initials: string; email: string };
  amount: string;
  date: string;
  method: string;
  methodIcon: React.ReactElement;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  reference: string;
}

const payments: Payment[] = [
  { id: 'PAY-8742', user: { name: 'Sarah Chen', initials: 'SC', email: 'sarah@company.com' }, amount: '$128.00', date: 'Feb 24, 2026', method: 'Card', methodIcon: <CardIcon sx={{ fontSize: 16 }} />, status: 'completed', description: 'Biannual Subscription', reference: 'REF-4X2K9' },
  { id: 'PAY-8741', user: { name: 'James Wilson', initials: 'JW', email: 'james@techcorp.com' }, amount: '$128.00', date: 'Feb 24, 2026', method: 'M-Pesa', methodIcon: <MpesaIcon sx={{ fontSize: 16 }} />, status: 'completed', description: 'Biannual Subscription', reference: 'REF-7M3P1' },
  { id: 'PAY-8740', user: { name: 'Maria Garcia', initials: 'MG', email: 'maria@startup.io' }, amount: '$128.00', date: 'Feb 23, 2026', method: 'MTN MoMo', methodIcon: <MtnIcon sx={{ fontSize: 16 }} />, status: 'pending', description: 'Biannual Subscription', reference: 'REF-2N8Q4' },
  { id: 'PAY-8739', user: { name: 'Alex Kim', initials: 'AK', email: 'alex@global.co' }, amount: '$128.00', date: 'Feb 23, 2026', method: 'Airtel', methodIcon: <AirtelIcon sx={{ fontSize: 16 }} />, status: 'completed', description: 'Biannual Subscription', reference: 'REF-5A1R7' },
  { id: 'PAY-8738', user: { name: 'Priya Patel', initials: 'PP', email: 'priya@edu.org' }, amount: '$128.00', date: 'Feb 22, 2026', method: 'Card', methodIcon: <CardIcon sx={{ fontSize: 16 }} />, status: 'completed', description: 'Biannual Subscription', reference: 'REF-9C4D2' },
  { id: 'PAY-8737', user: { name: 'David Ochieng', initials: 'DO', email: 'david@academy.ke' }, amount: '$128.00', date: 'Feb 22, 2026', method: 'M-Pesa', methodIcon: <MpesaIcon sx={{ fontSize: 16 }} />, status: 'failed', description: 'Biannual Subscription', reference: 'REF-3F6G8' },
  { id: 'PAY-8736', user: { name: 'Lisa Wang', initials: 'LW', email: 'lisa@firm.co' }, amount: '$128.00', date: 'Feb 21, 2026', method: 'Card', methodIcon: <CardIcon sx={{ fontSize: 16 }} />, status: 'completed', description: 'Biannual Subscription', reference: 'REF-8H2J5' },
  { id: 'PAY-8735', user: { name: 'Omar Hassan', initials: 'OH', email: 'omar@learn.com' }, amount: '$128.00', date: 'Feb 21, 2026', method: 'MTN MoMo', methodIcon: <MtnIcon sx={{ fontSize: 16 }} />, status: 'completed', description: 'Biannual Subscription', reference: 'REF-1K7L3' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
};

const methodColors: Record<string, { bg: string; color: string }> = {
  Card: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  'M-Pesa': { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  'MTN MoMo': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  Airtel: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
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

  const filtered = payments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.user.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: 'Total Payments', value: payments.length.toString(), color: '#6366f1' },
    { label: 'Completed', value: payments.filter((p) => p.status === 'completed').length.toString(), color: '#10b981' },
    { label: 'Pending', value: payments.filter((p) => p.status === 'pending').length.toString(), color: '#f59e0b' },
    { label: 'Failed', value: payments.filter((p) => p.status === 'failed').length.toString(), color: '#ef4444' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
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
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {stats.map((s) => (
              <Paper key={s.label} elevation={0} sx={{ ...cardSx, p: 2, px: 2.5, flex: '1 1 auto', minWidth: 120, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 8, height: 32, borderRadius: 4, bgcolor: s.color }} />
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
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
            {filtered.map((p, i) => (
              <Box key={p.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{p.user.initials}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{p.user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.id} · {p.description}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 90 }}>{p.date}</Typography>
                <Chip icon={p.methodIcon} label={p.method} size="small" variant="outlined" sx={{
                  display: { xs: 'none', md: 'flex' }, height: 24, fontSize: '0.7rem', fontWeight: 500,
                  borderColor: methodColors[p.method]?.color || 'divider', color: methodColors[p.method]?.color || 'text.secondary',
                }} />
                <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>{p.amount}</Typography>
                <Chip label={p.status} size="small" sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                  bgcolor: statusColors[p.status].bg, color: statusColors[p.status].color,
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
