import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Avatar,
  Chip,
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp as GrowthIcon,
  People as SubscribersIcon,
  CreditCard as TransactionsIcon,
  Star as StarIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

// ── KPI Cards ──
const kpis = [
  { label: 'Total Revenue', value: '$2.4M', icon: <RevenueIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Monthly Growth', value: '+15.3%', icon: <GrowthIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
  { label: 'Active Subscribers', value: '1,248', icon: <SubscribersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Total Transactions', value: '8,642', icon: <TransactionsIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
];

// ── Monthly Revenue data ──
const monthlyRevenue = [
  { month: 'Jul', amount: 142000 },
  { month: 'Aug', amount: 158000 },
  { month: 'Sep', amount: 134000 },
  { month: 'Oct', amount: 176000 },
  { month: 'Nov', amount: 168000 },
  { month: 'Dec', amount: 192000 },
  { month: 'Jan', amount: 186000 },
];
const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.amount));

// ── Payment gateway breakdown ──
const gatewayBreakdown = [
  { name: 'Card Payments', amount: '$892,400', percentage: 37, color: '#6366f1' },
  { name: 'M-Pesa', amount: '$624,200', percentage: 26, color: '#10b981' },
  { name: 'MTN MoMo', amount: '$432,600', percentage: 18, color: '#f59e0b' },
  { name: 'Airtel Money', amount: '$288,400', percentage: 12, color: '#ef4444' },
  { name: 'Pesapal Direct', amount: '$168,200', percentage: 7, color: '#8b5cf6' },
];

// ── Subscription metrics ──
const subscriptionMetrics = [
  { label: 'New Subscriptions', value: '186', change: '+24%', positive: true },
  { label: 'Renewals', value: '412', change: '+8%', positive: true },
  { label: 'Cancellations', value: '32', change: '-15%', positive: true },
  { label: 'Churn Rate', value: '2.6%', change: '-0.4%', positive: true },
  { label: 'Avg. Revenue / User', value: '$128', change: '+12%', positive: true },
  { label: 'Lifetime Value', value: '$384', change: '+18%', positive: true },
];

// ── Top revenue courses ──
const topCourses = [
  { name: 'Advanced React Patterns', revenue: '$48,200', enrollments: 452, rating: 4.8 },
  { name: 'TypeScript Mastery', revenue: '$36,800', enrollments: 321, rating: 4.6 },
  { name: 'Node.js Backend Dev', revenue: '$32,400', enrollments: 198, rating: 4.9 },
  { name: 'GraphQL Fundamentals', revenue: '$24,600', enrollments: 156, rating: 4.5 },
  { name: 'Docker & Kubernetes', revenue: '$19,200', enrollments: 120, rating: 4.3 },
];

// ── Recent transactions ──
const recentTransactions = [
  { id: 'TXN-8742', user: 'Sarah Chen', initials: 'SC', amount: '$128.00', method: 'Card', status: 'completed', time: '2 min ago' },
  { id: 'TXN-8741', user: 'James Wilson', initials: 'JW', amount: '$128.00', method: 'M-Pesa', status: 'completed', time: '15 min ago' },
  { id: 'TXN-8740', user: 'Maria Garcia', initials: 'MG', amount: '$128.00', method: 'MTN MoMo', status: 'pending', time: '32 min ago' },
  { id: 'TXN-8739', user: 'Alex Kim', initials: 'AK', amount: '$128.00', method: 'Airtel', status: 'completed', time: '1h ago' },
  { id: 'TXN-8738', user: 'Priya Patel', initials: 'PP', amount: '$128.00', method: 'Card', status: 'completed', time: '2h ago' },
];

// ── Shared Paper style ──
const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceAnalyticsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('30days');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Financial Analytics</Typography>
              <Typography variant="body2" color="text.secondary">Deep dive into revenue, subscriptions, and payment trends</Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Period</InputLabel>
              <Select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} label="Period">
                <MenuItem value="7days">Last 7 days</MenuItem>
                <MenuItem value="30days">Last 30 days</MenuItem>
                <MenuItem value="90days">Last 90 days</MenuItem>
                <MenuItem value="6months">Last 6 months</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* ── KPI Cards ── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    height: '100%',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      '& svg': { fontSize: 20 },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* ── Monthly Revenue Bar Chart ── */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Monthly Revenue Trend</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 240 }}>
                  {monthlyRevenue.map((d) => (
                    <Box key={d.month} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        ${(d.amount / 1000).toFixed(0)}K
                      </Typography>
                      <Box
                        sx={{
                          height: `${(d.amount / maxRevenue) * 170}px`,
                          background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s, opacity 0.2s',
                          opacity: 0.85,
                          '&:hover': { opacity: 1 },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {d.month}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Payment Gateway Breakdown ── */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Payment Methods</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {gatewayBreakdown.map((gw) => (
                    <Box key={gw.name} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{gw.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{gw.amount}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={gw.percentage}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: gw.color,
                            },
                          }}
                        />
                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 30 }}>{gw.percentage}%</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Subscription Metrics ── */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WalletIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography fontWeight={700}>Subscription Metrics</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 0 }}>
                  {subscriptionMetrics.map((metric, i) => (
                    <Box
                      key={metric.label}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        px: 3,
                        borderBottom: i < subscriptionMetrics.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{metric.value}</Typography>
                        <Chip
                          label={metric.change}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: metric.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: metric.positive ? '#10b981' : '#ef4444',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Top Revenue Courses ── */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Top Courses by Revenue</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {topCourses.map((course, i) => (
                    <Box
                      key={course.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        px: 3,
                        borderBottom: i < topCourses.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
                      <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ width: 24 }}>
                        {i + 1}
                      </Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{course.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{course.enrollments} enrollments</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                        <Typography variant="body2" fontWeight={700} color="primary.main">{course.revenue}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 50 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" fontWeight={600}>{course.rating}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Recent Transactions ── */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Recent Transactions</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {recentTransactions.map((tx, i) => (
                    <Box
                      key={tx.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        px: 3,
                        borderBottom: i < recentTransactions.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
                      <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{tx.initials}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{tx.user}</Typography>
                        <Typography variant="caption" color="text.secondary">{tx.id} · {tx.time}</Typography>
                      </Box>
                      <Chip
                        label={tx.method}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 22 }}
                      />
                      <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right' }}>
                        {tx.amount}
                      </Typography>
                      <Chip
                        label={tx.status}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: tx.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: tx.status === 'completed' ? '#10b981' : '#f59e0b',
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceAnalyticsPage;
