import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  History as RecordingsIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  PlayCircle as PlayIcon,
  Share as ShareIcon,
  CalendarToday as DateIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { useLivestreamSessions } from '../../hooks/useLivestream';
import type { LivestreamSession } from '../../services/livestream.services';

const RecordingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch ended sessions that have recording URLs
  const { data, isLoading } = useLivestreamSessions({ status: 'ended' });
  const allSessions: LivestreamSession[] = data?.results ?? [];
  const recordings = allSessions.filter((s) => s.recording_url);

  const filtered = recordings.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.course_title || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:00` : `${m}:00`;
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
              <RecordingsIcon sx={{ color: 'primary.main' }} />
              Recordings
            </Typography>
            <Typography variant="body2" color="text.secondary">{recordings.length} recordings</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
          {/* Search */}
          <Box sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search recordings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
              sx={{ minWidth: 300, bgcolor: 'white', borderRadius: 1 }}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CircularProgress size={36} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>Loading recordings...</Typography>
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <RecordingsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">No recordings found</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filtered.map((recording) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recording.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'divider',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                    }}
                  >
                    {/* Video thumbnail placeholder */}
                    <Box
                      sx={{
                        height: 160,
                        bgcolor: 'grey.800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                      onClick={() => recording.recording_url && window.open(recording.recording_url, '_blank')}
                    >
                      <PlayIcon sx={{ fontSize: 56, color: 'white', opacity: 0.9, '&:hover': { opacity: 1, transform: 'scale(1.1)' }, transition: 'all 0.2s' }} />
                      <Chip
                        label={formatDuration(recording.duration_minutes)}
                        size="small"
                        sx={{ position: 'absolute', bottom: 8, right: 8, height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                      />
                      <Chip
                        label={platformLabel(recording.platform)}
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8, height: 20, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: 'rgba(255,255,255,0.9)', color: 'text.primary' }}
                      />
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography variant="body1" fontWeight={700} noWrap sx={{ mb: 0.5 }}>{recording.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{recording.course_title || `Course #${recording.course}`}</Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <DateIcon sx={{ fontSize: 14 }} /> {formatDate(recording.end_time || recording.start_time)}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14 }} /> {recording.max_attendees} max
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          title="Share"
                          onClick={() => {
                            if (recording.recording_url) {
                              navigator.clipboard.writeText(recording.recording_url);
                            }
                          }}
                        >
                          <ShareIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RecordingsPage;
