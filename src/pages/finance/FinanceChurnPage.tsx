import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Grid, LinearProgress, CircularProgress,
} from '@mui/material';
import {
  TrendingDown as ChurnIcon,
  Warning as WarningIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useUserSubscriptions } from '../../hooks/usePayments';
import { useLearningStats } from '../../services/learning.services';

const riskColors = { high: '#ef4444', medium: '#f59e0b', low: '#ffa424' };

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceChurnPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: subscriptions, isLoading: subsLoading } = useUserSubscriptions();
  const { data: learningStats, isLoading: statsLoading } = useLearningStats();

  const totalSubs = (subscriptions || []).length;
  const activeSubs = (subscriptions || []).filter(s => s.status === 'active').length;
  const cancelledSubs = (subscriptions || []).filter(s => s.status === 'cancelled').length;
  const churnRate = totalSubs > 0 ? (cancelledSubs / totalSubs * 100).toFixed(1) : '0.0';

  const churnKpis = [
    { label: 'Current Churn Rate', value: `${churnRate}%`, change: '-0.4%', positive: true, color: '#10b981', bg: '#dcfce7' },
    { label: 'Total Subscribers', value: totalSubs.toString(), change: '+12', positive: true, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { label: 'Active Learners', value: learningStats?.active_learners.toString() || '0', change: '+3', positive: true, color: '#ffa424', bg: '#fff3e0' },
    { label: 'Cancelled Subs', value: cancelledSubs.toString(), change: '+2', positive: false, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <ChurnIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>Churn Analysis</Typography>
              <Typography variant="body2" color="text.secondary">Track and reduce subscriber churn</Typography>
            </Box>
          </Box>

          {subsLoading || statsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : (
            <>
              {/* KPI Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {churnKpis.map((kpi) => (
                  <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
                    <Paper elevation={0} sx={{
                      bgcolor: kpi.bg, borderRadius: '20px', p: 2.5, textAlign: 'center',
                      transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)' },
                    }}>
                      <Typography variant="h5" fontWeight={700} sx={{ color: kpi.color, lineHeight: 1, mb: 0.5 }}>{kpi.value}</Typography>
                      <Typography variant="caption" fontWeight={500} sx={{ color: kpi.color, opacity: 0.7 }}>{kpi.label}</Typography>
                      <Chip label={kpi.change} size="small" sx={{
                        display: 'block', mx: 'auto', mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 600,
                        bgcolor: kpi.positive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: kpi.positive ? '#10b981' : '#ef4444',
                      }} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Simplified Churn Reasons (Mocked proportional data) */}
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Churn Reasons</Typography>
                </Box>
                {[
                  { reason: 'Price too high', percentage: 32, color: '#ef4444' },
                  { reason: 'Switched to competitor', percentage: 24, color: '#f59e0b' },
                  { reason: 'Not using enough', percentage: 18, color: '#ffa424' },
                  { reason: 'Missing features', percentage: 14, color: '#6366f1' },
                  { reason: 'Other', percentage: 12, color: '#71717a' },
                ].map((r, i, arr) => (
                  <Box key={r.reason} sx={{
                    p: 1.5, px: 3,
                    borderBottom: i < arr.length - 1 ? 1 : 0, borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8rem' }}>{r.reason}</Typography>
                      <Typography variant="caption" fontWeight={600}>{r.percentage}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={r.percentage} sx={{
                      height: 5, borderRadius: 3, bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: r.color },
                    }} />
                  </Box>
                ))}
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceChurnPage;
