import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import CourseHero from '../../components/course/CourseHero';
import CoursePricingCard from '../../components/course/CoursePricingCard';
import CourseNavigation from '../../components/course/CourseNavigation';
import CourseObjectives from '../../components/course/CourseObjectives';
import CourseCurriculum from '../../components/course/CourseCurriculum';
import CourseInstructor from '../../components/course/CourseInstructor';
import CourseReviews from '../../components/course/CourseReviews';
import FaqSection from '../../components/business/FaqSection';
import RelatedCourses from '../../components/course/RelatedCourses';
import { publicCourseApi } from '../../services/public.services';
import { CourseDetailContext } from '../../contexts/CourseDetailContext';
import '../../styles/CourseLanding.css';

const CourseLandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();

  const { data: courseData, isLoading, isError } = useQuery({
    queryKey: ['publicCourse', slug],
    queryFn: () => publicCourseApi.getBySlug(slug!).then((r) => r.data),
    enabled: !!slug,
  });
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get('slug');

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['course', courseSlug],
    queryFn: () => publicCourseApi.getBySlug(courseSlug || ''),
    enabled: !!courseSlug,
  });

  const course = courseData?.data;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#ffa424' }} />
        <Typography sx={{ mt: 2, color: '#71717a' }}>Loading course...</Typography>
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ color: '#27272a', mb: 1 }}>Course Not Found</Typography>
        <Typography sx={{ color: '#71717a' }}>The course you're looking for doesn't exist or has been removed.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        scrolled={scrolled}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobile={isMobile}
      />

      <Box component="main" sx={{ flex: 1, mt: { xs: 8, md: 0 } }}>
        {isLoading && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Typography color="error" variant="h6">Course not found</Typography>
          </Box>
        )}

        {!slug && !isLoading && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="h6">No course selected</Typography>
          </Box>
        )}

        <CourseDetailContext.Provider value={courseData ?? null}>
          {(courseData || !slug) && (
            <>
              <CourseHero course={course} />

              <Container maxWidth="lg" sx={{ py: 6 }}>
                <Grid container spacing={6}>
                  {/* Main Content */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                    <CourseNavigation />
                    <CourseObjectives objectives={course.learning_objectives_list || []} />
                    <CourseCurriculum courseId={course.id} />
                    <CourseInstructor instructorId={course.instructor?.id} name={course.instructor_name} />
                    <CourseReviews courseId={courseData?.id} courseId={course.id} />
                    <Box id="faq" className="course-section" sx={{ scrollMarginTop: '140px', mb: 8 }}>
                      <FaqSection />
                    </Box>
                    <RelatedCourses categoryId={course.category?.id} />
                  </Grid>

                  {/* Sticky Sidebar (Desktop) */}
                  <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
                    <Box sx={{ position: 'relative', height: '100%' }}>
                      <CoursePricingCard />
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </>
          )}
        </CourseDetailContext.Provider>
      </Box>

      <Footer />
    </Box>
  );
};

export default CourseLandingPage;
