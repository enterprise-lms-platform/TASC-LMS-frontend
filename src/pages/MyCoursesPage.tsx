import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip, Avatar,
  LinearProgress, IconButton, TextField, MenuItem, Button, Tabs, Tab,
} from '@mui/material';
import {
  MenuBook as CourseIcon, PlayArrow as PlayIcon, CheckCircle as CompletedIcon,
  AccessTime as TimeIcon, Star as StarIcon, MoreVert as MoreIcon,
  Search as SearchIcon, FilterList as FilterIcon, TrendingUp as TrendIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data (will come from backend later) ── */

const kpis = [
  { label: 'IN PROGRESS', value: '4', icon: <CourseIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  { label: 'COMPLETED', value: '8', icon: <CompletedIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { label: 'TOTAL HOURS', value: '127', icon: <TimeIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { label: 'AVG. RATING', value: '4.7', icon: <StarIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  'In Progress': { bg: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' },
  'Completed': { bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981' },
  'Not Started': { bg: 'rgba(156, 163, 175, 0.08)', color: '#71717a' },
};

const courses = [
  { id: '1', title: 'Advanced React Patterns', instructor: 'Michael Rodriguez', category: 'Web Development', progress: 65, lessons: '8/12', rating: 4.8, status: 'In Progress', lastAccessed: '2 hours ago', image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=200' },
  { id: '2', title: 'Data Science Fundamentals', instructor: 'Emily Chen', category: 'Data Science', progress: 82, lessons: '10/12', rating: 4.9, status: 'In Progress', lastAccessed: '1 day ago', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=200' },
  { id: '3', title: 'Cybersecurity Essentials', instructor: 'David Wilson', category: 'Security', progress: 45, lessons: '5/11', rating: 4.7, status: 'In Progress', lastAccessed: '3 days ago', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=200' },
  { id: '4', title: 'JavaScript Fundamentals', instructor: 'Sarah Johnson', category: 'Web Development', progress: 100, lessons: '15/15', rating: 4.9, status: 'Completed', lastAccessed: '1 week ago', image: '' },
  { id: '5', title: 'React Basics', instructor: 'Michael Rodriguez', category: 'Web Development', progress: 100, lessons: '10/10', rating: 4.8, status: 'Completed', lastAccessed: '2 weeks ago', image: '' },
  { id: '6', title: 'HTML & CSS Mastery', instructor: 'Grace Lee', category: 'Web Development', progress: 100, lessons: '12/12', rating: 4.6, status: 'Completed', lastAccessed: '1 month ago', image: '' },
  { id: '7', title: 'Cloud Architecture with AWS', instructor: 'James Otieno', category: 'Cloud', progress: 0, lessons: '0/14', rating: 4.7, status: 'Not Started', lastAccessed: 'Never', image: '' },
  { id: '8', title: 'UX/UI Design Principles', instructor: 'Faith Muthoni', category: 'Design', progress: 25, lessons: '3/12', rating: 4.5, status: 'In Progress', lastAccessed: '5 days ago', image: '' },
];

/* ── Component ── */

const MyCoursesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const tabLabels = ['All Courses', 'In Progress', 'Completed', 'Not Started'];
  const statusFilter = activeTab === 0 ? null : tabLabels[activeTab];

  const filtered = courses.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
          {kpis.map((k, index) => (
            <Grid size={{ xs: 6, sm: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: 3,
                    background: k.gradient,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography color="text.disabled" sx={{ fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.06em' }}>{k.label}</Typography>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', '& svg': { fontSize: 18 } }}>{k.icon}</Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>{k.value}</Typography>
              </Paper>
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
            {filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CourseIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No courses found</Typography>
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
                        gap: 2,
                        p: 2,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.015)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
                      }}
                    >
                      {/* Thumbnail */}
                      <Avatar
                        variant="rounded"
                        src={course.image || undefined}
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '12px',
                          bgcolor: 'rgba(255,164,36,0.08)',
                          color: 'primary.dark',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          flexShrink: 0,
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
                          {course.instructor} · {course.lessons} lessons · Last accessed {course.lastAccessed}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{
                              flex: 1,
                              maxWidth: 200,
                              height: 5,
                              borderRadius: 3,
                              bgcolor: 'rgba(0,0,0,0.04)',
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
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            borderRadius: '50px',
                            height: 24,
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                          <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{course.rating}</Typography>
                        </Box>
                        {course.status === 'In Progress' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<PlayIcon />}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              borderRadius: '50px',
                              boxShadow: 'none',
                              px: 2,
                              color: 'white',
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography color="success.main" sx={{ fontSize: '0.78rem', fontWeight: 600 }}>
                65% overall completion rate
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MyCoursesPage;
