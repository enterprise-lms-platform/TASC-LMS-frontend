import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { PieChart as ChartIcon } from '@mui/icons-material';

const statsData = [
  { value: '92%', label: 'Learner Satisfaction', color: '#10b981', bg: '#dcfce7' },
  { value: '4.7', label: 'Avg. Course Rating', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { value: '85%', label: 'Quiz Pass Rate', color: '#f59e0b', bg: '#fff3e0' },
  { value: '324', label: 'Certificates Issued', color: '#ffa424', bg: 'rgba(255,164,36,0.08)' },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const LearningStatistics: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ ...headerSx, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ChartIcon sx={{ color: '#ffa424', fontSize: 20 }} />
        <Typography fontWeight={700}>Learning Statistics</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {statsData.map((stat) => (
            <Grid size={6} key={stat.label}>
              <Box sx={{
                textAlign: 'center', p: 2, borderRadius: '12px', bgcolor: stat.bg,
                transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' },
              }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{stat.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default LearningStatistics;
