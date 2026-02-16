import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  IconButton, Button, Card, CardContent, LinearProgress,
} from '@mui/material';
import {
  Bookmark as SavedIcon, BookmarkBorder as UnsaveIcon,
  PlayArrow as PlayIcon, Star as StarIcon, Person as PersonIcon,
  AccessTime as TimeIcon, MenuBook as LessonsIcon,
  Delete as RemoveIcon, FolderOpen as EmptyIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data ── */

interface SavedCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  rating: number;
  reviews: number;
  lessons: number;
  duration: string;
  image: string;
  savedDate: string;
  enrolled: boolean;
  progress?: number;
}

const initialSaved: SavedCourse[] = [
  { id: '1', title: 'Advanced React Patterns', instructor: 'Michael Rodriguez', category: 'Web Development', rating: 4.8, reviews: 1245, lessons: 12, duration: '18h 30m', image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=300', savedDate: '2 days ago', enrolled: true, progress: 65 },
  { id: '2', title: 'Machine Learning A-Z', instructor: 'Dr. Sarah Kim', category: 'Data Science', rating: 4.9, reviews: 3256, lessons: 24, duration: '42h', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=300', savedDate: '1 week ago', enrolled: false },
  { id: '3', title: 'Cloud Architecture with AWS', instructor: 'James Otieno', category: 'Cloud', rating: 4.7, reviews: 876, lessons: 14, duration: '22h', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=300', savedDate: '2 weeks ago', enrolled: false },
  { id: '4', title: 'UX/UI Design Principles', instructor: 'Faith Muthoni', category: 'Design', rating: 4.6, reviews: 1102, lessons: 16, duration: '28h', image: '', savedDate: '3 weeks ago', enrolled: false },
  { id: '5', title: 'Python for Data Analysis', instructor: 'Emily Chen', category: 'Data Science', rating: 4.8, reviews: 2341, lessons: 20, duration: '35h', image: '', savedDate: '1 month ago', enrolled: true, progress: 25 },
  { id: '6', title: 'Digital Marketing Strategy', instructor: 'Grace Akinyi', category: 'Marketing', rating: 4.5, reviews: 789, lessons: 10, duration: '15h', image: '', savedDate: '1 month ago', enrolled: false },
];

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
  const [saved, setSaved] = useState(initialSaved);

  const removeCourse = (id: string) => setSaved((prev) => prev.filter((c) => c.id !== id));
  const enrolledCount = saved.filter((c) => c.enrolled).length;

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
            {saved.length} saved · {enrolledCount} enrolled · {saved.length - enrolledCount} wishlisted
          </Typography>
        </Box>

        {/* KPI summary bar */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { 
              label: 'Total Saved', 
              value: String(saved.length), 
              icon: <SavedIcon />,
              // Light Blue Theme
              bgcolor: '#dbeafe',
              iconBg: '#93c5fd',
              color: '#1e3a8a',
              subColor: '#1e40af',
            },
            { 
              label: 'Enrolled', 
              value: String(enrolledCount), 
              icon: <PlayIcon />,
              // Mint Green Theme
              bgcolor: '#dcfce7',
              iconBg: '#86efac',
              color: '#14532d',
              subColor: '#166534',
            },
            { 
              label: 'Wishlist', 
              value: String(saved.length - enrolledCount), 
              icon: <UnsaveIcon />,
              // Warm Peach Theme
              bgcolor: '#ffedd5',
              iconBg: '#fdba74',
              color: '#7c2d12',
              subColor: '#9a3412',
            },
            { 
              label: 'Total Hours', 
              value: `${saved.reduce((s, c) => s + parseFloat(c.duration), 0).toFixed(0)}h`, 
              icon: <TimeIcon />,
              // Dusty Lavender Theme
              bgcolor: '#f3e8ff',
              iconBg: '#d8b4fe',
              color: '#581c87',
              subColor: '#6b21a8',
            },
          ].map((k, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
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
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Icon Badge */}
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

                {/* Main Stat */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: k.color,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {k.value}
                </Typography>

                {/* Label */}
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

        {/* Course Cards Grid */}
        {saved.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <EmptyIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.disabled" sx={{ mb: 1 }}>No saved courses yet</Typography>
            <Button variant="contained" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '50px', color: 'white' }}>Browse Courses</Button>
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {saved.map((course) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id}>
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
                      background: course.image ? `url(${course.image}) center/cover` : 'linear-gradient(135deg, #ffb74d, #f97316)',
                      position: 'relative',
                    }}
                  >
                    <Chip
                      label={course.category}
                      size="small"
                      sx={{
                        position: 'absolute', top: 10, left: 10,
                        bgcolor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
                        fontWeight: 600, fontSize: '0.65rem', height: 22, borderRadius: '50px',
                        color: catColors[course.category]?.color || 'text.primary',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeCourse(course.id)}
                      sx={{
                        position: 'absolute', top: 8, right: 8,
                        bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.95)', color: 'error.main' },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    {course.enrolled && course.progress !== undefined && (
                      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, bgcolor: 'rgba(0,0,0,0.15)' }}>
                        <Box sx={{ width: `${course.progress}%`, height: '100%', bgcolor: 'white', borderRadius: '0 2px 2px 0' }} />
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', mb: 0.5, lineHeight: 1.3 }}>
                      {course.title}
                    </Typography>
                    <Typography color="text.disabled" sx={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <PersonIcon sx={{ fontSize: 14 }} /> {course.instructor}
                    </Typography>

                    {/* Meta */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                        <LessonsIcon sx={{ fontSize: 14 }} /> {course.lessons} lessons
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                        <TimeIcon sx={{ fontSize: 14 }} /> {course.duration}
                      </Box>
                    </Box>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                      <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{course.rating}</Typography>
                      <Typography color="text.disabled" sx={{ fontSize: '0.72rem' }}>({course.reviews.toLocaleString()})</Typography>
                    </Box>

                    {/* Progress bar if enrolled */}
                    {course.enrolled && course.progress !== undefined && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography color="text.disabled" sx={{ fontSize: '0.7rem' }}>Progress</Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: 'primary.dark' }}>{course.progress}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 4, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.04)',
                            '& .MuiLinearProgress-bar': { borderRadius: 2, background: 'linear-gradient(90deg, #ffb74d, #ffa424)' },
                          }}
                        />
                      </Box>
                    )}

                    {/* Footer */}
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={course.enrolled ? <PlayIcon /> : undefined}
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
                        {course.enrolled ? 'Resume' : 'Enroll Now'}
                      </Button>
                    </Box>

                    {/* Saved date */}
                    <Typography color="text.disabled" sx={{ fontSize: '0.68rem', mt: 1 }}>
                      Saved {course.savedDate}
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
