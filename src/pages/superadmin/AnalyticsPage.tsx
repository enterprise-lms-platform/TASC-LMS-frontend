import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, LinearProgress,
} from '@mui/material';
import {
  ShowChart as ChartIcon, People as UsersIcon, TrendingUp as TrendIcon,
  School as CourseIcon, Timer as TimeIcon, BarChart as BarIcon,
  PieChart as PieIcon, Assessment as AssessmentIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Monthly Active Users', value: '8,234', icon: <UsersIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: '+12.5% vs last month' },
  { label: 'Course Completion Rate', value: '67.8%', icon: <CourseIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '+3.2% improvement' },
  { label: 'Avg. Session Duration', value: '42 min', icon: <TimeIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', trend: '+8 min vs last month' },
  { label: 'Platform Growth', value: '+23.4%', icon: <TrendIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: 'Year-over-year' },
];

const orgPerformance = [
  { name: 'TASC Group', users: 2450, activeRate: 89, completionRate: 78, avgScore: 82.3, revenue: '$124,500', trend: 'up' },
  { name: 'KCB Foundation', users: 1890, activeRate: 82, completionRate: 71, avgScore: 76.8, revenue: '$98,200', trend: 'up' },
  { name: 'Safaricom Academy', users: 1560, activeRate: 91, completionRate: 84, avgScore: 88.1, revenue: '$87,600', trend: 'up' },
  { name: 'Equity Bank Training', users: 1230, activeRate: 76, completionRate: 65, avgScore: 72.4, revenue: '$67,800', trend: 'down' },
  { name: 'USIU-Africa', users: 980, activeRate: 85, completionRate: 73, avgScore: 79.5, revenue: '$54,300', trend: 'up' },
  { name: 'Strathmore University', users: 870, activeRate: 88, completionRate: 81, avgScore: 85.2, revenue: '$48,900', trend: 'up' },
  { name: 'Co-operative Bank', users: 650, activeRate: 71, completionRate: 58, avgScore: 68.9, revenue: '$32,100', trend: 'down' },
  { name: 'Nation Media Group', users: 420, activeRate: 79, completionRate: 69, avgScore: 74.6, revenue: '$21,400', trend: 'up' },
];

const topCourses = [
  { name: 'Advanced React Patterns', enrollments: 1234, completion: 78, rating: 4.8 },
  { name: 'Data Science Fundamentals', enrollments: 1089, completion: 65, rating: 4.6 },
  { name: 'Python for Beginners', enrollments: 987, completion: 82, rating: 4.7 },
  { name: 'Cybersecurity Essentials', enrollments: 876, completion: 71, rating: 4.5 },
  { name: 'Cloud Architecture', enrollments: 765, completion: 59, rating: 4.4 },
];

const AnalyticsPage: React.FC = () => (
  <SuperadminLayout title="Analytics" subtitle="Platform-wide analytics and performance insights">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
            <Typography variant="body2" color="text.secondary">{k.trend}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>User Engagement Trends</Typography>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <Box sx={{ textAlign: 'center' }}>
              <ChartIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography color="text.secondary">User engagement chart — daily/weekly/monthly active users over time</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Content Distribution</Typography>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <Box sx={{ textAlign: 'center' }}>
              <PieIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography color="text.secondary">Content type distribution — courses, workshops, certifications</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Organization Comparison</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Organization', 'Users', 'Active Rate', 'Completion Rate', 'Avg Score', 'Revenue', 'Trend'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orgPerformance.map((o) => (
                  <TableRow key={o.name} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{o.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{o.users.toLocaleString()}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={o.activeRate} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: o.activeRate >= 80 ? '#10b981' : '#f59e0b' } }} />
                        <Typography variant="body2" sx={{ minWidth: 36 }}>{o.activeRate}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress variant="determinate" value={o.completionRate} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: o.completionRate >= 70 ? '#10b981' : '#f59e0b' } }} />
                        <Typography variant="body2" sx={{ minWidth: 36 }}>{o.completionRate}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{o.avgScore}%</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{o.revenue}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={o.trend === 'up' ? '↑ Up' : '↓ Down'}
                        size="small"
                        sx={{
                          bgcolor: o.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: o.trend === 'up' ? '#10b981' : '#ef4444',
                          fontWeight: 500, fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Performing Courses</Typography>
          {topCourses.map((c, i) => (
            <Box key={c.name} sx={{ py: 2, borderBottom: i < topCourses.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.name}</Typography>
                <Chip label={`★ ${c.rating}`} size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">{c.enrollments.toLocaleString()} enrolled</Typography>
                <Typography variant="caption" color="text.secondary">{c.completion}% completion</Typography>
              </Box>
              <LinearProgress variant="determinate" value={c.completion} sx={{ height: 4, borderRadius: 2, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: '#3b82f6' } }} />
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Course Performance by Category</Typography>
          <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <Box sx={{ textAlign: 'center' }}>
              <BarIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography color="text.secondary">Bar chart — completion rates by course category</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Assessment Performance</Typography>
          <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'grey.300' }}>
            <Box sx={{ textAlign: 'center' }}>
              <AssessmentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography color="text.secondary">Assessment pass rates and score distribution</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </SuperadminLayout>
);

export default AnalyticsPage;
