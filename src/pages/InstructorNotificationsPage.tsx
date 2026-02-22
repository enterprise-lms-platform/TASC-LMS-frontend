import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Button,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  School as CourseIcon,
  Chat as MessageIcon,
  Star as GradeIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
  DoneAll as MarkAllIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface Notification {
  id: string;
  type: 'submission' | 'enrollment' | 'message' | 'grade' | 'course';
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
  initials: string;
}

const sampleNotifications: Notification[] = [
  { id: '1', type: 'submission', title: 'New Assignment Submission', description: 'Sarah Chen submitted "React Hooks Library" for Advanced React Patterns', time: '5 min ago', read: false, initials: 'SC' },
  { id: '2', type: 'enrollment', title: 'New Enrollment', description: 'James Wilson enrolled in TypeScript Mastery', time: '15 min ago', read: false, initials: 'JW' },
  { id: '3', type: 'message', title: 'New Message', description: 'Maria Garcia asked a question in Module 3 discussion', time: '1 hour ago', read: false, initials: 'MG' },
  { id: '4', type: 'grade', title: 'Grade Review Request', description: 'Alex Kim requested a grade review for Quiz 2', time: '2 hours ago', read: false, initials: 'AK' },
  { id: '5', type: 'submission', title: 'Late Submission', description: 'Priya Patel submitted "State Management" 2 days late', time: '3 hours ago', read: false, initials: 'PP' },
  { id: '6', type: 'course', title: 'Course Milestone', description: 'Advanced React Patterns reached 450 enrollments!', time: '5 hours ago', read: true, initials: 'AR' },
  { id: '7', type: 'enrollment', title: 'Bulk Enrollment', description: '12 new learners enrolled via organization invite', time: '1 day ago', read: true, initials: '12' },
  { id: '8', type: 'message', title: 'Discussion Reply', description: 'Tom Brown replied to your post in "Custom Hooks"', time: '1 day ago', read: true, initials: 'TB' },
  { id: '9', type: 'submission', title: 'Quiz Completed', description: 'Lisa Wang completed Quiz 3 with a score of 95%', time: '2 days ago', read: true, initials: 'LW' },
  { id: '10', type: 'grade', title: 'Grading Reminder', description: '8 submissions are pending grading for Module 4', time: '2 days ago', read: true, initials: 'GR' },
];

const typeIcons: Record<string, React.ReactNode> = {
  submission: <AssignmentIcon sx={{ fontSize: 18 }} />,
  enrollment: <PeopleIcon sx={{ fontSize: 18 }} />,
  message: <MessageIcon sx={{ fontSize: 18 }} />,
  grade: <GradeIcon sx={{ fontSize: 18 }} />,
  course: <CourseIcon sx={{ fontSize: 18 }} />,
};

const typeColors: Record<string, string> = {
  submission: '#3b82f6',
  enrollment: '#10b981',
  message: '#8b5cf6',
  grade: '#f59e0b',
  course: '#ef4444',
};

const InstructorNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState(sampleNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = tab === 0
    ? notifications
    : tab === 1
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.read);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon sx={{ color: 'primary.main' }} />
              Notifications
              {unreadCount > 0 && (
                <Chip size="small" label={unreadCount} sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'error.main', color: 'white' }} />
              )}
            </Typography>
          </Box>
          <Button startIcon={<MarkAllIcon />} onClick={markAllRead} sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}>
            Mark all read
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
            }}
          >
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label={`All (${notifications.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Unread (${unreadCount})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Read" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">No notifications</Typography>
              </Box>
            ) : (
              filteredNotifications.map((notif, i) => (
                <Box key={notif.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      px: 3,
                      cursor: 'pointer',
                      bgcolor: notif.read ? 'transparent' : 'rgba(255,164,36,0.04)',
                      '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' },
                      transition: 'background 0.2s',
                    }}
                    onClick={() => toggleRead(notif.id)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Avatar sx={{ width: 40, height: 40, fontSize: '0.8rem', bgcolor: `${typeColors[notif.type]}20`, color: typeColors[notif.type] }}>
                        {notif.initials}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 1,
                          borderColor: 'divider',
                        }}
                      >
                        {typeIcons[notif.type]}
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="body2" fontWeight={notif.read ? 500 : 700} noWrap>
                          {notif.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notif.description}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">{notif.time}</Typography>
                    </Box>
                    <IconButton size="small" sx={{ mt: 0.5 }}>
                      {notif.read ? <ReadIcon sx={{ fontSize: 18, color: 'text.disabled' }} /> : <UnreadIcon sx={{ fontSize: 10, color: 'primary.main' }} />}
                    </IconButton>
                  </Box>
                  {i < filteredNotifications.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorNotificationsPage;
