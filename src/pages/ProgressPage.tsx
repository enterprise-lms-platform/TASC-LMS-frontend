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
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data ── */

const kpis = [
  { label: 'OVERALL PROGRESS', value: '65%', icon: <TrendIcon />, gradient: 'linear-gradient(135deg, #ffa424, #f97316)' },
  { label: 'COURSES COMPLETED', value: '8', icon: <CourseIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { label: 'TOTAL HOURS', value: '127', icon: <TimeIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
  { label: 'ACHIEVEMENTS', value: '14', icon: <TrophyIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
];

interface CourseProgress {
  id: string;
  title: string;
  category: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  quizzesCompleted: number;
  totalQuizzes: number;
  avgScore: number;
  timeSpent: string;
  lastActivity: string;
  status: 'in-progress' | 'completed';
}

const courses: CourseProgress[] = [
  { id: '1', title: 'Advanced React Patterns', category: 'Web Development', progress: 65, lessonsCompleted: 8, totalLessons: 12, quizzesCompleted: 2, totalQuizzes: 3, avgScore: 88, timeSpent: '28h 15m', lastActivity: '2 hours ago', status: 'in-progress' },
  { id: '2', title: 'Data Science Fundamentals', category: 'Data Science', progress: 82, lessonsCompleted: 10, totalLessons: 12, quizzesCompleted: 4, totalQuizzes: 5, avgScore: 92, timeSpent: '35h 40m', lastActivity: '1 day ago', status: 'in-progress' },
  { id: '3', title: 'Cybersecurity Essentials', category: 'Security', progress: 45, lessonsCompleted: 5, totalLessons: 11, quizzesCompleted: 1, totalQuizzes: 4, avgScore: 78, timeSpent: '15h 20m', lastActivity: '3 days ago', status: 'in-progress' },
  { id: '4', title: 'UX/UI Design Principles', category: 'Design', progress: 25, lessonsCompleted: 3, totalLessons: 12, quizzesCompleted: 1, totalQuizzes: 4, avgScore: 85, timeSpent: '8h 10m', lastActivity: '5 days ago', status: 'in-progress' },
  { id: '5', title: 'JavaScript Fundamentals', category: 'Web Development', progress: 100, lessonsCompleted: 15, totalLessons: 15, quizzesCompleted: 5, totalQuizzes: 5, avgScore: 94, timeSpent: '42h', lastActivity: '1 week ago', status: 'completed' },
  { id: '6', title: 'React Basics', category: 'Web Development', progress: 100, lessonsCompleted: 10, totalLessons: 10, quizzesCompleted: 3, totalQuizzes: 3, avgScore: 91, timeSpent: '22h', lastActivity: '2 weeks ago', status: 'completed' },
  { id: '7', title: 'HTML & CSS Mastery', category: 'Web Development', progress: 100, lessonsCompleted: 12, totalLessons: 12, quizzesCompleted: 4, totalQuizzes: 4, avgScore: 96, timeSpent: '18h', lastActivity: '1 month ago', status: 'completed' },
];

const milestones = [
  { label: 'First Course Completed', date: 'Sep 10, 2025', icon: <CheckIcon />, done: true },
  { label: '50 Learning Hours', date: 'Oct 5, 2025', icon: <TimeIcon />, done: true },
  { label: '3 Certificates Earned', date: 'Nov 15, 2025', icon: <TrophyIcon />, done: true },
  { label: '100 Learning Hours', date: 'Jan 8, 2026', icon: <TimeIcon />, done: true },
  { label: '5 Courses Completed', date: 'In Progress', icon: <CourseIcon />, done: false },
  { label: 'Top 10% Learner', date: 'Locked', icon: <StarIcon />, done: false },
];

/* ── Component ── */

const ProgressPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabLabels = ['All Courses', 'In Progress', 'Completed'];
  const filtered = courses.filter((c) => {
    if (activeTab === 1) return c.status === 'in-progress';
    if (activeTab === 2) return c.status === 'completed';
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
          {kpis.map((k, i) => (
            <Grid size={{ xs: 6, sm: 3 }} key={k.label}>
              <Paper elevation={0} className={`stat-card ld-fade-in ld-fade-in-${i}`} sx={{ p: { xs: 2, md: 3 }, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: k.gradient } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography color="text.disabled" sx={{ fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.06em' }}>{k.label}</Typography>
                  <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', '& svg': { fontSize: 18 } }}>{k.icon}</Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' } }}>{k.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Course Progress — left column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
              <Box sx={{ px: 3, pt: 2 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ minHeight: 40, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 2 }, '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 } }}>
                  {tabLabels.map((l) => <Tab key={l} label={l} />)}
                </Tabs>
              </Box>

              <Box sx={{ p: 3 }}>
                {filtered.map((c) => (
                  <Box key={c.id} sx={{ mb: 2.5, p: 2, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.title}</Typography>
                        <Chip label={c.category} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.04)' }} />
                      </Box>
                      <Chip label={c.status === 'completed' ? 'Completed' : `${c.progress}%`} size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 600, borderRadius: '50px', bgcolor: c.status === 'completed' ? 'rgba(16,185,129,0.08)' : 'rgba(255,164,36,0.08)', color: c.status === 'completed' ? '#10b981' : 'primary.dark' }} />
                    </Box>

                    <LinearProgress variant="determinate" value={c.progress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)', mb: 1.5, '& .MuiLinearProgress-bar': { borderRadius: 3, background: c.progress === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ffb74d, #ffa424)' } }} />

                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, flexWrap: 'wrap', color: 'text.disabled', fontSize: '0.72rem' }}>
                      <span>📚 {c.lessonsCompleted}/{c.totalLessons} lessons</span>
                      <span>📝 {c.quizzesCompleted}/{c.totalQuizzes} quizzes</span>
                      <span>⭐ {c.avgScore}% avg</span>
                      <span>⏱️ {c.timeSpent}</span>
                      <span style={{ marginLeft: 'auto' }}>Last: {c.lastActivity}</span>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Milestones — right column */}
          <Grid size={{ xs: 12, lg: 4 }}>
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
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>{m.date}</Typography>
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
