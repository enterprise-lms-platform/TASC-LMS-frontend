import React from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import { ShowChart as ChartIcon, CalendarMonth as CalendarIcon, Download as DownloadIcon } from '@mui/icons-material';

// Enrollment stats data (will come from backend later)
const statsData = [
  { value: '1,245', label: 'New Enrollments (30d)' },
  { value: '892', label: 'Completions (30d)' },
  { value: '4.2', label: 'Avg. Courses/User' },
  { value: '14.5h', label: 'Avg. Learning Time' },
];

const EnrollmentChart: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Enrollment & Completion Trends
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarIcon />}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Last 90 Days
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
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
            bgcolor: 'grey.50',
            borderRadius: 1,
            flexDirection: 'column',
            color: 'text.secondary',
          }}
        >
          <ChartIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.5 }} />
          <Typography variant="body1" fontWeight={500}>
            Enrollment & Completion Trends Chart
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            8,924 total enrollments | 68% avg completion rate
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {statsData.map((stat, index) => (
            <Grid size={{ xs: 6, sm: 3 }} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
