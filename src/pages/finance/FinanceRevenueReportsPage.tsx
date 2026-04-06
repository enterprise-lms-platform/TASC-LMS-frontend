import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Chip, LinearProgress,
  Select, MenuItem, FormControl, InputLabel, Button, CircularProgress,
} from '@mui/material';
import {
  FileDownload as ExportIcon,
  TrendingUp as TrendIcon,
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  Repeat as RecurringIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useRevenueStats, useCoursesByCategory } from '../../services/learning.services';
import { useTransactions } from '../../hooks/usePayments';

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
  const [period, setPeriod] = useState(6);

  const { data: stats, isLoading } = useRevenueStats(period);
  const { data: categories } = useCoursesByCategory();
  const { data: transactions } = useTransactions();

  const monthlyBreakdown = stats?.monthly || [];
  const maxRevenue = Math.max(...monthlyBreakdown.map((m) => parseFloat(m.revenue) || 0), 1);

  const revenueKpis = [
    { label: 'Total Revenue', value: stats?.total_revenue ? `$${parseFloat(stats.total_revenue).toLocaleString()}` : '$0', change: '+15.3%', icon: <RevenueIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Recurring Revenue', value: stats?.total_revenue ? `$${(parseFloat(stats.total_revenue) * 0.75).toLocaleString()}` : '$0', change: '+22.1%', icon: <RecurringIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
    { label: 'Avg Rev / User', value: (() => { const txns = transactions || []; const uniqueUsers = new Set(txns.map(t => t.user).filter(Boolean)).size; const total = parseFloat(stats?.total_revenue || '0'); return uniqueUsers > 0 ? `$${Math.round(total / uniqueUsers).toLocaleString()}` : '$0'; })(), change: '+8.4%', icon: <UsersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Growth Rate', value: monthlyBreakdown.length > 0 ? `${monthlyBreakdown[monthlyBreakdown.length - 1].growth_percent || 0}%` : '0%', change: '+3.2%', icon: <TrendIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
  ];

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
              <Typography variant="h5" fontWeight={700}>Revenue Reports</Typography>
              <Typography variant="body2" color="text.secondary">Detailed revenue breakdown and trends</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Period</InputLabel>
                <Select value={period} onChange={(e) => setPeriod(Number(e.target.value))} label="Period">
                  <MenuItem value={3}>Last 3 months</MenuItem>
                  <MenuItem value={6}>Last 6 months</MenuItem>
                  <MenuItem value={12}>Last 12 months</MenuItem>
                </Select>
              </FormControl>
              <Button size="small" variant="contained" startIcon={<ExportIcon />}
                onClick={() => {
                  const csvData = `Period,Revenue,Growth\n${monthlyBreakdown.map(m => `${m.month},${m.revenue},${m.growth_percent}%`).join('\n')}`;
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `revenue-report-${period}m.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Download Report
              </Button>
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : (
            <>
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
                      <Typography variant="h4" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }, lineHeight: 1, mb: 0.5 }}>{kpi.value}</Typography>
                      <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.8rem', opacity: 0.8, mb: 0.5 }}>{kpi.label}</Typography>
                      <Chip label={kpi.change} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'rgba(16,185,129,0.15)', color: '#10b981' }} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Monthly Breakdown Chart */}
                <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                  <Paper elevation={0} sx={cardSx}>
                    <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography fontWeight={700}>Monthly Revenue Breakdown</Typography>
                    </Box>
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 280 }}>
                      {monthlyBreakdown.map((m) => (
                        <Box key={m.month} sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.65rem' }}>
                            ${(parseFloat(m.revenue) / 1000).toFixed(1)}K
                          </Typography>
                          <Box sx={{
                            height: `${(parseFloat(m.revenue) / maxRevenue) * 200}px`,
                            background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                            borderRadius: '6px 6px 0 0',
                            opacity: 0.85, '&:hover': { opacity: 1 },
                          }} />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '0.65rem' }}>
                            {m.month}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* Revenue by Gateway */}
                <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                  <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                    <Box sx={headerSx}>
                      <Typography fontWeight={700}>Revenue by Gateway</Typography>
                    </Box>
                    <Box sx={{ p: 0 }}>
                      {(() => {
                        const gwColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#71717a'];
                        const gwLabels: Record<string, string> = {
                          credit_card: 'Credit Card', debit_card: 'Debit Card', mobile_money: 'Mobile Money',
                          bank_transfer: 'Bank Transfer', paypal: 'PayPal', google_pay: 'Google Pay',
                          apple_pay: 'Apple Pay', other: 'Other',
                        };
                        const txns = transactions || [];
                        const gwMap = new Map<string, number>();
                        let gwTotal = 0;
                        for (const t of txns) {
                          const amt = parseFloat(t.amount) || 0;
                          const method = t.payment_method || 'other';
                          gwMap.set(method, (gwMap.get(method) || 0) + amt);
                          gwTotal += amt;
                        }
                        const gwData = Array.from(gwMap.entries())
                          .map(([method, amount], i) => ({
                            gateway: gwLabels[method] || method,
                            amount,
                            percentage: gwTotal > 0 ? Math.round(amount / gwTotal * 100) : 0,
                            color: gwColors[i % gwColors.length],
                          }))
                          .sort((a, b) => b.amount - a.amount);
                        if (gwData.length === 0) return <Box sx={{ p: 3, textAlign: 'center' }}><Typography variant="body2" color="text.secondary">No transaction data</Typography></Box>;
                        return gwData.map((gw, i, arr) => (
                          <Box key={gw.gateway} sx={{
                            p: 2, px: 3, borderBottom: i < arr.length - 1 ? 1 : 0, borderColor: 'divider',
                            '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                          }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" fontWeight={600}>{gw.gateway}</Typography>
                              <Typography variant="body2" fontWeight={700}>${gw.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress variant="determinate" value={gw.percentage} sx={{
                                flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.100',
                                '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: gw.color },
                              }} />
                              <Typography variant="caption" fontWeight={600} sx={{ minWidth: 28 }}>{gw.percentage}%</Typography>
                            </Box>
                          </Box>
                        ));
                      })()}
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
                  {categories?.map((cat, i, arr) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.name}>
                      <Box sx={{
                        p: 2.5, px: 3,
                        borderBottom: i < arr.length - (arr.length % 3 || 3) ? 1 : 0,
                        borderRight: { sm: (i % 2 === 0) ? 1 : 0, md: (i % 3 !== 2) ? 1 : 0 },
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight={600}>{cat.name}</Typography>
                          <Typography variant="body2" fontWeight={700} color="primary.main">{cat.count} courses</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={Math.min(cat.count * 10, 100)} sx={{
                          height: 5, borderRadius: 3, bgcolor: 'grey.100',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#ffa424' },
                        }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceRevenueReportsPage;
