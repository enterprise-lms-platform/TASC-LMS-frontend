import React from 'react';
import { Box, Paper, Typography, Button, LinearProgress } from '@mui/material';
import { Layers as CategoriesIcon, Settings as SettingsIcon } from '@mui/icons-material';

// Categories data (will come from backend later)
const categoriesData = [
  { name: 'Web Development', count: 24, percentage: 75, color: 'primary' },
  { name: 'Data Science', count: 18, percentage: 56, color: 'info' },
  { name: 'Business & Management', count: 15, percentage: 47, color: 'success' },
  { name: 'Cybersecurity', count: 10, percentage: 31, color: 'warning' },
];

const progressColors = {
  primary: 'linear-gradient(90deg, #ffb74d, #ffa424)',
  info: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
  success: 'linear-gradient(90deg, #10b981, #34d399)',
  warning: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
};

const CourseCategories: React.FC = () => {
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
          <CategoriesIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Courses by Category
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SettingsIcon />}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Manage
        </Button>
      </Box>

      {/* Categories List */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {categoriesData.map((category, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={500}>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.count} courses
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={category.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: progressColors[category.color as keyof typeof progressColors],
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default CourseCategories;
