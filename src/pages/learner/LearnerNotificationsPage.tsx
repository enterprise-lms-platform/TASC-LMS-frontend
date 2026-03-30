import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip, Avatar,
  Tabs, Tab, Button, Switch, FormControlLabel, CircularProgress,
} from '@mui/material';
import {
  Notifications as NotifIcon, 
  EmojiEvents as AwardIcon, Campaign as AnnouncementIcon,
  MarkEmailRead as ReadIcon, 
  NotificationsActive as ActiveIcon, NotificationsOff as MuteIcon,
  Circle as DotIcon, AdminPanelSettings as ApprovalIcon,
  PersonAdd as RegistrationIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../services/notifications.services';
import type { Notification } from '../../services/notifications.services';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';

/* ── Type config mapped to backend notification types ── */

type NotifType = Notification['type'];

const typeConfig: Record<NotifType, { color: string; icon: React.ReactElement }> = {
  approval:     { color: '#3b82f6', icon: <ApprovalIcon sx={{ fontSize: 20 }} /> },
  registration: { color: '#10b981', icon: <RegistrationIcon sx={{ fontSize: 20 }} /> },
  system:       { color: '#8b5cf6', icon: <AnnouncementIcon sx={{ fontSize: 20 }} /> },
  milestone:    { color: '#f59e0b', icon: <AwardIcon sx={{ fontSize: 20 }} /> },
};

/* ── Helpers ── */

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
};

/* ── Component ── */

const LearnerNotificationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAll().then((r) => r.data.results ?? []),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const tabLabels = ['All', 'Unread', 'Approval', 'Registration', 'System', 'Milestone'];
  const typeFilterMap: Record<number, NotifType | null> = { 0: null, 1: null, 2: 'approval', 3: 'registration', 4: 'system', 5: 'milestone' };

  const filtered = notifications.filter((n) => {
    if (activeTab === 1) return !n.is_read;
    const typeFilter = typeFilterMap[activeTab];
    return typeFilter ? n.type === typeFilter : true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  /* ── KPIs computed from real data ── */
  const kpis = [
    {
      label: 'Unread',
      value: String(unreadCount),
      icon: <NotifIcon />,
      bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534',
    },
    {
      label: 'Approvals',
      value: String(notifications.filter((n) => n.type === 'approval').length),
      icon: <ApprovalIcon />,
      bgcolor: '#dbeafe', iconBg: '#93c5fd', color: '#1e3a8a', subColor: '#1e40af',
    },
    {
      label: 'Milestones',
      value: String(notifications.filter((n) => n.type === 'milestone').length),
      icon: <AwardIcon />,
      bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412',
    },
    {
      label: 'System',
      value: String(notifications.filter((n) => n.type === 'system').length),
      icon: <AnnouncementIcon />,
      bgcolor: '#f3e8ff', iconBg: '#d8b4fe', color: '#581c87', subColor: '#6b21a8',
    },
  ];

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
              Notifications
            </Typography>
            <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>
              Stay updated with your courses, achievements, and announcements
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<ReadIcon />}
              onClick={() => markAllReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', borderRadius: '50px', color: 'primary.dark' }}
            >
              Mark All Read
            </Button>
          </Box>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: { xs: 110, md: 160 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Icon Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: k.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {k.icon}
                </Box>

                {/* Main Stat */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: k.color,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {k.value}
                </Typography>

                {/* Label */}
                <Typography
                  variant="body2"
                  sx={{
                    color: k.subColor,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    opacity: 0.8,
                  }}
                >
                  {k.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Notifications Panel */}
        <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          {/* Tabs */}
          <Box sx={{ px: 3, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 1.5 },
                '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 },
              }}
            >
              {tabLabels.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
            <FormControlLabel
              control={<Switch size="small" defaultChecked />}
              label={<Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Push notifications</Typography>}
              sx={{ m: 0 }}
            />
          </Box>

          {/* Notification List */}
          <Box sx={{ px: 1, py: 1 }}>
            {isLoading ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress size={32} sx={{ color: '#ffa424' }} />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <MuteIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No notifications</Typography>
              </Box>
            ) : (
              filtered.map((notif) => {
                const config = typeConfig[notif.type] || typeConfig.system;
                return (
                  <Box
                    key={notif.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      mx: 1,
                      mb: 0.5,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      bgcolor: notif.is_read ? 'transparent' : 'rgba(255,164,36,0.03)',
                      transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' },
                    }}
                    onClick={() => {
                      if (!notif.is_read) markAsReadMutation.mutate(notif.id);
                    }}
                  >
                    {/* Unread dot */}
                    <Box sx={{ width: 8, pt: 1.2, flexShrink: 0 }}>
                      {!notif.is_read && <DotIcon sx={{ fontSize: 8, color: 'primary.main' }} />}
                    </Box>

                    {/* Icon */}
                    <Avatar
                      sx={{
                        bgcolor: `${config.color}14`,
                        color: config.color,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        flexShrink: 0,
                      }}
                    >
                      {config.icon}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: notif.is_read ? 500 : 600, fontSize: '0.85rem', mb: 0.25 }}>
                        {notif.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: '0.78rem', mb: 0.5, lineHeight: 1.4 }}>
                        {notif.description}
                      </Typography>
                      <Typography color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                        {formatTime(notif.created_at)}
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                      <Chip
                        label={notif.type}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.62rem',
                          fontWeight: 600,
                          borderRadius: '50px',
                          bgcolor: `${config.color}14`,
                          color: config.color,
                          textTransform: 'capitalize',
                        }}
                      />
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography color="text.disabled" sx={{ fontSize: '0.78rem' }}>
              {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` · ${unreadCount} unread`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ActiveIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography color="primary.dark" sx={{ fontSize: '0.78rem', fontWeight: 600 }}>
                Notifications enabled
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LearnerNotificationsPage;
