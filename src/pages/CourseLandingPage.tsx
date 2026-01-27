import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import CourseHero from '../components/course/CourseHero';
import CoursePricingCard from '../components/course/CoursePricingCard';
import CourseNavigation from '../components/course/CourseNavigation';
import CourseObjectives from '../components/course/CourseObjectives';
import CourseCurriculum from '../components/course/CourseCurriculum';
import CourseInstructor from '../components/course/CourseInstructor';
import CourseReviews from '../components/course/CourseReviews';
import FaqSection from '../components/business/FaqSection';
import RelatedCourses from '../components/course/RelatedCourses';
import '../styles/CourseLanding.css';

const CourseLandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        scrolled={scrolled}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobile={isMobile}
      />
      
      <Box component="main" sx={{ flex: 1, mt: { xs: 8, md: 0 } }}>
        <CourseHero />

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={6}>
            {/* Main Content */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <CourseNavigation />
              <CourseObjectives />
              <CourseCurriculum />
              <CourseInstructor />
              <CourseReviews />
              <Box id="faq" className="course-section" sx={{ scrollMarginTop: '140px', mb: 8 }}>
                <FaqSection />
              </Box>
              <RelatedCourses />
            </Grid>

            {/* Sticky Sidebar (Desktop) */}
            <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Box sx={{ position: 'relative', height: '100%' }}>
                <CoursePricingCard />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Sticky Enroll Bar would go here */}

      <Footer />
    </Box>
  );
};

export default CourseLandingPage;
