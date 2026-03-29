import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, CircularProgress,
} from '@mui/material';
import {
  TrendingDown as ChurnIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useUserSubscriptions } from '../../hooks/usePayments';
import { useLearningStats } from '../../services/learning.services';

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
  const cancelledSubs = (subscriptions || []).filter(s => s.status === 'cancelled').length;
  const churnRate = totalSubs > 0 ? (cancelledSubs / totalSubs * 100).toFixed(1) : '0.0';

  const churnKpis = [
    { label: 'Current Churn Rate', value: `${churnRate}%`, color: '#10b981', bg: '#dcfce7' },
    { label: 'Total Subscribers', value: totalSubs.toString(), color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { label: 'Active Learners', value: learningStats?.active_learners?.toString() || '0', color: '#ffa424', bg: '#fff3e0' },
    { label: 'Cancelled Subs', value: cancelledSubs.toString(), color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
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
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Churn Reasons */}
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Churn Reasons</Typography>
                </Box>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Churn reason tracking is not yet available. Cancellation reasons will appear here once enabled.
                  </Typography>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceChurnPage;
