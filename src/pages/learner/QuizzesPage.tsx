import React, { useState, useMemo } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  Tabs, Tab, Button, CircularProgress,
} from '@mui/material';
import {
  Quiz as QuizIcon, CheckCircle as PassIcon, Cancel as FailIcon,
  AccessTime as TimeIcon, TrendingUp as ScoreIcon,
  PlayArrow as StartIcon,
} from '@mui/icons-material';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { enrollmentApi, sessionProgressApi } from '../../services/learning.services';
import { sessionApi } from '../../services/catalogue.services';
import { queryKeys } from '../../hooks/queryKeys';
import type { SessionProgress, QuizDetailResponse, Enrollment } from '../../types/types';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';

/* ── Types ── */

type QuizStatus = 'completed' | 'available' | 'failed';

const statusStyles: Record<QuizStatus, { bg: string; color: string; label: string }> = {
  completed: { bg: 'rgba(16,185,129,0.08)', color: '#10b981', label: 'Passed' },
  available: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6', label: 'Available' },
  failed:    { bg: 'rgba(239,68,68,0.08)', color: '#ef4444', label: 'Failed' },
};

interface QuizRow {
  sessionId: number;
  title: string;
  courseTitle: string;
  courseId: number;
  questions: number;
  duration: string;
  passingScore: number;
  maxAttempts: number;
  status: QuizStatus;
  isCompleted: boolean;
  timeSpent: number;
}

/* ── Component ── */

const QuizzesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  // Fetch enrollments
  const { data: enrollmentsRes } = useQuery({
    queryKey: queryKeys.enrollments.all,
    queryFn: () => enrollmentApi.getAll().then((r) => r.data),
  });
  const enrollments = enrollmentsRes ?? [];

  // Fetch session progress (all quiz-type sessions)
  const { data: progressRes } = useQuery({
    queryKey: queryKeys.sessionProgress.all({}),
    queryFn: () => sessionProgressApi.getAll({}).then((r) => r.data),
  });
  const allProgress: SessionProgress[] = Array.isArray(progressRes)
    ? progressRes
    : (progressRes as unknown as { results?: SessionProgress[] })?.results ?? [];

  // Filter quiz-type sessions from progress
  const quizProgress = useMemo(
    () => allProgress.filter((p) => p.session_type === 'quiz'),
    [allProgress],
  );

  // Fetch quiz details for each quiz session (settings: questions, passing_score, etc.)
  const quizDetailQueries = useQueries({
    queries: quizProgress.map((p) => ({
      queryKey: queryKeys.quiz.detail(p.session),
      queryFn: () => sessionApi.getQuiz(p.session).then((r) => r.data),
      enabled: !!p.session,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Build quiz rows by joining progress with quiz details
  const quizRows: QuizRow[] = useMemo(() => {
    return quizProgress.map((prog, i) => {
      const detail: QuizDetailResponse | undefined = quizDetailQueries[i]?.data as QuizDetailResponse | undefined;
      const enrollmentsList = Array.isArray(enrollments) ? enrollments : [];
      const enrollment = enrollmentsList.find((e: Enrollment) => e.id === prog.enrollment);

      const questionCount = detail?.questions?.length ?? 0;
      const passingScore = detail?.settings?.passing_score_percent ?? 70;
      const maxAttempts = detail?.settings?.max_attempts ?? 1;
      const timeLimit = detail?.settings?.time_limit_minutes;

      let status: QuizStatus = 'available';
      if (prog.is_completed) {
        status = 'completed';
      }
      // No score from backend yet so we can't determine 'failed' — treat as completed or available

      return {
        sessionId: prog.session,
        title: prog.session_title || detail?.session?.title || 'Quiz',
        courseTitle: enrollment?.course_title ?? '',
        courseId: enrollment?.course ?? 0,
        questions: questionCount,
        duration: timeLimit ? `${timeLimit} min` : `${prog.duration_minutes || 0} min`,
        passingScore,
        maxAttempts,
        status,
        isCompleted: prog.is_completed,
        timeSpent: prog.time_spent_minutes,
      };
    });
  }, [quizProgress, quizDetailQueries, enrollments]);

  const isLoading = !enrollmentsRes || !progressRes;

  const tabLabels = ['All', 'Completed', 'Available'];
  const tabFilter: Record<number, QuizStatus | null> = { 0: null, 1: 'completed', 2: 'available' };

  const filtered = quizRows.filter((q) => {
    const f = tabFilter[activeTab];
    return f ? q.status === f : true;
  });

  const completedCount = quizRows.filter((q) => q.status === 'completed').length;
  const pendingCount = quizRows.filter((q) => q.status === 'available').length;

  /* ── KPIs computed from real data ── */
  const kpis = [
    {
      label: 'Total Quizzes',
      value: String(quizRows.length),
      icon: <QuizIcon />,
      bgcolor: '#dbeafe', iconBg: '#93c5fd', color: '#1e3a8a', subColor: '#1e40af',
    },
    {
      label: 'Completed',
      value: String(completedCount),
      icon: <PassIcon />,
      bgcolor: '#dcfce7', iconBg: '#86efac', color: '#14532d', subColor: '#166534',
    },
    {
      label: 'Avg. Score',
      value: '—',
      icon: <ScoreIcon />,
      bgcolor: '#ffedd5', iconBg: '#fdba74', color: '#7c2d12', subColor: '#9a3412',
    },
    {
      label: 'Pending',
      value: String(pendingCount),
      icon: <TimeIcon />,
      bgcolor: '#f3e8ff', iconBg: '#d8b4fe', color: '#581c87', subColor: '#6b21a8',
    },
  ];

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
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Box sx={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', bgcolor: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', '& svg': { fontSize: 20 } }}>
                  {k.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: k.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                  {k.value}
                </Typography>
                <Typography variant="body2" sx={{ color: k.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
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
            {isLoading ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress size={32} sx={{ color: '#ffa424' }} />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <QuizIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No quizzes found</Typography>
              </Box>
            ) : (
              filtered.map((quiz) => {
                const st = statusStyles[quiz.status];
                return (
                  <Box
                    key={quiz.sessionId}
                    sx={{
                      display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' },
                      flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: 2, mb: 1,
                      borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)',
                      transition: 'all 0.2s', cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
                    }}
                    onClick={() => {
                      if (quiz.courseId) navigate(`/learner/course/${quiz.courseId}/learn`);
                    }}
                  >
                    {/* Icon */}
                    <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: st.bg, color: st.color, '& svg': { fontSize: 22 } }}>
                      {quiz.status === 'completed' ? <PassIcon /> : quiz.status === 'failed' ? <FailIcon /> : <QuizIcon />}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{quiz.title}</Typography>
                        <Chip label={st.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: st.bg, color: st.color }} />
                      </Box>
                      <Typography color="text.disabled" sx={{ fontSize: '0.78rem', mb: 0.5 }}>{quiz.courseTitle}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.disabled', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                        {quiz.questions > 0 && <span>{quiz.questions} questions</span>}
                        <span>{quiz.duration}</span>
                        <span>Pass: {quiz.passingScore}%</span>
                        <span>Max {quiz.maxAttempts} attempt{quiz.maxAttempts !== 1 ? 's' : ''}</span>
                      </Box>
                    </Box>

                    {/* Action */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      {quiz.status === 'available' && (
                        <Button size="small" variant="contained" startIcon={<StartIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', borderRadius: '50px', boxShadow: 'none', px: 2, color: 'white', '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' } }}>Start</Button>
                      )}
                      {quiz.status === 'completed' && (
                        <Chip label="Done" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600 }} />
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default QuizzesPage;
