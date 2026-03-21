import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Chip,
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
import { livestreamApi } from '../../services/livestream.services';

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

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ''}`.trim();
  return `${s}s`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const ManagerRecordingsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ['livestreams', 'recordings'],
    queryFn: () => livestreamApi.getAll({ page_size: 100 }).then(r => r.data),
  });

  const sessions = sessionsData?.results ?? [];

  const recordings = useMemo(() => {
    return sessions
      .filter(s => s.recording_url && s.status === 'ended')
      .map(s => ({
        id: s.id,
        title: s.title,
        instructor: s.instructor_name || 'Instructor',
        course: s.course_title || '—',
        dateRecorded: s.end_time?.split('T')[0] || '',
        duration: formatDuration(s.duration_minutes * 60),
        views: 0,
        fileSize: formatFileSize(0),
        recordingUrl: s.recording_url,
      }));
  }, [sessions]);

  const uniqueCourses = useMemo(() => {
    const courses = new Set(recordings.map(r => r.course).filter(Boolean));
    return Array.from(courses).sort();
  }, [recordings]);

  const filteredRecordings = useMemo(() => {
    return recordings.filter((recording) => {
      const matchesSearch =
        !searchQuery ||
        recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = courseFilter === 'All Courses' || recording.course === courseFilter;
      const matchesDateFrom = !dateFrom || recording.dateRecorded >= dateFrom;
      const matchesDateTo = !dateTo || recording.dateRecorded <= dateTo;
      return matchesSearch && matchesCourse && matchesDateFrom && matchesDateTo;
    });
  }, [recordings, searchQuery, courseFilter, dateFrom, dateTo]);

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
                  <MenuItem value="All Courses">All Courses</MenuItem>
                  {uniqueCourses.map((course) => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
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
