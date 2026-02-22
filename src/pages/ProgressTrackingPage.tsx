import React, { useState } from 'react';
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
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface CourseProgress {
  id: string;
  name: string;
  enrolled: number;
  avgProgress: number;
  completions: number;
  atRisk: number;
  modules: { name: string; progress: number }[];
}

const courseProgressData: CourseProgress[] = [
  {
    id: '1',
    name: 'Advanced React Patterns',
    enrolled: 452,
    avgProgress: 68,
    completions: 312,
    atRisk: 28,
    modules: [
      { name: 'Module 1: Introduction', progress: 95 },
      { name: 'Module 2: React Hooks', progress: 82 },
      { name: 'Module 3: Advanced Patterns', progress: 65 },
      { name: 'Module 4: Custom Hooks', progress: 48 },
      { name: 'Module 5: Final Project', progress: 22 },
    ],
  },
  {
    id: '2',
    name: 'TypeScript Mastery',
    enrolled: 321,
    avgProgress: 55,
    completions: 178,
    atRisk: 42,
    modules: [
      { name: 'Module 1: TypeScript Basics', progress: 88 },
      { name: 'Module 2: Advanced Types', progress: 62 },
      { name: 'Module 3: Generics', progress: 45 },
      { name: 'Module 4: Project Config', progress: 28 },
    ],
  },
  {
    id: '3',
    name: 'Node.js Backend Dev',
    enrolled: 198,
    avgProgress: 72,
    completions: 142,
    atRisk: 15,
    modules: [
      { name: 'Module 1: Node Fundamentals', progress: 92 },
      { name: 'Module 2: Express.js', progress: 78 },
      { name: 'Module 3: Database Integration', progress: 65 },
      { name: 'Module 4: Authentication', progress: 52 },
    ],
  },
];

// Completion funnel
const funnelData = [
  { label: 'Enrolled', count: 971, pct: 100, color: '#3b82f6' },
  { label: 'Started', count: 923, pct: 95, color: '#6366f1' },
  { label: 'Midway (50%+)', count: 685, pct: 71, color: '#f59e0b' },
  { label: 'Near Complete (80%+)', count: 498, pct: 51, color: '#10b981' },
  { label: 'Completed', count: 632, pct: 65, color: '#059669' },
];

const ProgressTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState('all');

  const filteredCourses = courseFilter === 'all'
    ? courseProgressData
    : courseProgressData.filter((c) => c.id === courseFilter);

  const totalEnrolled = courseProgressData.reduce((s, c) => s + c.enrolled, 0);
  const totalCompleted = courseProgressData.reduce((s, c) => s + c.completions, 0);
  const totalAtRisk = courseProgressData.reduce((s, c) => s + c.atRisk, 0);
  const overallAvg = Math.round(courseProgressData.reduce((s, c) => s + c.avgProgress, 0) / courseProgressData.length);

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
                    {course.modules.map((mod) => (
                      <Box key={mod.name} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">{mod.name}</Typography>
                          <Typography variant="caption" fontWeight={600}>{mod.progress}%</Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={mod.progress}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: mod.progress >= 80 ? '#10b981' : mod.progress >= 50 ? '#f59e0b' : '#ef4444',
                              borderRadius: 1,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressTrackingPage;
