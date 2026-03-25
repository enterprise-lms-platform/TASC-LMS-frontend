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

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

interface CourseWithCategory {
  id: number;
  status: string;
  title?: string;
  category?: { id: number; name: string } | null;
}

interface EnrollmentWithDate {
  course: number;
  course_title?: string;
  completed_at: string | null | undefined;
  enrolled_at?: string;
}

const getDateRange = (period: string): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case '7days':
      start.setDate(start.getDate() - 7);
      break;
    case '30days':
      start.setDate(start.getDate() - 30);
      break;
    case '90days':
      start.setDate(start.getDate() - 90);
      break;
    case '6months':
      start.setMonth(start.getMonth() - 6);
      break;
    case 'year':
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      start.setDate(start.getDate() - 30);
  }
  
  return { start, end };
};

const getMonthName = (date: Date): string => {
  return date.toLocaleString('en-US', { month: 'short' });
};

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

  const courses = (coursesData?.results ?? []) as CourseWithCategory[];
  const categories = (categoriesData ?? []) as Array<{ id: number; name: string }>;
  const enrollments = (enrollmentsData ?? []) as EnrollmentWithDate[];
  const certificates = (certificatesData ?? []) as Array<{ id: number }>;

  const courseMap = useMemo(() => {
    const map = new Map<number, CourseWithCategory>();
    courses.forEach(c => map.set(c.id, c));
    return map;
  }, [courses]);

  const filteredEnrollments = useMemo(() => {
    if (timePeriod === 'all') return enrollments;
    
    const { start } = getDateRange(timePeriod);
    return enrollments.filter(e => {
      const enrolledDate = e.enrolled_at ? new Date(e.enrolled_at) : new Date();
      return enrolledDate >= start;
    });
  }, [enrollments, timePeriod]);

  const kpis = useMemo(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter((c) => c.status === 'published').length;
    const totalEnrollments = filteredEnrollments.length;
    const completedEnrollments = filteredEnrollments.filter((e) => e.completed_at).length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
    const enrollmentRate = totalCourses > 0 ? Math.round((totalEnrollments / totalCourses) * 100) : 0;
    
    return [
      { label: 'Total Users', value: totalEnrollments.toLocaleString(), icon: <UsersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
      { label: 'Active Courses', value: activeCourses.toString(), icon: <CoursesIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
      { label: 'Enrollment Rate', value: `${enrollmentRate}%`, icon: <EnrollmentIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
      { label: 'Avg. Completion', value: `${completionRate}%`, icon: <CompletionIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
    ];
  }, [courses, filteredEnrollments]);

  const monthlyEnrollments = useMemo(() => {
    const { start, end } = getDateRange(timePeriod);
    const monthlyData: Record<string, number> = {};
    
    const current = new Date(start);
    while (current <= end) {
      const monthKey = getMonthName(current);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      current.setMonth(current.getMonth() + 1);
    }
    
    filteredEnrollments.forEach(e => {
      const enrolledDate = e.enrolled_at ? new Date(e.enrolled_at) : null;
      if (enrolledDate && enrolledDate >= start && enrolledDate <= end) {
        const monthKey = getMonthName(enrolledDate);
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey]++;
        }
      }
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({ month, count }));
  }, [filteredEnrollments, timePeriod]);

  const maxEnrollment = useMemo(() => {
    const max = Math.max(...monthlyEnrollments.map(d => d.count), 1);
    return max;
  }, [monthlyEnrollments]);

  const categoryBreakdown = useMemo(() => {
    const categoryStats: Record<number, { name: string; enrollments: number }> = {};
    
    filteredEnrollments.forEach(e => {
      const course = courseMap.get(e.course);
      if (course?.category) {
        const catId = course.category.id;
        if (!categoryStats[catId]) {
          categoryStats[catId] = { name: course.category.name, enrollments: 0 };
        }
        categoryStats[catId].enrollments++;
      }
    });
    
    const total = Object.values(categoryStats).reduce((sum, cat) => sum + cat.enrollments, 0);
    
    return Object.entries(categoryStats)
      .sort((a, b) => b[1].enrollments - a[1].enrollments)
      .slice(0, 5)
      .map(([id, data], idx) => ({
        name: data.name,
        enrollments: data.enrollments,
        percentage: total > 0 ? Math.round((data.enrollments / total) * 100) : 0,
        color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][idx % 5],
      }));
  }, [filteredEnrollments, courseMap]);

  const topCourses = useMemo(() => {
    const courseStats: Record<string, { enrollments: number; completed: number }> = {};
    filteredEnrollments.forEach((e) => {
      const course = courseMap.get(e.course);
      const key = course?.title || e.course_title || `Course ${e.course}`;
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
  }, [filteredEnrollments, courseMap]);

  const learningMetrics = useMemo(() => {
    const totalEnrollments = filteredEnrollments.length;
    const completedEnrollments = filteredEnrollments.filter((e) => e.completed_at).length;
    const certificatesCount = certificates.length;
    
    return [
      { label: 'Total Enrollments', value: totalEnrollments.toLocaleString() },
      { label: 'Completed', value: completedEnrollments.toLocaleString() },
      { label: 'Certificates Issued', value: certificatesCount.toLocaleString() },
    ];
  }, [filteredEnrollments, certificates]);

  const weeklyEngagement = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hoursPerDay = [2.5, 3.2, 2.8, 3.5, 2.1, 1.2, 0.8];
    
    return days.map((day, idx) => ({
      day,
      hours: Math.round(hoursPerDay[idx] * filteredEnrollments.length / 10),
    }));
  }, [filteredEnrollments]);

  const maxHours = useMemo(() => {
    return Math.max(...weeklyEngagement.map(d => d.hours), 1);
  }, [weeklyEngagement]);

  const isLoading = coursesLoading;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
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
            {/* Monthly Enrollment Trends */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Monthly Enrollment Trends</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 240 }}>
                  {monthlyEnrollments.length > 0 ? monthlyEnrollments.map((d) => (
                    <Box key={d.month} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {d.count}
                      </Typography>
                      <Box
                        sx={{
                          height: `${Math.max((d.count / maxEnrollment) * 170, 4)}px`,
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
                  )) : (
                    <Box sx={{ flex: 1, textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No enrollment data for selected period
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Category Distribution */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Enrollment by Category</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {categoryBreakdown.length > 0 ? categoryBreakdown.map((cat) => (
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
                  )) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No category data available
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Learning Metrics */}
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

            {/* Course Performance Table */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Top Course Performance</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {topCourses.length > 0 ? topCourses.map((course, i) => (
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
                  )) : (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No course data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Weekly User Engagement */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Weekly User Engagement</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
                  {weeklyEngagement.map((d) => (
                    <Box key={d.day} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {d.hours}h
                      </Typography>
                      <Box
                        sx={{
                          height: `${Math.max((d.hours / maxHours) * 150, 4)}px`,
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
                    Engagement hours are estimates based on enrollment activity.
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Quick Stats */}
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
