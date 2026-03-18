import React, { useState, useMemo } from 'react';
import React, { useMemo, useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  School as CourseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { courseApi, enrollmentApi, submissionApi } from '../../services/main.api';
import { enrollmentApi } from '../../services/learning.services';
import type { Enrollment } from '../../types/types';

interface Learner {
  id: string;
  name: string;
  initials: string;
  email: string;
  courses: number;
  avgProgress: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'at-risk';
  enrolledDate: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function deriveLearnerStatus(enrollments: Enrollment[]): 'active' | 'inactive' | 'at-risk' {
  const hasActive = enrollments.some((e) => e.status === 'active');
  if (!hasActive) return 'inactive';
  const latest = enrollments.reduce((a, b) =>
    new Date(b.last_accessed_at) > new Date(a.last_accessed_at) ? b : a
  );
  const daysSince = (Date.now() - new Date(latest.last_accessed_at).getTime()) / 86400000;
  if (daysSince > 14) return 'inactive';
  if (daysSince > 5) return 'at-risk';
  return 'active';
}

function groupByLearner(enrollments: Enrollment[]): Learner[] {
  const map = new Map<number, Enrollment[]>();
  for (const e of enrollments) {
    const list = map.get(e.user) || [];
    list.push(e);
    map.set(e.user, list);
  }
  const learners: Learner[] = [];
  map.forEach((enrs, userId) => {
    const first = enrs[0];
    const name = first.user_name || first.user_email;
    const initials = name.split(' ').map((n) => n[0]?.toUpperCase() || '').join('').slice(0, 2);
    const avgProgress = Math.round(enrs.reduce((s, e) => s + e.progress_percentage, 0) / enrs.length);
    const latest = enrs.reduce((a, b) =>
      new Date(b.last_accessed_at) > new Date(a.last_accessed_at) ? b : a
    );
    learners.push({
      id: String(userId),
      name,
      initials,
      email: first.user_email,
      courses: enrs.length,
      avgProgress,
      lastActive: timeAgo(latest.last_accessed_at),
      status: deriveLearnerStatus(enrs),
      enrolledDate: new Date(first.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  });
  return learners;
}

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: '#d1fae5', color: '#059669', label: 'Active' },
  'at-risk': { bg: '#fef3c7', color: '#d97706', label: 'At Risk' },
  inactive: { bg: '#fee2e2', color: '#dc2626', label: 'Inactive' },
};

const InstructorLearnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'instructor'],
    queryFn: () => courseApi.getAll({ instructor_courses: true, limit: 100 }).then(r => r.data),
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', 'learners'],
    queryFn: () => enrollmentApi.getAll().then(r => r.data),
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['submissions', 'learners'],
    queryFn: () => submissionApi.getAll().then(r => r.data),
  });

  const courses = (coursesData?.results ?? []) as Array<{ id: number }>;
  const enrollments = (enrollmentsData ?? []) as Array<{
    id: number; user: number; user_name: string; user_email: string;
    course: number; course_title: string; progress_percentage: number;
    status: string; enrolled_at: string; last_accessed_at: string;
  }>;
