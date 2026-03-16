import React, { useState, useMemo } from 'react';
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
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { enrollmentApi, courseApi, sessionProgressApi } from '../../services/main.api';

// ─── Styles ────────────────────────────────────────────────

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

const statusChipColor = (status: string) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Completed': return 'info';
    case 'Dropped': return 'error';
    default: return 'default';
  }
};

const getKpiColor = (label: string) => {
  switch (label) {
    case 'Total Enrollments': return { bgcolor: '#fff3e0', color: '#7c2d12' };
    case 'Active': return { bgcolor: '#dcfce7', color: '#14532d' };
    case 'Completed': return { bgcolor: '#eff6ff', color: '#1e3a5f' };
    case 'Dropped': return { bgcolor: '#fee2e2', color: '#991b1b' };
    default: return { bgcolor: '#f5f5f5', color: '#666' };
  }
};

// ─── Component ─────────────────────────────────────────────

const ManagerEnrollmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', courseFilter, statusFilter],
    queryFn: () => enrollmentApi.getAll({
      course: courseFilter !== 'all' ? courseFilter : undefined,
    }).then(r => r.data),
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'list'],
    queryFn: () => courseApi.getAll({ limit: 100 }).then(r => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ['session-progress', 'all'],
    queryFn: () => sessionProgressApi.getAll({}).then(r => r.data),
  });

  const enrollments = enrollmentsData ?? [];
  const courses = coursesData?.results ?? [];

  const courseOptions: Array<{ id: number | 'all'; title: string }> = [
    { id: 'all', title: 'All Courses' },
    ...courses.map((c) => ({ id: c.id, title: c.title })),
  ];

  const getEnrollmentProgress = (enrollmentId: number) => {
    if (!progressData) return 0;
    const results = (progressData as Record<string, any>)?.results ?? [];
    const prog = results.find((p: Record<string, any>) => p.enrollment === enrollmentId);
    return prog?.progress || 0;
  };

  const getLearnerName = (enrollment: Record<string, any>) => {
    return enrollment.learner?.name || enrollment.user?.name || 'Unknown';
  };

  const getLearnerEmail = (enrollment: Record<string, any>) => {
    return enrollment.learner?.email || enrollment.user?.email || '';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCourseTitle = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.title || 'Unknown Course';
  };

  const getEnrollmentStatus = (enrollment: Record<string, any>): 'Active' | 'Completed' | 'Dropped' => {
    if (enrollment.completed_at) return 'Completed';
    if (enrollment.is_active === false) return 'Dropped';
    return 'Active';
  };

  const filteredEnrollments = useMemo(() => {
    if (!enrollments.length) return [];
    return enrollments.filter((e) => {
      const learnerName = getLearnerName(e).toLowerCase();
      const learnerEmail = getLearnerEmail(e).toLowerCase();
      const courseTitle = getCourseTitle(e.course).toLowerCase();
      const matchSearch = search === '' ||
        learnerName.includes(search.toLowerCase()) ||
        learnerEmail.includes(search.toLowerCase()) ||
        courseTitle.includes(search.toLowerCase());
      const matchCourse = courseFilter === 'all' || e.course === courseFilter;
      const matchStatus = statusFilter === 'All' || getEnrollmentStatus(e) === statusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [enrollments, search, courseFilter, statusFilter, courses]);

  const kpis = useMemo(() => {
    if (!enrollments.length) return [];
    const active = enrollments.filter((e) => getEnrollmentStatus(e) === 'Active').length;
    const completed = enrollments.filter((e) => getEnrollmentStatus(e) === 'Completed').length;
    const dropped = enrollments.filter((e) => getEnrollmentStatus(e) === 'Dropped').length;
    return [
      { label: 'Total Enrollments', value: enrollments.length.toString(), ...getKpiColor('Total Enrollments') },
      { label: 'Active', value: active.toString(), ...getKpiColor('Active') },
      { label: 'Completed', value: completed.toString(), ...getKpiColor('Completed') },
      { label: 'Dropped', value: dropped.toString(), ...getKpiColor('Dropped') },
    ];
  }, [enrollments]);

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
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Page Header */}
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
              <Typography variant="h5" fontWeight={700}>All Enrollments</Typography>
              <Typography variant="body2" color="text.secondary">Track and manage course enrollments</Typography>
            </Box>
          </Box>

          {/* KPI Row */}
          <Grid container spacing={2} sx={{ my: 3 }}>
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
                  <Typography variant="h4" fontWeight={700} sx={{ color: kpi.color }}>{kpi.value}</Typography>
                  <Typography variant="body2" sx={{ color: kpi.color, opacity: 0.8, fontWeight: 500 }}>{kpi.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Enrollments Table Card */}
          <Paper elevation={0} sx={cardSx}>
            {/* Toolbar */}
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search learners or courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                    {courseOptions.map((opt: any) => (
                      <MenuItem key={opt.id} value={opt.id}>{opt.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Dropped">Dropped</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Table */}
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
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">No enrollments found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((enrollment: any) => {
                      const learnerName = getLearnerName(enrollment);
                      const learnerEmail = getLearnerEmail(enrollment);
                      const progress = getEnrollmentProgress(enrollment.id);
                      const status = getEnrollmentStatus(enrollment);
                      return (
                    <TableRow key={enrollment.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      {/* Learner */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: '#ffa424', fontWeight: 600 }}>
                            {getInitials(learnerName)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{learnerName}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>{learnerEmail}</Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Course */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{getCourseTitle(enrollment.course)}</Typography>
                      </TableCell>

                      {/* Enrolled Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : '-'}
                        </Typography>
                      </TableCell>

                      {/* Progress */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 130 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: progress === 100
                                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                                  : progress >= 50
                                    ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                    : 'linear-gradient(90deg, #f87171, #ef4444)',
                              },
                            }}
                          />
                          <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
                            {progress}%
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          color={statusChipColor(status) as 'success' | 'info' | 'error' | 'default'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>

                      {/* Last Activity */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {enrollment.last_activity || enrollment.updated_at ? new Date(enrollment.last_activity || enrollment.updated_at).toLocaleDateString() : '-'}
                        </Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" sx={{ color: '#3b82f6' }}><ViewIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" sx={{ color: '#f59e0b' }}><EditIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="More">
                            <IconButton size="small" sx={{ color: '#6b7280' }}><MoreIcon fontSize="small" /></IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                      );
                    }))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerEnrollmentsPage;
