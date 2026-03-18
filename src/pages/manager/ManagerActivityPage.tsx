import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import {
  History as HistoryIcon,
  Login as LoginIcon,
  School as EnrollmentIcon,
  EmojiEvents as CompletionIcon,
  Assignment as SubmissionIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

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

// ── Action Type Config ──
const actionTypeConfig: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  Enrollment: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', icon: <EnrollmentIcon sx={{ fontSize: 16 }} /> },
  Completion: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: <CompletionIcon sx={{ fontSize: 16 }} /> },
  Submission: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: <SubmissionIcon sx={{ fontSize: 16 }} /> },
  Login: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', icon: <LoginIcon sx={{ fontSize: 16 }} /> },
};

// ── Mock Activity Items ──
const activityItems = [
  { user: 'Sarah Mitchell', initials: 'SM', action: 'enrolled in Advanced React Patterns', timestamp: '10 minutes ago', type: 'Enrollment' },
  { user: 'James Rodriguez', initials: 'JR', action: 'completed Quiz: TypeScript Generics', timestamp: '25 minutes ago', type: 'Completion' },
  { user: 'Emily Chen', initials: 'EC', action: 'submitted Assignment: REST API Design Project', timestamp: '42 minutes ago', type: 'Submission' },
  { user: 'David Kim', initials: 'DK', action: 'logged in from Chrome on macOS', timestamp: '1 hour ago', type: 'Login' },
  { user: 'Priya Sharma', initials: 'PS', action: 'enrolled in AWS Solutions Architect Prep', timestamp: '1.5 hours ago', type: 'Enrollment' },
  { user: 'Michael Thompson', initials: 'MT', action: 'completed Course: Python for Data Science', timestamp: '2 hours ago', type: 'Completion' },
  { user: 'Laura Bennett', initials: 'LB', action: 'submitted Assignment: Machine Learning Capstone', timestamp: '2.5 hours ago', type: 'Submission' },
  { user: 'Alex Okafor', initials: 'AO', action: 'logged in from Firefox on Windows', timestamp: '3 hours ago', type: 'Login' },
  { user: 'Rachel Green', initials: 'RG', action: 'enrolled in Docker & Kubernetes Fundamentals', timestamp: '3.5 hours ago', type: 'Enrollment' },
  { user: 'Tom Nguyen', initials: 'TN', action: 'completed Quiz: Cloud Security Basics', timestamp: '4 hours ago', type: 'Completion' },
  { user: 'Jessica Park', initials: 'JP', action: 'submitted Assignment: Database Optimization Report', timestamp: '5 hours ago', type: 'Submission' },
  { user: 'Carlos Mendez', initials: 'CM', action: 'enrolled in TypeScript Mastery', timestamp: '6 hours ago', type: 'Enrollment' },
];

// ── Activity Summary ──
const summaryStats = [
  { label: 'Logins Today', value: 145, color: '#6366f1' },
  { label: 'Enrollments', value: 23, color: '#3b82f6' },
  { label: 'Completions', value: 18, color: '#10b981' },
  { label: 'Submissions', value: 31, color: '#f59e0b' },
];

const ManagerActivityPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7days');

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <HistoryIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  User Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track user actions and engagement
                </Typography>
              </Box>
            </Box>

            {/* Date Range Filter */}
            <ToggleButtonGroup
              value={dateRange}
              exclusive
              onChange={(_, val) => { if (val !== null) setDateRange(val); }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  px: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,164,36,0.1)',
                    color: '#b45309',
                    borderColor: '#ffa424',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' },
                  },
                },
              }}
            >
              <ToggleButton value="today">Today</ToggleButton>
              <ToggleButton value="7days">Last 7 days</ToggleButton>
              <ToggleButton value="30days">Last 30 days</ToggleButton>
              <ToggleButton value="custom">Custom</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3}>
            {/* Activity Feed */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Activity Feed</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activityItems.length} activities
                  </Typography>
                </Box>
                <Box>
                  {activityItems.map((item, idx) => {
                    const config = actionTypeConfig[item.type];
                    return (
                      <Box key={idx}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            px: 3,
                            '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                            transition: 'background 0.15s',
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 38,
                              height: 38,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #ffa424, #f97316)',
                            }}
                          >
                            {item.initials}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                              <Box component="span" fontWeight={600}>{item.user}</Box>
                              {' '}{item.action}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {item.timestamp}
                            </Typography>
                          </Box>
                          <Chip
                            icon={<Box sx={{ display: 'flex', alignItems: 'center', pl: 0.5 }}>{config.icon}</Box>}
                            label={item.type}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              bgcolor: config.bg,
                              color: config.color,
                              '& .MuiChip-icon': { color: config.color },
                              flexShrink: 0,
                            }}
                          />
                        </Box>
                        {idx < activityItems.length - 1 && <Divider />}
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>

            {/* Activity Summary Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Activity Summary</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {summaryStats.map((stat, idx) => (
                    <Box key={stat.label}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              bgcolor: stat.color,
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {stat.label}
                          </Typography>
                        </Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      {idx < summaryStats.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Peak Activity Hours */}
              <Paper elevation={0} sx={{ ...cardSx, mt: 3 }}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Peak Hours</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {[
                    { time: '9:00 AM - 11:00 AM', users: 342, pct: 85 },
                    { time: '1:00 PM - 3:00 PM', users: 278, pct: 70 },
                    { time: '4:00 PM - 6:00 PM', users: 198, pct: 50 },
                    { time: '7:00 PM - 9:00 PM', users: 124, pct: 31 },
                  ].map((slot) => (
                    <Box key={slot.time} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600}>
                          {slot.time}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {slot.users} users
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.100',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${slot.pct}%`,
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, #ffa424, #f97316)',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </Box>
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

export default ManagerActivityPage;
