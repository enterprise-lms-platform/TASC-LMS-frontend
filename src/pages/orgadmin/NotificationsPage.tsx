import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Button,
  Chip,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  MarkEmailRead as MarkReadIcon,
  Notifications as NotifIcon,
  CheckCircle as ApprovalIcon,
  Person as RegistrationIcon,
  Settings as SystemIcon,
  EmojiEvents as MilestoneIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgNotifications, useMarkAllNotificationsRead } from '../../hooks/useOrgAdmin';
import type { Notification } from '../../services/notifications.services';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const typeColors: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  approval: { bg: '#dcfce7', color: '#10b981', icon: <ApprovalIcon /> },
  registration: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1', icon: <RegistrationIcon /> },
  system: { bg: '#fff3e0', color: '#f59e0b', icon: <SystemIcon /> },
  milestone: { bg: 'rgba(255,164,36,0.08)', color: '#ffa424', icon: <MilestoneIcon /> },
};

const NotificationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data: notificationsData, isLoading } = useOrgNotifications({ page_size: 20 });
  const markAllRead = useMarkAllNotificationsRead();

  const notifications: Notification[] = useMemo(() => {
    const results = notificationsData?.results ?? [];
    if (filter === 'unread') {
      return results.filter((n) => !n.is_read);
    }
    return results;
  }, [notificationsData, filter]);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minutes ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Notifications" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Paper elevation={0} sx={cardSx}>
            <Box
              sx={{
                p: 2,
                px: 3,
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <ToggleButtonGroup
                value={filter}
                exclusive
                onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    px: 2,
                  },
                }}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="unread">Unread</ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="outlined"
                startIcon={<MarkReadIcon />}
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
              >
                Mark all as read
              </Button>
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, p: 1 }}>
                    <Skeleton variant="rounded" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" />
                      <Skeleton width="30%" />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : notifications.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <NotifIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1" fontWeight={600} color="text.secondary">
                  You're all caught up!
                </Typography>
              </Box>
            ) : (
              notifications.map((notif, i) => {
                const colors = typeColors[notif.type] || typeColors.system;
                return (
                  <Box
                    key={notif.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      px: 3,
                      borderBottom: i < notifications.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      bgcolor: notif.is_read ? 'transparent' : 'rgba(255,164,36,0.02)',
                      '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: colors.bg,
                        color: colors.color,
                        flexShrink: 0,
                      }}
                    >
                      {colors.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={notif.is_read ? 500 : 600} sx={{ mb: 0.25 }}>
                        {notif.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notif.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {!notif.is_read && (
                        <Chip label="New" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'primary.main', color: 'white' }} />
                      )}
                      <Typography variant="caption" color="text.disabled">
                        {formatTime(notif.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationsPage;