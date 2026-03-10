import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  VideoLibrary as VideoLibraryIcon,
  PlayCircle as PlayIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewsIcon,
  AccessTime as DurationIcon,
  CalendarToday as DateIcon,
  Storage as SizeIcon,
  Person as PersonIcon,
  MenuBook as CourseIcon,
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

// ── Mock recordings ──
const mockRecordings = [
  {
    id: 1,
    title: 'Advanced React Patterns - Session 4',
    instructor: 'Dr. Sarah Chen',
    course: 'Advanced React Patterns',
    dateRecorded: '2026-03-08',
    duration: '1h 48m',
    views: 142,
    fileSize: '1.2 GB',
  },
  {
    id: 2,
    title: 'Python ML Fundamentals - Week 3',
    instructor: 'James Wilson',
    course: 'Python for Data Science',
    dateRecorded: '2026-03-07',
    duration: '2h 05m',
    views: 98,
    fileSize: '1.8 GB',
  },
  {
    id: 3,
    title: 'AWS Solutions Architect - Lab Session',
    instructor: 'Maria Garcia',
    course: 'AWS Solutions Architect',
    dateRecorded: '2026-03-06',
    duration: '1h 32m',
    views: 76,
    fileSize: '980 MB',
  },
  {
    id: 4,
    title: 'TypeScript Generics Deep Dive',
    instructor: 'Alex Kim',
    course: 'TypeScript Mastery',
    dateRecorded: '2026-03-05',
    duration: '1h 15m',
    views: 203,
    fileSize: '840 MB',
  },
  {
    id: 5,
    title: 'Kubernetes Cluster Management',
    instructor: 'Priya Patel',
    course: 'Docker & Kubernetes',
    dateRecorded: '2026-03-04',
    duration: '2h 20m',
    views: 64,
    fileSize: '2.1 GB',
  },
  {
    id: 6,
    title: 'Network Security Essentials',
    instructor: 'David Okonkwo',
    course: 'Cybersecurity Fundamentals',
    dateRecorded: '2026-03-03',
    duration: '1h 40m',
    views: 118,
    fileSize: '1.4 GB',
  },
  {
    id: 7,
    title: 'React Native Mobile Development',
    instructor: 'Dr. Sarah Chen',
    course: 'Mobile App Development',
    dateRecorded: '2026-03-02',
    duration: '1h 55m',
    views: 87,
    fileSize: '1.6 GB',
  },
  {
    id: 8,
    title: 'Data Visualization with D3.js',
    instructor: 'James Wilson',
    course: 'Data Visualization',
    dateRecorded: '2026-03-01',
    duration: '1h 28m',
    views: 156,
    fileSize: '1.1 GB',
  },
];

const courseOptions = [
  'All Courses',
  'Advanced React Patterns',
  'Python for Data Science',
  'AWS Solutions Architect',
  'TypeScript Mastery',
  'Docker & Kubernetes',
  'Cybersecurity Fundamentals',
  'Mobile App Development',
  'Data Visualization',
];

const ManagerRecordingsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredRecordings = mockRecordings.filter((recording) => {
    const matchesSearch =
      searchQuery === '' ||
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recording.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'All Courses' || recording.course === courseFilter;
    const matchesDateFrom = dateFrom === '' || recording.dateRecorded >= dateFrom;
    const matchesDateTo = dateTo === '' || recording.dateRecorded <= dateTo;
    return matchesSearch && matchesCourse && matchesDateFrom && matchesDateTo;
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
              <VideoLibraryIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Recordings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access recorded session archives
              </Typography>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Search & Filter</Typography>
            </Box>
            <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: 240, flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Course</InputLabel>
                <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} label="Course">
                  {courseOptions.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="From"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
              <TextField
                size="small"
                label="To"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
            </Box>
          </Paper>

          {/* Recordings List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>
                Recordings ({filteredRecordings.length})
              </Typography>
            </Box>
            <Box>
              {filteredRecordings.map((recording, index) => (
                <Box
                  key={recording.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 2, md: 3 },
                    p: 2,
                    px: 3,
                    borderBottom: index < filteredRecordings.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' },
                    transition: 'background 0.2s',
                  }}
                >
                  {/* Thumbnail Placeholder */}
                  <Box
                    sx={{
                      width: { xs: 80, md: 120 },
                      height: { xs: 50, md: 72 },
                      borderRadius: '8px',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: 'grey.300' },
                    }}
                  >
                    <PlayIcon sx={{ fontSize: 32, color: 'grey.500' }} />
                  </Box>

                  {/* Recording Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {recording.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {recording.instructor}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CourseIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {recording.course}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DateIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {recording.dateRecorded}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DurationIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {recording.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ViewsIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {recording.views} views
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SizeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {recording.fileSize}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title="Play">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#ffa424',
                          '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' },
                        }}
                      >
                        <PlayIcon sx={{ fontSize: 22 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { bgcolor: 'rgba(59,130,246,0.08)' },
                        }}
                      >
                        <DownloadIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#ef4444',
                          '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}

              {filteredRecordings.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <VideoLibraryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" fontWeight={600}>
                    No recordings found
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Try adjusting your search or filters.
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

export default ManagerRecordingsPage;
