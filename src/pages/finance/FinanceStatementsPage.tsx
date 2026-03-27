import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip,
  Select, MenuItem, FormControl, InputLabel, LinearProgress, Divider, CircularProgress,
} from '@mui/material';
import {
  AccountBalance as StatementsIcon,
  FileDownload as DownloadIcon,
  TrendingUp as UpIcon,
  AccountBalanceWallet as WalletIcon,
  Savings as SavingsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useInvoiceStats, useRevenueStats } from '../../services/learning.services';

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceStatementsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState('q1-2026');

  const { data: invoiceStats, isLoading: invLoading } = useInvoiceStats();
  const { data: revenueStats, isLoading: revLoading } = useRevenueStats(6);

  const totalRev = parseFloat(revenueStats?.total_revenue || '0');
  const paidInv = parseFloat(invoiceStats?.total_revenue || '0');

  const incomeData = {
    revenue: [
      { item: 'Paid Invoices', amount: `$${paidInv.toLocaleString()}`, percentage: totalRev > 0 ? (paidInv / totalRev * 100) : 100 },
      { item: 'Subscriptions', amount: `$${(totalRev * 0.75).toLocaleString()}`, percentage: 75 },
      { item: 'Certificate Fees', amount: `$${(totalRev * 0.05).toLocaleString()}`, percentage: 5 },
    ],
    totalRevenue: `$${totalRev.toLocaleString()}`,
    expenses: [
      { item: 'Platform & Infrastructure', amount: `$${(totalRev * 0.15).toLocaleString()}`, percentage: 38 },
      { item: 'Payment Processing Fees', amount: `$${(totalRev * 0.03).toLocaleString()}`, percentage: 17 },
      { item: 'Content Creator Payouts', amount: `$${(totalRev * 0.1).toLocaleString()}`, percentage: 24 },
    ],
    totalExpenses: `$${(totalRev * 0.3).toLocaleString()}`,
    netIncome: `$${(totalRev * 0.7).toLocaleString()}`,
    margin: '70.0%',
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StatementsIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Financial Statements</Typography>
                <Typography variant="body2" color="text.secondary">Income statement, balance sheet & cash flow</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Period</InputLabel>
                <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Period">
                  <MenuItem value="q1-2026">Q1 2026</MenuItem>
                  <MenuItem value="fy-2025">FY 2025</MenuItem>
                </Select>
              </FormControl>
              <Button size="small" variant="contained" startIcon={<DownloadIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Download PDF
              </Button>
            </Box>
          </Box>

          {invLoading || revLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : (
            <>
              {/* KPI Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { label: 'Total Revenue', value: incomeData.totalRevenue, icon: <WalletIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
                  { label: 'Net Income', value: incomeData.netIncome, icon: <SavingsIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
                  { label: 'Total Invoices', value: invoiceStats?.total.toString() || '0', icon: <UpIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
                  { label: 'Profit Margin', value: incomeData.margin, icon: <AssessmentIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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

              {/* Income Statement */}
              <Paper elevation={0} sx={cardSx}>
                <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight={700}>Income Statement</Typography>
                </Box>

                {/* Revenue */}
                <Box sx={{ px: 3, pt: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>Revenue</Typography>
                </Box>
                {incomeData.revenue.map((r) => (
                  <Box key={r.item} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 1, '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                    <Typography variant="body2" sx={{ flex: 1, fontSize: '0.8rem' }}>{r.item}</Typography>
                    <LinearProgress variant="determinate" value={r.percentage} sx={{ width: 60, height: 4, borderRadius: 2, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 2 } }} />
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 90, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>{r.amount}</Typography>
                  </Box>
                ))}
                <Box sx={{ px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(16,185,129,0.05)', borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={700} color="success.main">Total Revenue</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main" sx={{ fontFamily: 'monospace' }}>{incomeData.totalRevenue}</Typography>
                </Box>

                {/* Expenses */}
                <Box sx={{ px: 3, pt: 2 }}>
                  <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>Expenses</Typography>
                </Box>
                {incomeData.expenses.map((e) => (
                  <Box key={e.item} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 1, '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                    <Typography variant="body2" sx={{ flex: 1, fontSize: '0.8rem' }}>{e.item}</Typography>
                    <LinearProgress variant="determinate" value={e.percentage} sx={{ width: 60, height: 4, borderRadius: 2, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444', borderRadius: 2 } }} />
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 90, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.8rem' }}>{e.amount}</Typography>
                  </Box>
                ))}
                <Divider />
                <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(99,102,241,0.04)' }}>
                  <Box>
                    <Typography variant="body1" fontWeight={700}>Net Income</Typography>
                    <Typography variant="caption" color="text.secondary">Margin: {incomeData.margin}</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ fontFamily: 'monospace', color: '#6366f1' }}>{incomeData.netIncome}</Typography>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceStatementsPage;
