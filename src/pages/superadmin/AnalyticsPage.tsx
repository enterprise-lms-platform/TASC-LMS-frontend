import React from 'react';
import {
  Box, Paper, Typography, Grid, Chip, LinearProgress,
} from '@mui/material';
import {
  People as UsersIcon, TrendingUp as TrendIcon,
  School as CourseIcon, Timer as TimeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';

const kpis = [
  { label: 'Monthly Active Users', value: '8,234', icon: <UsersIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
  { label: 'Course Completion Rate', value: '67.8%', icon: <CourseIcon />, bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534' },
  { label: 'Avg. Session Duration', value: '42 min', icon: <TimeIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
  { label: 'Platform Growth', value: '+23.4%', icon: <TrendIcon />, bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534' },
];

const orgPerformance = [
  { name: 'TASC Group', users: 2450, activeRate: 89, completionRate: 78, avgScore: 82.3, revenue: '$124,500', trend: 'up' as const },
  { name: 'KCB Foundation', users: 1890, activeRate: 82, completionRate: 71, avgScore: 76.8, revenue: '$98,200', trend: 'up' as const },
  { name: 'Safaricom Academy', users: 1560, activeRate: 91, completionRate: 84, avgScore: 88.1, revenue: '$87,600', trend: 'up' as const },
  { name: 'Equity Bank Training', users: 1230, activeRate: 76, completionRate: 65, avgScore: 72.4, revenue: '$67,800', trend: 'down' as const },
  { name: 'USIU-Africa', users: 980, activeRate: 85, completionRate: 73, avgScore: 79.5, revenue: '$54,300', trend: 'up' as const },
  { name: 'Strathmore University', users: 870, activeRate: 88, completionRate: 81, avgScore: 85.2, revenue: '$48,900', trend: 'up' as const },
  { name: 'Co-operative Bank', users: 650, activeRate: 71, completionRate: 58, avgScore: 68.9, revenue: '$32,100', trend: 'down' as const },
  { name: 'Nation Media Group', users: 420, activeRate: 79, completionRate: 69, avgScore: 74.6, revenue: '$21,400', trend: 'up' as const },
];

const topCourses = [
  { name: 'Advanced React Patterns', enrollments: 1234, completion: 78, rating: 4.8 },
  { name: 'Data Science Fundamentals', enrollments: 1089, completion: 65, rating: 4.6 },
  { name: 'Python for Beginners', enrollments: 987, completion: 82, rating: 4.7 },
  { name: 'Cybersecurity Essentials', enrollments: 876, completion: 71, rating: 4.5 },
  { name: 'Cloud Architecture', enrollments: 765, completion: 59, rating: 4.4 },
];

// Engagement data
const weeklyEngagement = [
  { day: 'Mon', dau: 2840, wau: 5120 },
  { day: 'Tue', dau: 3120, wau: 5280 },
  { day: 'Wed', dau: 2960, wau: 5340 },
  { day: 'Thu', dau: 3380, wau: 5100 },
  { day: 'Fri', dau: 2600, wau: 4900 },
  { day: 'Sat', dau: 1400, wau: 4200 },
  { day: 'Sun', dau: 1180, wau: 3800 },
];
const maxEngagement = Math.max(...weeklyEngagement.map((d) => d.wau));

// Content distribution
const contentTypes = [
  { type: 'Courses', count: 342, percentage: 48, color: '#ffa424' },
  { type: 'Workshops', count: 156, percentage: 22, color: '#10b981' },
  { type: 'Certifications', count: 89, percentage: 12, color: '#6366f1' },
  { type: 'Assessments', count: 78, percentage: 11, color: '#f59e0b' },
  { type: 'Live Sessions', count: 48, percentage: 7, color: '#ef4444' },
];

// Category performance
const categoryPerformance = [
  { category: 'Web Development', completion: 78, color: '#ffa424' },
  { category: 'Data Science', completion: 65, color: '#10b981' },
  { category: 'Cybersecurity', completion: 71, color: '#6366f1' },
  { category: 'Cloud Computing', completion: 59, color: '#f59e0b' },
  { category: 'Mobile Dev', completion: 82, color: '#ef4444' },
  { category: 'DevOps', completion: 68, color: '#8b5cf6' },
];
const maxCat = Math.max(...categoryPerformance.map((c) => c.completion));

// Assessment data
const assessmentMetrics = [
  { label: 'Total Assessments', value: '4,286', change: '+14%' },
  { label: 'Avg. Pass Rate', value: '76.3%', change: '+2.4%' },
  { label: 'Avg. Score', value: '78.5%', change: '+3.1%' },
  { label: 'Retake Rate', value: '18.2%', change: '-5.4%' },
];

const scoreDistribution = [
  { range: '90-100', count: 856, percentage: 20, color: '#10b981' },
  { range: '80-89', count: 1243, percentage: 29, color: '#4ade80' },
  { range: '70-79', count: 1028, percentage: 24, color: '#ffa424' },
  { range: '60-69', count: 642, percentage: 15, color: '#f59e0b' },
  { range: 'Below 60', count: 517, percentage: 12, color: '#ef4444' },
];

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const AnalyticsPage: React.FC = () => (
  <SuperadminLayout title="Analytics" subtitle="Platform-wide analytics and performance insights">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <KPICard title={k.label} value={k.value} icon={k.icon}
            bgColor={k.bgColor} badgeColor={k.badgeColor} valueColor={k.valueColor} labelColor={k.labelColor} index={index} />
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* User Engagement - Bar Chart */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={cardSx}>
          <Box sx={headerSx}>
            <Typography fontWeight={700}>User Engagement Trends</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#ffa424' }} />
                <Typography variant="caption" fontWeight={500}>Daily Active</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: 'rgba(255,164,36,0.3)' }} />
                <Typography variant="caption" fontWeight={500}>Weekly Active</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 220 }}>
              {weeklyEngagement.map((d) => (
                <Box key={d.day} sx={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                  {/* WAU (background bar) */}
                  <Box sx={{
                    height: `${(d.wau / maxEngagement) * 180}px`,
                    bgcolor: 'rgba(255,164,36,0.15)',
                    borderRadius: '6px 6px 0 0',
                    position: 'absolute', bottom: 20, left: '10%', right: '10%',
                  }} />
                  {/* DAU (foreground bar) */}
                  <Box sx={{
                    height: `${(d.dau / maxEngagement) * 180}px`,
                    background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                    borderRadius: '6px 6px 0 0',
                    position: 'absolute', bottom: 20, left: '25%', right: '25%',
                    opacity: 0.9, '&:hover': { opacity: 1 },
                  }} />
                  <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    {d.day}
                  </Typography>
                  {/* Spacer */}
                  <Box sx={{ height: `${(d.wau / maxEngagement) * 180 + 20}px` }} />
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Content Distribution - Donut + List */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
          <Box sx={headerSx}>
            <Typography fontWeight={700}>Content Distribution</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 1 }}>
            <Box component="svg" viewBox="0 0 100 100" sx={{ width: 120, height: 120 }}>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="10" />
              {(() => {
                let offset = 0;
                const circumference = 2 * Math.PI * 38;
                return contentTypes.map((ct) => {
                  const dash = (ct.percentage / 100) * circumference;
                  const el = (
                    <circle key={ct.type} cx="50" cy="50" r="38" fill="none" stroke={ct.color} strokeWidth="10"
                      strokeDasharray={`${dash} ${circumference}`} strokeDashoffset={`${-offset}`} transform="rotate(-90 50 50)" />
                  );
                  offset += dash;
                  return el;
                });
              })()}
              <text x="50" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#27272a">713</text>
              <text x="50" y="59" textAnchor="middle" fontSize="6" fill="#a1a1aa">Total</text>
            </Box>
          </Box>
          <Box sx={{ p: 2.5, pt: 1 }}>
            {contentTypes.map((ct) => (
              <Box key={ct.type} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: ct.color }} />
                  <Typography variant="caption" fontWeight={500}>{ct.type}</Typography>
                </Box>
                <Typography variant="caption" fontWeight={600}>{ct.count} ({ct.percentage}%)</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Organization Comparison */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={cardSx}>
          <Box sx={headerSx}>
            <Typography fontWeight={700}>Organization Comparison</Typography>
          </Box>
          {orgPerformance.map((o, i) => (
            <Box key={o.name} sx={{
              display: 'flex', alignItems: 'center', gap: 2, p: 1.5, px: 3,
              borderBottom: i < orgPerformance.length - 1 ? 1 : 0, borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140, flex: 1 }} noWrap>{o.name}</Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, minWidth: 55 }}>
                <Typography variant="caption" color="text.secondary">{o.users.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.5, minWidth: 80 }}>
                <LinearProgress variant="determinate" value={o.activeRate} sx={{
                  width: 50, height: 5, borderRadius: 3, bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: o.activeRate >= 80 ? '#10b981' : '#f59e0b' },
                }} />
                <Typography variant="caption" fontWeight={500}>{o.activeRate}%</Typography>
              </Box>
              <Typography variant="body2" fontWeight={700} color="primary.main" sx={{ minWidth: 70, textAlign: 'right' }}>{o.revenue}</Typography>
              <Chip label={o.trend === 'up' ? '↑' : '↓'} size="small" sx={{
                height: 22, minWidth: 32, fontSize: '0.75rem', fontWeight: 600,
                bgcolor: o.trend === 'up' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: o.trend === 'up' ? '#10b981' : '#ef4444',
              }} />
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* Top Courses */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
          <Box sx={headerSx}>
            <Typography fontWeight={700}>Top Performing Courses</Typography>
          </Box>
          {topCourses.map((c, i) => (
            <Box key={c.name} sx={{
              p: 2, px: 3,
              borderBottom: i < topCourses.length - 1 ? 1 : 0, borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>{c.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                  <Typography variant="caption" fontWeight={600}>{c.rating}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">{c.enrollments.toLocaleString()} enrolled</Typography>
                <Typography variant="caption" color="text.secondary">{c.completion}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={c.completion} sx={{
                height: 5, borderRadius: 3, bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#ffa424' },
              }} />
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>

    <Grid container spacing={3}>
      {/* Course Performance by Category - Bar Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={cardSx}>
          <Box sx={headerSx}>
            <Typography fontWeight={700}>Course Performance by Category</Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            {categoryPerformance.map((cat) => (
              <Box key={cat.category} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, '&:last-child': { mb: 0 } }}>
                <Typography variant="caption" fontWeight={500} sx={{ minWidth: 100, fontSize: '0.75rem' }}>{cat.category}</Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{
                    height: 24, width: `${(cat.completion / maxCat) * 100}%`,
                    bgcolor: cat.color, borderRadius: '0 6px 6px 0',
                    opacity: 0.85, transition: 'opacity 0.2s, width 0.3s',
                    '&:hover': { opacity: 1 },
                  }} />
                  <Typography variant="caption" fontWeight={600}>{cat.completion}%</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Assessment Performance */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={cardSx}>
          <Box sx={headerSx}>
            <Typography fontWeight={700}>Assessment Performance</Typography>
          </Box>
          <Box sx={{ p: 0 }}>
            {assessmentMetrics.map((m, i) => (
              <Box key={m.label} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                p: 1.5, px: 3,
                borderBottom: i < assessmentMetrics.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{m.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={700}>{m.value}</Typography>
                  <Chip label={m.change} size="small" sx={{
                    height: 20, fontSize: '0.65rem', fontWeight: 600,
                    bgcolor: m.change.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: m.change.startsWith('+') ? '#10b981' : '#ef4444',
                  }} />
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 2.5, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
              Score Distribution
            </Typography>
            {scoreDistribution.map((sd) => (
              <Box key={sd.range} sx={{ mb: 1.25, '&:last-child': { mb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                  <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.72rem' }}>{sd.range}</Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.72rem' }}>{sd.count} ({sd.percentage}%)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={sd.percentage} sx={{
                  height: 6, borderRadius: 3, bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: sd.color },
                }} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </SuperadminLayout>
);

export default AnalyticsPage;
