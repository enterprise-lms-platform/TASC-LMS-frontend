import React, { useState, useMemo } from 'react';
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
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as ProgressIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  People as PeopleIcon,
  CheckCircle as CompletedIcon,
  Warning as AtRiskIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { useEnrollments } from '../../hooks/useLearning';
import { useLearningStats } from '../../services/learning.services';

interface CourseProgress {
  id: string;
  name: string;
  enrolled: number;
  avgProgress: number;
  completions: number;
  atRisk: number;
}

const ProgressTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState('all');

  const { data: enrollments, isLoading: enrollLoading } = useEnrollments();
  const { data: stats, isLoading: statsLoading } = useLearningStats();
  const isLoading = enrollLoading || statsLoading;

  const courseProgressData = useMemo(() => {
    if (!enrollments) return [];
    const courseMap = new Map<number, { title: string; enrollments: Array<{ progress: number; status: string }> }>();
    for (const e of enrollments) {
      if (!courseMap.has(e.course)) {
        courseMap.set(e.course, { title: e.course_title, enrollments: [] });
      }
      courseMap.get(e.course)!.enrollments.push({
        progress: e.progress_percentage,
        status: e.status,
      });
    }
    return Array.from(courseMap.entries()).map(([courseId, data]) => {
      const enrolled = data.enrollments.length;
      const avgProgress = enrolled > 0 ? Math.round(data.enrollments.reduce((s, e) => s + e.progress, 0) / enrolled) : 0;
      const completions = data.enrollments.filter(e => e.status === 'completed').length;
      const atRisk = data.enrollments.filter(e => e.progress < 25 && e.status !== 'completed').length;
      return { id: String(courseId), name: data.title, enrolled, avgProgress, completions, atRisk };
    });
  }, [enrollments]);

  const funnelData = useMemo(() => {
    if (!enrollments || enrollments.length === 0) return [];
    const total = enrollments.length;
    const started = enrollments.filter(e => e.progress_percentage > 0).length;
    const midway = enrollments.filter(e => e.progress_percentage >= 50).length;
    const nearComplete = enrollments.filter(e => e.progress_percentage >= 80).length;
    const completed = enrollments.filter(e => e.status === 'completed').length;
    return [
      { label: 'Enrolled', count: total, pct: 100, color: '#3b82f6' },
      { label: 'Started', count: started, pct: total > 0 ? Math.round(started / total * 100) : 0, color: '#6366f1' },
      { label: 'Midway (50%+)', count: midway, pct: total > 0 ? Math.round(midway / total * 100) : 0, color: '#f59e0b' },
      { label: 'Near Complete (80%+)', count: nearComplete, pct: total > 0 ? Math.round(nearComplete / total * 100) : 0, color: '#10b981' },
      { label: 'Completed', count: completed, pct: total > 0 ? Math.round(completed / total * 100) : 0, color: '#059669' },
    ];
  }, [enrollments]);

  const filteredCourses = courseFilter === 'all'
    ? courseProgressData
    : courseProgressData.filter((c) => c.id === courseFilter);

  const totalEnrolled = stats?.total_learners ?? courseProgressData.reduce((s, c) => s + c.enrolled, 0);
  const totalCompleted = stats?.total_completed_courses ?? courseProgressData.reduce((s, c) => s + c.completions, 0);
  const totalAtRisk = courseProgressData.reduce((s, c) => s + c.atRisk, 0);
  const overallAvg = stats?.avg_completion_rate ?? (courseProgressData.length > 0 ? Math.round(courseProgressData.reduce((s, c) => s + c.avgProgress, 0) / courseProgressData.length) : 0);

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
              <ProgressIcon sx={{ color: 'primary.main' }} />
              Progress Tracking
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Course</InputLabel>
            <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} label="Course">
              <MenuItem value="all">All Courses</MenuItem>
              {courseProgressData.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : (<>
          {/* KPIs */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Enrolled', value: totalEnrolled, icon: <PeopleIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Average Progress', value: `${overallAvg}%`, icon: <ProgressIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
              { label: 'Completions', value: totalCompleted, icon: <CompletedIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'At Risk', value: totalAtRisk, icon: <AtRiskIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
            ].map((kpi) => (
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

          <Grid container spacing={3}>
            {/* Completion Funnel */}
            <Grid size={{ xs: 12, md: 5 }}>
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
                <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                  <Typography fontWeight={700}>Completion Funnel</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {funnelData.map((step) => (
                    <Box key={step.label} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>{step.label}</Typography>
                        <Typography variant="body2" fontWeight={700}>{step.count}</Typography>
                      </Box>
                      <Box sx={{ position: 'relative' }}>
                        <LinearProgress
                          variant="determinate"
                          value={step.pct}
                          sx={{
                            height: 24,
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': { bgcolor: step.color, borderRadius: 1 },
                          }}
                        />
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: step.pct > 30 ? 'white' : 'text.primary' }}
                        >
                          {step.pct}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Course Progress Breakdown */}
            <Grid size={{ xs: 12, md: 7 }}>
              {filteredCourses.map((course) => (
                <Paper
                  key={course.id}
                  elevation={0}
                  sx={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    mb: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography fontWeight={700}>{course.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{course.enrolled} enrolled</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={`${course.avgProgress}% avg`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#dbeafe', color: '#2563eb' }} />
                      {course.atRisk > 0 && (
                        <Chip label={`${course.atRisk} at risk`} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#fee2e2', color: '#dc2626' }} />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, px: 3 }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Overall Progress</Typography>
                        <Typography variant="caption" fontWeight={600}>{course.avgProgress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.avgProgress}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: 'grey.100',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: course.avgProgress >= 80 ? '#10b981' : course.avgProgress >= 50 ? '#f59e0b' : '#ef4444',
                            borderRadius: 1,
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">{course.completions} completed</Typography>
                      {course.atRisk > 0 && <Typography variant="caption" color="error">{course.atRisk} at risk (&lt;25%)</Typography>}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>
          </Grid>
          </>)}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressTrackingPage;
