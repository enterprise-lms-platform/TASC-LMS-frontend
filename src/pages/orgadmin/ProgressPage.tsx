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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Skeleton,
  Avatar,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  TrendingUp as ProgressIcon,
  People as ActiveLearnersIcon,
  CheckCircle as AvgCompletionIcon,
  Warning as AtRiskIcon,
  CheckCircle as OnTrackIcon,
  Notifications as ReminderIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgEnrollments } from '../../hooks/useOrgAdmin';
import { getUserInitials } from '../../utils/userHelpers';

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
};

interface Enrollment {
  id: number;
  user: { id: number; name: string; email: string };
  course: { id: number; title: string };
  progress_percentage: number;
  status: string;
  last_activity_at?: string;
}

const ProgressPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { data: enrollmentsData, isLoading } = useOrgEnrollments({ page_size: 200 });
  const enrollments: Enrollment[] = (enrollmentsData as unknown as { results?: Enrollment[] })?.results ?? [];

  const stats = useMemo(() => {
    const total = enrollments.length;
    const activeLearners = new Set(enrollments.filter(e => e.progress_percentage > 0).map(e => e.user.id)).size;
    const completed = enrollments.filter(e => e.progress_percentage >= 100).length;
    const atRisk = enrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 25).length;
    const onTrack = enrollments.filter(e => e.progress_percentage >= 75).length;
    const avgCompletion = total > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / total) : 0;
    return { total, activeLearners, avgCompletion, atRisk, onTrack };
  }, [enrollments]);

  const filteredEnrollments = enrollments.filter(
    e => search === '' || e.user.name.toLowerCase().includes(search.toLowerCase()) || e.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const courseProgress = useMemo(() => {
    const byCourse: Record<string, { enrolled: number; totalProgress: number; completed: number }> = {};
    filteredEnrollments.forEach(e => {
      if (!byCourse[e.course.title]) {
        byCourse[e.course.title] = { enrolled: 0, totalProgress: 0, completed: 0 };
      }
      byCourse[e.course.title].enrolled++;
      byCourse[e.course.title].totalProgress += e.progress_percentage;
      if (e.progress_percentage >= 100) byCourse[e.course.title].completed++;
    });
    return Object.entries(byCourse).map(([name, data]) => ({
      name,
      enrolled: data.enrolled,
      avgProgress: Math.round(data.totalProgress / data.enrolled),
      completionRate: Math.round((data.completed / data.enrolled) * 100),
      color: data.enrolled > 0 && (data.totalProgress / data.enrolled) >= 70 ? '#10b981' : (data.totalProgress / data.enrolled) >= 40 ? '#f59e0b' : '#ef4444',
    })).sort((a, b) => b.enrolled - a.enrolled);
  }, [filteredEnrollments]);

  const atRiskLearners = filteredEnrollments.filter(e => e.progress_percentage > 0 && e.progress_percentage < 25);

  const kpiData = [
    { label: 'Active Learners', value: stats.activeLearners, icon: <ActiveLearnersIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Avg Completion', value: `${stats.avgCompletion}%`, icon: <AvgCompletionIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'At Risk', value: stats.atRisk, icon: <AtRiskIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#7f1d1d', subColor: '#991b1b' },
    { label: 'On Track', value: stats.onTrack, icon: <OnTrackIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
  ];

  const handleReminder = () => setSnackbarOpen(true);

  const getStatusChip = (progress: number) => {
    if (progress >= 100) return <Chip label="Completed" size="small" sx={{ bgcolor: '#dcfce7', color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress >= 75) return <Chip label="On Track" size="small" sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: '#6366f1', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress >= 25) return <Chip label="In Progress" size="small" sx={{ bgcolor: '#fff3e0', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress > 0) return <Chip label="At Risk" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 600, fontSize: '0.7rem' }} />;
    return <Chip label="Not Started" size="small" sx={{ bgcolor: '#f4f4f5', color: '#71717a', fontWeight: 600, fontSize: '0.7rem' }} />;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Progress Tracking" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <ProgressIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Progress Tracking</Typography>
              <Typography variant="body2" color="text.secondary">Track learner progress across courses</Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpiData.map((kpi) => (
              <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
                <Paper elevation={0} sx={{
                  bgcolor: kpi.bgcolor, borderRadius: '20px', p: 3, position: 'relative', minHeight: 140,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                  transition: 'transform 0.2s', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' },
                }}>
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

          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}><Typography fontWeight={700}>Course Progress Overview</Typography></Box>
            {courseProgress.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">No course data</Typography></Box>
            ) : (
              courseProgress.map((course, i) => (
                <Box key={course.name} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5, px: 3, borderBottom: i < courseProgress.length - 1 ? 1 : 0, borderColor: 'divider', '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                  <Box sx={{ minWidth: { xs: '100%', md: 220 } }}>
                    <Typography variant="body2" fontWeight={600}>{course.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.enrolled} enrolled</Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Avg Progress</Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ color: course.color }}>{course.avgProgress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={course.avgProgress} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: course.color } }} />
                  </Box>
                  <Box sx={{ textAlign: 'center', minWidth: 90 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: course.completionRate >= 60 ? '#16a34a' : course.completionRate >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {course.completionRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Completion</Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Progress Details</Typography>
              <TextField
                size="small"
                placeholder="Search by member name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 250 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><ProgressIcon color="action" /></InputAdornment> } }}
              />
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>{[0,1,2,3,4].map(i => <Skeleton key={i} height={56} sx={{mb:1}} />)}</Box>
            ) : filteredEnrollments.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">No enrollment data</Typography></Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Member</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEnrollments.map(e => (
                      <TableRow key={e.id} hover>
                        <TableCell><Typography fontWeight={500}>{e.user.name}</Typography></TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{e.course.title}</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress variant="determinate" value={e.progress_percentage} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                            <Typography variant="caption" color="text.secondary">{e.progress_percentage}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(e.progress_percentage)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          {atRiskLearners.length > 0 && (
            <Paper elevation={0} sx={{ ...cardSx, mt: 3 }}>
              <Box sx={headerSx}><Typography fontWeight={700}>At Risk Learners</Typography></Box>
              {atRiskLearners.map((learner, i) => (
                <Box key={learner.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, borderBottom: i < atRiskLearners.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                  <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ffa424, #f97316)', fontSize: '0.75rem' }}>
                    {getUserInitials(learner.user.name.split(' ')[0], learner.user.name.split(' ')[1])}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>{learner.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{learner.course.title}</Typography>
                  </Box>
                  <Box sx={{ width: 100 }}>
                    <LinearProgress variant="determinate" value={learner.progress_percentage} sx={{ height: 6, borderRadius: 3, bgcolor: '#fef2f2', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }} />
                  </Box>
                  <Chip label="At Risk" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 600 }} />
                  <Button size="small" startIcon={<ReminderIcon />} onClick={handleReminder} sx={{ textTransform: 'none' }}>Send Reminder</Button>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="info">Reminder feature coming soon</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProgressPage;