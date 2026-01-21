import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import CourseCard from './CourseCard';

// Courses data (will come from backend later)
const coursesData = [
  {
    id: '1',
    category: 'Web Development',
    title: 'Advanced React Patterns',
    instructor: 'Michael Rodriguez',
    progress: 65,
    lessonsCompleted: 8,
    totalLessons: 12,
    rating: 4.8,
  },
  {
    id: '2',
    category: 'Data Science',
    title: 'Data Science Fundamentals',
    instructor: 'Emily Chen',
    progress: 82,
    lessonsCompleted: 10,
    totalLessons: 12,
    rating: 4.9,
  },
  {
    id: '3',
    category: 'Security',
    title: 'Cybersecurity Essentials',
    instructor: 'David Wilson',
    progress: 45,
    lessonsCompleted: 5,
    totalLessons: 11,
    rating: 4.7,
  },
];

const CourseGrid: React.FC = () => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700}>
          Continue Learning
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark' }}
        >
          View All Courses
        </Button>
      </Box>

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {coursesData.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseGrid;
