import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, IconButton, Button, Switch, FormControlLabel,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  NotificationsActive as BellIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  time: string;
  read: boolean;
}

const alertsData: Alert[] = [
  { id: '1', title: 'Payment Gateway Down', message: 'M-Pesa gateway is experiencing intermittent failures. Transaction success rate dropped to 62%.', severity: 'critical', time: '5 min ago', read: false },
  { id: '2', title: 'Revenue Target Exceeded', message: 'Monthly revenue has exceeded the $200K target by 8%. Current: $216,400.', severity: 'success', time: '1 hour ago', read: false },
  { id: '3', title: 'High Churn Rate Detected', message: 'Subscription churn rate increased to 4.2% this week, above the 3% threshold.', severity: 'warning', time: '3 hours ago', read: false },
  { id: '4', title: 'Pending Reconciliation', message: '14 transactions from MTN MoMo require manual reconciliation. Total: $3,842.', severity: 'warning', time: '5 hours ago', read: true },
  { id: '5', title: 'Invoice Overdue', message: 'Invoice INV-2400 for Startup Hub ($1,890) is 3 days overdue. Automatic reminder sent.', severity: 'warning', time: '8 hours ago', read: true },
  { id: '6', title: 'System Maintenance Scheduled', message: 'Payment processing will be briefly paused on Feb 28 from 2:00-3:00 AM EAT for database maintenance.', severity: 'info', time: '1 day ago', read: true },
  { id: '7', title: 'New Card Processor Added', message: 'Visa Direct integration has been enabled. Payouts now support instant card transfers.', severity: 'info', time: '2 days ago', read: true },
  { id: '8', title: 'Quarterly Report Ready', message: 'Q4 2025 financial statements have been generated and are ready for download.', severity: 'success', time: '3 days ago', read: true },
];

const severityConfig: Record<AlertSeverity, { icon: React.ReactNode; color: string; bg: string }> = {
  critical: { icon: <ErrorIcon sx={{ fontSize: 20 }} />, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  warning: { icon: <WarningIcon sx={{ fontSize: 20 }} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  info: { icon: <InfoIcon sx={{ fontSize: 20 }} />, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  success: { icon: <SuccessIcon sx={{ fontSize: 20 }} />, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

const FinanceAlertsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = showUnreadOnly ? alertsData.filter((a) => !a.read) : alertsData;
  const unreadCount = alertsData.filter((a) => !a.read).length;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BellIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Alerts & Notifications</Typography>
                <Typography variant="body2" color="text.secondary">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={<Switch size="small" checked={showUnreadOnly} onChange={(e) => setShowUnreadOnly(e.target.checked)} />}
                label={<Typography variant="body2">Unread only</Typography>}
              />
              <Button size="small" variant="outlined" startIcon={<MarkReadIcon />}
                sx={{ textTransform: 'none', fontSize: '0.8rem', borderColor: 'divider', color: 'text.secondary' }}>
                Mark all read
              </Button>
            </Box>
          </Box>

          {/* Severity Summary */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {(['critical', 'warning', 'info', 'success'] as AlertSeverity[]).map((sev) => {
              const count = alertsData.filter((a) => a.severity === sev).length;
              const cfg = severityConfig[sev];
              return (
                <Paper key={sev} elevation={0} sx={{
                  ...cardSx, display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 2.5, flex: '1 1 auto', minWidth: 160,
                }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cfg.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>{count}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{sev}</Typography>
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {/* Alerts List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>All Alerts</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} alert{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {filtered.map((alert, i) => {
              const cfg = severityConfig[alert.severity];
              return (
                <Box key={alert.id} sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, px: 3,
                  borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                  bgcolor: alert.read ? 'transparent' : 'rgba(255,164,36,0.02)',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                    {cfg.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography variant="body2" fontWeight={alert.read ? 500 : 700} noWrap>{alert.title}</Typography>
                      {!alert.read && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>{alert.message}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={alert.severity} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: cfg.bg, color: cfg.color, textTransform: 'capitalize' }} />
                      <Typography variant="caption" color="text.disabled">{alert.time}</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceAlertsPage;
