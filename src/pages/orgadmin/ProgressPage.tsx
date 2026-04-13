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
} from '@mui/material';
import { Search as SearchIcon, People as ActiveLearnersIcon, TrendingUp as AvgCompletionIcon, Warning as AtRiskIcon, CheckCircle as OnTrackIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgEnrollments } from '../../hooks/useOrgAdmin';

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
  status: 'enrolled' | 'completed' | 'in_progress';
  last_activity_at?: string;
}

const ProgressPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: enrollmentsData, isLoading } = useOrgEnrollments({ page_size: 200 });
  const enrollments: Enrollment[] = (enrollmentsData as unknown as { results?: Enrollment[] })?.results ?? [];

  const stats = useMemo(() => {
    const total = enrollments.length;
    const activeLearners = new Set(enrollments.filter((e) => e.progress_percentage > 0).map((e) => e.user.id)).size;
    const completed = enrollments.filter((e) => e.progress_percentage >= 100).length;
    const atRisk = enrollments.filter((e) => e.progress_percentage > 0 && e.progress_percentage < 25).length;
    const onTrack = enrollments.filter((e) => e.progress_percentage >= 75).length;
    const avgCompletion = total > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / total) : 0;
    return { total, activeLearners, avgCompletion, atRisk, onTrack };
  }, [enrollments]);

  const filteredEnrollments = enrollments.filter(
    (e) => search === '' || e.user.name.toLowerCase().includes(search.toLowerCase()) || e.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusChip = (progress: number) => {
    if (progress >= 100) return <Chip label="Completed" size="small" sx={{ bgcolor: '#dcfce7', color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress >= 75) return <Chip label="On Track" size="small" sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: '#6366f1', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress >= 50) return <Chip label="In Progress" size="small" sx={{ bgcolor: '#fff3e0', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress >= 25) return <Chip label="In Progress" size="small" sx={{ bgcolor: '#fff3e0', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }} />;
    if (progress > 0) return <Chip label="At Risk" size="small" sx={{ bgcolor: '#fef2f2', color: '#ef4444', fontWeight: 600, fontSize: '0.7rem' }} />;
    return <Chip label="Not Started" size="small" sx={{ bgcolor: '#f4f4f5', color: '#71717a', fontWeight: 600, fontSize: '0.7rem' }} />;
  };

  const kpiData = [
    { label: 'Active Learners', value: stats.activeLearners, icon: <ActiveLearnersIcon />, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { label: 'Avg Completion', value: `${stats.avgCompletion}%`, icon: <AvgCompletionIcon />, color: '#10b981', bg: '#dcfce7' },
    { label: 'At Risk', value: stats.atRisk, icon: <AtRiskIcon />, color: '#ef4444', bg: '#fef2f2' },
    { label: 'On Track', value: stats.onTrack, icon: <OnTrackIcon />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Progress Tracking" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpiData.map((kpi) => (
              <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
                <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: kpi.color }}>{kpi.icon}</Box>
                    <Typography variant="body2" color="text.secondary">
                      {kpi.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={700}>
                    {kpi.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Progress Details
              </Typography>
              <TextField
                size="small"
                placeholder="Search by member name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={56} sx={{ mb: 1 }} />
                ))}
              </Box>
            ) : filteredEnrollments.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No enrollment data available
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Member</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Last Active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {enrollment.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {enrollment.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{enrollment.course.title}</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress variant="determinate" value={enrollment.progress_percentage} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                              {enrollment.progress_percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(enrollment.progress_percentage)}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {enrollment.last_activity_at ? new Date(enrollment.last_activity_at).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressPage;