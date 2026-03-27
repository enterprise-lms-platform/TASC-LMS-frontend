import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Avatar, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Grid,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  AutoGraph as TrendUpIcon,
  People as UsersIcon,
  WorkspacePremium as PremiumIcon,
  AccessTime as HistoryIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useUserSubscriptions } from '../../hooks/usePayments';

const statusColors: Record<string, { bg: string; color: string }> = {
  active: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  paused: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  expired: { bg: 'rgba(156,163,175,0.1)', color: '#71717a' },
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinanceSubscriptionsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: subscriptions, isLoading } = useUserSubscriptions();

  const filtered = (subscriptions || []).filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    const email = s.user_email || '';
    const plan = s.plan_name || '';
    if (search && !email.toLowerCase().includes(search.toLowerCase()) && !plan.toLowerCase().includes(search.toLowerCase())) return false;
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
              <Typography variant="h5" fontWeight={700}>Subscriptions</Typography>
              <Typography variant="body2" color="text.secondary">Active plans and customer recurring billing</Typography>
            </Box>
            <Button size="small" variant="contained" startIcon={<FilterIcon />}
              sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              Advanced Filters
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Active Users', value: (subscriptions || []).filter(s => s.status === 'active').length.toString(), icon: <UsersIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d' },
              { label: 'Total MRR', value: `$${((subscriptions || []).filter(s => s.status === 'active').reduce((sum, s) => sum + parseFloat(s.price || '0'), 0)).toLocaleString()}`, icon: <TrendUpIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81' },
              { label: 'Growth', value: '+12.5%', icon: <PremiumIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12' },
              { label: 'Churn Rate', value: '2.4%', icon: <HistoryIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b' },
            ].map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                <Paper elevation={0} sx={{
                  bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' },
                }}>
                  <Box sx={{
                    position: 'absolute', top: 16, right: 16, width: 36, height: 36,
                    borderRadius: '50%', bgcolor: s.iconBg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white',
                    '& svg': { fontSize: 18 },
                  }}>{s.icon}</Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: s.color, mb: 0.5 }}>{s.value}</Typography>
                  <Typography variant="body2" sx={{ color: s.color, fontWeight: 500, opacity: 0.7 }}>{s.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Search customer or plan..." value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.02)' } }}
              />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All Plans</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Subscriptions List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>All Subscriptions</Typography>
              <Typography variant="caption" color="text.secondary">{(subscriptions || []).length} total</Typography>
            </Box>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
            ) : filtered.map((sub, i) => (
              <Box key={sub.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700 }}>
                  {(sub.user_email || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700}>{sub.user_email}</Typography>
                  <Typography variant="caption" color="text.secondary">{sub.plan_name} · Renewing {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : 'N/A'}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' }, px: 2 }}>
                  <Typography variant="body2" fontWeight={700}>${sub.price}</Typography>
                  <Typography variant="caption" color="text.secondary">Monthly</Typography>
                </Box>
                <Chip label={sub.status} size="small" sx={{
                  height: 24, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                  bgcolor: statusColors[sub.status]?.bg || 'rgba(0,0,0,0.05)',
                  color: statusColors[sub.status]?.color || 'text.secondary',
                }} />
                <IconButton size="small"><MoreIcon fontSize="small" /></IconButton>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceSubscriptionsPage;
