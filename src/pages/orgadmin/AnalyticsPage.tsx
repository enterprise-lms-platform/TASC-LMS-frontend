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
} from '@mui/material';
import { School as EnrollmentIcon, CheckCircle as CompletionIcon, Assignment as SubmissionIcon } from '@mui/icons-material';
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

const typeColors: Record<string, { bg: string; color: string }> = {
  Enrollment: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
  Completion: { bg: '#dcfce7', color: '#10b981' },
  Submission: { bg: '#fff3e0', color: '#f59e0b' },
};

const AnalyticsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [range, setRange] = useState<'today' | '7days' | '30days'>('30days');
  const { data: activityData, isLoading } = useOrgActivity(range);

  const summary = activityData?.summary;
  const events = activityData?.events ?? [];

  const stats = [
    { label: 'Enrollments', value: summary?.enrollments ?? 0, icon: <EnrollmentIcon />, color: '#6366f1' },
    { label: 'Completions', value: summary?.completions ?? 0, icon: <CompletionIcon />, color: '#10b981' },
    { label: 'Submissions', value: summary?.submissions ?? 0, icon: <SubmissionIcon />, color: '#f59e0b' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Analytics" />

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
            {stats.map((stat) => (
              <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  {isLoading ? (
                    <Skeleton width={60} height={48} />
                  ) : (
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography variant="subtitle1" fontWeight={700}>
                Activity
              </Typography>
              <ToggleButtonGroup
                value={range}
                exclusive
                onChange={(_, newRange) => newRange && setRange(newRange)}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    px: 2,
                  },
                }}
              >
                <ToggleButton value="today">Today</ToggleButton>
                <ToggleButton value="7days">7 Days</ToggleButton>
                <ToggleButton value="30days">30 Days</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={48} sx={{ mb: 1 }} />
                ))}
              </Box>
            ) : events.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No activity in this period
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Activity Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.slice(0, 20).map((event: ActivityEvent, i) => {
                      const colors = typeColors[event.type] || { bg: '#f4f4f5', color: '#a1a1aa' };
                      return (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontWeight: 500 }}>{event.user_name}</TableCell>
                          <TableCell>
                            <Chip label={event.type} size="small" sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 600, fontSize: '0.7rem' }} />
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary' }}>{event.description}</TableCell>
                          <TableCell sx={{ color: 'text.disabled', fontSize: '0.8rem' }}>{event.relative_time}</TableCell>
                        </TableRow>
                      );
                    })}
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

export default AnalyticsPage;