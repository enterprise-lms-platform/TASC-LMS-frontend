import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip, Avatar,
  LinearProgress, IconButton, TextField, MenuItem, Button, Tabs, Tab, Skeleton,
} from '@mui/material';
import {
  MenuBook as CourseIcon, PlayArrow as PlayIcon, CheckCircle as CompletedIcon,
  AccessTime as TimeIcon, Star as StarIcon, MoreVert as MoreIcon,
  Search as SearchIcon, FilterList as FilterIcon, TrendingUp as TrendIcon,
} from '@mui/icons-material';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { enrollmentApi } from '../../services/learning.services';
import { normalizeEnrollmentListResponse } from '../../hooks/useLearning';
import type { Enrollment } from '../../types/types';

const statusColors: Record<string, { bg: string; color: string }> = {
  'In Progress': { bg: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' },
  'Completed': { bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981' },
  'Not Started': { bg: 'rgba(156, 163, 175, 0.08)', color: '#71717a' },
};

const getStatus = (progress: number, lastAccessedSession: number | null | undefined) => {
  if (progress >= 100) return 'Completed';
  if (progress > 0) return 'In Progress';
  if (lastAccessedSession != null) return 'In Progress';
  return 'Not Started';
};

const getTimeAgo = (iso?: string) => {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const MyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const { data: enrollmentsRaw, isLoading } = useQuery({
    queryKey: ['learner', 'my-courses'],
    queryFn: () => enrollmentApi.getAll({ page_size: 50 }).then(r => r.data),
  });

  const enrollments: Enrollment[] = useMemo(
    () => normalizeEnrollmentListResponse(enrollmentsRaw),
    [enrollmentsRaw],
  );

  const courses = useMemo(() => enrollments.map(e => ({
    id: String(e.course),
    title: e.course_title || 'Untitled Course',
    instructor: '—',
    category: 'General',
    progress: Number(e.progress_percentage) ?? 0,
    progressLabel: `${Math.round(Number(e.progress_percentage) || 0)}% complete`,
    status: getStatus(Number(e.progress_percentage) || 0, e.last_accessed_session ?? null),
    lastAccessed: getTimeAgo(e.last_accessed_at || e.enrolled_at),
    image: e.course_thumbnail || '',
    sortKey: new Date(e.last_accessed_at || e.enrolled_at || 0).getTime(),
    lastAccessedSession: e.last_accessed_session ?? null,
  })), [enrollments]);

  // Compute KPIs from real data
  const kpiData = useMemo(() => {
    const inProgress = courses.filter(c => c.status === 'In Progress').length;
    const completed = courses.filter(c => c.status === 'Completed').length;
    const avgProgress =
      courses.length > 0
        ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
        : 0;
    return [
      { label: 'In Progress', value: String(inProgress), icon: <CourseIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
      { label: 'Completed', value: String(completed), icon: <CompletedIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
      { label: 'Total Courses', value: String(courses.length), icon: <TimeIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
      { label: 'Avg. progress', value: `${avgProgress}%`, icon: <StarIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
    ];
  }, [courses]);

  const tabLabels = ['All Courses', 'In Progress', 'Completed', 'Not Started'];
  const statusFilter = activeTab === 0 ? null : tabLabels[activeTab];

  const filtered = useMemo(() => {
    let result = courses.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    // Sort
    if (sortBy === 'progress') result = [...result].sort((a, b) => b.progress - a.progress);
    else if (sortBy === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'rating') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'recent') result = [...result].sort((a, b) => b.sortKey - a.sortKey);
    return result;
  }, [courses, statusFilter, search, sortBy]);

  const completionRate = courses.length > 0
    ? Math.round((courses.filter(c => c.status === 'Completed').length / courses.length) * 100)
    : 0;

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
            My Courses
          </Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>
            Track your learning progress and manage your enrolled courses
          </Typography>
        </Box>

        {/* KPI Row */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpiData.map((k, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
              {isLoading ? (
                <Skeleton variant="rounded" height={160} sx={{ borderRadius: '20px' }} />
              ) : (
                <Paper
                  elevation={0}
                  className={`stat-card ld-fade-in ld-fade-in-${index}`}
                  sx={{
                    bgcolor: k.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    height: '100%',
                    minHeight: 160,
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
                      position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                      borderRadius: '50%', bgcolor: k.iconBg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'white',
                      '& svg': { fontSize: 20 },
                    }}
                  >
                    {k.icon}
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: k.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}
                  >
                    {k.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: k.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                    {k.label}
                  </Typography>
                </Paper>
              )}
            </Grid>
          ))}
        </Grid>

        {/* Courses Section */}
        <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          {/* Tabs & Filters */}
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                minHeight: 40,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 2 },
                '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 },
              }}
            >
              {tabLabels.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          </Box>

          <Box sx={{ px: 3, py: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }}
              sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.85rem' } }}
            />
            <TextField
              size="small"
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.85rem' } }}
              InputProps={{ startAdornment: <FilterIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 18 }} /> }}
            >
              <MenuItem value="recent">Last Accessed</MenuItem>
              <MenuItem value="progress">Progress</MenuItem>
              <MenuItem value="name">Name A-Z</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
            </TextField>
          </Box>

          {/* Course Cards */}
          <Box sx={{ px: 3, pb: 3 }}>
            {isLoading ? (
              [0, 1, 2, 3].map(i => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                  <Skeleton variant="rounded" width={64} height={64} sx={{ borderRadius: '12px' }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="50%" />
                    <Skeleton width="30%" />
                    <Skeleton width="40%" height={8} sx={{ mt: 1 }} />
                  </Box>
                </Box>
              ))
            ) : filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CourseIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">
                  {courses.length === 0 ? 'No enrolled courses yet' : 'No courses found'}
                </Typography>
                {courses.length === 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/learner/courses')}
                    sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
                  >
                    Browse Courses
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filtered.map((course) => (
                  <Grid size={{ xs: 12 }} key={course.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2, p: 2, borderRadius: '12px', cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.015)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
                      }}
                      onClick={() => navigate(`/learner/course/${course.id}`)}
                    >
                      {/* Thumbnail */}
                      <Avatar
                        variant="rounded"
                        src={course.image || undefined}
                        sx={{
                          width: 64, height: 64, borderRadius: '12px',
                          bgcolor: 'rgba(255,164,36,0.08)', color: 'primary.dark',
                          fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                        }}
                      >
                        {!course.image && course.title.substring(0, 2)}
                      </Avatar>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }} noWrap>{course.title}</Typography>
                          <Chip label={course.category} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.04)' }} />
                        </Box>
                        <Typography color="text.disabled" sx={{ fontSize: '0.78rem', mb: 1 }}>
                          {course.progressLabel} · Last accessed {course.lastAccessed}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{
                              flex: 1, maxWidth: 200, height: 5, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: course.progress === 100
                                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                                  : 'linear-gradient(90deg, #ffb74d, #ffa424)',
                              },
                            }}
                          />
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: course.progress === 100 ? '#10b981' : 'text.secondary' }}>
                            {course.progress}%
                          </Typography>
                        </Box>
                      </Box>

                      {/* Right side */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        <Chip
                          label={course.status}
                          size="small"
                          sx={{
                            bgcolor: statusColors[course.status]?.bg,
                            color: statusColors[course.status]?.color,
                            fontWeight: 600, fontSize: '0.7rem', borderRadius: '50px', height: 24,
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <StarIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.disabled' }}>—</Typography>
                        </Box>
                        {course.status === 'In Progress' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<PlayIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              const base = `/learner/course/${course.id}/learn`;
                              navigate(
                                course.lastAccessedSession != null
                                  ? `${base}?session=${course.lastAccessedSession}`
                                  : base,
                              );
                            }}
                            sx={{
                              textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
                              borderRadius: '50px', boxShadow: 'none', px: 2, color: 'white',
                              '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' },
                            }}
                          >
                            Resume
                          </Button>
                        )}
                        <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}>
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography color="text.disabled" sx={{ fontSize: '0.78rem' }}>
              Showing {filtered.length} of {courses.length} courses
            </Typography>
            {courses.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography color="success.main" sx={{ fontSize: '0.78rem', fontWeight: 600 }}>
                  {completionRate}% overall completion rate
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MyCoursesPage;
