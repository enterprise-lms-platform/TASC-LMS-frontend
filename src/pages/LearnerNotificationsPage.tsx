import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip, Avatar,
  IconButton, Tabs, Tab, Button, Switch, FormControlLabel,
} from '@mui/material';
import {
  Notifications as NotifIcon, School as CourseIcon, Payment as PaymentIcon,
  EmojiEvents as AwardIcon, Campaign as AnnouncementIcon,
  MarkEmailRead as ReadIcon, Delete as DeleteIcon,
  NotificationsActive as ActiveIcon, NotificationsOff as MuteIcon,
  Circle as DotIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data ── */

const kpis = [
  { 
    label: 'Unread', 
    value: '5', 
    icon: <NotifIcon />, 
    // Soft Rose Theme
    bgcolor: '#fce4ec',
    iconBg: '#f06292',
    color: '#ad1457',
    subColor: '#880e4f',
  },
  { 
    label: 'Course Updates', 
    value: '12', 
    icon: <CourseIcon />, 
    // Mint Green Theme
    bgcolor: '#e8f5e9',
    iconBg: '#81c784',
    color: '#2e7d32',
    subColor: '#1b5e20',
  },
  { 
    label: 'Achievements', 
    value: '3', 
    icon: <AwardIcon />, 
    // Light Amber Theme
    bgcolor: '#fff8e1',
    iconBg: '#ffd54f',
    color: '#f57f17',
    subColor: '#ff6f00',
  },
  { 
    label: 'Announcements', 
    value: '2', 
    icon: <AnnouncementIcon />, 
    // Soft Blue Theme
    bgcolor: '#e3f2fd',
    iconBg: '#64b5f6',
    color: '#1565c0',
    subColor: '#0d47a1',
  },
];

type NotifType = 'course' | 'achievement' | 'payment' | 'announcement';
const typeConfig: Record<NotifType, { color: string; icon: React.ReactElement }> = {
  course:       { color: '#3b82f6', icon: <CourseIcon sx={{ fontSize: 20 }} /> },
  achievement:  { color: '#f59e0b', icon: <AwardIcon sx={{ fontSize: 20 }} /> },
  payment:      { color: '#10b981', icon: <PaymentIcon sx={{ fontSize: 20 }} /> },
  announcement: { color: '#8b5cf6', icon: <AnnouncementIcon sx={{ fontSize: 20 }} /> },
};

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'course', title: 'New lesson available', description: 'Module 9: "Advanced Hooks" has been published in Advanced React Patterns', time: '10 minutes ago', read: false },
  { id: '2', type: 'achievement', title: 'Badge earned!', description: 'You earned the "Quick Learner" badge for completing 3 lessons in one day', time: '2 hours ago', read: false },
  { id: '3', type: 'course', title: 'Quiz reminder', description: 'You have a pending quiz in Data Science Fundamentals — due tomorrow', time: '5 hours ago', read: false },
  { id: '4', type: 'announcement', title: 'Platform maintenance', description: 'Scheduled maintenance on Saturday, Feb 22 from 2:00 AM to 4:00 AM EAT', time: '1 day ago', read: false },
  { id: '5', type: 'payment', title: 'Payment confirmed', description: 'Your subscription payment of $29.99 for Pro Learner plan was successful', time: '2 days ago', read: false },
  { id: '6', type: 'course', title: 'Certificate ready', description: 'Your certificate for "JavaScript Fundamentals" is ready to download', time: '3 days ago', read: true },
  { id: '7', type: 'course', title: 'Instructor feedback', description: 'Michael Rodriguez left feedback on your React Patterns assignment', time: '4 days ago', read: true },
  { id: '8', type: 'announcement', title: 'New feature: Study Groups', description: 'Collaborate with peers in our new Study Groups feature — now available!', time: '5 days ago', read: true },
  { id: '9', type: 'achievement', title: 'Streak milestone!', description: 'You maintained a 7-day learning streak. Keep it up!', time: '1 week ago', read: true },
  { id: '10', type: 'course', title: 'Course updated', description: 'Cybersecurity Essentials has been updated with 2 new modules', time: '1 week ago', read: true },
];

/* ── Component ── */

const LearnerNotificationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState(initialNotifications);

  const tabLabels = ['All', 'Unread', 'Course', 'Achievements', 'Payments', 'Announcements'];
  const typeFilterMap: Record<number, NotifType | null> = { 0: null, 1: null, 2: 'course', 3: 'achievement', 4: 'payment', 5: 'announcement' };

  const filtered = notifications.filter((n) => {
    if (activeTab === 1) return !n.read;
    const typeFilter = typeFilterMap[activeTab];
    return typeFilter ? n.type === typeFilter : true;
  });

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifications.filter((n) => !n.read).length;

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
              onClick={markAllRead}
              disabled={unreadCount === 0}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', borderRadius: '50px', color: 'primary.dark' }}
            >
              Mark All Read
            </Button>
          </Box>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: 160,
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
                    fontSize: { xs: '2rem', md: '2.5rem' },
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
            {filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <MuteIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No notifications</Typography>
              </Box>
            ) : (
              filtered.map((notif) => {
                const config = typeConfig[notif.type];
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
                      bgcolor: notif.read ? 'transparent' : 'rgba(255,164,36,0.03)',
                      transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' },
                    }}
                    onClick={() => markAsRead(notif.id)}
                  >
                    {/* Unread dot */}
                    <Box sx={{ width: 8, pt: 1.2, flexShrink: 0 }}>
                      {!notif.read && <DotIcon sx={{ fontSize: 8, color: 'primary.main' }} />}
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
                      <Typography sx={{ fontWeight: notif.read ? 500 : 600, fontSize: '0.85rem', mb: 0.25 }}>
                        {notif.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ fontSize: '0.78rem', mb: 0.5, lineHeight: 1.4 }}>
                        {notif.description}
                      </Typography>
                      <Typography color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                        {notif.time}
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
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                        sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
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
