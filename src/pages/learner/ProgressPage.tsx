import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid,
  LinearProgress, Tabs, Tab, Chip,
} from '@mui/material';
import {
  TrendingUp as TrendIcon, AccessTime as TimeIcon,
  School as CourseIcon, EmojiEvents as TrophyIcon,
  Star as StarIcon, CheckCircle as CheckIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';

import { enrollmentApi, useLearningStats } from '../../services/learning.services';
import { useQuery } from '@tanstack/react-query';

/* ── Component ── */

const ProgressPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { data: stats } = useLearningStats();
  const { data: enrollmentsData } = useQuery({
    queryKey: ['learner-enrollments'],
    queryFn: () => enrollmentApi.getAll().then(res => res.data),
  });

  const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData as any)?.results ?? [];

  // Use enrollments (user-scoped) for milestones, not stats (platform-wide)
  const userCompletedCount = enrollments.filter(e => e.status === 'completed').length;

  const milestones = [
    { label: 'First Course Completed', icon: <CheckIcon />, done: userCompletedCount >= 1 },
    { label: '3 Courses Completed', icon: <CourseIcon />, done: userCompletedCount >= 3 },
    { label: '5 Courses Completed', icon: <TrophyIcon />, done: userCompletedCount >= 5 },
    { label: '10 Courses Completed', icon: <StarIcon />, done: userCompletedCount >= 10 },
  ];

  const kpis = [
    { 
      label: 'Overall Progress', 
      value: `${Math.round(stats?.avg_completion_rate || 0)}%`, 
      icon: <TrendIcon />, 
      bgcolor: '#dcfce7',
      iconBg: '#86efac',
      color: '#14532d',
      subColor: '#166534',
    },
    { 
      label: 'Courses Completed', 
      value: String(stats?.total_completed_courses || 0), 
      icon: <CourseIcon />, 
      bgcolor: '#dbeafe',
      iconBg: '#93c5fd',
      color: '#1e3a8a',
      subColor: '#1e40af',
    },
    { 
      label: 'In Progress', 
      value: String(stats?.total_courses_in_progress || 0), 
      icon: <TimeIcon />, 
      bgcolor: '#ffedd5',
      iconBg: '#fdba74',
      color: '#7c2d12',
      subColor: '#9a3412',
    },
    { 
      label: 'Avg Quiz Score', 
      value: `${Math.round(stats?.avg_quiz_score || 0)}%`, 
      icon: <TrophyIcon />, 
      bgcolor: '#f3e8ff',
      iconBg: '#d8b4fe',
      color: '#581c87',
      subColor: '#6b21a8',
    },
  ];

  const tabLabels = ['All Courses', 'In Progress', 'Completed'];
  
  const filtered = enrollments.filter((e) => {
    if (activeTab === 1) return e.status === 'active';
    if (activeTab === 2) return e.status === 'completed';
    return true;
  });

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, overflowX: 'hidden', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>Progress</Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>Track your learning journey across all courses</Typography>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, index) => (
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
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
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

        <Grid container spacing={3}>
          {/* Course Progress — left column */}
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
              <Box sx={{ px: 3, pt: 2 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ minHeight: 40, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 2 }, '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 } }}>
                  {tabLabels.map((l) => <Tab key={l} label={l} />)}
                </Tabs>
              </Box>

              <Box sx={{ p: 3 }}>
                {filtered.length === 0 && (
                  <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 4 }}>
                    No courses found in this category.
                  </Typography>
                )}
                {filtered.map((e) => (
                  <Box key={e.id} sx={{ mb: 2.5, p: 2, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{e.course_title}</Typography>
                        <Chip label={e.organization_name || 'Individual'} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.04)' }} />
                      </Box>
                      <Chip label={e.status === 'completed' ? 'Completed' : `${Math.round(Number(e.progress_percentage))}%`} size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 600, borderRadius: '50px', bgcolor: e.status === 'completed' ? 'rgba(16,185,129,0.08)' : 'rgba(255,164,36,0.08)', color: e.status === 'completed' ? '#10b981' : 'primary.dark' }} />
                    </Box>

                    <LinearProgress variant="determinate" value={Number(e.progress_percentage)} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)', mb: 1.5, '& .MuiLinearProgress-bar': { borderRadius: 3, background: Number(e.progress_percentage) >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ffb74d, #ffa424)' } }} />

                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, flexWrap: 'wrap', color: 'text.disabled', fontSize: '0.72rem' }}>
                      <span>Enrolled: {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : 'N/A'}</span>
                      <span style={{ marginLeft: 'auto' }}>Last: {e.last_accessed_at ? new Date(e.last_accessed_at).toLocaleDateString() : 'N/A'}</span>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Milestones — right column */}
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TimelineIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Milestones</Typography>
              </Box>
              {milestones.map((m, i) => (
                <Box key={i} className="ld-timeline-item" sx={{ display: 'flex', gap: 1.5, pb: 2.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: m.done ? 'rgba(16,185,129,0.08)' : 'rgba(0,0,0,0.04)', color: m.done ? '#10b981' : 'text.disabled', '& svg': { fontSize: 18 } }}>
                    {m.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: m.done ? 600 : 500, fontSize: '0.82rem', color: m.done ? 'text.primary' : 'text.disabled' }}>{m.label}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>{m.done ? 'Achieved' : 'Locked'}</Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProgressPage;
