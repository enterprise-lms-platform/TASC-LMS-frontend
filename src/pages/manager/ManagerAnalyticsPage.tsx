import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import {
  People as UsersIcon,
  MenuBook as CoursesIcon,
  TrendingUp as EnrollmentIcon,
  EmojiEvents as CompletionIcon,
  Star as StarIcon,
  School as InstructorIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { courseApi, categoryApi, enrollmentApi, certificateApi } from '../../services/main.api';

// ── Chart placeholders (time-series data requires backend aggregation endpoints) ──
const getMonthlyEnrollments = () => [
  { month: 'Jul', count: 312 },
  { month: 'Aug', count: 428 },
  { month: 'Sep', count: 386 },
  { month: 'Oct', count: 502 },
  { month: 'Nov', count: 467 },
  { month: 'Dec', count: 534 },
  { month: 'Jan', count: 498 },
];
const monthlyEnrollments = getMonthlyEnrollments();
const maxEnrollment = Math.max(...monthlyEnrollments.map((d) => d.count));

const getWeeklyEngagement = () => [
  { day: 'Mon', hours: 342 },
  { day: 'Tue', hours: 428 },
  { day: 'Wed', hours: 386 },
  { day: 'Thu', hours: 456 },
  { day: 'Fri', hours: 312 },
  { day: 'Sat', hours: 198 },
  { day: 'Sun', hours: 156 },
];
const weeklyEngagement = getWeeklyEngagement();
const maxHours = Math.max(...weeklyEngagement.map((d) => d.hours));

// ── Top courses (requires course-revenue join - compute from enrollments) ──

// ── Shared Paper style ──
const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const ManagerAnalyticsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('30days');

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'analytics'],
    queryFn: () => courseApi.getAll({ limit: 100 }).then(r => r.data),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'analytics'],
    queryFn: () => categoryApi.getAll().then(r => r.data),
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments', 'analytics'],
    queryFn: () => enrollmentApi.getAll().then(r => r.data),
  });

  const { data: certificatesData } = useQuery({
    queryKey: ['certificates', 'analytics'],
    queryFn: () => certificateApi.getAll().then(r => r.data),
  });

  const courses = (coursesData?.results ?? []) as Array<{ id: number; status: string }>;
  const categories = (categoriesData ?? []) as Array<{ name: string }>;
  const enrollments = (enrollmentsData ?? []) as Array<{ course: number; course_title: string; completed_at: string | null | undefined }>;
  const certificates = (certificatesData ?? []) as Array<{ id: number }>;

  const kpis = useMemo(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter((c) => c.status === 'published').length;
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.completed_at).length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
    const enrollmentRate = totalCourses > 0 ? Math.round((totalEnrollments / totalCourses) * 100) : 0;
    
    return [
      { label: 'Total Users', value: totalEnrollments.toLocaleString(), icon: <UsersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
      { label: 'Active Courses', value: activeCourses.toString(), icon: <CoursesIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
      { label: 'Enrollment Rate', value: `${enrollmentRate}%`, icon: <EnrollmentIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
      { label: 'Avg. Completion', value: `${completionRate}%`, icon: <CompletionIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
    ];
  }, [courses, enrollments]);

  const categoryBreakdown = useMemo(() => {
    return categories.slice(0, 5).map((cat, idx: number) => ({
      name: cat.name,
      enrollments: '0',
      percentage: Math.round((idx + 1) * 15),
      color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx],
    }));
  }, [categories]);

  const topCourses = useMemo(() => {
    const courseStats: Record<string, { enrollments: number; completed: number }> = {};
    enrollments.forEach((e) => {
      const key = e.course_title || `Course ${e.course}`;
      if (!courseStats[key]) {
        courseStats[key] = { enrollments: 0, completed: 0 };
      }
      courseStats[key].enrollments += 1;
      if (e.completed_at) {
        courseStats[key].completed += 1;
      }
    });
    
    return Object.entries(courseStats)
      .map(([name, stats]) => ({
        name,
        enrollments: stats.enrollments,
        completion: stats.enrollments > 0 ? Math.round((stats.completed / stats.enrollments) * 100) : 0,
        avgScore: 0,
        rating: 0,
      }))
      .sort((a, b) => b.enrollments - a.enrollments)
      .slice(0, 5);
  }, [enrollments]);

  const learningMetrics = useMemo(() => {
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.completed_at).length;
    const certificatesCount = certificates.length;
    
    return [
      { label: 'Total Enrollments', value: totalEnrollments.toLocaleString(), change: '+0%', positive: true },
      { label: 'Completed', value: completedEnrollments.toLocaleString(), change: '+0%', positive: true },
      { label: 'Certificates Issued', value: certificatesCount.toLocaleString(), change: '+0%', positive: true },
    ];
  }, [enrollments, certificates]);

  const isLoading = coursesLoading;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}
          {/* Page Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Manager Analytics</Typography>
              <Typography variant="body2" color="text.secondary">Organization-wide learning outcomes and engagement insights</Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Period</InputLabel>
              <Select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} label="Period">
                <MenuItem value="7days">Last 7 days</MenuItem>
                <MenuItem value="30days">Last 30 days</MenuItem>
                <MenuItem value="90days">Last 90 days</MenuItem>
                <MenuItem value="6months">Last 6 months</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* ── KPI Cards ── */}
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

          <Grid container spacing={3}>
            {/* ── Monthly Enrollment Trends ── */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Monthly Enrollment Trends</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 240 }}>
                  {monthlyEnrollments.map((d) => (
                    <Box key={d.month} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {d.count}
                      </Typography>
                      <Box
                        sx={{
                          height: `${(d.count / maxEnrollment) * 170}px`,
                          background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s, opacity 0.2s',
                          opacity: 0.85,
                          '&:hover': { opacity: 1 },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {d.month}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Category Distribution ── */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Enrollment by Category</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {categoryBreakdown.map((cat) => (
                    <Box key={cat.name} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{cat.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{cat.enrollments}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={cat.percentage}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: cat.color,
                            },
                          }}
                        />
                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 30 }}>{cat.percentage}%</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Learning Metrics ── */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InstructorIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography fontWeight={700}>Learning Metrics</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 0 }}>
                  {learningMetrics.map((metric, i) => (
                    <Box
                      key={metric.label}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        px: 3,
                        borderBottom: i < learningMetrics.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                      <Typography variant="body2" fontWeight={700}>{metric.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Course Performance Table ── */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Top Course Performance</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {topCourses.map((course, i) => (
                    <Box
                      key={course.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        px: 3,
                        borderBottom: i < topCourses.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
                      <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ width: 24 }}>
                        {i + 1}
                      </Typography>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{course.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{course.enrollments} enrolled</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                        <Typography variant="body2" fontWeight={700} color="primary.main">{course.completion}%</Typography>
                        <Typography variant="caption" color="text.secondary">Complete</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                        <Typography variant="body2" fontWeight={700}>{course.avgScore}%</Typography>
                        <Typography variant="caption" color="text.secondary">Avg Score</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 50 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" fontWeight={600}>{course.rating}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* ── Weekly User Engagement ── */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Weekly User Engagement (Placeholder)</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
                  {weeklyEngagement.map((d) => (
                    <Box key={d.day} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {d.hours}h
                      </Typography>
                      <Box
                        sx={{
                          height: `${(d.hours / maxHours) * 150}px`,
                          background: 'linear-gradient(180deg, #3b82f6, #93c5fd)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s, opacity 0.2s',
                          opacity: 0.85,
                          '&:hover': { opacity: 1 },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {d.day}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Note: Weekly engagement data requires time-tracking endpoints. Showing placeholder data.
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* ── Quick Stats ── */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Organization Overview</Typography>
                </Box>
                <Box sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Total Enrollments</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[0]?.value || '0'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Active Courses</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[1]?.value || '0'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Enrollment Rate</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[2]?.value || '0%'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3 }}>
                    <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[3]?.value || '0%'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerAnalyticsPage;
