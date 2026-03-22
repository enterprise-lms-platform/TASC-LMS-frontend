import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Grid, Paper, Stack, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { publicCourseApi, type PublicCourseParams } from '../../services/public.services';

interface RelatedCoursesProps {
  categoryId?: number;
  currentCourseId?: number;
}

interface RelatedCourse {
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  image: string;
  slug: string;
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ categoryId, currentCourseId }) => {
  const navigate = useNavigate();

  const params: PublicCourseParams = {
    page_size: 4,
  };
  if (categoryId) params.category = categoryId;

  const { data: coursesData } = useQuery({
    queryKey: ['relatedCourses', categoryId],
    queryFn: () => publicCourseApi.getAll(params),
  });

  const apiResults = coursesData?.data?.results ?? [];
  const courses: RelatedCourse[] = apiResults
    .filter((c: any) => c.id !== currentCourseId)
    .slice(0, 3)
    .map((c: any) => ({
      title: c.title,
      instructor: c.instructor_name || 'Instructor',
      rating: c.rating || 0,
      reviews: c.rating_count || 0,
      image: c.thumbnail || '',
      slug: c.slug,
    }));

  if (courses.length === 0) return null;

  return (
    <Box id="related" className="course-section" sx={{ mb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#18181b' }}>Students Also Bought</Typography>
      <Grid container spacing={4}>
        {courses.map((course, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Paper 
              elevation={0}
              sx={{ 
                border: '1px solid #e4e4e7', 
                borderRadius: 3, 
                overflow: 'hidden', 
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
              onClick={() => course.slug && navigate(`/course-details/${course.slug}`)}
            >
              <Box component="img" src={course.image} alt={course.title} sx={{ width: '100%', height: 180, objectFit: 'cover' }} />
              <Box p={3}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem', lineHeight: 1.4, height: 44, overflow: 'hidden' }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>{course.instructor}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating value={course.rating} readOnly precision={0.1} size="small" sx={{ color: '#f59e0b', fontSize: '1rem' }} />
                    <Typography variant="body2" fontWeight={600} color="#f59e0b">{course.rating}</Typography>
                    <Typography variant="caption" color="text.secondary">({course.reviews})</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedCourses;
