import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import { Layers as CategoriesIcon } from '@mui/icons-material';

const categoriesData = [
  { name: 'Web Development', count: 24, percentage: 75, color: '#ffa424' },
  { name: 'Data Science', count: 18, percentage: 56, color: '#6366f1' },
  { name: 'Business & Management', count: 15, percentage: 47, color: '#10b981' },
  { name: 'Cybersecurity', count: 10, percentage: 31, color: '#f59e0b' },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const CourseCategories: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ ...headerSx, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoriesIcon sx={{ color: '#ffa424', fontSize: 20 }} />
        <Typography fontWeight={700}>Courses by Category</Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {categoriesData.map((cat) => (
          <Box key={cat.name}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="body2" fontWeight={600}>{cat.name}</Typography>
              <Typography variant="caption" fontWeight={600} sx={{ color: cat.color }}>{cat.count} courses</Typography>
            </Box>
            <LinearProgress variant="determinate" value={cat.percentage}
              sx={{
                height: 6, borderRadius: 3, bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: cat.color },
              }} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default CourseCategories;
