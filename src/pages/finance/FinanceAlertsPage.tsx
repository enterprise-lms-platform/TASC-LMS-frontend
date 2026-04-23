import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, Button, Grid, LinearProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  NotificationsActive as BellIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useFinanceAlerts } from '../../hooks/usePayments';
import type { FinanceAlertItem } from '../../services/payments.services';

const severityConfig: Record<'critical' | 'warning' | 'info' | 'success', { icon: React.ReactNode; color: string; bg: string }> = {
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
  const navigate = useNavigate();
  const { data, isLoading } = useFinanceAlerts();
  const alertsData: FinanceAlertItem[] = data?.alerts ?? [];

  const formatTime = (value: string) => new Date(value).toLocaleString();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <BellIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Alerts & Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.summary.total ?? 0} active finance alert{(data?.summary.total ?? 0) !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </Box>

          {isLoading && <LinearProgress sx={{ mb: 2 }} />}

          {/* Severity Summary — matches Overview stat cards */}
          {(() => {
            const sevCards: { sev: 'critical' | 'warning' | 'info' | 'success'; bgcolor: string; iconBg: string; color: string; subColor: string }[] = [
              { sev: 'critical', bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
              { sev: 'warning', bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { sev: 'info', bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { sev: 'success', bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
            ];
            return (
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {sevCards.map((card) => {
                  const count = data?.summary?.[card.sev] ?? 0;
                  const cfg = severityConfig[card.sev];
                  return (
                    <Grid size={{ xs: 6, sm: 6, md: 3 }} key={card.sev}>
                      <Paper elevation={0} sx={{
                        bgcolor: card.bgcolor, borderRadius: '20px', p: 3,
                        position: 'relative', minHeight: { xs: 110, md: 160 }, display: 'flex',
                        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
                        '&:hover': { transform: 'translateY(-4px)' },
                      }}>
                        <Box sx={{
                          position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                          borderRadius: '50%', bgcolor: card.iconBg, display: 'flex',
                          alignItems: 'center', justifyContent: 'center', color: 'white',
                          '& svg': { fontSize: 20 },
                        }}>{cfg.icon}</Box>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: card.color, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{count}</Typography>
                        <Typography variant="body2" sx={{ color: card.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8, textTransform: 'capitalize' }}>{card.sev}</Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })()}

          {/* Alerts List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>All Alerts</Typography>
              <Typography variant="caption" color="text.secondary">{alertsData.length} alert{alertsData.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {alertsData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                <BellIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                <Typography variant="body2">No finance alerts at the moment.</Typography>
                <Typography variant="caption">This feed shows only real aggregate alerts from payments, invoices, and subscriptions.</Typography>
              </Box>
            ) : alertsData.map((alert, i) => {
              const cfg = severityConfig[alert.severity];
              return (
                <Box key={alert.id} sx={{
                  display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, px: 3,
                  borderBottom: i < alertsData.length - 1 ? 1 : 0, borderColor: 'divider',
                  bgcolor: 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
                    {cfg.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography variant="body2" fontWeight={700} noWrap>{alert.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>{alert.message}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={alert.severity} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: cfg.bg, color: cfg.color, textTransform: 'capitalize' }} />
                      <Typography variant="caption" color="text.disabled">{formatTime(alert.created_at)}</Typography>
                    </Box>
                  </Box>
                  {alert.action?.route && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(alert.action?.route || '/finance')}
                      sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                    >
                      {alert.action.label}
                    </Button>
                  )}
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
