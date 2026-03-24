import React from 'react';
import { Box, Typography, Paper, Button, Grid, Skeleton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../../services/catalogue.services';
import { enrollmentApi } from '../../services/learning.services';
import type { PaginatedResponse } from '../../types/types';
import CourseCard from './CourseCard';

interface CourseResult {
  id: number;
  title: string;
  category?: { name?: string };
  thumbnail?: string;
  rating?: number;
  is_published?: boolean;
}

const CoursesSection: React.FC = () => {
  const navigate = useNavigate();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['instructor', 'courses', 'section'],
    queryFn: () => courseApi.getAll({ page_size: 3 }).then(r => r.data),
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ['instructor', 'enrollments', 'counts'],
    queryFn: () => enrollmentApi.getAll({}).then(r => r.data),
  });

  const courses = (coursesData as PaginatedResponse<CourseResult> | undefined)?.results ?? [];
  const enrollments = (enrollmentsData as PaginatedResponse<{ course?: { id?: number }; progress_percentage?: number }> | undefined)?.results ?? [];

  const courseCards = courses.map(c => {
    const courseEnrollments = enrollments.filter(e => e.course?.id === c.id);
    const avgProgress = courseEnrollments.length > 0
      ? Math.round(courseEnrollments.reduce((s, e) => s + (e.progress_percentage || 0), 0) / courseEnrollments.length)
      : 0;
    return {
      title: c.title,
      category: c.category?.name || 'General',
      learners: courseEnrollments.length,
      rating: c.rating || 0,
      progress: avgProgress,
      image: c.thumbnail,
    };
  });
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
          onClick={() => navigate('/instructor/courses/create')}
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
          {isLoading
            ? [0, 1, 2].map(i => (
                <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={i}>
                  <Skeleton variant="rounded" height={200} sx={{ borderRadius: '12px' }} />
                </Grid>
              ))
            : courseCards.map((course) => (
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
