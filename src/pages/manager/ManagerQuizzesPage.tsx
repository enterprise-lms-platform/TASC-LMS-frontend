import React, { useMemo, useState } from 'react';
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
  TableFooter,
  TablePagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Assignment as QuizIcon,
  Search as SearchIcon,
  Quiz as TotalQuizzesIcon,
  TrendingUp as PassRateIcon,
  People as AttemptsIcon,
  Score as ScoreIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { useAssessmentStats, quizSubmissionApi } from '../../services/learning.services';

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

/** Rows from GET /learning/quiz-submissions/ (QuizSubmissionSerializer). */
interface QuizSubmissionRow {
  id: number;
  quiz_title?: string | null;
  course_title?: string | null;
  attempt_number: number;
  score?: number | null;
  max_score: number;
  passed: boolean;
  submitted_at: string;
}

function normalizeQuizSubmissionsPage(data: unknown): { results: QuizSubmissionRow[]; count: number } {
  if (data && typeof data === 'object' && 'results' in data) {
    const d = data as { results?: QuizSubmissionRow[]; count?: number };
    return {
      results: Array.isArray(d.results) ? d.results : [],
      count: typeof d.count === 'number' ? d.count : 0,
    };
  }
  if (Array.isArray(data)) {
    const arr = data as QuizSubmissionRow[];
    return { results: arr, count: arr.length };
  }
  return { results: [], count: 0 };
}

const formatScore = (row: QuizSubmissionRow): string => {
  if (row.score == null || row.max_score == null) return '—';
  return `${row.score} / ${row.max_score}`;
};

const ManagerQuizzesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErr,
  } = useAssessmentStats();

  const {
    data: listPayload,
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useQuery({
    queryKey: ['quiz-submissions', 'manager', page, rowsPerPage],
    queryFn: () =>
      quizSubmissionApi.getAll({ page: page + 1, page_size: rowsPerPage }).then((r) => normalizeQuizSubmissionsPage(r.data)),
  });

  const rows = listPayload?.results ?? [];
  const totalCount = listPayload?.count ?? 0;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const title = (r.quiz_title || '').toLowerCase();
      const course = (r.course_title || '').toLowerCase();
      return title.includes(q) || course.includes(q);
    });
  }, [rows, search]);

  const kpis = useMemo(() => {
    const dash = statsError ? '—' : statsLoading ? '…' : null;
    return [
      {
        label: 'Quiz attempts',
        hint: 'Rows in quiz submissions (your role scope)',
        value: dash ?? String(stats?.total_quizzes ?? 0),
        icon: <TotalQuizzesIcon />,
        bgcolor: '#fff3e0',
        iconBg: '#ffa424',
        color: '#7c2d12',
        subColor: '#9a3412',
      },
      {
        label: 'Average quiz score',
        hint: 'Mean score field on quiz attempts (same scope)',
        value: dash ?? (stats?.average_quiz_score != null ? String(stats.average_quiz_score) : '0'),
        icon: <ScoreIcon />,
        bgcolor: '#fef9c3',
        iconBg: '#facc15',
        color: '#713f12',
        subColor: '#854d0e',
      },
      {
        label: 'Quiz pass rate',
        hint: 'Passed attempts ÷ total attempts',
        value: dash ?? (stats?.quiz_pass_rate != null ? `${stats.quiz_pass_rate}%` : '0%'),
        icon: <PassRateIcon />,
        bgcolor: '#dcfce7',
        iconBg: '#4ade80',
        color: '#14532d',
        subColor: '#166534',
      },
      {
        label: 'Assignment submissions',
        hint: 'All assignment submission rows (same scope)',
        value: dash ?? String(stats?.total_assignments ?? 0),
        icon: <AttemptsIcon />,
        bgcolor: '#eff6ff',
        iconBg: '#3b82f6',
        color: '#1e3a5f',
        subColor: '#1e40af',
      },
    ];
  }, [stats, statsLoading, statsError]);

  const isTableLoading = listLoading;
  const showTableError = listError && !isTableLoading;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QuizIcon sx={{ color: '#ffa424', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Quizzes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quiz attempt activity and assessment aggregates (server-scoped)
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            KPIs use GET /learning/submissions/stats/ (assignments + quizzes). The table lists individual quiz attempts from GET
            /learning/quiz-submissions/. No per-quiz analytics are derived here.
          </Typography>

          {statsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {String((statsErr as Error)?.message ?? 'Could not load assessment statistics.')}
            </Alert>
          )}

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
                    minHeight: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
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
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: kpi.color,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: kpi.subColor, opacity: 0.85, mb: 0.5, px: 1 }}>
                    {kpi.hint}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.9 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Quiz attempts</Typography>
              <TextField
                size="small"
                placeholder="Search by quiz or course title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 260, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>

            {showTableError && (
              <Box sx={{ px: 3, py: 2 }}>
                <Alert severity="error">{String((listErr as Error)?.message ?? 'Could not load quiz attempts.')}</Alert>
              </Box>
            )}

            {isTableLoading && !showTableError ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          '& th': {
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: 'text.secondary',
                            bgcolor: 'grey.50',
                            borderBottom: 2,
                            borderColor: 'divider',
                          },
                        }}
                      >
                        <TableCell>Quiz title</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell align="center">Attempt #</TableCell>
                        <TableCell align="center">Score</TableCell>
                        <TableCell align="center">Passed</TableCell>
                        <TableCell align="center">Submitted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              {search.trim()
                                ? 'No attempts match your search on this page.'
                                : 'No quiz attempts in this page of results.'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRows.map((row) => (
                          <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {row.quiz_title || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {row.course_title || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">{row.attempt_number}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={600}>
                                {formatScore(row)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">{row.passed ? 'Yes' : 'No'}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" color="text.secondary">
                                {row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '—'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[10, 20, 50, 100]}
                          count={totalCount}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={(_, newPage) => setPage(newPage)}
                          onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                          }}
                          colSpan={6}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerQuizzesPage;
