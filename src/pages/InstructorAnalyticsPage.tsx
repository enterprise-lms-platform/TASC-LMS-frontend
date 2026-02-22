import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// KPI data — matches learner QuickStats color themes
const kpis = [
  { label: 'Total Enrollments', value: '1,247', icon: <PeopleIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Course Completion Rate', value: '78%', icon: <SchoolIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
  { label: 'Average Quiz Score', value: '82%', icon: <AssignmentIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Avg. Learning Time', value: '4.2h', icon: <TimerIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
];

// Course performance data
const coursePerformance = [
  { name: 'Advanced React Patterns', enrolled: 452, completion: 78, avgScore: 85, rating: 4.8 },
  { name: 'TypeScript Mastery', enrolled: 321, completion: 65, avgScore: 79, rating: 4.6 },
  { name: 'Node.js Backend Dev', enrolled: 198, completion: 82, avgScore: 88, rating: 4.9 },
  { name: 'GraphQL Fundamentals', enrolled: 156, completion: 71, avgScore: 76, rating: 4.5 },
  { name: 'Docker & Kubernetes', enrolled: 120, completion: 58, avgScore: 72, rating: 4.3 },
];

// Engagement by day
const weeklyEngagement = [
  { day: 'Mon', hours: 320 },
  { day: 'Tue', hours: 450 },
  { day: 'Wed', hours: 380 },
  { day: 'Thu', hours: 510 },
  { day: 'Fri', hours: 290 },
  { day: 'Sat', hours: 180 },
  { day: 'Sun', hours: 150 },
];
const maxHours = Math.max(...weeklyEngagement.map((d) => d.hours));

// Top learners
const topLearners = [
  { name: 'Sarah Chen', initials: 'SC', courses: 4, avgScore: 96, streak: 28 },
  { name: 'James Wilson', initials: 'JW', courses: 3, avgScore: 94, streak: 21 },
  { name: 'Maria Garcia', initials: 'MG', courses: 5, avgScore: 92, streak: 35 },
  { name: 'Alex Kim', initials: 'AK', courses: 3, avgScore: 91, streak: 14 },
  { name: 'Priya Patel', initials: 'PP', courses: 4, avgScore: 89, streak: 19 },
];

const InstructorAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('30days');

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Top Bar */}
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
            {/* Course Performance Table */}
            <Grid size={{ xs: 12, lg: 8 }}>
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
                  <Typography fontWeight={700}>Course Performance</Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  {coursePerformance.map((course, i) => (
                    <Box
                      key={course.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        px: 3,
                        borderBottom: i < coursePerformance.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
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
                        <Typography variant="body2" fontWeight={600}>{course.avgScore}%</Typography>
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

            {/* Top Learners */}
            <Grid size={{ xs: 12, lg: 4 }}>
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
                  <Typography fontWeight={700}>Top Learners</Typography>
                </Box>
                {topLearners.map((learner, i) => (
                  <Box
                    key={learner.name}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 2,
                      px: 3,
                      borderBottom: i < topLearners.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ width: 20 }}>
                      {i + 1}
                    </Typography>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{learner.initials}</Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>{learner.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{learner.courses} courses</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={700} color="primary.main">{learner.avgScore}%</Typography>
                      <Typography variant="caption" color="text.secondary">{learner.streak}d streak</Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>

            {/* Weekly Engagement Chart */}
            <Grid size={{ xs: 12 }}>
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
                  <Typography fontWeight={700}>Weekly Engagement (Learning Hours)</Typography>
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
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorAnalyticsPage;
