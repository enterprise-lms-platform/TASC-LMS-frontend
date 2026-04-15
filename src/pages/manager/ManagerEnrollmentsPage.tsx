import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { School as SchoolIcon, Search as SearchIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { courseApi } from '../../services/main.api';
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

const statusChipColor = (status: string): 'success' | 'info' | 'error' | 'warning' | 'default' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'completed':
      return 'info';
    case 'dropped':
      return 'error';
    case 'expired':
      return 'warning';
    default:
      return 'default';
  }
};

const getKpiColor = (label: string) => {
  switch (label) {
    case 'Matching enrollments':
      return { bgcolor: '#fff3e0', color: '#7c2d12' };
    case 'Active (this page)':
      return { bgcolor: '#dcfce7', color: '#14532d' };
    case 'Completed (this page)':
      return { bgcolor: '#eff6ff', color: '#1e3a5f' };
    case 'Dropped (this page)':
      return { bgcolor: '#fee2e2', color: '#991b1b' };
    default:
      return { bgcolor: '#f5f5f5', color: '#666' };
  }
};

const toProgressNumber = (v: unknown): number => {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
};

const formatStatusLabel = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : '';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DEFAULT_ORDERING = '-enrolled_at';

const ManagerEnrollmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>(''); // '' = all; else API status value
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, courseFilter, statusFilter, rowsPerPage]);

  const listParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      course: courseFilter !== 'all' ? courseFilter : undefined,
      status: statusFilter || undefined,
      page: page + 1,
      page_size: rowsPerPage,
      ordering: DEFAULT_ORDERING,
    }),
    [debouncedSearch, courseFilter, statusFilter, page, rowsPerPage],
  );

  const { data: listData, isLoading: enrollmentsLoading } = useEnrollmentList(listParams);

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'list'],
    queryFn: () => courseApi.getAll({ limit: 100 }).then((r) => r.data),
  });

  const courses = coursesData?.results ?? (Array.isArray(coursesData) ? coursesData : []);

  const courseOptions: Array<{ id: number | 'all'; title: string }> = [
    { id: 'all', title: 'All Courses' },
    ...courses.map((c: { id: number; title: string }) => ({ id: c.id, title: c.title })),
  ];

  const results = listData?.results ?? [];
  const totalCount = listData?.count ?? 0;

  const pageStatusCounts = useMemo(() => {
    let active = 0;
    let completed = 0;
    let dropped = 0;
    for (const e of results) {
      if (e.status === 'active') active += 1;
      else if (e.status === 'completed') completed += 1;
      else if (e.status === 'dropped') dropped += 1;
    }
    return { active, completed, dropped };
  }, [results]);

  const kpis = useMemo(
    () => [
      { label: 'Matching enrollments', value: totalCount.toLocaleString(), ...getKpiColor('Matching enrollments') },
      { label: 'Active (this page)', value: pageStatusCounts.active.toString(), ...getKpiColor('Active (this page)') },
      { label: 'Completed (this page)', value: pageStatusCounts.completed.toString(), ...getKpiColor('Completed (this page)') },
      { label: 'Dropped (this page)', value: pageStatusCounts.dropped.toString(), ...getKpiColor('Dropped (this page)') },
    ],
    [totalCount, pageStatusCounts],
  );

  const isLoading = enrollmentsLoading || coursesLoading;

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <SchoolIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                All Enrollments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage course enrollments
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Status counts in the second row reflect the current page only. &quot;Matching enrollments&quot; is the total for your filters (all pages).
          </Typography>

          <Grid container spacing={2} sx={{ my: 2 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, sm: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: kpi.bgcolor,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} sx={{ color: kpi.color }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.color, opacity: 0.8, fontWeight: 500 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search learners or courses..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ minWidth: 240 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={courseFilter}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCourseFilter(val === 'all' ? 'all' : Number(val));
                    }}
                    label="Course"
                  >
                    {courseOptions.map((opt) => (
                      <MenuItem key={String(opt.id)} value={opt.id}>
                        {opt.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="dropped">Dropped</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Learner</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Enrolled Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Last Activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No enrollments found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((enrollment: Enrollment) => {
                      const pct = toProgressNumber(enrollment.progress_percentage);
                      const st = enrollment.status ?? '';
                      return (
                        <TableRow key={enrollment.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 34,
                                  height: 34,
                                  fontSize: '0.8rem',
                                  bgcolor: '#ffa424',
                                  fontWeight: 600,
                                }}
                              >
                                {getInitials(enrollment.user_name || enrollment.user_email || '?')}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600} noWrap>
                                  {enrollment.user_name || '—'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {enrollment.user_email || ''}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {enrollment.course_title || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {enrollment.enrolled_at
                                ? new Date(enrollment.enrolled_at).toLocaleDateString()
                                : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 130 }}>
                              <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{
                                  flex: 1,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: 'grey.200',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    background:
                                      pct === 100
                                        ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                                        : pct >= 50
                                          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                          : 'linear-gradient(90deg, #f87171, #ef4444)',
                                  },
                                }}
                              />
                              <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
                                {pct}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={formatStatusLabel(st)}
                              size="small"
                              color={statusChipColor(st)}
                              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {enrollment.last_accessed_at
                                ? new Date(enrollment.last_accessed_at).toLocaleString()
                                : '—'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerEnrollmentsPage;
