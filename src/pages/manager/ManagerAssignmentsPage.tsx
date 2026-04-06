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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Task as TaskIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  AssignmentTurnedIn as TotalIcon,
  HourglassBottom as PendingIcon,
  TrendingUp as SubmissionIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { submissionApi } from '../../services/learning.services';
import { sessionApi, courseApi } from '../../services/catalogue.services';
import type { Submission, Session, CourseList } from '../../types/types';

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

const kpiConfig = [
  { label: 'Total Assignments', icon: <TotalIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Pending Grading',   icon: <PendingIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
  { label: 'Total Submitted',   icon: <SubmissionIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Avg Grade',         icon: <GradeIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
];

const getStatusChip = (status: string) => {
  const config: Record<string, { bgcolor: string; color: string }> = {
    Active:     { bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' },
    'Past Due': { bgcolor: 'rgba(239,68,68,0.1)',  color: '#ef4444' },
    Graded:     { bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  };
  const c = config[status] || config.Active;
  return (
    <Chip
      label={status}
      size="small"
      sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24, bgcolor: c.bgcolor, color: c.color }}
    />
  );
};

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ManagerAssignmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const { data: sessionsData, isLoading: loadingSessions } = useQuery({
    queryKey: ['sessions', 'assignment'],
    queryFn: () => sessionApi.getAll({ type: 'assignment', page_size: 200 }).then(r => r.data),
  });

  const { data: submissionsData, isLoading: loadingSubmissions } = useQuery({
    queryKey: ['submissions', 'manager'],
    queryFn: () => submissionApi.getAll({ page_size: 1000 }).then(r => r.data),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'manager-assignments'],
    queryFn: () => courseApi.getAll({ limit: 200 }).then(r => r.data),
  });

  const isLoading = loadingSessions || loadingSubmissions;

  // Build course lookup: id -> title
  const courseMap = useMemo(() => {
    const raw = coursesData as any;
    const list: CourseList[] = Array.isArray(raw) ? raw : (raw?.results ?? []);
    return Object.fromEntries(list.map((c: CourseList) => [c.id, c.title]));
  }, [coursesData]);

  // Normalize sessions (handle paginated or array response)
  const sessions = useMemo(() => {
    const raw = sessionsData as any;
    return (Array.isArray(raw) ? raw : (raw?.results ?? [])) as Session[];
  }, [sessionsData]);

  // Normalize submissions
  const submissions = useMemo(() => {
    const raw = submissionsData as any;
    return (Array.isArray(raw) ? raw : (raw?.results ?? [])) as Submission[];
  }, [submissionsData]);

  // Group submissions by session ID
  const submissionsBySession = useMemo(() => {
    const map: Record<number, Submission[]> = {};
    for (const sub of submissions) {
      const sid = sub.session;
      if (sid != null) {
        if (!map[sid]) map[sid] = [];
        map[sid].push(sub);
      }
    }
    return map;
  }, [submissions]);

  // Build assignment rows from sessions
  const assignmentRows = useMemo(() => {
    return sessions
      .filter(s => s.session_type === 'assignment')
      .map(s => {
        const subs = submissionsBySession[s.id] ?? [];
        const submitted = subs.filter(sub => sub.status !== 'draft');
        const pending = subs.filter(sub => sub.status === 'submitted').length;
        const graded = subs.filter(sub => sub.status === 'graded' && sub.grade != null);
        const avgGrade = graded.length > 0
          ? Math.round(graded.reduce((acc, sub) => acc + (sub.grade ?? 0), 0) / graded.length)
          : null;
        const courseTitle = courseMap[s.course] ?? `Course #${s.course}`;
        const rowStatus = pending > 0 ? 'Active' : submitted.length > 0 ? 'Graded' : 'Active';
        return {
          id: s.id,
          courseId: s.course,
          title: s.title,
          course: courseTitle,
          submissions: submitted.length,
          pendingGrading: pending,
          avgGrade,
          status: rowStatus,
        };
      });
  }, [sessions, submissionsBySession, courseMap]);

  // KPI values
  const kpis = useMemo(() => {
    const totalPending = submissions.filter(s => s.status === 'submitted').length;
    const totalSubmitted = submissions.filter(s => s.status !== 'draft').length;
    const graded = submissions.filter(s => s.status === 'graded' && s.grade != null);
    const avgGrade = graded.length > 0
      ? Math.round(graded.reduce((acc, s) => acc + (s.grade ?? 0), 0) / graded.length)
      : null;
    return [
      { ...kpiConfig[0], value: sessions.filter(s => s.session_type === 'assignment').length.toString() },
      { ...kpiConfig[1], value: totalPending.toString() },
      { ...kpiConfig[2], value: totalSubmitted.toString() },
      { ...kpiConfig[3], value: avgGrade != null ? `${avgGrade}%` : '—' },
    ];
  }, [sessions, submissions]);

  // Unique course options for filter
  const courseOptions = useMemo(() => {
    const titles = [...new Set(assignmentRows.map(r => r.course))].sort();
    return ['All Courses', ...titles];
  }, [assignmentRows]);

  const filtered = assignmentRows.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.course.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === 'All Courses' || a.course === courseFilter;
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}

          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TaskIcon sx={{ color: '#ffa424', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Assignments</Typography>
              <Typography variant="body2" color="text.secondary">Monitor assignments and submissions</Typography>
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
                  <Box sx={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: '50%', bgcolor: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', '& svg': { fontSize: 20 } }}>
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

          {/* Assignments Table */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>All Assignments</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search assignments..."
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
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Course</InputLabel>
                  <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} label="Course" sx={{ borderRadius: '10px' }}>
                    {courseOptions.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ borderRadius: '10px' }}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Past Due">Past Due</MenuItem>
                    <MenuItem value="Graded">Graded</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', bgcolor: 'grey.50', borderBottom: 2, borderColor: 'divider' } }}>
                    <TableCell>Assignment Title</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell align="center">Submissions</TableCell>
                    <TableCell align="center">Pending Grading</TableCell>
                    <TableCell align="center">Avg Grade</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{a.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{a.course}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{a.submissions}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {a.pendingGrading > 0 ? (
                          <Badge badgeContent={a.pendingGrading} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', fontWeight: 700, minWidth: 20, height: 20 } }}>
                            <Box sx={{ width: 24 }} />
                          </Badge>
                        ) : (
                          <Typography variant="body2" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>
                          {a.avgGrade != null ? `${a.avgGrade}%` : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(a.status)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View course">
                            <IconButton
                              size="small"
                              sx={{ color: '#3b82f6' }}
                              onClick={() => navigate(`/manager/courses/${a.courseId}`)}
                            >
                              <ViewIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit course structure">
                            <IconButton
                              size="small"
                              sx={{ color: '#ffa424' }}
                              onClick={() => navigate(`/manager/courses/${a.courseId}/structure`)}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No assignments found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerAssignmentsPage;
