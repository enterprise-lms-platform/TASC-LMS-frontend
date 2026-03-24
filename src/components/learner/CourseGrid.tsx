import React from 'react';
import { Grid, Box, Typography, Button, Skeleton } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '../../services/learning.services';
import type { PaginatedResponse } from '../../types/types';
import CourseCard from './CourseCard';

interface EnrollmentResult {
  id: number;
  course: {
    id: number;
    title: string;
    category?: { name?: string };
    instructor_name?: string;
    thumbnail?: string;
    rating?: number;
  };
  progress_percentage: number;
  completed_sessions: number;
  total_sessions: number;
}

const CourseGrid: React.FC = () => {
  const navigate = useNavigate();

  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ['learner', 'enrollments', 'active'],
    queryFn: () => enrollmentApi.getAll({ page_size: 6 }).then(r => r.data),
  });

  const enrollments = (enrollmentsData as PaginatedResponse<EnrollmentResult> | undefined)?.results ?? [];
  const activeCourses = enrollments
    .filter(e => e.progress_percentage < 100)
    .slice(0, 3)
    .map(e => ({
      id: String(e.course?.id ?? e.id),
      category: e.course?.category?.name || 'General',
      title: e.course?.title || 'Untitled Course',
      instructor: e.course?.instructor_name || 'Instructor',
      progress: e.progress_percentage || 0,
      lessonsCompleted: e.completed_sessions || 0,
      totalLessons: e.total_sessions || 0,
      rating: e.course?.rating || 0,
      image: e.course?.thumbnail,
    }));

  if (!isLoading && activeCourses.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
        <Typography variant="h6" fontWeight={700}>
          Continue Learning
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          onClick={() => navigate('/learner/my-courses')}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark' }}
        >
          View All Courses
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {isLoading
          ? [0, 1, 2].map(i => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rounded" height={280} sx={{ borderRadius: '1rem' }} />
              </Grid>
            ))
          : activeCourses.map((course) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default CourseGrid;
