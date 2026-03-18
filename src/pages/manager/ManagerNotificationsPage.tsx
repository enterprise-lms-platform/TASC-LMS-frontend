import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as ApprovalIcon,
  PersonAdd as NewUserIcon,
  Warning as SystemAlertIcon,
  School as MilestoneIcon,
  DoneAll as MarkReadIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { notificationApi } from '../../services/notifications.services';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};
const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

// ── Notification Type Config ──
const typeConfig: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  approval: { icon: <ApprovalIcon />, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  registration: { icon: <NewUserIcon />, bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  system: { icon: <SystemAlertIcon />, bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  milestone: { icon: <MilestoneIcon />, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
};

const formatType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ManagerNotificationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll({ page_size: 50 }).then(r => r.data),
  });

  const notifications = notificationsData?.results ?? [];

  const unreadCount = useMemo(() => 
    notifications.filter((n: any) => !n.is_read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n: any) => {
      if (filter === 'All') return true;
      if (filter === 'Unread') return !n.is_read;
      if (filter === 'Approvals') return n.type === 'approval';
      if (filter === 'System') return n.type === 'system';
      return true;
    });
  }, [notifications, filter]);

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const filterOptions = useMemo(() => [
    { label: 'All', count: notifications.length },
    { label: 'Unread', count: unreadCount },
    { label: 'Approvals', count: notifications.filter((n: any) => n.type === 'approval').length },
    { label: 'System', count: notifications.filter((n: any) => n.type === 'system').length },
  ], [notifications, unreadCount]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}
          
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <NotificationsIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stay updated on organization activity
                </Typography>
              </Box>
            </Box>

            {unreadCount > 0 && (
              <Button
                startIcon={<MarkReadIcon />}
                onClick={handleMarkAllRead}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#ffa424',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' },
                }}
              >
                Mark All as Read
              </Button>
            )}
          </Box>

          {/* Filter Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {filterOptions.map((opt) => (
              <Chip
                key={opt.label}
                label={`${opt.label} (${opt.count})`}
                onClick={() => setFilter(opt.label)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  bgcolor: filter === opt.label ? 'rgba(255,164,36,0.12)' : 'white',
                  color: filter === opt.label ? '#b45309' : 'text.secondary',
                  border: '1px solid',
                  borderColor: filter === opt.label ? '#ffa424' : 'divider',
                  '&:hover': { bgcolor: filter === opt.label ? 'rgba(255,164,36,0.15)' : 'grey.50' },
                }}
              />
            ))}
          </Box>

          {/* Notification List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>
                {filter === 'All' ? 'All Notifications' : filter === 'Unread' ? 'Unread Notifications' : `${filter} Notifications`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredNotifications.length} notifications
              </Typography>
            </Box>
            <Box>
              {filteredNotifications.map((notification: any, idx: number) => {
                const config = typeConfig[notification.type] || typeConfig.system;
                return (
                  <Box key={notification.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2.5,
                        px: 3,
                        bgcolor: notification.is_read ? 'transparent' : 'rgba(255,164,36,0.03)',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.05)' },
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      {/* Unread Indicator */}
                      {!notification.is_read && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#3b82f6',
                          }}
                        />
                      )}

                      {/* Type Icon */}
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: '10px',
                          bgcolor: config.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: config.color,
                          flexShrink: 0,
                          '& svg': { fontSize: 22 },
                        }}
                      >
                        {config.icon}
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                          <Typography variant="body2" fontWeight={notification.is_read ? 500 : 700}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={formatType(notification.type)}
                            size="small"
                            sx={{
                              height: 20,
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              bgcolor: config.bg,
                              color: config.color,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 0.5 }}>
                          {notification.description}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {formatRelativeTime(notification.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                    {idx < filteredNotifications.length - 1 && <Divider />}
                  </Box>
                );
              })}

              {filteredNotifications.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <NotificationsIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No notifications found
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Adjust your filters to see more notifications
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerNotificationsPage;