=======
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'instructor'],
    queryFn: () => courseApi.getAll({ instructor_courses: true, limit: 100 }).then(r => r.data),
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', 'learners'],
    queryFn: () => enrollmentApi.getAll().then(r => r.data),
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['submissions', 'learners'],
    queryFn: () => submissionApi.getAll().then(r => r.data),
  });

  const courses = (coursesData?.results ?? []) as Array<{ id: number }>;
  const enrollments = (enrollmentsData ?? []) as Array<{
    id: number; user: number; user_name: string; user_email: string;
    course: number; course_title: string; progress_percentage: number;
    status: string; enrolled_at: string; last_accessed_at: string;
  }>;
  const submissions = (submissionsData ?? []) as Array<{ user: number; enrollment: number; grade: number | null }>;

  const instructorCourseIds = useMemo(() => new Set(courses.map(c => c.id)), [courses]);

  const instructorEnrollments = useMemo(() => {
    return enrollments.filter(e => instructorCourseIds.has(e.course));
  }, [enrollments, instructorCourseIds]);

  const learnerStats = useMemo(() => {
    const stats: Record<number, { name: string; email: string; courses: number; totalProgress: number; totalGrade: number; gradeCount: number; lastActive: string; enrolledAt: string }> = {};
    instructorEnrollments.forEach(e => {
      if (!stats[e.user]) {
        stats[e.user] = { name: e.user_name, email: e.user_email, courses: 0, totalProgress: 0, totalGrade: 0, gradeCount: 0, lastActive: e.last_accessed_at, enrolledAt: e.enrolled_at };
      }
      stats[e.user].courses += 1;
      stats[e.user].totalProgress += e.progress_percentage;
      stats[e.user].lastActive = e.last_accessed_at > stats[e.user].lastActive ? e.last_accessed_at : stats[e.user].lastActive;
    });
    submissions.forEach(s => {
      const enrollment = instructorEnrollments.find(e => e.id === s.enrollment);
      if (enrollment && stats[enrollment.user]) {
        if (s.grade !== null && s.grade !== undefined) {
          stats[enrollment.user].totalGrade += s.grade;
          stats[enrollment.user].gradeCount += 1;
        }
      }
    });
    return Object.entries(stats).map(([userId, s]) => ({
      id: userId,
      name: s.name,
      initials: s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      email: s.email,
      courses: s.courses,
      avgProgress: s.courses > 0 ? Math.round(s.totalProgress / s.courses) : 0,
      avgScore: s.gradeCount > 0 ? Math.round(s.totalGrade / s.gradeCount) : 0,
      lastActive: s.lastActive ? timeAgo(s.lastActive) : 'Never',
      status: s.lastActive && isRecent(s.lastActive) ? 'active' : (s.lastActive && isAtRisk(s.lastActive) ? 'at-risk' : 'inactive') as 'active' | 'inactive' | 'at-risk',
      enrolledDate: s.enrolledAt ? new Date(s.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    }));
  }, [instructorEnrollments, submissions]);

  const statusFilter = tab === 0 ? null : tab === 1 ? 'active' : tab === 2 ? 'at-risk' : 'inactive';
  const filtered = learnerStats.filter((l) => {
>>>>>>> feature/Updates
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = learnerStats.filter(l => l.status === 'active').length;
  const atRiskCount = learnerStats.filter(l => l.status === 'at-risk').length;
  const avgScore = learnerStats.length > 0 ? Math.round(learnerStats.reduce((s, l) => s + l.avgScore, 0) / learnerStats.filter(l => l.avgScore > 0).length) || 0 : 0;

  const activeCount = learners.filter((l) => l.status === 'active').length;
  const atRiskCount = learners.filter((l) => l.status === 'at-risk').length;
  const inactiveCount = learners.filter((l) => l.status === 'inactive').length;
  const avgProgress = learners.length ? Math.round(learners.reduce((s, l) => s + l.avgProgress, 0) / learners.length) : 0;

  const kpis = [
    { label: 'Total Learners', value: learnerStats.length, icon: <PeopleIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Active', value: activeCount, icon: <TrendingUpIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
    { label: 'At Risk', value: atRiskCount, icon: <TrendingUpIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Avg. Score', value: avgScore > 0 ? `${avgScore}%` : '—', icon: <CourseIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
>>>>>>> feature/Updates
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: 'primary.main' }} />
              My Learners
            </Typography>
          </Box>
          <Button startIcon={<ExportIcon />} variant="outlined" sx={{ textTransform: 'none', fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }}>
            Export
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {/* KPIs */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Table */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
            }}
          >
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search learners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 250 }}
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">{filtered.length} learners</Typography>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label={`All (${learnerStats.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Active (${activeCount})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`At Risk (${atRiskCount})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Inactive (${learnerStats.filter(l => l.status === 'inactive').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Learner</Typography></TableCell>
                    <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Courses</Typography></TableCell>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Progress</Typography></TableCell>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Last Active</Typography></TableCell>
                    <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Status</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" fontWeight={600} color="text.secondary">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((learner) => (
                    <TableRow key={learner.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{learner.initials}</Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{learner.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{learner.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{learner.courses}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                          <LinearProgress variant="determinate" value={learner.avgProgress} sx={{ flex: 1, height: 6, borderRadius: 1, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: learner.avgProgress > 75 ? '#10b981' : learner.avgProgress > 50 ? '#f59e0b' : '#ef4444' } }} />
                          <Typography variant="caption" fontWeight={600} sx={{ minWidth: 30 }}>{learner.avgProgress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{learner.lastActive}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusStyles[learner.status].label}
                          size="small"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: statusStyles[learner.status].bg, color: statusStyles[learner.status].color }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" title="Send email"><EmailIcon sx={{ fontSize: 18 }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorLearnersPage;

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Never';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function isRecent(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

function isAtRisk(dateString: string): boolean {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 7 && diffDays <= 30;
}
