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
} from '@mui/material';
import {
  History as RecordingsIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  PlayCircle as PlayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  CalendarToday as DateIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface Recording {
  id: string;
  title: string;
  course: string;
  date: string;
  duration: string;
  size: string;
  views: number;
  platform: 'zoom' | 'teams' | 'meet';
}

const sampleRecordings: Recording[] = [
  { id: '1', title: 'React Hooks Part 1', course: 'Advanced React Patterns', date: '2026-02-20', duration: '58:32', size: '245 MB', views: 89, platform: 'zoom' },
  { id: '2', title: 'Intro to TypeScript', course: 'TypeScript Mastery', date: '2026-02-18', duration: '43:15', size: '182 MB', views: 67, platform: 'teams' },
  { id: '3', title: 'State Management Patterns', course: 'Advanced React Patterns', date: '2026-02-15', duration: '1:12:45', size: '320 MB', views: 112, platform: 'zoom' },
  { id: '4', title: 'API Design Best Practices', course: 'Node.js Backend Dev', date: '2026-02-12', duration: '55:20', size: '230 MB', views: 54, platform: 'meet' },
  { id: '5', title: 'Custom Hooks Workshop', course: 'Advanced React Patterns', date: '2026-02-10', duration: '1:28:10', size: '380 MB', views: 145, platform: 'zoom' },
  { id: '6', title: 'GraphQL Queries & Mutations', course: 'GraphQL Fundamentals', date: '2026-02-08', duration: '47:55', size: '198 MB', views: 38, platform: 'zoom' },
];

const RecordingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = sampleRecordings.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) || r.course.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
            <Typography variant="body2" color="text.secondary">{sampleRecordings.length} recordings</Typography>
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

          {/* Recordings Grid */}
          <Grid container spacing={2}>
            {filtered.map((recording) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={recording.id}>
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
                  >
                    <PlayIcon sx={{ fontSize: 56, color: 'white', opacity: 0.9, '&:hover': { opacity: 1, transform: 'scale(1.1)' }, transition: 'all 0.2s' }} />
                    <Chip
                      label={recording.duration}
                      size="small"
                      sx={{ position: 'absolute', bottom: 8, right: 8, height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                    />
                    <Chip
                      label={recording.platform}
                      size="small"
                      sx={{ position: 'absolute', top: 8, left: 8, height: 20, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: 'rgba(255,255,255,0.9)', color: 'text.primary' }}
                    />
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1" fontWeight={700} noWrap sx={{ mb: 0.5 }}>{recording.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{recording.course}</Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DateIcon sx={{ fontSize: 14 }} /> {formatDate(recording.date)}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 14 }} /> {recording.views} views
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <IconButton size="small" title="Share"><ShareIcon sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small" title="Download"><DownloadIcon sx={{ fontSize: 18 }} /></IconButton>
                      <IconButton size="small" title="Delete" sx={{ color: 'error.main' }}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default RecordingsPage;
