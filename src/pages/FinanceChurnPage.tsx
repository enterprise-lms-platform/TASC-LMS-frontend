import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Grid, LinearProgress,
} from '@mui/material';
import {
  TrendingDown as ChurnIcon,
  Warning as WarningIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

const churnKpis = [
  { label: 'Current Churn Rate', value: '3.8%', change: '-0.4%', positive: true, color: '#10b981', bg: '#dcfce7' },
  { label: 'At-Risk Subscribers', value: '24', change: '+3', positive: false, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  { label: 'Avg. Lifecycle', value: '14.2 mo', change: '+1.3', positive: true, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { label: 'Recovery Rate', value: '22%', change: '+5%', positive: true, color: '#ffa424', bg: '#fff3e0' },
];

const monthlyChurn = [
  { month: 'Aug', rate: 5.2, lost: 48 },
  { month: 'Sep', rate: 4.8, lost: 42 },
  { month: 'Oct', rate: 4.1, lost: 38 },
  { month: 'Nov', rate: 3.6, lost: 34 },
  { month: 'Dec', rate: 4.2, lost: 40 },
  { month: 'Jan', rate: 3.8, lost: 36 },
];
const maxRate = Math.max(...monthlyChurn.map((m) => m.rate));

const churnReasons = [
  { reason: 'Price too high', percentage: 32, count: 84, color: '#ef4444' },
  { reason: 'Switched to competitor', percentage: 24, count: 63, color: '#f59e0b' },
  { reason: 'Not using enough', percentage: 18, count: 47, color: '#ffa424' },
  { reason: 'Missing features', percentage: 14, count: 37, color: '#6366f1' },
  { reason: 'Company restructuring', percentage: 8, count: 21, color: '#71717a' },
  { reason: 'Other', percentage: 4, count: 10, color: '#a1a1aa' },
];

const atRiskUsers = [
  { name: 'TechStart Inc', daysInactive: 28, usage: 12, plan: 'Professional', risk: 'high' as const },
  { name: 'CloudBase Ltd', daysInactive: 21, usage: 18, plan: 'Enterprise', risk: 'high' as const },
  { name: 'DataFlow Corp', daysInactive: 18, usage: 24, plan: 'Professional', risk: 'medium' as const },
  { name: 'AppVenture', daysInactive: 14, usage: 31, plan: 'Professional', risk: 'medium' as const },
  { name: 'SmartEd Labs', daysInactive: 12, usage: 35, plan: 'Enterprise', risk: 'low' as const },
];

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <ChurnIcon sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>Churn Analysis</Typography>
              <Typography variant="body2" color="text.secondary">Track and reduce subscriber churn</Typography>
            </Box>
          </Box>

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

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Monthly Churn Chart */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Monthly Churn Rate</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 3, height: 250 }}>
                  {monthlyChurn.map((m) => (
                    <Box key={m.month} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {m.rate}%
                      </Typography>
                      <Box sx={{
                        height: `${(m.rate / maxRate) * 160}px`,
                        background: m.rate > 4 ? 'linear-gradient(180deg, #ef4444, #fca5a5)' : 'linear-gradient(180deg, #ffa424, #ffb74d)',
                        borderRadius: '6px 6px 0 0',
                        opacity: 0.85, '&:hover': { opacity: 1 },
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {m.month}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                        {m.lost} lost
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Churn Reasons */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Churn Reasons</Typography>
                </Box>
                {churnReasons.map((r, i) => (
                  <Box key={r.reason} sx={{
                    p: 1.5, px: 3,
                    borderBottom: i < churnReasons.length - 1 ? 1 : 0, borderColor: 'divider',
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
            </Grid>
          </Grid>

          {/* At-Risk Subscribers */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
                <Typography fontWeight={700}>At-Risk Subscribers</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">{atRiskUsers.length} accounts</Typography>
            </Box>
            {atRiskUsers.map((u, i) => (
              <Box key={u.name} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < atRiskUsers.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: `${riskColors[u.risk]}15`, color: riskColors[u.risk], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UsersIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{u.plan} · {u.daysInactive} days inactive</Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, minWidth: 80 }}>
                  <LinearProgress variant="determinate" value={u.usage} sx={{
                    width: 50, height: 5, borderRadius: 3, bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: riskColors[u.risk] },
                  }} />
                  <Typography variant="caption" fontWeight={500}>{u.usage}%</Typography>
                </Box>
                <Chip label={u.risk} size="small" sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                  bgcolor: `${riskColors[u.risk]}15`, color: riskColors[u.risk],
                }} />
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceChurnPage;
