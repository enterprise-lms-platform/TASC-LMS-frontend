import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

// ── Shared styles ──
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

// ── KPI data ──
const kpis = [
  { label: 'Total Sessions', value: '34', icon: <VideocamIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'This Week', value: '8', icon: <CalendarIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
  { label: 'Avg Attendance', value: '82%', icon: <TrendingIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Total Hours', value: '124', icon: <ScheduleIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
];

// ── Mock sessions ──
const mockSessions = [
  {
    id: 1,
    title: 'Advanced React Patterns Workshop',
    instructor: 'Dr. Sarah Chen',
    initials: 'SC',
    date: '2026-03-12',
    time: '10:00 AM',
    duration: '2 hours',
    attendees: 28,
    maxAttendees: 35,
    platform: 'Zoom',
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Python Data Science Masterclass',
    instructor: 'James Wilson',
    initials: 'JW',
    date: '2026-03-11',
    time: '2:00 PM',
    duration: '1.5 hours',
    attendees: 42,
    maxAttendees: 50,
    platform: 'Google Meet',
    status: 'In Progress',
  },
  {
    id: 3,
    title: 'AWS Cloud Architecture Deep Dive',
    instructor: 'Maria Garcia',
    initials: 'MG',
    date: '2026-03-10',
    time: '9:00 AM',
    duration: '2 hours',
    attendees: 31,
    maxAttendees: 40,
    platform: 'Microsoft Teams',
    status: 'Completed',
  },
  {
    id: 4,
    title: 'TypeScript Best Practices',
    instructor: 'Alex Kim',
    initials: 'AK',
    date: '2026-03-13',
    time: '11:00 AM',
    duration: '1 hour',
    attendees: 19,
    maxAttendees: 30,
    platform: 'Zoom',
    status: 'Upcoming',
  },
  {
    id: 5,
    title: 'Docker & Kubernetes Workshop',
    instructor: 'Priya Patel',
    initials: 'PP',
    date: '2026-03-09',
    time: '3:00 PM',
    duration: '2 hours',
    attendees: 36,
    maxAttendees: 40,
    platform: 'Google Meet',
    status: 'Completed',
  },
  {
    id: 6,
    title: 'Cybersecurity Fundamentals',
    instructor: 'David Okonkwo',
    initials: 'DO',
    date: '2026-03-14',
    time: '1:00 PM',
    duration: '1.5 hours',
    attendees: 0,
    maxAttendees: 45,
    platform: 'Microsoft Teams',
    status: 'Upcoming',
  },
];

const instructors = ['All Instructors', 'Dr. Sarah Chen', 'James Wilson', 'Maria Garcia', 'Alex Kim', 'Priya Patel', 'David Okonkwo'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Upcoming':
      return { bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6' };
    case 'In Progress':
      return { bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' };
    case 'Completed':
      return { bgcolor: 'rgba(107,114,128,0.1)', color: '#6b7280' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Zoom':
      return { bgcolor: 'rgba(45,140,255,0.1)', color: '#2d8cff' };
    case 'Google Meet':
      return { bgcolor: 'rgba(52,168,83,0.1)', color: '#34a853' };
    case 'Microsoft Teams':
      return { bgcolor: 'rgba(80,80,186,0.1)', color: '#5050ba' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const ManagerSessionsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [instructorFilter, setInstructorFilter] = useState('All Instructors');

  const filteredSessions = mockSessions.filter((session) => {
    const matchesStatus = statusFilter === 'All' || session.status === statusFilter;
    const matchesInstructor = instructorFilter === 'All Instructors' || session.instructor === instructorFilter;
    return matchesStatus && matchesInstructor;
  });

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
              <VideocamIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Scheduled Sessions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage live sessions
              </Typography>
            </Box>
          </Box>

          {/* KPI Cards */}
          <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, sm: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    height: '100%',
                    minHeight: 130,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      '& svg': { fontSize: 18 },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: kpi.color,
                      fontSize: { xs: '1.8rem', md: '2.2rem' },
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.8rem', opacity: 0.8 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Sessions</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Upcoming">Upcoming</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Instructor</InputLabel>
                  <Select value={instructorFilter} onChange={(e) => setInstructorFilter(e.target.value)} label="Instructor">
                    {instructors.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          {/* Session Cards */}
          <Grid container spacing={3}>
            {filteredSessions.map((session) => {
              const statusColors = getStatusColor(session.status);
              const platformColors = getPlatformColor(session.platform);
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={session.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...cardSx,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    {/* Card Header with gradient */}
                    <Box
                      sx={{
                        p: 2,
                        px: 3,
                        background: session.status === 'In Progress'
                          ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))'
                          : 'linear-gradient(135deg, rgba(255,164,36,0.08), rgba(255,164,36,0.02))',
                        borderBottom: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1, mr: 1 }}>
                          {session.title}
                        </Typography>
                        <Chip
                          label={session.status}
                          size="small"
                          sx={{
                            ...statusColors,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 24,
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: '0.7rem',
                            background: 'linear-gradient(135deg, #ffa424, #f97316)',
                            fontWeight: 600,
                          }}
                        >
                          {session.initials}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {session.instructor}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Card Body */}
                    <Box sx={{ p: 2, px: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {session.date}
                        </Typography>
                        <TimeIcon sx={{ fontSize: 18, color: 'text.secondary', ml: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {session.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Duration: {session.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {session.attendees}/{session.maxAttendees} attendees
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Chip
                          label={session.platform}
                          size="small"
                          sx={{
                            ...platformColors,
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            height: 26,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Card Footer */}
                    <Box sx={{ p: 2, px: 3, borderTop: 1, borderColor: 'divider' }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          borderColor: '#ffa424',
                          color: '#ffa424',
                          fontWeight: 600,
                          borderRadius: '10px',
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#f97316',
                            bgcolor: 'rgba(255,164,36,0.04)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {filteredSessions.length === 0 && (
            <Paper elevation={0} sx={{ ...cardSx, p: 6, textAlign: 'center' }}>
              <VideocamIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                No sessions found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Try adjusting your filters to see more sessions.
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerSessionsPage;
