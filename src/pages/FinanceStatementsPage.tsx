import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip,
  Select, MenuItem, FormControl, InputLabel, LinearProgress, Divider,
} from '@mui/material';
import {
  AccountBalance as StatementsIcon,
  FileDownload as DownloadIcon,
  TrendingUp as UpIcon,
  TrendingDown as DownIcon,
  AccountBalanceWallet as WalletIcon,
  Savings as SavingsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

/* ── Income Statement ── */
const incomeData = {
  revenue: [
    { item: 'Subscription Revenue', amount: '$1,862,400', percentage: 77 },
    { item: 'One-time Course Purchases', amount: '$312,600', percentage: 13 },
    { item: 'Certificate Fees', amount: '$148,200', percentage: 6 },
    { item: 'Enterprise Contracts', amount: '$96,800', percentage: 4 },
  ],
  totalRevenue: '$2,420,000',
  expenses: [
    { item: 'Platform & Infrastructure', amount: '$384,600', percentage: 38 },
    { item: 'Payment Processing Fees', amount: '$168,400', percentage: 17 },
    { item: 'Content Creator Payouts', amount: '$242,000', percentage: 24 },
    { item: 'Support & Operations', amount: '$124,800', percentage: 12 },
    { item: 'Marketing & Growth', amount: '$92,200', percentage: 9 },
  ],
  totalExpenses: '$1,012,000',
  netIncome: '$1,408,000',
  margin: '58.2%',
};

/* ── Balance Sheet ── */
const balanceItems = [
  { category: 'Assets', items: [
    { name: 'Cash & Equivalents', value: '$1,240,000' },
    { name: 'Accounts Receivable', value: '$186,400' },
    { name: 'Prepaid Expenses', value: '$48,200' },
    { name: 'Platform Infrastructure', value: '$320,000' },
  ], total: '$1,794,600', color: '#10b981' },
  { category: 'Liabilities', items: [
    { name: 'Accounts Payable', value: '$96,800' },
    { name: 'Deferred Revenue', value: '$412,600' },
    { name: 'Accrued Expenses', value: '$68,400' },
  ], total: '$577,800', color: '#f59e0b' },
  { category: 'Equity', items: [
    { name: 'Retained Earnings', value: '$808,800' },
    { name: 'Current Period', value: '$408,000' },
  ], total: '$1,216,800', color: '#6366f1' },
];

/* ── Cash Flow ── */
const cashFlowItems = [
  { category: 'Operating', amount: '+$1,408,000', items: ['Net Income', 'Depreciation', 'Working Capital Changes'], positive: true },
  { category: 'Investing', amount: '-$186,000', items: ['Platform Upgrades', 'New Feature Development'], positive: false },
  { category: 'Financing', amount: '-$42,000', items: ['Loan Repayments', 'Interest Payments'], positive: false },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceStatementsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState('q4-2025');

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
                  <MenuItem value="q4-2025">Q4 2025</MenuItem>
                  <MenuItem value="q3-2025">Q3 2025</MenuItem>
                  <MenuItem value="fy-2025">FY 2025</MenuItem>
                  <MenuItem value="q1-2026">Q1 2026</MenuItem>
                </Select>
              </FormControl>
              <Button size="small" variant="contained" startIcon={<DownloadIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Download PDF
              </Button>
            </Box>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Revenue', value: '$2.42M', icon: <WalletIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Net Income', value: '$1.41M', icon: <SavingsIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Profit Margin', value: '58.2%', icon: <UpIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Total Assets', value: '$1.79M', icon: <AssessmentIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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

          <Grid container spacing={3}>
            {/* ── Income Statement ── */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight={700}>Income Statement</Typography>
                  <Chip label="Q4 2025" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.1)', color: '#ffa424' }} />
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
                <Box sx={{ px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(239,68,68,0.05)', borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={700} color="error.main">Total Expenses</Typography>
                  <Typography variant="body2" fontWeight={700} color="error.main" sx={{ fontFamily: 'monospace' }}>{incomeData.totalExpenses}</Typography>
                </Box>

                {/* Net Income */}
                <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(99,102,241,0.04)' }}>
                  <Box>
                    <Typography variant="body1" fontWeight={700}>Net Income</Typography>
                    <Typography variant="caption" color="text.secondary">Margin: {incomeData.margin}</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={800} sx={{ fontFamily: 'monospace', color: '#6366f1' }}>{incomeData.netIncome}</Typography>
                </Box>
              </Paper>
            </Grid>

            {/* ── Balance Sheet + Cash Flow ── */}
            <Grid size={{ xs: 12, lg: 5 }}>
              {/* Balance Sheet */}
              <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Balance Sheet</Typography>
                </Box>
                {balanceItems.map((section) => (
                  <Box key={section.category}>
                    <Box sx={{ px: 3, pt: 2, pb: 0.5 }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: section.color, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>{section.category}</Typography>
                    </Box>
                    {section.items.map((item) => (
                      <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 0.75, '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{item.name}</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.value}</Typography>
                      </Box>
                    ))}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 3, py: 1, borderTop: 1, borderBottom: 1, borderColor: 'divider', bgcolor: `${section.color}08` }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: section.color }}>Total {section.category}</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: section.color, fontFamily: 'monospace' }}>{section.total}</Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>

              {/* Cash Flow */}
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Cash Flow Summary</Typography>
                </Box>
                {cashFlowItems.map((cf, i) => (
                  <Box key={cf.category} sx={{
                    p: 2, px: 3,
                    borderBottom: i < cashFlowItems.length - 1 ? 1 : 0, borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {cf.positive ? <UpIcon sx={{ fontSize: 16, color: '#10b981' }} /> : <DownIcon sx={{ fontSize: 16, color: '#ef4444' }} />}
                        <Typography variant="body2" fontWeight={700}>{cf.category} Activities</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace', color: cf.positive ? '#10b981' : '#ef4444' }}>{cf.amount}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{cf.items.join(' · ')}</Typography>
                  </Box>
                ))}
                <Divider />
                <Box sx={{ p: 2, px: 3, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(99,102,241,0.04)' }}>
                  <Typography variant="body2" fontWeight={700}>Net Cash Change</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace', color: '#6366f1' }}>+$1,180,000</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceStatementsPage;
