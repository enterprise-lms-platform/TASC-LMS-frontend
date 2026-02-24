import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Chip, LinearProgress,
  Select, MenuItem, FormControl, InputLabel, Button,
} from '@mui/material';
import {
  FileDownload as ExportIcon,
  TrendingUp as TrendIcon,
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  Repeat as RecurringIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

// Revenue KPIs
const revenueKpis = [
  { label: 'Total Revenue', value: '$2.41M', change: '+15.3%', icon: <RevenueIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Recurring Revenue', value: '$1.86M', change: '+22.1%', icon: <RecurringIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
  { label: 'Avg Rev / User', value: '$128', change: '+8.4%', icon: <UsersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Growth Rate', value: '+15.3%', change: '+3.2%', icon: <TrendIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
];

// Monthly revenue breakdown
const monthlyBreakdown = [
  { month: 'Jul 2025', subscriptions: 98000, oneTime: 12000, total: 110000 },
  { month: 'Aug 2025', subscriptions: 108000, oneTime: 14000, total: 122000 },
  { month: 'Sep 2025', subscriptions: 112000, oneTime: 11000, total: 123000 },
  { month: 'Oct 2025', subscriptions: 124000, oneTime: 18000, total: 142000 },
  { month: 'Nov 2025', subscriptions: 132000, oneTime: 15000, total: 147000 },
  { month: 'Dec 2025', subscriptions: 142000, oneTime: 22000, total: 164000 },
  { month: 'Jan 2026', subscriptions: 156000, oneTime: 30000, total: 186000 },
];
const maxTotal = Math.max(...monthlyBreakdown.map((m) => m.total));

// Revenue by gateway
const gatewayRevenue = [
  { gateway: 'Card Payments', revenue: '$892,400', percentage: 37, color: '#6366f1', growth: '+18%' },
  { gateway: 'M-Pesa', revenue: '$624,200', percentage: 26, color: '#10b981', growth: '+24%' },
  { gateway: 'MTN MoMo', revenue: '$432,600', percentage: 18, color: '#f59e0b', growth: '+12%' },
  { gateway: 'Airtel Money', revenue: '$288,400', percentage: 12, color: '#ef4444', growth: '+9%' },
  { gateway: 'Pesapal Direct', revenue: '$168,200', percentage: 7, color: '#8b5cf6', growth: '+31%' },
];

// Revenue by course category
const categoryRevenue = [
  { category: 'Web Development', revenue: '$486,200', courses: 42, percentage: 28 },
  { category: 'Data Science', revenue: '$382,400', courses: 28, percentage: 22 },
  { category: 'Cloud Computing', revenue: '$296,800', courses: 18, percentage: 17 },
  { category: 'Cybersecurity', revenue: '$248,600', courses: 15, percentage: 14 },
  { category: 'Mobile Development', revenue: '$186,400', courses: 12, percentage: 11 },
  { category: 'DevOps', revenue: '$142,200', courses: 8, percentage: 8 },
];

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceRevenueReportsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState('6months');

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
              <Typography variant="h5" fontWeight={700}>Revenue Reports</Typography>
              <Typography variant="body2" color="text.secondary">Detailed revenue breakdown and trends</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Period</InputLabel>
                <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Period">
                  <MenuItem value="30days">Last 30 days</MenuItem>
                  <MenuItem value="3months">Last 3 months</MenuItem>
                  <MenuItem value="6months">Last 6 months</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
              <Button size="small" variant="contained" startIcon={<ExportIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Download Report
              </Button>
            </Box>
          </Box>

          {/* KPI Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {revenueKpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
                <Paper elevation={0} sx={{
                  bgcolor: kpi.bgcolor, borderRadius: '20px', p: 3, position: 'relative', height: '100%',
                  minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                  transition: 'transform 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' },
                }}>
                  <Box sx={{
                    position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%',
                    bgcolor: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', '& svg': { fontSize: 18 },
                  }}>{kpi.icon}</Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '1.8rem', md: '2rem' }, lineHeight: 1, mb: 0.5 }}>{kpi.value}</Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.8rem', opacity: 0.8, mb: 0.5 }}>{kpi.label}</Typography>
                  <Chip label={kpi.change} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.15)', color: '#10b981' }} />
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Monthly Breakdown Chart */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight={700}>Monthly Revenue Breakdown</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: '#ffa424' }} />
                      <Typography variant="caption">Subscriptions</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: 'rgba(255,164,36,0.3)' }} />
                      <Typography variant="caption">One-time</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 280 }}>
                  {monthlyBreakdown.map((m) => (
                    <Box key={m.month} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.65rem' }}>
                        ${(m.total / 1000).toFixed(0)}K
                      </Typography>
                      {/* Stacked: one-time on top */}
                      <Box sx={{ position: 'relative' }}>
                        <Box sx={{
                          height: `${(m.total / maxTotal) * 200}px`,
                          bgcolor: 'rgba(255,164,36,0.2)',
                          borderRadius: '6px 6px 0 0',
                        }} />
                        <Box sx={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: `${(m.subscriptions / maxTotal) * 200}px`,
                          background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                          borderRadius: '6px 6px 0 0',
                          opacity: 0.85, '&:hover': { opacity: 1 },
                        }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.65rem' }}>
                        {m.month.split(' ')[0]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Revenue by Gateway */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Revenue by Gateway</Typography>
                </Box>
                <Box sx={{ p: 0 }}>
                  {gatewayRevenue.map((gw, i) => (
                    <Box key={gw.gateway} sx={{
                      p: 2, px: 3, borderBottom: i < gatewayRevenue.length - 1 ? 1 : 0, borderColor: 'divider',
                      '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{gw.gateway}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={700}>{gw.revenue}</Typography>
                          <Chip label={gw.growth} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }} />
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={gw.percentage} sx={{
                          flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.100',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: gw.color },
                        }} />
                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 28 }}>{gw.percentage}%</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Revenue by Course Category */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Revenue by Course Category</Typography>
            </Box>
            <Grid container>
              {categoryRevenue.map((cat, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.category}>
                  <Box sx={{
                    p: 2.5, px: 3,
                    borderBottom: { xs: 1, md: i < categoryRevenue.length - 3 ? 1 : 0 },
                    borderRight: { xs: 0, sm: (i % 2 === 0) ? 1 : 0, md: (i % 3 !== 2) ? 1 : 0 },
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{cat.category}</Typography>
                      <Typography variant="body2" fontWeight={700} color="primary.main">{cat.revenue}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{cat.courses} courses · {cat.percentage}% of total</Typography>
                    <LinearProgress variant="determinate" value={cat.percentage} sx={{
                      height: 5, borderRadius: 3, bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#ffa424' },
                    }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceRevenueReportsPage;
