import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as ActiveLearnersIcon,
  CheckCircle as OnTrackIcon,
  Warning as AtRiskIcon,
  Speed as CompletionIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

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

// ── KPI data ──
const kpis = [
  { label: 'Active Learners', value: '1,892', icon: <ActiveLearnersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Avg Completion', value: '64.2%', icon: <CompletionIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'At Risk', value: '156', icon: <AtRiskIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#7f1d1d', subColor: '#991b1b' },
  { label: 'On Track', value: '1,248', icon: <OnTrackIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
];

// ── Course progress overview ──
const courseProgress = [
  { name: 'Advanced React Patterns', enrolled: 452, avgProgress: 72, completionRate: 68, color: '#ffa424' },
  { name: 'Python for Data Science', enrolled: 386, avgProgress: 65, completionRate: 58, color: '#3b82f6' },
  { name: 'AWS Solutions Architect', enrolled: 321, avgProgress: 54, completionRate: 42, color: '#10b981' },
  { name: 'TypeScript Mastery', enrolled: 278, avgProgress: 81, completionRate: 74, color: '#8b5cf6' },
  { name: 'Docker & Kubernetes', enrolled: 234, avgProgress: 48, completionRate: 35, color: '#f59e0b' },
  { name: 'Cybersecurity Fundamentals', enrolled: 198, avgProgress: 59, completionRate: 51, color: '#ef4444' },
];

// ── At-risk learners ──
const atRiskLearners = [
  { id: 1, name: 'Michael Torres', initials: 'MT', course: 'AWS Solutions Architect', progress: 12, daysInactive: 21, lastActivity: 'Feb 17, 2026' },
  { id: 2, name: 'Rachel Green', initials: 'RG', course: 'Docker & Kubernetes', progress: 8, daysInactive: 18, lastActivity: 'Feb 20, 2026' },
  { id: 3, name: 'Daniel Park', initials: 'DP', course: 'Python for Data Science', progress: 15, daysInactive: 14, lastActivity: 'Feb 24, 2026' },
  { id: 4, name: 'Jessica Liu', initials: 'JL', course: 'Cybersecurity Fundamentals', progress: 22, daysInactive: 16, lastActivity: 'Feb 22, 2026' },
  { id: 5, name: 'Brandon Scott', initials: 'BS', course: 'Advanced React Patterns', progress: 18, daysInactive: 12, lastActivity: 'Feb 26, 2026' },
  { id: 6, name: 'Priya Sharma', initials: 'PS', course: 'TypeScript Mastery', progress: 10, daysInactive: 25, lastActivity: 'Feb 13, 2026' },
];

const getInactiveColor = (days: number) => {
  if (days >= 20) return '#ef4444';
  if (days >= 14) return '#f97316';
  return '#f59e0b';
};

const getInactiveLabel = (days: number) => {
  if (days >= 20) return 'Critical';
  if (days >= 14) return 'High';
  return 'Medium';
};

const ManagerProgressPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon sx={{ color: '#ffa424', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Progress Tracking</Typography>
              <Typography variant="body2" color="text.secondary">Track learner progress across courses</Typography>
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

          {/* Course Progress Overview */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Course Progress Overview</Typography>
              <Typography variant="body2" color="text.secondary">{courseProgress.length} active courses</Typography>
            </Box>
            <Box sx={{ p: 0 }}>
              {courseProgress.map((course, i) => (
                <Box
                  key={course.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                    px: 3,
                    borderBottom: i < courseProgress.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                  }}
                >
                  <Box sx={{ minWidth: { xs: '100%', md: 220 } }}>
                    <Typography variant="body2" fontWeight={600}>{course.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.enrolled} enrolled</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Avg Progress</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: course.color }}>{course.avgProgress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.avgProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: course.color,
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 90 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: course.completionRate >= 60 ? '#16a34a' : course.completionRate >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {course.completionRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Completion</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* At Risk Learners Table */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AtRiskIcon sx={{ fontSize: 20, color: '#ef4444' }} />
                <Typography fontWeight={700}>At Risk Learners</Typography>
              </Box>
              <Chip
                label={`${atRiskLearners.length} learners need attention`}
                size="small"
                sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24, bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', bgcolor: 'grey.50', borderBottom: 2, borderColor: 'divider' } }}>
                    <TableCell>Learner</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell align="center">Progress</TableCell>
                    <TableCell align="center">Days Inactive</TableCell>
                    <TableCell align="center">Last Activity</TableCell>
                    <TableCell align="center">Risk Level</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {atRiskLearners.map((learner) => (
                    <TableRow key={learner.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', fontWeight: 600, background: 'linear-gradient(135deg, #ffb74d, #f97316)' }}>
                            {learner.initials}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>{learner.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{learner.course}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                          <LinearProgress
                            variant="determinate"
                            value={learner.progress}
                            sx={{
                              width: 60,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'grey.100',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                bgcolor: '#ef4444',
                              },
                            }}
                          />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#ef4444', minWidth: 30 }}>
                            {learner.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={700} sx={{ color: getInactiveColor(learner.daysInactive) }}>
                          {learner.daysInactive} days
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">{learner.lastActivity}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getInactiveLabel(learner.daysInactive)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            height: 24,
                            bgcolor: `${getInactiveColor(learner.daysInactive)}18`,
                            color: getInactiveColor(learner.daysInactive),
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<SendIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            borderRadius: '8px',
                            borderColor: '#ffa424',
                            color: '#ffa424',
                            '&:hover': {
                              bgcolor: 'rgba(255,164,36,0.08)',
                              borderColor: '#ffa424',
                            },
                          }}
                        >
                          Send Reminder
                        </Button>
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

export default ManagerProgressPage;
