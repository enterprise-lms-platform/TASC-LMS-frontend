import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as ActiveLearnersIcon,
  Warning as AtRiskIcon,
  Speed as CompletionIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { useLearningStats, useTopCoursePerformance } from '../../services/learning.services';
import { useEnrollmentList } from '../../hooks/useLearning';
import type { Enrollment } from '../../types/types';

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

const INACTIVE_RISK_DAYS = 14;
const AT_RISK_PROGRESS_LT = 50;
const TOP_COURSES_LIMIT = 50;

const toProgressNumber = (v: unknown): number => {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
};

const daysSince = (iso: string): number => {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
};

/** Wave 1 rule: active, no activity for more than 14 days, progress under 50%. */
const isAtRiskEnrollment = (e: Enrollment): boolean => {
  if (e.status !== 'active') return false;
  const pct = toProgressNumber(e.progress_percentage);
  if (pct >= AT_RISK_PROGRESS_LT) return false;
  if (!e.last_accessed_at) return false;
  return daysSince(e.last_accessed_at) > INACTIVE_RISK_DAYS;
};

const getRiskColor = (days: number) => {
  if (days >= 20) return '#ef4444';
  if (days >= INACTIVE_RISK_DAYS) return '#f97316';
  return '#f59e0b';
};

const getRiskLabel = (days: number) => {
  if (days >= 20) return 'Critical';
  if (days >= INACTIVE_RISK_DAYS) return 'High';
  return 'Medium';
};

const completionBarColor = (rate: number) => {
  if (rate >= 60) return '#16a34a';
  if (rate >= 40) return '#f59e0b';
  return '#ef4444';
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ManagerProgressPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErr,
  } = useLearningStats();

  const {
    data: topCourses,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErr,
  } = useTopCoursePerformance(TOP_COURSES_LIMIT);

  const enrollmentListParams = useMemo(
    () => ({
      status: 'active',
      ordering: 'last_accessed_at',
      page: 1,
      page_size: 100,
    }),
    [],
  );

  const {
    data: enrollmentPage,
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    error: enrollmentsErr,
  } = useEnrollmentList(enrollmentListParams);

  const atRiskRows = useMemo(() => {
    const results = enrollmentPage?.results ?? [];
    return results.filter(isAtRiskEnrollment);
  }, [enrollmentPage]);

  const statsKpis = useMemo(() => {
    const active = stats?.active_learners ?? 0;
    const avg = stats?.avg_completion_rate ?? 0;
    const loadingOrError = statsError ? '—' : statsLoading ? '…' : null;
    return [
      {
        label: 'Active Learners',
        value: loadingOrError ?? active.toLocaleString(),
        icon: <ActiveLearnersIcon />,
        bgcolor: '#fff3e0',
        iconBg: '#ffa424',
        color: '#7c2d12',
        subColor: '#9a3412',
      },
      {
        label: 'Avg Completion',
        value: loadingOrError ?? `${avg}%`,
        icon: <CompletionIcon />,
        bgcolor: '#dcfce7',
        iconBg: '#4ade80',
        color: '#14532d',
        subColor: '#166534',
      },
    ];
  }, [stats, statsLoading, statsError]);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
              <TrendingUpIcon sx={{ color: '#ffa424', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Progress Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track learner progress across courses
              </Typography>
            </Box>
          </Box>

          {statsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {String((statsErr as Error)?.message ?? 'Could not load learning statistics.')}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {statsKpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 6 }} key={kpi.label}>
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
                      mb: 1,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}
                  >
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Course completion overview</Typography>
              <Typography variant="body2" color="text.secondary">
                Top courses by enrollment (completion rate = completed ÷ enrolled)
              </Typography>
            </Box>
            {coursesError && (
              <Box sx={{ px: 3, py: 2 }}>
                <Alert severity="error">
                  {String((coursesErr as Error)?.message ?? 'Could not load course performance.')}
                </Alert>
              </Box>
            )}
            {coursesLoading && !coursesError ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : !topCourses?.length ? (
              <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No course performance data available.</Typography>
              </Box>
            ) : (
              <Box sx={{ p: 0 }}>
                {topCourses.map((row, i) => {
                  const barColor = completionBarColor(row.completion_rate);
                  return (
                    <Box
                      key={row.course_id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2.5,
                        px: 3,
                        borderBottom: i < topCourses.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                        flexWrap: { xs: 'wrap', md: 'nowrap' },
                      }}
                    >
                      <Box sx={{ minWidth: { xs: '100%', md: 220 } }}>
                        <Typography variant="body2" fontWeight={600}>
                          {row.course_title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.enrollments} enrolled · {row.completed} completed
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Completion rate
                          </Typography>
                          <Typography variant="caption" fontWeight={700} sx={{ color: barColor }}>
                            {row.completion_rate}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={row.completion_rate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: barColor,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AtRiskIcon sx={{ fontSize: 20, color: '#ef4444' }} />
                <Typography fontWeight={700}>At-risk enrollments</Typography>
              </Box>
              <Chip
                label={`${atRiskRows.length} match`}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  height: 24,
                  bgcolor: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                }}
              />
            </Box>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Based on the first 100 active enrollments (oldest last activity first). At-risk rule: enrollment
                status active, last activity more than {INACTIVE_RISK_DAYS} days ago, progress under{' '}
                {AT_RISK_PROGRESS_LT}%.
              </Typography>
            </Box>
            {enrollmentsError && (
              <Box sx={{ px: 3, pb: 2 }}>
                <Alert severity="error">
                  {String((enrollmentsErr as Error)?.message ?? 'Could not load enrollments.')}
                </Alert>
              </Box>
            )}
            {enrollmentsLoading && !enrollmentsError ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
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
                      <TableCell>Learner</TableCell>
                      <TableCell>Course</TableCell>
                      <TableCell align="center">Progress</TableCell>
                      <TableCell align="center">Days inactive</TableCell>
                      <TableCell align="center">Last activity</TableCell>
                      <TableCell align="center">Risk level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {atRiskRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">
                            No enrollments match the at-risk rule in this loaded set.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      atRiskRows.map((e) => {
                        const days = e.last_accessed_at ? daysSince(e.last_accessed_at) : 0;
                        const pct = toProgressNumber(e.progress_percentage);
                        const name = e.user_name || '—';
                        return (
                          <TableRow
                            key={e.id}
                            sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar
                                  sx={{
                                    width: 34,
                                    height: 34,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                                  }}
                                >
                                  {getInitials(name)}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="body2" fontWeight={600} noWrap>
                                    {name}
                                  </Typography>
                                  {e.user_email ? (
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                      {e.user_email}
                                    </Typography>
                                  ) : null}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {e.course_title || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={pct}
                                  sx={{
                                    width: 60,
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: 'grey.100',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      bgcolor: '#ef4444',
                                    },
                                  }}
                                />
                                <Typography variant="body2" fontWeight={600} sx={{ color: '#ef4444', minWidth: 30 }}>
                                  {pct}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight={700} sx={{ color: getRiskColor(days) }}>
                                {days} days
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" color="text.secondary">
                                {e.last_accessed_at
                                  ? new Date(e.last_accessed_at).toLocaleString()
                                  : '—'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={getRiskLabel(days)}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.72rem',
                                  height: 24,
                                  bgcolor: `${getRiskColor(days)}18`,
                                  color: getRiskColor(days),
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
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

export default ManagerProgressPage;
