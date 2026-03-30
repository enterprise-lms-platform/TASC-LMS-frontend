import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  IconButton, Button, Card, CardContent, CircularProgress,
} from '@mui/material';
import {
  Bookmark as SavedIcon, BookmarkBorder as UnsaveIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Delete as RemoveIcon, FolderOpen as EmptyIcon,
} from '@mui/icons-material';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { useSavedCourses, useToggleSavedCourse } from '../../services/learning.services';

/* ── Category Colors ── */
const catColors: Record<string, { bg: string; color: string }> = {
  'Web Development': { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6' },
  'Data Science': { bg: 'rgba(16,185,129,0.08)', color: '#10b981' },
  'Cloud': { bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6' },
  'Design': { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b' },
  'Marketing': { bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
};

/* ── Component ── */

const SavedCoursesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Wire to real API
  const { data: savedData, isLoading } = useSavedCourses();
  const toggleMutation = useToggleSavedCourse();

  // Handle both paginated { results: [...] } and plain array responses
  const saved = Array.isArray(savedData) ? savedData : (savedData as any)?.results ?? [];

  const removeCourse = (courseId: number) => {
    toggleMutation.mutate(courseId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

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

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
            Saved Courses
          </Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>
            {saved.length} saved
          </Typography>
        </Box>

        {/* KPI summary bar */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { 
              label: 'Total Saved', 
              value: String(saved.length), 
              icon: <SavedIcon />,
              bgcolor: '#dbeafe',
              iconBg: '#93c5fd',
              color: '#1e3a8a',
              subColor: '#1e40af',
            },
            { 
              label: 'Wishlist', 
              value: String(saved.length), 
              icon: <UnsaveIcon />,
              bgcolor: '#ffedd5',
              iconBg: '#fdba74',
              color: '#7c2d12',
              subColor: '#9a3412',
            },
          ].map((k, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: { xs: 110, md: 160 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: k.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {k.icon}
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: k.color,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {k.value}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: k.subColor,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    opacity: 0.8,
                  }}
                >
                  {k.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Loading state */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : saved.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <EmptyIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.disabled" sx={{ mb: 1 }}>No saved courses yet</Typography>
            <Button variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '50px', color: 'white' }}>Browse Courses</Button>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {saved.map((sc: any) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={sc.id}>
                <Card
                  className="course-card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      height: 140,
                      background: sc.course_thumbnail
                        ? `url(${sc.course_thumbnail}) center/cover`
                        : 'linear-gradient(135deg, #ffb74d, #f97316)',
                      position: 'relative',
                    }}
                  >
                    {sc.category_name && (
                      <Chip
                        label={sc.category_name}
                        size="small"
                        sx={{
                          position: 'absolute', top: 10, left: 10,
                          bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
                          fontWeight: 600, fontSize: '0.65rem', height: 22, borderRadius: '50px',
                          color: catColors[sc.category_name]?.color || 'text.primary',
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => removeCourse(sc.course)}
                      disabled={toggleMutation.isPending}
                      sx={{
                        position: 'absolute', top: 8, right: 8,
                        bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.95)', color: 'error.main' },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', mb: 0.5, lineHeight: 1.3 }}>
                      {sc.course_title}
                    </Typography>
                    {sc.instructor_name && (
                      <Typography color="text.disabled" sx={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <PersonIcon sx={{ fontSize: 14 }} /> {sc.instructor_name}
                      </Typography>
                    )}

                    {/* Meta */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                      {sc.course_level && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                          {sc.course_level}
                        </Box>
                      )}
                      {sc.course_price && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                          ${sc.course_price}
                        </Box>
                      )}
                    </Box>

                    {/* Footer */}
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
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
                        View Course
                      </Button>
                    </Box>

                    {/* Saved date */}
                    <Typography color="text.disabled" sx={{ fontSize: '0.68rem', mt: 1 }}>
                      Saved {formatDate(sc.created_at)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default SavedCoursesPage;
