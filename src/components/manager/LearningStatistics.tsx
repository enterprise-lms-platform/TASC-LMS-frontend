import React from 'react';
import { Box, Paper, Typography, CircularProgress, Grid } from '@mui/material';
import { PieChart as ChartIcon } from '@mui/icons-material';
import { useLearningStats } from '../../services/learning.services';

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const LearningStatistics: React.FC = () => {
  const { data, isLoading, isError } = useLearningStats();

  const statsData = [
    { value: data?.total_learners?.toLocaleString() || '0', label: 'Total Learners', color: '#10b981', bg: '#dcfce7' },
    { value: data?.active_learners?.toLocaleString() || '0', label: 'Active Learners', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { value: `${data?.avg_quiz_score?.toFixed(1) || '0'}%`, label: 'Avg. Quiz Score', color: '#f59e0b', bg: '#fff3e0' },
    { value: data?.total_courses_in_progress?.toLocaleString() || '0', label: 'Courses In Progress', color: '#ffa424', bg: 'rgba(255,164,36,0.08)' },
  ];

  return (
    <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ ...headerSx, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ChartIcon sx={{ color: '#ffa424', fontSize: 20 }} />
        <Typography fontWeight={700}>Learning Statistics</Typography>
      </Box>

      <Box sx={{ p: 3, height: 'calc(100% - 60px)' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', height: '100%', minHeight: 180, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#ffa424' }} />
          </Box>
        ) : isError ? (
          <Box sx={{ display: 'flex', height: '100%', minHeight: 180, alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Failed to load statistics.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {statsData.map((stat) => (
              <Grid size={6} key={stat.label}>
                <Box sx={{
                  textAlign: 'center', p: 2, borderRadius: '12px', bgcolor: stat.bg, height: '100%',
                  transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' },
                  display: 'flex', flexDirection: 'column', justifyContent: 'center'
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, lineHeight: 1.2 }}>{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default LearningStatistics;
