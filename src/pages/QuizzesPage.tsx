import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  Tabs, Tab, Button,
} from '@mui/material';
import {
  Quiz as QuizIcon, CheckCircle as PassIcon, Cancel as FailIcon,
  AccessTime as TimeIcon, TrendingUp as ScoreIcon,
  PlayArrow as StartIcon, Refresh as RetryIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data ── */

const kpis = [
  { 
    label: 'Total Quizzes', 
    value: '18', 
    icon: <QuizIcon />, 
    // Light Blue Theme
    bgcolor: '#dbeafe',
    iconBg: '#93c5fd',
    color: '#1e3a8a',
    subColor: '#1e40af',
  },
  { 
    label: 'Completed', 
    value: '12', 
    icon: <PassIcon />, 
    // Mint Green Theme
    bgcolor: '#dcfce7',
    iconBg: '#86efac',
    color: '#14532d',
    subColor: '#166534',
  },
  { 
    label: 'Avg. Score', 
    value: '87%', 
    icon: <ScoreIcon />, 
    // Warm Peach Theme
    bgcolor: '#ffedd5',
    iconBg: '#fdba74',
    color: '#7c2d12',
    subColor: '#9a3412',
  },
  { 
    label: 'Pending', 
    value: '6', 
    icon: <TimeIcon />, 
    // Dusty Lavender Theme
    bgcolor: '#f3e8ff',
    iconBg: '#d8b4fe',
    color: '#581c87',
    subColor: '#6b21a8',
  },
];

type QuizStatus = 'completed' | 'available' | 'locked' | 'failed';
const statusStyles: Record<QuizStatus, { bg: string; color: string; label: string }> = {
  completed: { bg: 'rgba(16,185,129,0.08)', color: '#10b981', label: 'Passed' },
  available: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6', label: 'Available' },
  locked:    { bg: 'rgba(156,163,175,0.08)', color: '#9ca3af', label: 'Locked' },
  failed:    { bg: 'rgba(239,68,68,0.08)', color: '#ef4444', label: 'Failed' },
};

interface Quiz {
  id: string;
  title: string;
  course: string;
  questions: number;
  duration: string;
  score?: number;
  passingScore: number;
  attempts: number;
  maxAttempts: number;
  status: QuizStatus;
  dueDate?: string;
  completedDate?: string;
}

const quizzes: Quiz[] = [
  { id: '1', title: 'React Hooks Deep Dive', course: 'Advanced React Patterns', questions: 15, duration: '20 min', score: 92, passingScore: 70, attempts: 1, maxAttempts: 3, status: 'completed', completedDate: 'Feb 12' },
  { id: '2', title: 'State Management Patterns', course: 'Advanced React Patterns', questions: 12, duration: '15 min', score: 88, passingScore: 70, attempts: 1, maxAttempts: 3, status: 'completed', completedDate: 'Feb 5' },
  { id: '3', title: 'Data Visualization Basics', course: 'Data Science Fundamentals', questions: 20, duration: '30 min', score: 95, passingScore: 75, attempts: 1, maxAttempts: 2, status: 'completed', completedDate: 'Feb 1' },
  { id: '4', title: 'Statistical Analysis', course: 'Data Science Fundamentals', questions: 18, duration: '25 min', score: 62, passingScore: 70, attempts: 2, maxAttempts: 3, status: 'failed', completedDate: 'Jan 28' },
  { id: '5', title: 'Performance Optimization', course: 'Advanced React Patterns', questions: 10, duration: '15 min', passingScore: 70, attempts: 0, maxAttempts: 3, status: 'available', dueDate: 'Feb 18' },
  { id: '6', title: 'Machine Learning Intro', course: 'Data Science Fundamentals', questions: 15, duration: '20 min', passingScore: 75, attempts: 0, maxAttempts: 2, status: 'available', dueDate: 'Feb 20' },
  { id: '7', title: 'Network Security Basics', course: 'Cybersecurity Essentials', questions: 12, duration: '15 min', score: 85, passingScore: 70, attempts: 1, maxAttempts: 3, status: 'completed', completedDate: 'Jan 20' },
  { id: '8', title: 'Advanced CSS Layouts', course: 'HTML & CSS Mastery', questions: 10, duration: '12 min', score: 98, passingScore: 70, attempts: 1, maxAttempts: 3, status: 'completed', completedDate: 'Dec 15' },
  { id: '9', title: 'Penetration Testing', course: 'Cybersecurity Essentials', questions: 20, duration: '30 min', passingScore: 75, attempts: 0, maxAttempts: 2, status: 'locked' },
  { id: '10', title: 'Design Systems', course: 'UX/UI Design Principles', questions: 14, duration: '18 min', passingScore: 70, attempts: 0, maxAttempts: 3, status: 'locked' },
];

/* ── Component ── */

const QuizzesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabLabels = ['All', 'Completed', 'Available', 'Failed', 'Locked'];
  const tabFilter: Record<number, QuizStatus | null> = { 0: null, 1: 'completed', 2: 'available', 3: 'failed', 4: 'locked' };

  const filtered = quizzes.filter((q) => {
    const f = tabFilter[activeTab];
    return f ? q.status === f : true;
  });

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, overflowX: 'hidden', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>Quizzes</Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>Test your knowledge and track your quiz performance</Typography>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, index) => (
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

        {/* Quiz List */}
        <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 1.5 }, '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 } }}>
              {tabLabels.map((l) => <Tab key={l} label={l} />)}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <QuizIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No quizzes found</Typography>
              </Box>
            ) : (
              filtered.map((quiz) => {
                const st = statusStyles[quiz.status];
                return (
                  <Box key={quiz.id} sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: 2, mb: 1, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: quiz.status !== 'locked' ? 'pointer' : 'default', opacity: quiz.status === 'locked' ? 0.6 : 1, '&:hover': quiz.status !== 'locked' ? { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } : {} }}>
                    {/* Icon */}
                    <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: st.bg, color: st.color, '& svg': { fontSize: 22 } }}>
                      {quiz.status === 'completed' ? <PassIcon /> : quiz.status === 'failed' ? <FailIcon /> : quiz.status === 'locked' ? <LockIcon /> : <QuizIcon />}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{quiz.title}</Typography>
                        <Chip label={st.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: st.bg, color: st.color }} />
                      </Box>
                      <Typography color="text.disabled" sx={{ fontSize: '0.78rem', mb: 0.5 }}>{quiz.course}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.disabled', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                        <span>📝 {quiz.questions} questions</span>
                        <span>⏱️ {quiz.duration}</span>
                        <span>🎯 Pass: {quiz.passingScore}%</span>
                        <span>🔄 {quiz.attempts}/{quiz.maxAttempts} attempts</span>
                      </Box>
                    </Box>

                    {/* Score + Action */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      {quiz.score !== undefined && (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: quiz.score >= quiz.passingScore ? '#10b981' : '#ef4444' }}>{quiz.score}%</Typography>
                          <Typography color="text.disabled" sx={{ fontSize: '0.65rem' }}>{quiz.completedDate}</Typography>
                        </Box>
                      )}
                      {quiz.dueDate && (
                        <Typography color="text.disabled" sx={{ fontSize: '0.72rem' }}>Due: {quiz.dueDate}</Typography>
                      )}
                      {quiz.status === 'available' && (
                        <Button size="small" variant="contained" startIcon={<StartIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', borderRadius: '50px', boxShadow: 'none', px: 2, color: 'white', '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' } }}>Start</Button>
                      )}
                      {quiz.status === 'failed' && quiz.attempts < quiz.maxAttempts && (
                        <Button size="small" variant="outlined" startIcon={<RetryIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', borderRadius: '50px', borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', '&:hover': { borderColor: 'primary.main', color: 'primary.dark' } }}>Retry</Button>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Score Distribution */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            <Typography color="text.disabled" sx={{ fontSize: '0.78rem', mb: 1 }}>Score Distribution</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 40 }}>
              {[2, 0, 1, 3, 6].map((count, i) => (
                <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: '100%', height: Math.max(count * 8, 4), borderRadius: 2, bgcolor: i >= 3 ? 'rgba(16,185,129,0.3)' : i >= 2 ? 'rgba(255,164,36,0.3)' : 'rgba(239,68,68,0.2)', transition: 'height 0.3s' }} />
                  <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>{['0-59', '60-69', '70-79', '80-89', '90+'][i]}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default QuizzesPage;
