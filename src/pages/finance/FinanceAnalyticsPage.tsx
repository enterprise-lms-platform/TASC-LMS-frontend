import React, { useState, useMemo } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp as GrowthIcon,
  People as SubscribersIcon,
  CreditCard as TransactionsIcon,
  Star as StarIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { transactionApi, invoiceApi, userSubscriptionApi } from '../../services/main.api';

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

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', 'finance'],
    queryFn: () => transactionApi.getAll({ limit: 100 }).then(r => r.data),
  });

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices', 'finance'],
    queryFn: () => invoiceApi.getAll({ limit: 100 }).then(r => r.data),
  });

  const { data: subscriptionsData } = useQuery({
    queryKey: ['user-subscriptions', 'finance'],
    queryFn: () => userSubscriptionApi.getAll().then(r => r.data),
  });

  const transactions = (transactionsData ?? []) as Array<{ id: number; user_name: string; amount: string; status: string; payment_method: string; transaction_id: string; created_at: string; course_title: string }>;
  const invoices = (invoicesData ?? []) as Array<{ id: number; status: string }>;
  const subscriptions = (subscriptionsData ?? []) as Array<{ id: number; status: string }>;

  const kpis = useMemo(() => {
    const completedTransactions = transactions.filter((t) => t.status === 'completed');
    const totalRevenue = completedTransactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount) || 0;
      return sum + amount;
    }, 0);
    
    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
    
    const gatewayTotals: Record<string, number> = {};
    completedTransactions.forEach((t) => {
      const method = t.payment_method || 'Other';
      gatewayTotals[method] = (gatewayTotals[method] || 0) + (parseFloat(t.amount) || 0);
    });
    const totalGatewayAmount = Object.values(gatewayTotals).reduce((a, b) => a + b, 0) || 1;

    return {
      totalRevenue,
      activeSubscriptions: activeSubscriptions.length,
      totalTransactions: completedTransactions.length,
      gatewayBreakdown: Object.entries(gatewayTotals).map(([name, amount]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        amount,
        percentage: Math.round((amount / totalGatewayAmount) * 100),
        color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
      })).sort((a, b) => b.amount - a.amount),
    };
  }, [transactions, subscriptions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5).map((tx) => {
      const initials = tx.user_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'UN';
      return {
        id: tx.transaction_id,
        user: tx.user_name,
        initials,
        amount: `$${parseFloat(tx.amount).toFixed(2)}`,
        method: tx.payment_method?.replace(/_/g, ' ') || 'Unknown',
        status: tx.status === 'completed' ? 'completed' : 'pending',
        time: formatTimeAgo(tx.created_at),
      };
    });
  }, [transactions]);

  const subscriptionMetrics = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === 'active').length;
    const total = subscriptions.length;
    const churnRate = total > 0 ? Math.round((subscriptions.filter((s) => s.status === 'cancelled').length / total) * 100) : 0;
    
    return [
      { label: 'Active Subscriptions', value: active.toString(), change: '+0%', positive: true },
      { label: 'Total Subscriptions', value: total.toString(), change: '+0%', positive: true },
      { label: 'Pending Invoices', value: invoices.filter((i) => i.status === 'pending').length.toString(), change: '0', positive: true },
      { label: 'Churn Rate', value: `${churnRate}%`, change: '0%', positive: churnRate < 5 },
    ];
  }, [subscriptions, invoices]);

  const topCourses = useMemo(() => {
    const courseRevenue: Record<string, { revenue: number; enrollments: number }> = {};
    transactions.forEach((tx) => {
      if (tx.course_title && tx.status === 'completed') {
        if (!courseRevenue[tx.course_title]) {
          courseRevenue[tx.course_title] = { revenue: 0, enrollments: 0 };
        }
        courseRevenue[tx.course_title].revenue += parseFloat(tx.amount) || 0;
        courseRevenue[tx.course_title].enrollments += 1;
      }
    });
    
    return Object.entries(courseRevenue)
      .map(([name, data]) => ({
        name,
        revenue: `$${data.revenue.toFixed(0)}`,
        enrollments: data.enrollments,
        rating: (4 + Math.random()).toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.revenue.replace('$', '')) - parseFloat(a.revenue.replace('$', '')))
      .slice(0, 5);
  }, [transactions]);

  const isLoading = transactionsLoading;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
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

          {isLoading && <LinearProgress sx={{ mb: 2 }} />}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Revenue', value: `$${kpis.totalRevenue.toLocaleString()}`, icon: <RevenueIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Monthly Growth', value: '—', icon: <GrowthIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
              { label: 'Active Subscribers', value: kpis.activeSubscriptions.toLocaleString(), icon: <SubscribersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Total Transactions', value: kpis.totalTransactions.toLocaleString(), icon: <TransactionsIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
            ].map((kpi) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
                <Paper elevation={0} sx={{ bgcolor: kpi.bgcolor, borderRadius: '20px', p: 3, position: 'relative', height: '100%', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', bgcolor: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', '& svg': { fontSize: 20 } }}>
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
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Transaction History</Typography>
                </Box>
                <Box sx={{ overflow: 'auto', maxHeight: 300 }}>
                  {recentTransactions.length > 0 ? recentTransactions.map((tx, i) => (
                    <Box key={tx.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, borderBottom: i < recentTransactions.length - 1 ? 1 : 0, borderColor: 'divider', '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{tx.initials}</Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{tx.user}</Typography>
                        <Typography variant="caption" color="text.secondary">{tx.id} · {tx.time}</Typography>
                      </Box>
                      <Chip label={tx.method} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 22 }} />
                      <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right' }}>
                        {tx.amount}
                      </Typography>
                      <Chip label={tx.status} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: tx.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: tx.status === 'completed' ? '#10b981' : '#f59e0b', textTransform: 'capitalize' }} />
                    </Box>
                  )) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">No transactions found</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Payment Methods</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {kpis.gatewayBreakdown.length > 0 ? kpis.gatewayBreakdown.map((gw) => (
                    <Box key={gw.name} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{gw.name}</Typography>
                        <Typography variant="body2" color="text.secondary">${gw.amount.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={gw.percentage} sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: gw.color } }} />
                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 30 }}>{gw.percentage}%</Typography>
                      </Box>
                    </Box>
                  )) : (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No payment data</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

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
                    <Box key={metric.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderBottom: i < subscriptionMetrics.length - 1 ? 1 : 0, borderColor: 'divider', '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={700}>{metric.value}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Top Courses by Revenue</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {topCourses.length > 0 ? topCourses.map((course, i) => (
                    <Box key={course.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, borderBottom: i < topCourses.length - 1 ? 1 : 0, borderColor: 'divider', '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ width: 24 }}>{i + 1}</Typography>
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
                  )) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">No course revenue data</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default FinanceAnalyticsPage;
