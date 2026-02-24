import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip,
  Select, MenuItem, FormControl, InputLabel, Grid,
} from '@mui/material';
import {
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Autorenew as RenewedIcon,
  Update as ExpiredIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

type EventType = 'created' | 'renewed' | 'cancelled' | 'expired' | 'upgraded' | 'downgraded';

interface HistoryEvent {
  id: string;
  user: string;
  org: string;
  event: EventType;
  plan: string;
  amount: string;
  date: string;
  details: string;
}

const events: HistoryEvent[] = [
  { id: 'EVT-891', user: 'Sarah Chen', org: 'TechCorp Ltd', event: 'renewed', plan: 'Enterprise', amount: '$128.00', date: 'Feb 24, 2026', details: 'Auto-renewed for 6 months' },
  { id: 'EVT-890', user: 'Maria Garcia', org: 'Startup Hub', event: 'cancelled', plan: 'Professional', amount: '$128.00', date: 'Feb 23, 2026', details: 'Cancelled by user — switching provider' },
  { id: 'EVT-889', user: 'Alex Kim', org: 'Innovate Solutions', event: 'upgraded', plan: 'Enterprise', amount: '$128.00', date: 'Feb 22, 2026', details: 'Upgraded from Professional to Enterprise' },
  { id: 'EVT-888', user: 'James Wilson', org: 'Global Tech', event: 'renewed', plan: 'Enterprise', amount: '$128.00', date: 'Feb 21, 2026', details: 'Auto-renewed for 6 months' },
  { id: 'EVT-887', user: 'Priya Patel', org: 'EduPro Inc', event: 'created', plan: 'Professional', amount: '$128.00', date: 'Feb 20, 2026', details: 'New subscription started (14-day trial)' },
  { id: 'EVT-886', user: 'David Ochieng', org: 'KCB Foundation', event: 'renewed', plan: 'Enterprise', amount: '$128.00', date: 'Feb 19, 2026', details: 'Manual renewal processed' },
  { id: 'EVT-885', user: 'Lisa Wang', org: 'Digital Futures', event: 'expired', plan: 'Professional', amount: '$128.00', date: 'Feb 18, 2026', details: 'Subscription expired — payment failed' },
  { id: 'EVT-884', user: 'Omar Hassan', org: 'LearnPro', event: 'created', plan: 'Enterprise', amount: '$128.00', date: 'Feb 17, 2026', details: 'New Enterprise subscription created' },
  { id: 'EVT-883', user: 'Chen Wei', org: 'AsiaEd', event: 'downgraded', plan: 'Professional', amount: '$128.00', date: 'Feb 16, 2026', details: 'Downgraded from Enterprise effective next cycle' },
  { id: 'EVT-882', user: 'Anna Schmidt', org: 'EuroTech', event: 'cancelled', plan: 'Professional', amount: '$128.00', date: 'Feb 15, 2026', details: 'Company restructuring' },
];

const eventCfg: Record<EventType, { bg: string; color: string; icon: React.ReactElement; label: string }> = {
  created: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', icon: <CompletedIcon sx={{ fontSize: 16 }} />, label: 'Created' },
  renewed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: <RenewedIcon sx={{ fontSize: 16 }} />, label: 'Renewed' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', icon: <CancelledIcon sx={{ fontSize: 16 }} />, label: 'Cancelled' },
  expired: { bg: 'rgba(156,163,175,0.1)', color: '#71717a', icon: <ExpiredIcon sx={{ fontSize: 16 }} />, label: 'Expired' },
  upgraded: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: <CompletedIcon sx={{ fontSize: 16 }} />, label: 'Upgraded' },
  downgraded: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: <ExpiredIcon sx={{ fontSize: 16 }} />, label: 'Downgraded' },
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

  const filtered = eventFilter === 'all' ? events : events.filter((e) => e.event === eventFilter);




  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
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
              <InputLabel>Event Type</InputLabel>
              <Select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} label="Event Type">
                <MenuItem value="all">All Events</MenuItem>
                <MenuItem value="created">Created</MenuItem>
                <MenuItem value="renewed">Renewed</MenuItem>
                <MenuItem value="upgraded">Upgraded</MenuItem>
                <MenuItem value="downgraded">Downgraded</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {(() => {
              const statCards = [
                { label: 'Total Events', value: events.length.toString(), icon: <HistoryIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
                { label: 'Renewals', value: events.filter((e) => e.event === 'renewed').length.toString(), icon: <RenewedIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
                { label: 'Cancellations', value: events.filter((e) => e.event === 'cancelled').length.toString(), icon: <CancelledIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
                { label: 'New Subs', value: events.filter((e) => e.event === 'created').length.toString(), icon: <CompletedIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              ];
              return statCards.map((s) => (
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
              ));
            })()}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Event Timeline</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {filtered.map((evt, i) => {
              const cfg = eventCfg[evt.event];
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
                      <Typography variant="body2" fontWeight={700}>{evt.user}</Typography>
                      <Typography variant="caption" color="text.secondary">· {evt.org}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>{evt.details}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: cfg.bg, color: cfg.color }} />
                      <Chip label={evt.plan} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 500, borderColor: 'divider' }} />
                      <Typography variant="caption" color="text.disabled">{evt.date}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace', minWidth: 65, textAlign: 'right' }}>{evt.amount}</Typography>
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
