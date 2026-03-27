import React from 'react';
import { Box, Paper, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { Layers as CategoriesIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../services/learning.services';

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

// Fixed color palette for categories
const COLORS = ['#ffa424', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const CourseCategories: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', 'categories'],
    queryFn: () => analyticsApi.getCoursesByCategory().then(res => res.data),
  });

  const totalCourses = data?.reduce((acc, cat) => acc + cat.count, 0) || 0;

  return (
    <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ ...headerSx, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoriesIcon sx={{ color: '#ffa424', fontSize: 20 }} />
        <Typography fontWeight={700}>Courses by Category</Typography>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', height: '100%', minHeight: 180, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#ffa424' }} />
          </Box>
        ) : isError ? (
           <Box sx={{ display: 'flex', height: '100%', minHeight: 180, alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Failed to load categories.</Typography>
          </Box>
        ) : !data || data.length === 0 ? (
           <Box sx={{ display: 'flex', height: '100%', minHeight: 180, alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">No category data available.</Typography>
          </Box>
        ) : (
          data.map((cat, index) => {
            const percentage = totalCourses > 0 ? Math.round((cat.count / totalCourses) * 100) : 0;
            const color = COLORS[index % COLORS.length];
            return (
              <Box key={cat.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="body2" fontWeight={600}>{cat.name}</Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ color }}>{cat.count} courses</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={percentage}
                  sx={{
                    height: 6, borderRadius: 3, bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: color },
                  }} 
                />
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default CourseCategories;
