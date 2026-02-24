import React from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import { ShowChart as ChartIcon, CalendarMonth as CalendarIcon, Download as DownloadIcon } from '@mui/icons-material';

const statsData = [
  { value: '1,245', label: 'New Enrollments (30d)', color: '#6366f1' },
  { value: '892', label: 'Completions (30d)', color: '#10b981' },
  { value: '4.2', label: 'Avg. Courses/User', color: '#ffa424' },
  { value: '14.5h', label: 'Avg. Learning Time', color: '#8b5cf6' },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const EnrollmentChart: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      {/* Header */}
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Enrollment & Completion Trends</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<CalendarIcon />}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem',
              '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
            Last 90 Days
          </Button>
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem',
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Chart Placeholder */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            height: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(99,102,241,0.04)',
            borderRadius: '12px',
            flexDirection: 'column',
            color: 'text.secondary',
            border: '2px dashed rgba(99,102,241,0.15)',
          }}
        >
          <ChartIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.3, color: '#6366f1' }} />
          <Typography variant="body1" fontWeight={600} sx={{ color: '#6366f1', opacity: 0.6 }}>
            Enrollment & Completion Trends
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
            8,924 total enrollments · 68% avg completion rate
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {statsData.map((stat) => (
            <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
              <Box
                sx={{
                  textAlign: 'center', p: 2, borderRadius: '12px',
                  bgcolor: `${stat.color}0a`,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default EnrollmentChart;
