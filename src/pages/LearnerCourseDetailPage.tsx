import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, useMediaQuery, useTheme, CssBaseline, Toolbar } from '@mui/material';

// Import Layout components
import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

// Import Course components
import CourseDetailHero from '../components/learner/course/CourseDetailHero';
import type { CourseHeroData } from '../components/learner/course/CourseDetailHero';
import WhatYouLearn, { sampleLearnings } from '../components/learner/course/WhatYouLearn';
import CourseCurriculum, { sampleModules } from '../components/learner/course/CourseCurriculum';
import CourseRequirements, { sampleRequirements } from '../components/learner/course/CourseRequirements';
import CourseInstructor, { sampleInstructor } from '../components/learner/course/CourseInstructor';
import CourseReviews, { sampleRatingDistribution, sampleReviews } from '../components/learner/course/CourseReviews';
import CourseFAQ, { sampleFAQs } from '../components/learner/course/CourseFAQ';
import CourseSidebar from '../components/learner/course/CourseSidebar';

// Sample course data (would come from API)
const sampleCourse: CourseHeroData = {
  title: 'Advanced React Patterns',
  description: 'Master advanced React patterns and techniques used by senior developers at top tech companies. Learn render props, higher-order components, custom hooks, and performance optimization.',
  category: 'Web Development',
  rating: 4.8,
  reviewCount: 1234,
  studentCount: 5678,
  level: 'Intermediate Level',
  duration: '24 hours total',
  lastUpdated: 'Dec 2025',
  lessons: 24,
  videoHours: 12,
  projects: 7,
  hasCertificate: true,
  price: 129.99,
  originalPrice: 199.99,
  discountPercent: 35,
};

const LearnerCourseDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleEnroll = () => {
    // Navigate to checkout with course data
    navigate('/checkout', {
      state: {
        course: {
          id: courseId,
          title: sampleCourse.title,
          instructor: 'Michael Rodriguez',
          duration: `${sampleCourse.lessons} hours`,
          level: sampleCourse.level,
          originalPrice: sampleCourse.originalPrice || sampleCourse.price + 20,
          currentPrice: sampleCourse.price,
        },
      },
    });
  };

  const handlePreview = () => {
    console.log('Starting preview for course:', courseId);
    // Handle preview logic
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <CssBaseline />
      
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* TopBar */}
      <TopBar onMobileMenuToggle={handleMobileMenuToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Course Hero */}
        <CourseDetailHero
          course={sampleCourse}
          onEnroll={handleEnroll}
          onPreview={handlePreview}
        />

        {/* Course Content */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, md: 4 },
            maxWidth: 1400,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 4,
            }}
          >
            {/* Left Column: Main Content */}
            <Stack spacing={4}>
              <WhatYouLearn learnings={sampleLearnings} />
              
              <CourseCurriculum
                modules={sampleModules}
                completedLessons={['1-1', '1-2', '1-3']}
                progress={65}
              />
              
              <CourseRequirements requirements={sampleRequirements} />
              
              <CourseInstructor
                instructor={sampleInstructor}
                onViewProfile={() => console.log('View instructor profile')}
              />
              
              <CourseReviews
                averageRating={4.8}
                totalReviews={1234}
                ratingDistribution={sampleRatingDistribution}
                reviews={sampleReviews}
                onWriteReview={() => console.log('Write review')}
              />
              
              <CourseFAQ faqs={sampleFAQs} />
            </Stack>

            {/* Right Column: Sidebar (hide on mobile since hero has enroll card) */}
            {!isMobile && (
              <Box>
                <CourseSidebar
                  progress={65}
                  completedLessons={12}
                  totalLessons={24}
                  completedHours={8}
                  totalHours={12}
                  projects={7}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid #e4e4e7',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#71717a',
            fontSize: '0.875rem',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>© 2025 TASC Learning Management System</Box>
          <Stack direction="row" spacing={4}>
            <Box component="a" href="#" sx={{ color: '#71717a', textDecoration: 'none', '&:hover': { color: '#ffa424' } }}>
              Learning Resources
            </Box>
            <Box component="a" href="#" sx={{ color: '#71717a', textDecoration: 'none', '&:hover': { color: '#ffa424' } }}>
              Help Center
            </Box>
            <Box component="a" href="#" sx={{ color: '#71717a', textDecoration: 'none', '&:hover': { color: '#ffa424' } }}>
              Community
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default LearnerCourseDetailPage;
