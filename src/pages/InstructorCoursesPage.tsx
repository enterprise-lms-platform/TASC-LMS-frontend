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
  LinearProgress,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import {
  MenuBook as CoursesIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  People as PeopleIcon,
  PlayCircle as LessonsIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';
import { useCourses } from '../hooks/useCatalogue';
import { useAuth } from '../hooks/useAuth';
import type { CourseList } from '../types/types';

const statusColors: Record<string, { bg: string; color: string }> = {
  published: { bg: '#d1fae5', color: '#059669' },
  draft: { bg: '#fef3c7', color: '#d97706' },
  archived: { bg: '#e5e7eb', color: '#6b7280' },
};

/** Format an ISO date string to a readable date, or return "—" */
const formatDateLabel = (iso?: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '—';
  }
};

const InstructorCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuCourseId, setMenuCourseId] = useState<string | null>(null);

  // Fetch instructor's courses from API
  const { data, isLoading, isError } = useCourses(
    user?.id ? { instructor: user.id } : undefined,
  );
  const courses: CourseList[] = data?.results ?? [];

  const statusFilter = tab === 0 ? null : tab === 1 ? 'published' : tab === 2 ? 'draft' : 'archived';
  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, courseId: string) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuCourseId(courseId);
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
              <CoursesIcon sx={{ color: 'primary.main' }} />
              My Courses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/instructor/course/create')}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Create Course
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Loading state */}
          {isLoading && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Loading courses...
              </Typography>
            </Box>
          )}

          {/* Error state */}
          {isError && (
            <Typography color="error.main" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
              Failed to load courses. Please try again.
            </Typography>
          )}

          {/* Search & Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              overflow: 'hidden',
              mb: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
            }}
          >
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 280 }}
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">{filtered.length} courses</Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label={`All (${courses.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Published (${courses.filter((c) => c.status === 'published').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Drafts (${courses.filter((c) => c.status === 'draft').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Archived (${courses.filter((c) => c.status === 'archived').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Paper>

          {/* Course Grid */}
          <Grid container spacing={2}>
            {filtered.map((course) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s, transform 0.2s',
                    '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
                  }}
                  onClick={() => navigate(`/instructor/course/${course.id}/structure`)}
                >
                  {/* Course image */}
                  <Box sx={{ height: 140, bgcolor: 'grey.200', position: 'relative', overflow: 'hidden' }}>
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>
                          {course.title[0]}
                        </Avatar>
                      </Box>
                    )}
                    <Chip
                      label={course.status}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        bgcolor: statusColors[course.status]?.bg ?? '#e5e7eb',
                        color: statusColors[course.status]?.color ?? '#6b7280',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={700} noWrap>{course.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{course.category?.name ?? '—'}</Typography>
                      </Box>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, String(course.id))}>
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5, fontSize: '0.8rem', color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 16 }} /> {course.enrollment_count}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LessonsIcon sx={{ fontSize: 16 }} /> {course.total_sessions ?? 0}
                      </Box>
                    </Box>

                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1.5, display: 'block' }}>
                      {course.published_at ? `Published ${formatDateLabel(course.published_at)}` : '—'}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Context Menu */}
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => { setMenuAnchor(null); if (menuCourseId) navigate(`/instructor/course/${menuCourseId}/edit`); }}>
              <EditIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Edit Course
            </MenuItem>
            <MenuItem onClick={() => { setMenuAnchor(null); if (menuCourseId) navigate(`/instructor/course/${menuCourseId}/preview`); }}>
              <ViewIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Preview
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <DuplicateIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Duplicate
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ fontSize: 18, mr: 1.5 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorCoursesPage;
