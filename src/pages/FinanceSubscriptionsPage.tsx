import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Avatar, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Grid, LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Visibility as ViewIcon,
  Autorenew as RenewIcon,
  Cancel as CancelIcon,
  CheckCircle as ActiveIcon,
  Warning as WarningIcon,
  CardMembership as SubIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

type SubStatus = 'active' | 'expiring' | 'trial';

interface Subscription {
  id: string;
  user: { name: string; initials: string; email: string; org: string };
  plan: string;
  amount: string;
  startDate: string;
  nextBilling: string;
  status: SubStatus;
  usage: number;
}

const subscriptions: Subscription[] = [
  { id: 'SUB-4201', user: { name: 'Sarah Chen', initials: 'SC', email: 'sarah@techcorp.com', org: 'TechCorp Ltd' }, plan: 'Enterprise', amount: '$128/6mo', startDate: 'Aug 15, 2025', nextBilling: 'Feb 15, 2026', status: 'active', usage: 87 },
  { id: 'SUB-4200', user: { name: 'James Wilson', initials: 'JW', email: 'james@globaltech.com', org: 'Global Tech' }, plan: 'Enterprise', amount: '$128/6mo', startDate: 'Sep 1, 2025', nextBilling: 'Mar 1, 2026', status: 'active', usage: 72 },
  { id: 'SUB-4199', user: { name: 'Maria Garcia', initials: 'MG', email: 'maria@startup.io', org: 'Startup Hub' }, plan: 'Professional', amount: '$128/6mo', startDate: 'Jul 20, 2025', nextBilling: 'Feb 28, 2026', status: 'expiring', usage: 94 },
  { id: 'SUB-4198', user: { name: 'Alex Kim', initials: 'AK', email: 'alex@innovate.co', org: 'Innovate Solutions' }, plan: 'Professional', amount: '$128/6mo', startDate: 'Oct 10, 2025', nextBilling: 'Apr 10, 2026', status: 'active', usage: 58 },
  { id: 'SUB-4197', user: { name: 'David Ochieng', initials: 'DO', email: 'david@kcb.co.ke', org: 'KCB Foundation' }, plan: 'Enterprise', amount: '$128/6mo', startDate: 'Nov 1, 2025', nextBilling: 'May 1, 2026', status: 'active', usage: 65 },
  { id: 'SUB-4196', user: { name: 'Priya Patel', initials: 'PP', email: 'priya@edu.org', org: 'EduPro Inc' }, plan: 'Professional', amount: '$128/6mo', startDate: 'Dec 5, 2025', nextBilling: 'Jun 5, 2026', status: 'trial', usage: 32 },
  { id: 'SUB-4195', user: { name: 'Omar Hassan', initials: 'OH', email: 'omar@learn.com', org: 'LearnPro' }, plan: 'Enterprise', amount: '$128/6mo', startDate: 'Jan 15, 2026', nextBilling: 'Jul 15, 2026', status: 'active', usage: 41 },
  { id: 'SUB-4194', user: { name: 'Lisa Wang', initials: 'LW', email: 'lisa@firm.co', org: 'Digital Futures' }, plan: 'Professional', amount: '$128/6mo', startDate: 'Feb 1, 2026', nextBilling: 'Aug 1, 2026', status: 'trial', usage: 18 },
];

const statusCfg: Record<SubStatus, { bg: string; color: string; label: string; icon: React.ReactElement }> = {
  active: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Active', icon: <ActiveIcon sx={{ fontSize: 14 }} /> },
  expiring: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Expiring Soon', icon: <WarningIcon sx={{ fontSize: 14 }} /> },
  trial: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', label: 'Trial', icon: <SubIcon sx={{ fontSize: 14 }} /> },
};

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinanceSubscriptionsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = subscriptions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search && !s.user.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });




  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Active Subscriptions</Typography>
              <Typography variant="body2" color="text.secondary">Manage all active subscriber accounts</Typography>
            </Box>
            <Button size="small" variant="contained" startIcon={<ExportIcon />}
              sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              Export
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(() => {
              const statCards = [
                { label: 'Active Subscriptions', value: subscriptions.filter((s) => s.status === 'active').length.toString(), icon: <ActiveIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
                { label: 'Expiring Soon', value: subscriptions.filter((s) => s.status === 'expiring').length.toString(), icon: <WarningIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
                { label: 'Trials', value: subscriptions.filter((s) => s.status === 'trial').length.toString(), icon: <SubIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
                { label: 'Monthly Recurring', value: '$18,640', icon: <ExportIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
              ];
              return statCards.map((s) => (
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
              ));
            })()}
          </Grid>

          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Search subscribers..." value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.02)' } }} />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="expiring">Expiring</MenuItem>
                  <MenuItem value="trial">Trial</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Subscribers</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {filtered.map((sub, i) => {
              const cfg = statusCfg[sub.status];
              return (
                <Box key={sub.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                  borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{sub.user.initials}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{sub.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{sub.user.org} · {sub.plan}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center', minWidth: 70 }}>
                    <Typography variant="caption" fontWeight={600}>{sub.amount}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', lg: 'block' }, minWidth: 80 }}>
                    <Typography variant="caption" color="text.secondary">Next: {sub.nextBilling}</Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, minWidth: 80 }}>
                    <LinearProgress variant="determinate" value={sub.usage} sx={{
                      width: 50, height: 5, borderRadius: 3, bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: sub.usage > 80 ? '#10b981' : sub.usage > 50 ? '#ffa424' : '#6366f1' },
                    }} />
                    <Typography variant="caption" fontWeight={500}>{sub.usage}%</Typography>
                  </Box>
                  <Chip icon={cfg.icon} label={cfg.label} size="small" sx={{
                    height: 24, fontSize: '0.7rem', fontWeight: 600,
                    bgcolor: cfg.bg, color: cfg.color,
                    '& .MuiChip-icon': { color: cfg.color },
                  }} />
                  <Box sx={{ display: 'flex', gap: 0.25 }}>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }} title="Renew">
                      <RenewIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'info.main' } }} title="View">
                      <ViewIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }} title="Cancel">
                      <CancelIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceSubscriptionsPage;
