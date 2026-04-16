import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Divider,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { History as ActivityIcon, School as EnrollmentIcon, CheckCircle as CompletionIcon, Assignment as SubmissionIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgActivity } from '../../hooks/useOrgAdmin';
import type { ActivityEvent } from '../../services/organization.services';

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

const actionTypeConfig: Record<string, { bg: string; color: string }> = {
  Enrollment: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
  Completion: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  Submission: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  Login: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
};

const getInitials = (name: string): string =>
  name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const ActivityPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');
  const { data: activityData, isLoading } = useOrgActivity(dateRange);

  const summary = activityData?.summary;
  const events = activityData?.events ?? [];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Member Activity" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ActivityIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>User Activity</Typography>
                <Typography variant="body2" color="text.secondary">Track user actions and engagement</Typography>
              </Box>
            </Box>
            <ToggleButtonGroup
              value={dateRange}
              exclusive
              onChange={(_, newRange) => newRange && setDateRange(newRange)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 2,
                  border: '1px solid', borderColor: 'divider',
                  '&.Mui-selected': { bgcolor: 'rgba(255,164,36,0.1)', color: '#b45309', borderColor: '#ffa424', '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } },
                },
              }}
            >
              <ToggleButton value="today">Today</ToggleButton>
              <ToggleButton value="7days">7 Days</ToggleButton>
              <ToggleButton value="30days">30 Days</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Activity Feed</Typography>
                </Box>

                {isLoading ? (
                  <Box sx={{ p: 2 }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, p: 1 }}>
                        <Skeleton variant="circular" width={38} height={38} />
                        <Box sx={{ flex: 1 }}><Skeleton width="80%" /><Skeleton width="30%" /></Box>
                      </Box>
                    ))}
                  </Box>
                ) : events.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No activity in this period</Typography>
                  </Box>
                ) : (
                  events.map((item: ActivityEvent, idx) => {
                    const config = actionTypeConfig[item.type] ?? actionTypeConfig.Enrollment;
                    return (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, transition: 'background 0.15s' }}>
                          <Avatar sx={{ width: 38, height: 38, fontSize: '0.8rem', fontWeight: 600, background: 'linear-gradient(135deg, #ffa424, #f97316)' }}>
                            {getInitials(item.user_name)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                              <Box component="span" fontWeight={600}>{item.user_name}</Box>
                              {' '}{item.description}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">{item.relative_time}</Typography>
                          </Box>
                          <Chip label={item.type} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: config.bg, color: config.color }} />
                        </Box>
                        {idx < events.length - 1 && <Divider />}
                      </Box>
                    );
                  })
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Activity Summary</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dateRange === 'today' ? 'Today' : dateRange === '7days' ? 'Last 7 days' : 'Last 30 days'}
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {[
                    { label: 'Enrollments', value: summary?.enrollments ?? 0, color: '#3b82f6' },
                    { label: 'Completions', value: summary?.completions ?? 0, color: '#10b981' },
                    { label: 'Submissions', value: summary?.submissions ?? 0, color: '#f59e0b' },
                  ].map((stat, idx, arr) => (
                    <Box key={stat.label}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: stat.color }} />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                      </Box>
                      {idx < arr.length - 1 && <Divider />}
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

export default ActivityPage;