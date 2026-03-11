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
  CircularProgress,
  Snackbar,
  Alert,
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
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { useLivestreamSessions, useLivestreamAction } from '../../hooks/useLivestream';
import type { LivestreamSession } from '../../services/livestream.services';

const platformColors: Record<string, { bg: string; color: string }> = {
  zoom: { bg: '#dbeafe', color: '#2563eb' },
  teams: { bg: '#ede9fe', color: '#7c3aed' },
  google_meet: { bg: '#d1fae5', color: '#059669' },
  custom: { bg: '#fef3c7', color: '#d97706' },
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  scheduled: { bg: '#dbeafe', color: '#2563eb' },
  live: { bg: '#fee2e2', color: '#dc2626' },
  ended: { bg: '#d1fae5', color: '#059669' },
  cancelled: { bg: '#e5e7eb', color: '#6b7280' },
};

const UpcomingSessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useLivestreamSessions();
  const actionMutation = useLivestreamAction();

  const sessions: LivestreamSession[] = data?.results ?? [];

  const filtered = tab === 0
    ? sessions.filter((s) => s.status === 'scheduled')
    : tab === 1
    ? sessions.filter((s) => s.status === 'live')
    : sessions.filter((s) => s.status === 'ended');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleStart = (session: LivestreamSession) => {
    actionMutation.mutate(
      { id: session.id, data: { action: 'start' } },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Session started!', severity: 'success' });
          if (session.start_url) {
            window.open(session.start_url, '_blank');
          }
        },
        onError: () => setSnackbar({ open: true, message: 'Failed to start session', severity: 'error' }),
      }
    );
  };

  const handleCopyLink = (session: LivestreamSession) => {
    const url = session.join_url || session.start_url;
    if (url) {
      navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: 'Link copied to clipboard!', severity: 'success' });
    }
  };

  const platformLabel = (p: string) => {
    const map: Record<string, string> = { zoom: 'Zoom', google_meet: 'Meet', teams: 'Teams', custom: 'Custom' };
    return map[p] || p;
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
              <Tab label={`Upcoming (${sessions.filter((s) => s.status === 'scheduled').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Live (${sessions.filter((s) => s.status === 'live').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Past (${sessions.filter((s) => s.status === 'ended').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            {isLoading ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <CircularProgress size={36} />
                <Typography color="text.secondary" sx={{ mt: 2 }}>Loading sessions...</Typography>
              </Box>
            ) : filtered.length === 0 ? (
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
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{formatDate(session.start_time).split(' ')[0]}</Typography>
                      <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1}>{formatDate(session.start_time).split(' ')[2]}</Typography>
                      <Typography variant="caption" color="text.secondary">{formatDate(session.start_time).split(' ')[1]}</Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" fontWeight={700} noWrap>{session.title}</Typography>
                        <Chip label={session.status} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: (statusStyles[session.status] || statusStyles.scheduled).bg, color: (statusStyles[session.status] || statusStyles.scheduled).color }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{session.course_title || `Course #${session.course}`}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 14 }} /> {formatTime(session.start_time)} ({session.duration_minutes}min)
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14 }} /> {session.max_attendees}
                        </Box>
                        <Chip label={platformLabel(session.platform)} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: (platformColors[session.platform] || platformColors.custom).bg, color: (platformColors[session.platform] || platformColors.custom).color }} />
                      </Box>
                    </Box>

                    {session.status === 'scheduled' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" startIcon={<CopyLinkIcon sx={{ fontSize: 16 }} />} onClick={() => handleCopyLink(session)} sx={{ textTransform: 'none', fontSize: '0.8rem', color: 'text.secondary' }}>
                          Copy Link
                        </Button>
                        <Button size="small" startIcon={<EditIcon sx={{ fontSize: 16 }} />} onClick={() => navigate(`/instructor/sessions/schedule?edit=${session.id}`)} sx={{ textTransform: 'none', fontSize: '0.8rem', color: 'text.secondary' }}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<StartIcon sx={{ fontSize: 16 }} />}
                          onClick={() => handleStart(session)}
                          disabled={actionMutation.isPending}
                          sx={{ textTransform: 'none', fontSize: '0.8rem', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                        >
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

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UpcomingSessionsPage;
