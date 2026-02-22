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
  Chip,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Videocam as VideoIcon,
  Add as AddIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  PlayArrow as StartIcon,
  Edit as EditIcon,
  ContentCopy as CopyLinkIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface Session {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  platform: 'zoom' | 'teams' | 'meet';
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  meetingLink: string;
}

const sampleSessions: Session[] = [
  { id: '1', title: 'React Hooks Deep Dive', course: 'Advanced React Patterns', date: '2026-02-23', time: '14:00', duration: 60, platform: 'zoom', attendees: 38, maxAttendees: 50, status: 'upcoming', meetingLink: 'https://zoom.us/j/123' },
  { id: '2', title: 'State Management Q&A', course: 'Advanced React Patterns', date: '2026-02-25', time: '10:00', duration: 45, platform: 'teams', attendees: 25, maxAttendees: 40, status: 'upcoming', meetingLink: 'https://teams.live/456' },
  { id: '3', title: 'TypeScript Workshop', course: 'TypeScript Mastery', date: '2026-02-27', time: '15:00', duration: 90, platform: 'meet', attendees: 42, maxAttendees: 50, status: 'upcoming', meetingLink: 'https://meet.google.com/789' },
  { id: '4', title: 'Node.js Live Coding', course: 'Node.js Backend Dev', date: '2026-03-02', time: '11:00', duration: 60, platform: 'zoom', attendees: 18, maxAttendees: 30, status: 'upcoming', meetingLink: 'https://zoom.us/j/456' },
  { id: '5', title: 'GraphQL Best Practices', course: 'GraphQL Fundamentals', date: '2026-03-05', time: '16:00', duration: 75, platform: 'zoom', attendees: 31, maxAttendees: 50, status: 'upcoming', meetingLink: 'https://zoom.us/j/789' },
  { id: '6', title: 'React Hooks Part 1', course: 'Advanced React Patterns', date: '2026-02-20', time: '14:00', duration: 60, platform: 'zoom', attendees: 45, maxAttendees: 50, status: 'completed', meetingLink: '' },
  { id: '7', title: 'Intro to TypeScript', course: 'TypeScript Mastery', date: '2026-02-18', time: '10:00', duration: 45, platform: 'teams', attendees: 32, maxAttendees: 40, status: 'completed', meetingLink: '' },
];

const platformColors: Record<string, { bg: string; color: string }> = {
  zoom: { bg: '#dbeafe', color: '#2563eb' },
  teams: { bg: '#ede9fe', color: '#7c3aed' },
  meet: { bg: '#d1fae5', color: '#059669' },
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  upcoming: { bg: '#dbeafe', color: '#2563eb' },
  live: { bg: '#fee2e2', color: '#dc2626' },
  completed: { bg: '#d1fae5', color: '#059669' },
  cancelled: { bg: '#e5e7eb', color: '#6b7280' },
};

const UpcomingSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const filtered = tab === 0
    ? sampleSessions.filter((s) => s.status === 'upcoming')
    : tab === 1
    ? sampleSessions.filter((s) => s.status === 'live')
    : sampleSessions.filter((s) => s.status === 'completed');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
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
              <CalendarIcon sx={{ color: 'primary.main' }} />
              Live Sessions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/instructor/sessions/schedule')}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}
          >
            Schedule Session
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
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
              <Tab label={`Upcoming (${sampleSessions.filter((s) => s.status === 'upcoming').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Live Now" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Past (${sampleSessions.filter((s) => s.status === 'completed').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            {filtered.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <VideoIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">No sessions found</Typography>
              </Box>
            ) : (
              filtered.map((session, i) => (
                <Box key={session.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, px: 3, '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                    {/* Date badge */}
                    <Box sx={{ textAlign: 'center', minWidth: 60, p: 1, bgcolor: 'grey.50', borderRadius: 1.5, border: 1, borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{formatDate(session.date).split(' ')[0]}</Typography>
                      <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1}>{formatDate(session.date).split(' ')[2]}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDate(session.date).split(' ')[1]}</Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" fontWeight={700} noWrap>{session.title}</Typography>
                        <Chip label={session.status} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: statusStyles[session.status].bg, color: statusStyles[session.status].color }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{session.course}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 14 }} /> {session.time} ({session.duration}min)
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14 }} /> {session.attendees}/{session.maxAttendees}
                        </Box>
                        <Chip label={session.platform} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: platformColors[session.platform].bg, color: platformColors[session.platform].color }} />
                      </Box>
                    </Box>

                    {session.status === 'upcoming' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<CopyLinkIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', fontSize: '0.8rem', color: 'text.secondary' }}>
                          Copy Link
                        </Button>
                        <Button size="small" startIcon={<EditIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', fontSize: '0.8rem', color: 'text.secondary' }}>
                          Edit
                        </Button>
                        <Button size="small" variant="contained" startIcon={<StartIcon sx={{ fontSize: 16 }} />} sx={{ textTransform: 'none', fontSize: '0.8rem', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                          Start
                        </Button>
                      </Box>
                    )}
                  </Box>
                  {i < filtered.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default UpcomingSessionsPage;
