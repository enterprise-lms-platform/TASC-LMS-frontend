import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CourseCard from './CourseCard';

// Sample courses data (will come from backend later)
const coursesData = [
  {
    title: 'Advanced React Patterns',
    category: 'Web Development',
    learners: 452,
    rating: 4.8,
    progress: 78,
  },
  {
    title: 'Modern JavaScript',
    category: 'Programming',
    learners: 312,
    rating: 4.7,
    progress: 82,
  },
  {
    title: 'TypeScript Fundamentals',
    category: 'Programming',
    learners: 245,
    rating: 4.9,
    progress: 65,
  },
];

const CoursesSection: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary">
          My Courses
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.8rem',
            bgcolor: 'primary.dark',
            '&:hover': { bgcolor: 'primary.main' },
          }}
        >
          New Course
        </Button>
      </Box>

      {/* Courses Grid */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {coursesData.map((course) => (
            <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={course.title}>
              <CourseCard {...course} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default CoursesSection;
