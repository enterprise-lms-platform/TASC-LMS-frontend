import React from 'react';
import { Box, Paper, Typography, Button, Grid } from '@mui/material';
import { PieChart as ChartIcon, Download as DownloadIcon } from '@mui/icons-material';

// Stats data (will come from backend later)
const statsData = [
  { value: '92%', label: 'Learner Satisfaction', color: 'success.main' },
  { value: '4.7', label: 'Avg. Course Rating', color: 'info.main' },
  { value: '85%', label: 'Quiz Pass Rate', color: 'warning.main' },
  { value: '324', label: 'Certificates Issued', color: 'primary.dark' },
];

const LearningStatistics: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', height: '100%' }}>
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
            Learning Statistics
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Report
        </Button>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {statsData.map((stat, index) => (
            <Grid size={6} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>
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

export default LearningStatistics;
