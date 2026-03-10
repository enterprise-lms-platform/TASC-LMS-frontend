import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as ApprovalIcon,
  PersonAdd as NewUserIcon,
  Warning as SystemAlertIcon,
  School as MilestoneIcon,
  DoneAll as MarkReadIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

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
type NotificationType = 'Approval' | 'Registration' | 'System' | 'Milestone';

const typeConfig: Record<NotificationType, { icon: React.ReactNode; bg: string; color: string }> = {
  Approval: { icon: <ApprovalIcon />, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  Registration: { icon: <NewUserIcon />, bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  System: { icon: <SystemAlertIcon />, bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  Milestone: { icon: <MilestoneIcon />, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
};

// ── Mock Notifications ──
interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'Approval', title: 'Course Approval Request', description: 'James Rodriguez submitted "Advanced Kubernetes Networking" for review and publishing approval.', timestamp: '5 minutes ago', read: false },
  { id: 2, type: 'Registration', title: 'New User Registration', description: 'Rachel Green (rachel.green@acmecorp.com) has registered and is awaiting role assignment.', timestamp: '18 minutes ago', read: false },
  { id: 3, type: 'System', title: 'Storage Limit Warning', description: 'Organization storage usage has reached 85% of the allocated 500GB quota. Consider upgrading your plan.', timestamp: '1 hour ago', read: false },
  { id: 4, type: 'Milestone', title: 'Enrollment Milestone Reached', description: 'The course "Python for Data Science" has surpassed 400 total enrollments across the organization.', timestamp: '2 hours ago', read: false },
  { id: 5, type: 'Approval', title: 'Course Approval Request', description: 'Priya Sharma submitted "DevSecOps Fundamentals" for review and publishing approval.', timestamp: '3 hours ago', read: true },
  { id: 6, type: 'Registration', title: 'Bulk Registration Complete', description: '42 new users from the engineering_team_q1.csv import have been successfully created and notified.', timestamp: '5 hours ago', read: true },
  { id: 7, type: 'System', title: 'Scheduled Maintenance', description: 'Platform maintenance is scheduled for March 15, 2026, from 2:00 AM to 4:00 AM UTC. Expect brief downtime.', timestamp: '8 hours ago', read: true },
  { id: 8, type: 'Milestone', title: 'Completion Milestone', description: 'Over 1,000 course completions have been recorded this quarter, a 24% increase from last quarter.', timestamp: '1 day ago', read: true },
  { id: 9, type: 'Approval', title: 'Course Update Review', description: 'Emily Chen updated the curriculum for "React Performance Optimization" and submitted changes for approval.', timestamp: '1 day ago', read: true },
  { id: 10, type: 'Registration', title: 'New User Registration', description: 'Carlos Mendez (carlos.mendez@acmecorp.com) has registered via SSO and was auto-assigned the Learner role.', timestamp: '2 days ago', read: true },
];

const ManagerNotificationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<string>('All');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.read;
    if (filter === 'Approvals') return n.type === 'Approval';
    if (filter === 'System') return n.type === 'System';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filterOptions = [
    { label: 'All', count: notifications.length },
    { label: 'Unread', count: unreadCount },
    { label: 'Approvals', count: notifications.filter((n) => n.type === 'Approval').length },
    { label: 'System', count: notifications.filter((n) => n.type === 'System').length },
  ];

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

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
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
              {filteredNotifications.map((notification, idx) => {
                const config = typeConfig[notification.type];
                return (
                  <Box key={notification.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2.5,
                        px: 3,
                        bgcolor: notification.read ? 'transparent' : 'rgba(255,164,36,0.03)',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.05)' },
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      {/* Unread Indicator */}
                      {!notification.read && (
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
                          <Typography variant="body2" fontWeight={notification.read ? 500 : 700}>
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
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
                          {notification.timestamp}
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
