import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

interface CourseStats {
  modules: number;
  lessons: number;
  quizzes: number;
  assignments: number;
}

interface CourseStatsWidgetProps {
  stats: CourseStats;
}

const CourseStatsWidget: React.FC<CourseStatsWidgetProps> = ({ stats }) => {
  const items = [
    { label: 'Modules', value: stats.modules },
    { label: 'Lessons', value: stats.lessons },
    { label: 'Quizzes', value: stats.quizzes },
    { label: 'Assignments', value: stats.assignments },
  ];

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography fontWeight={700}>Course Statistics</Typography>
      </Box>
      <Grid container sx={{ '& > *': { borderBottom: 1, borderColor: 'grey.200' } }}>
        {items.map((item, index) => (
          <Grid
            size={6}
            key={item.label}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRight: index % 2 === 0 ? 1 : 0,
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {item.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default CourseStatsWidget;
export type { CourseStats };
