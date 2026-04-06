import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button,
  Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Snackbar, Alert,
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
import { useCreateReport } from '../../hooks/usePayments';

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
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });

  const { data: invoiceStats, isLoading: invLoading } = useInvoiceStats();
  const { data: revenueStats, isLoading: revLoading } = useRevenueStats(6);
  const createReport = useCreateReport();

  const totalRev = parseFloat(revenueStats?.total_revenue || '0');
  const paidInv = parseFloat(invoiceStats?.total_revenue || '0');
  // Net income: proxy using collected (paid invoices) vs total revenue
  const netIncome = paidInv > 0 ? paidInv : totalRev;
  // Profit margin: ratio of collected to total revenue
  const profitMargin = totalRev > 0 ? Math.round((netIncome / totalRev) * 100) : 0;

  const totalRevFmt = totalRev > 0 ? `$${totalRev.toLocaleString()}` : '—';
  const netIncomeFmt = netIncome > 0 ? `$${netIncome.toLocaleString()}` : '—';
  const profitMarginFmt = totalRev > 0 ? `${profitMargin}%` : '—';

  const handleDownloadPdf = () => {
    const dateParam = period === 'fy-2025'
      ? { date_from: '2025-01-01', date_to: '2025-12-31' }
      : { date_from: '2026-01-01', date_to: '2026-03-31' };
    createReport.mutate(
      { report_type: 'revenue', parameters: dateParam },
      {
        onSuccess: () => setToast({ open: true, message: 'Statement report queued. Check Export Data when ready.', severity: 'success' }),
        onError: () => setToast({ open: true, message: 'Failed to generate statement report.', severity: 'error' }),
      },
    );
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
                onClick={handleDownloadPdf}
                disabled={createReport.isPending}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                {createReport.isPending ? 'Queuing...' : 'Download PDF'}
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
                  { label: 'Total Revenue', value: totalRevFmt, icon: <WalletIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
                  { label: 'Net Income', value: netIncomeFmt, icon: <SavingsIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
                  { label: 'Total Invoices', value: invoiceStats?.total?.toString() || '—', icon: <UpIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
                  { label: 'Collection Rate', value: profitMarginFmt, icon: <AssessmentIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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

              {/* Income Statement */}
              <Paper elevation={0} sx={cardSx}>
                <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography fontWeight={700}>Income Statement</Typography>
                </Box>
                <Box sx={{ px: 3, py: 1.5, display: 'flex', justifyContent: 'space-between', bgcolor: 'rgba(16,185,129,0.05)', borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight={700} color="success.main">Total Revenue</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main" sx={{ fontFamily: 'monospace' }}>{totalRevFmt}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                  <AssessmentIcon sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
                  <Typography variant="body2">Detailed income breakdown pending backend implementation</Typography>
                  <Typography variant="caption">Revenue by category, expense breakdown, and net income require a financial statements API endpoint</Typography>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={5000} onClose={() => setToast(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={() => setToast(p => ({ ...p, open: false }))} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FinanceStatementsPage;
