import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  School as ActiveLearnersIcon,
  TrendingUp as CompletionIcon,
  Assignment as EnrollmentsIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgEnrollments, useOrgCourses, useOrgBillingUsage } from '../../hooks/useOrgAdmin';

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

interface OrgEnrollment {
  id: number;
  user: { id: number; name: string; email: string };
  course: { id: number; title: string; category?: { name: string } };
  progress_percentage: number;
  status: string;
  enrolled_at: string;
}

const AnalyticsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState<'7days' | '30days' | '90days' | '6months'>('30days');

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useOrgEnrollments({ page_size: 200 });
  const { data: coursesData, isLoading: coursesLoading } = useOrgCourses({ page_size: 100 });
  const { data: billingData } = useOrgBillingUsage();

  const enrollments: OrgEnrollment[] = ((enrollmentsData as unknown as { results?: OrgEnrollment[] })?.results ?? []);
  const courses = coursesData?.results ?? [];

  const activeUsers = billingData?.active_users ?? 0;

  const completedCount = enrollments.filter(e => e.progress_percentage >= 100).length;
  const avgCompletion = enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length) : 0;

  const kpiData = [
    { label: 'Total Members', value: activeUsers, icon: <PeopleIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Active Learners', value: new Set(enrollments.filter(e => e.progress_percentage > 0).map(e => e.user.id)).size, icon: <ActiveLearnersIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
    { label: 'Avg Completion', value: `${avgCompletion}%`, icon: <CompletionIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Total Enrollments', value: enrollments.length, icon: <EnrollmentsIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
  ];

  const monthlyData = useMemo(() => {
    const byMonth: Record<string, number> = {};
    enrollments.forEach(e => {
      if (!e.enrolled_at) return;
      const d = new Date(e.enrolled_at);
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      byMonth[key] = (byMonth[key] ?? 0) + 1;
    });
    return Object.entries(byMonth).slice(-6).map(([month, count]) => ({ month, count }));
  }, [enrollments]);

  const categoryData = useMemo(() => {
    const categoryColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const byCategory: Record<string, number> = {};
    enrollments.forEach(e => {
      const catName = e.course.category?.name || 'Uncategorized';
      byCategory[catName] = (byCategory[catName] ?? 0) + 1;
    });
    const total = enrollments.length;
    return Object.entries(byCategory).map(([name, count], i) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: categoryColors[i % categoryColors.length],
    }));
  }, [enrollments]);

  const topCourses = useMemo(() => {
    const byCourse: Record<string, { enrolled: number; completed: number }> = {};
    enrollments.forEach(e => {
      if (!byCourse[e.course.title]) {
        byCourse[e.course.title] = { enrolled: 0, completed: 0 };
      }
      byCourse[e.course.title].enrolled++;
      if (e.progress_percentage >= 100) {
        byCourse[e.course.title].completed++;
      }
    });
    return Object.entries(byCourse)
      .map(([title, data]) => ({
        title,
        enrolled: data.enrolled,
        completionRate: data.enrolled > 0 ? Math.round((data.completed / data.enrolled) * 100) : 0,
      }))
      .sort((a, b) => b.enrolled - a.enrolled)
      .slice(0, 5);
  }, [enrollments]);

  const maxMonthlyCount = Math.max(...monthlyData.map(m => m.count), 1);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Analytics" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <AnalyticsIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Analytics</Typography>
              <Typography variant="body2" color="text.secondary">Member learning outcomes and engagement</Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <ToggleButtonGroup
                value={period}
                exclusive
                onChange={(_, newPeriod) => newPeriod && setPeriod(newPeriod)}
                size="small"
                sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', px: 2 } }}
              >
                <ToggleButton value="7days">7 Days</ToggleButton>
                <ToggleButton value="30days">30 Days</ToggleButton>
                <ToggleButton value="90days">90 Days</ToggleButton>
                <ToggleButton value="6months">6 Months</ToggleButton>
              </ToggleButtonGroup>
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

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}><Typography fontWeight={700}>Monthly Enrollment Trends</Typography></Box>
                <Box sx={{ p: 3, minHeight: 200 }}>
                  {enrollmentsLoading ? <Skeleton height={200} /> : monthlyData.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="text.secondary">No enrollment data</Typography></Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180 }}>
                      {monthlyData.map((m) => (
                        <Box key={m.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: '100%', height: 140, display: 'flex', alignItems: 'flex-end' }}>
                            <Box sx={{ width: '100%', height: `${(m.count / maxMonthlyCount) * 100}%`, background: 'linear-gradient(180deg, #ffa424, #ffb74d)', borderRadius: '2px 2px 0 0', transition: 'height 0.3s' }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">{m.month}</Typography>
                          <Typography variant="body2" fontWeight={600}>{m.count}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}><Typography fontWeight={700}>Enrollment by Category</Typography></Box>
                <Box sx={{ p: 3 }}>
                  {coursesLoading ? <Skeleton height={150} /> : categoryData.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}><Typography color="text.secondary">No category data</Typography></Box>
                  ) : (
                    categoryData.map((cat) => (
                      <Box key={cat.name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={500}>{cat.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{cat.count} ({cat.percentage}%)</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={cat.percentage} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: cat.color } }} />
                      </Box>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}><Typography fontWeight={700}>Learning Metrics</Typography></Box>
                <Box sx={{ p: 3 }}>
                  {[
                    { label: 'Total Enrollments', value: enrollments.length, color: '#3b82f6' },
                    { label: 'Completed', value: completedCount, color: '#10b981' },
                    { label: 'Certificates Issued', value: completedCount, color: '#8b5cf6' },
                  ].map((stat, idx, arr) => (
                    <Box key={stat.label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: stat.color }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                      </Box>
                      {idx < arr.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}><Typography fontWeight={700}>Top Course Performance</Typography></Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>#</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enrolled</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Completion</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topCourses.map((course, idx) => (
                        <TableRow key={course.title} hover>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 500, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</TableCell>
                          <TableCell>{course.enrolled}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress variant="determinate" value={course.completionRate} sx={{ width: 60, height: 6, borderRadius: 3 }} />
                              <Typography variant="caption">{course.completionRate}%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label="Active" size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: '0.7rem' }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;