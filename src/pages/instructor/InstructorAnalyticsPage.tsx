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
  Avatar,
  IconButton,
  AppBar,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { courseApi, enrollmentApi, submissionApi } from '../../services/main.api';
import { useLearningStats } from '../../services/learning.services';

const InstructorAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('30days');

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'instructor'],
    queryFn: () => courseApi.getAll({ instructor_courses: true, limit: 100 }).then(r => r.data),
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments', 'instructor'],
    queryFn: () => enrollmentApi.getAll().then(r => r.data),
  });

  const { data: stats } = useLearningStats();

  const courses = (coursesData?.results ?? []) as Array<{ id: number; title: string; status: string }>;
  const enrollments = (Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData as any)?.results ?? []) as Array<{ course: number; completed_at: string | null | undefined }>;

  const instructorCourseIds = useMemo(() => new Set(courses.map((c) => c.id)), [courses]);

  const instructorEnrollments = useMemo(() => {
    return enrollments.filter((e) => instructorCourseIds.has(e.course));
  }, [enrollments, instructorCourseIds]);

  const kpis = useMemo(() => {
    return [
      { label: 'Total Enrollments', value: (stats?.total_learners || 0).toLocaleString(), icon: <PeopleIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
      { label: 'Course Completion Rate', value: `${stats?.avg_completion_rate || 0}%`, icon: <SchoolIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
      { label: 'Average Quiz Score', value: stats?.avg_quiz_score ? `${stats.avg_quiz_score}%` : '—', icon: <AssignmentIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
      { label: 'Published Courses', value: courses.filter((c) => c.status === 'published').length.toString(), icon: <TimerIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
    ];
  }, [stats, courses]);

  const coursePerformance = useMemo(() => {
    return courses.slice(0, 5).map((course) => {
      const courseEnrollments = instructorEnrollments.filter((e) => e.course === course.id);
      const completedCount = courseEnrollments.filter((e) => e.completed_at).length;
      const completion = courseEnrollments.length > 0 ? Math.round((completedCount / courseEnrollments.length) * 100) : 0;
      
      return {
        name: course.title,
        enrolled: courseEnrollments.length,
        completion,
        avgScore: 0,
        rating: 0,
      };
    });
  }, [courses, instructorEnrollments]);

  const weeklyEngagement = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Calculate hours based on submission distribution across the week
    // Assume higher activity mid-week; minimal weekend activity
    const weekPattern = [0.12, 0.15, 0.16, 0.18, 0.15, 0.14, 0.10];
    const totalHours = Math.max(instructorEnrollments.length * 2, 5); // ~2h per learner, min 5h total
    return days.map((day, idx) => ({
      day,
      hours: Math.round(totalHours * weekPattern[idx]),
    }));
  }, [instructorEnrollments.length]);

  const maxHours = Math.max(...weeklyEngagement.map((d) => d.hours), 1);

  const isLoading = coursesLoading || enrollmentsLoading;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar position="fixed" elevation={0} sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon sx={{ color: 'primary.main' }} />
              Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">Track your teaching performance and learner engagement</Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} label="Period">
              <MenuItem value="7days">Last 7 days</MenuItem>
              <MenuItem value="30days">Last 30 days</MenuItem>
              <MenuItem value="90days">Last 90 days</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button startIcon={<ExportIcon />} variant="outlined" sx={{ textTransform: 'none', fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }}>
            Export
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={kpi.label}>
                <Paper elevation={0} sx={{ bgcolor: kpi.bgcolor, borderRadius: '20px', p: 3, position: 'relative', height: '100%', minHeight: { xs: 110, md: 160 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' } }}>
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

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Paper elevation={0} sx={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' } }}>
                <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                  <Typography fontWeight={700}>Course Performance</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {coursePerformance.length > 0 ? coursePerformance.map((course, i) => (
                    <Box key={course.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, borderBottom: i < coursePerformance.length - 1 ? 1 : 0, borderColor: 'divider', '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{course.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{course.enrolled} enrolled</Typography>
                      </Box>
                      <Box sx={{ width: 120 }}>
                        <Typography variant="caption" color="text.secondary">Completion</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress variant="determinate" value={course.completion} sx={{ flex: 1, height: 6, borderRadius: 1, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
                          <Typography variant="caption" fontWeight={600}>{course.completion}%</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                        <Typography variant="caption" color="text.secondary">Avg Score</Typography>
                        <Typography variant="body2" fontWeight={600}>{course.avgScore > 0 ? `${course.avgScore}%` : '—'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 50 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" fontWeight={600}>{course.rating > 0 ? course.rating.toFixed(1) : '—'}</Typography>
                      </Box>
                    </Box>
                  )) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography color="text.secondary">No course data available</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Paper elevation={0} sx={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' } }}>
                <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                  <Typography fontWeight={700}>Quick Stats</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Total Enrollments</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[0]?.value || '0'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[1]?.value || '0%'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="body2" color="text.secondary">Published Courses</Typography>
                    <Typography variant="body2" fontWeight={700}>{kpis[3]?.value || '0'}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' } }}>
                <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                  <Typography fontWeight={700}>Weekly Engagement</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 200 }}>
                  {weeklyEngagement.map((d) => (
                    <Box key={d.day} sx={{ flex: 1, textAlign: 'center' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        {d.hours}h
                      </Typography>
                      <Box
                        sx={{
                          height: `${(d.hours / maxHours) * 140}px`,
                          bgcolor: 'primary.main',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s',
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
                    Estimated based on enrollment activity. Calculated as ~2 hours per learner distributed across the week.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorAnalyticsPage;
