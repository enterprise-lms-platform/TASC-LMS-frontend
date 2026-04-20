import React from 'react';
import { Grid, Box, Typography, Button, Skeleton } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '../../services/learning.services';
import { normalizeEnrollmentListResponse } from '../../hooks/useLearning';
import CourseCard from './CourseCard';

const CourseGrid: React.FC = () => {
  const navigate = useNavigate();

  const { data: enrollmentsData, isLoading } = useQuery({
    queryKey: ['learner', 'enrollments', 'active'],
    queryFn: () => enrollmentApi.getAll({ page_size: 6 }).then(r => r.data),
  });

  const enrollments = normalizeEnrollmentListResponse(enrollmentsData);
  const activeCourses = enrollments
    .filter(e => Number(e.progress_percentage) < 100)
    .slice(0, 3)
    .map(e => ({
      id: String(e.course),
      title: e.course_title || 'Untitled Course',
      progress: Number(e.progress_percentage) || 0,
      image: e.course_thumbnail || undefined,
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
