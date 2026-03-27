import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip,
  Select, MenuItem, FormControl, InputLabel, Grid, CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Autorenew as RenewedIcon,
  Update as ExpiredIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useTransactions } from '../../hooks/usePayments';

type EventType = 'completed' | 'pending' | 'failed';

const eventCfg: Record<string, { bg: string; color: string; icon: React.ReactElement; label: string }> = {
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: <RenewedIcon sx={{ fontSize: 16 }} />, label: 'Renewed' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: <RenewedIcon sx={{ fontSize: 16 }} />, label: 'Pending' },
  failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: <CancelledIcon sx={{ fontSize: 16 }} />, label: 'Failed' },
};

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinanceSubscriptionHistoryPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState('all');

  const { data: transactions, isLoading } = useTransactions();

  const filtered = (transactions || []).filter((e) => {
    if (eventFilter !== 'all' && e.status !== eventFilter) return false;
    return true;
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HistoryIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Subscription History</Typography>
                <Typography variant="body2" color="text.secondary">Timeline of all subscription events</Typography>
              </Box>
            </Box>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} label="Status">
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Events', value: (transactions || []).length.toString(), icon: <HistoryIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Renewals', value: (transactions || []).filter((e) => e.status === 'completed').length.toString(), icon: <RenewedIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Pending', value: (transactions || []).filter((e) => e.status === 'pending').length.toString(), icon: <RenewedIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Failed', value: (transactions || []).filter((e) => e.status === 'failed').length.toString(), icon: <CancelledIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
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

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Event Timeline</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
            ) : filtered.map((evt, i) => {
              const cfg = eventCfg[evt.status] || eventCfg.failed;
              return (
                <Box key={evt.id} sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, px: 3,
                  borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25,
                  }}>{cfg.icon}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                      <Typography variant="body2" fontWeight={700}>{evt.user_email}</Typography>
                      <Typography variant="caption" color="text.secondary">· {evt.provider}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>Transaction {evt.transaction_id} via {evt.provider}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: cfg.bg, color: cfg.color }} />
                      <Typography variant="caption" color="text.disabled">{new Date(evt.created_at).toLocaleDateString()}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace', minWidth: 65, textAlign: 'right' }}>${evt.amount}</Typography>
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceSubscriptionHistoryPage;
