import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Assignment as QuizIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Quiz as TotalQuizzesIcon,
  TrendingUp as PassRateIcon,
  People as AttemptsIcon,
  Score as ScoreIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { useAssessmentStats, submissionApi } from '../../services/learning.services';

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

// ── Utility function to determine pass rate color ──
const getPassRateColor = (rate: number) => {
  if (rate > 70) return '#16a34a';
  if (rate >= 50) return '#f59e0b';
  return '#ef4444';
};

const ManagerQuizzesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');

  // Fetch assessment stats (includes quiz data)
  const { data: stats, isLoading: statsLoading } = useAssessmentStats();

  // Fetch quiz submissions using the API
  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ['quiz-submissions', 'all'],
    queryFn: () => submissionApi.getAll({ page_size: 100 }).then(r => r.data),
    select: (data) => Array.isArray(data) ? data : (data as any).results || [],
  });

  const submissions = submissionsData || [];

  const courses = []; // Could be wired to course list if needed

  const statsData = stats || {
    total_quizzes: 0,
    average_quiz_score: 0,
    quiz_pass_rate: 0,
    total_assignments: 0,
  };

  const kpis = [
    { label: 'Total Quizzes', value: statsLoading ? '—' : (statsData.total_quizzes || '—'), icon: <TotalQuizzesIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Avg Pass Rate', value: statsLoading ? '—' : (statsData.quiz_pass_rate ? `${statsData.quiz_pass_rate}%` : '—'), icon: <PassRateIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Total Attempts', value: statsLoading ? '—' : (statsData.total_quizzes || '—'), icon: <AttemptsIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
    { label: 'Avg Score', value: statsLoading ? '—' : (statsData.average_quiz_score ? `${statsData.average_quiz_score}%` : '—'), icon: <ScoreIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
  ];

  const filteredQuizzes = submissions.filter((q) => {
    const quizTitle = q.quiz_title || q.quiz?.title || 'Untitled Quiz';
    const matchSearch = quizTitle.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const isLoading = statsLoading || submissionsLoading;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QuizIcon sx={{ color: '#ffa424', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Quizzes</Typography>
              <Typography variant="body2" color="text.secondary">Oversee quizzes across all courses</Typography>
            </Box>
          </Box>

          {/* KPI Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    height: '100%',
                    minHeight: 140,
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
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      '& svg': { fontSize: 20 },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Quizzes Table */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>All Quiz Submissions</Typography>
              <TextField
                size="small"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', bgcolor: 'grey.50', borderBottom: 2, borderColor: 'divider' } }}>
                      <TableCell>Quiz</TableCell>
                      <TableCell>Learner</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell align="center">Score</TableCell>
                      <TableCell align="center">Pass/Fail</TableCell>
                      <TableCell align="center">Submitted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredQuizzes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No quiz submissions found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuizzes.map((submission) => (
                        <TableRow key={submission.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {submission.quiz?.session?.title || submission.quiz_title || 'Untitled Quiz'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {submission.enrollment?.user?.first_name} {submission.enrollment?.user?.last_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {submission.enrollment?.course?.title || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>
                              {submission.score}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={submission.passed ? 'Passed' : 'Failed'}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.72rem',
                                height: 24,
                                bgcolor: submission.passed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: submission.passed ? '#10b981' : '#ef4444',
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">
                              {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : '—'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerQuizzesPage;
