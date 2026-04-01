import React, { useState, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { sessionApi } from '../../services/main.api';

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

const getKpiConfig = (label: string) => {
  switch (label) {
    case 'Total Sessions': return { icon: <VideocamIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' };
    case 'This Week': return { icon: <CalendarIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' };
    case 'Avg Attendance': return { icon: <TrendingIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' };
    case 'Total Hours': return { icon: <ScheduleIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' };
    default: return { icon: <VideocamIcon />, bgcolor: '#f5f5f5', iconBg: '#666', color: '#666', subColor: '#888' };
  }
};

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

interface Session{
  start_date?: string;
  end_date?: string;
  created_at: string;
  instructor?: {
    name?: string;
    email?: string;
  };
  duration_minutes?: number;
  session_type?: string;
  title: string;
}
const ManagerSessionsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [instructorFilter, setInstructorFilter] = useState('All Instructors');

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions', 'manager'],
    queryFn: () => sessionApi.getAll({ page_size: 100 }).then(r => r.data),
  });

  const sessions = useMemo(() => sessionsData?.results ?? [], [sessionsData]);

  const getSessionDisplayStatus = (session: Session): 'Upcoming' | 'In Progress' | 'Completed' => {
    const now = new Date();
    const start = new Date(session.start_date || session.created_at);
    const end = session.end_date ? new Date(session.end_date) : null;
    if (end && end < now) return 'Completed';
    if (start > now) return 'Upcoming';
    return 'In Progress';
  };

  const getInstructorName = (session: Session): string => {
    return session.instructor?.name || session.instructor?.email || 'Unknown';
  };

  const getInitials = (name: string): string => {
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatSessionDate = (session: Session): string => {
    const date = session.start_date || session.created_at;
    return date ? new Date(date).toLocaleDateString() : '-';
  };

  const formatSessionTime = (session: Session): string => {
    const date = session.start_date || session.created_at;
    return date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
  };

  const filteredSessions = useMemo(() => {
    if (!sessions.length) return [];
    return sessions.filter((session: Session) => {
      const status = getSessionDisplayStatus(session);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      const matchesInstructor = instructorFilter === 'All Instructors' || (session.instructor?.name || '').includes(instructorFilter.replace('All Instructors', ''));
      return matchesStatus && matchesInstructor;
    });
  }, [sessions, statusFilter, instructorFilter]);

  const kpis = useMemo(() => {
    if (!sessions.length) return [];
    const now = new Date();
    const thisWeek = sessions.filter((s: Session) => {
      const start = new Date(s.start_date || s.created_at);
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return start >= now && start <= weekFromNow;
    }).length;
    const totalHours = sessions.reduce((acc: number, s: Session) => acc + (s.duration_minutes || 0), 0);
    return [
      { label: 'Total Sessions', value: sessions.length.toString(), ...getKpiConfig('Total Sessions') },
      { label: 'This Week', value: thisWeek.toString(), ...getKpiConfig('This Week') },
      { label: 'Avg Attendance', value: '82%', ...getKpiConfig('Avg Attendance') },
      { label: 'Total Hours', value: totalHours.toString(), ...getKpiConfig('Total Hours') },
    ];
  }, [sessions]);

  const instructorList = useMemo(() => {
    if (!sessions.length) return ['All Instructors'];
    const uniqueInstructors = new Set<string>(sessions.map((s: Session) => s.instructor?.name || s.instructor?.email || 'Unknown').filter((n: string) => Boolean(n)));
    return ['All Instructors', ...Array.from(uniqueInstructors)];
  }, [sessions]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

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
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
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
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
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
                    {instructorList.map((name: string) => (
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
              const displayStatus = getSessionDisplayStatus(session);
              const statusColors = getStatusColor(displayStatus);
              const instructorName = getInstructorName(session);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
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
                        background: displayStatus === 'In Progress'
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
                          label={displayStatus}
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
                          {getInitials(instructorName)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {instructorName}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Card Body */}
                    <Box sx={{ p: 2, px: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatSessionDate(session)}
                        </Typography>
                        <TimeIcon sx={{ fontSize: 18, color: 'text.secondary', ml: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatSessionTime(session)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Duration: {session.duration_minutes} min
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {session.session_type}
                        </Typography>
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
