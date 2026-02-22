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
    image: '/course_images/dash_image (1).jpg',
  },
  {
    title: 'Modern JavaScript',
    category: 'Programming',
    learners: 312,
    rating: 4.7,
    progress: 82,
    image: '/course_images/dash_image (2).jpg',
  },
  {
    title: 'TypeScript Fundamentals',
    category: 'Programming',
    learners: 245,
    rating: 4.9,
    progress: 65,
    image: '/course_images/dash_image (3).jpg',
  },
];

const CoursesSection: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          p: 2.5,
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
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: '50px',
            px: 2.5,
            bgcolor: 'primary.dark',
            boxShadow: 'none',
            '&:hover': { bgcolor: 'primary.main', boxShadow: 'none' },
          }}
        >
          New Course
        </Button>
      </Box>

      {/* Courses Grid */}
      <Box sx={{ p: 2.5, pt: 0 }}>
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
