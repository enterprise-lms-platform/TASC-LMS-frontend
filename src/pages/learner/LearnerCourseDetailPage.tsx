import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, useMediaQuery, useTheme, CssBaseline, Toolbar, Alert, CircularProgress, Typography, Snackbar } from '@mui/material';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';

import { useMySubscription } from '../../hooks/usePayments';
import { useCreateEnrollment } from '../../hooks/useLearning';
import { useCourse } from '../../hooks/useCatalogue';
import { useCourseReviews } from '../../hooks/usePublicCourse';

import CourseDetailHero from '../../components/learner/course/CourseDetailHero';
import type { CourseHeroData } from '../../components/learner/course/CourseDetailHero';
import WhatYouLearn from '../../components/learner/course/WhatYouLearn';
import CourseCurriculum from '../../components/learner/course/CourseCurriculum';
import type { Module } from '../../components/learner/course/CourseCurriculum';
import CourseRequirements from '../../components/learner/course/CourseRequirements';
import CourseInstructor from '../../components/learner/course/CourseInstructor';
import type { InstructorData } from '../../components/learner/course/CourseInstructor';
import CourseReviews from '../../components/learner/course/CourseReviews';
import type { RatingDistribution, Review } from '../../components/learner/course/CourseReviews';
import CourseFAQ from '../../components/learner/course/CourseFAQ';
import CourseSidebar from '../../components/learner/course/CourseSidebar';

const LearnerCourseDetailPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [toast, setToast] = useState('');

  const courseNumericId = courseId ? Number(courseId) : 0;

  const { data: course, isLoading: courseLoading, isError: courseError } = useCourse(courseNumericId, { enabled: !!courseId });
  const { data: reviewData } = useCourseReviews(courseNumericId);

  const { data: subscriptionStatus, isLoading: subLoading } = useMySubscription();
  const createEnrollment = useCreateEnrollment();
  const hasSubscription = subscriptionStatus?.has_active_subscription ?? false;

  const courseHeroData: CourseHeroData | null = useMemo(() => {
    if (!course) return null;
    return {
      title: course.title,
      description: course.short_description || course.subtitle || '',
      category: course.category?.name || 'General',
      rating: reviewData?.average || 0,
      reviewCount: reviewData?.total || 0,
      studentCount: course.enrollment_count || 0,
      level: course.level || 'All Levels',
      duration: course.duration_hours ? `${course.duration_hours} hours` : 'Self-paced',
      lastUpdated: course.updated_at ? new Date(course.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A',
      lessons: course.total_sessions || 0,
      videoHours: course.duration_hours || 0,
      projects: 0,
      hasCertificate: course.certificate_on_completion || false,
    };
  }, [course, reviewData]);

  const curriculumModules: Module[] = useMemo(() => {
    if (!course?.sessions?.length) return [];

    const moduleMap = new Map<number, { id: string; title: string; lessons: { id: string; title: string; duration: string; type: 'video' | 'article' | 'quiz'; isPreview?: boolean; }[]; totalDuration: string }>();

    course.sessions.forEach((session) => {
      const moduleId = session.module || 0;
      if (!moduleMap.has(moduleId)) {
        moduleMap.set(moduleId, {
          id: String(moduleId || `unassigned-${moduleMap.size}`),
          title: moduleId ? `Module ${moduleId}` : 'Additional Sessions',
          lessons: [],
          totalDuration: '0 hours',
        });
      }
      const mod = moduleMap.get(moduleId)!;
      const duration = session.video_duration_seconds
        ? `${Math.floor(session.video_duration_seconds / 60)} min`
        : session.duration_minutes
        ? `${session.duration_minutes} min`
        : 'N/A';
      const type: 'video' | 'article' | 'quiz' =
        session.session_type === 'quiz' ? 'quiz' :
        session.session_type === 'text' || session.session_type === 'html' ? 'article' : 'video';

      mod.lessons.push({
        id: String(session.id),
        title: session.title,
        duration,
        type,
        isPreview: session.is_free_preview || false,
      });
    });

    return Array.from(moduleMap.values()).map((mod) => ({
      ...mod,
      id: mod.id,
      totalDuration: mod.lessons.length > 0 ? `${mod.lessons.length} lessons` : '0 lessons',
    }));
  }, [course]);

  const instructorData: InstructorData | null = useMemo(() => {
    if (!course) return null;
    const name = course.instructor_name || 'Instructor';
    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    return {
      id: String(course.instructor?.id || 0),
      name,
      title: 'Course Instructor',
      initials,
      avatar: course.instructor?.avatar || undefined,
      bio: 'Experienced instructor dedicated to helping students achieve their learning goals.',
      rating: reviewData?.average || 0,
      courseCount: 0,
      studentCount: String(course.enrollment_count || 0),
    };
  }, [course, reviewData]);

  const reviewDistribution: RatingDistribution[] = useMemo(() => {
    if (!reviewData?.distribution?.length) return [
      { stars: 5, percentage: 0 },
      { stars: 4, percentage: 0 },
      { stars: 3, percentage: 0 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 },
    ];

    const total = reviewData.distribution.reduce((a: number, b: number) => a + b, 0) || 1;
    return [5, 4, 3, 2, 1].map((stars, idx) => ({
      stars,
      percentage: total > 0 ? Math.round((reviewData.distribution[idx] || 0) / total * 100) : 0,
    }));
  }, [reviewData]);

  const reviewsList: Review[] = useMemo(() => {
    if (!reviewData?.reviews?.length) return [];
    return reviewData.reviews.map((r) => {
      const name = r.user_name || 'Anonymous';
      const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AN';
      return {
        id: String(r.id),
        reviewerName: name,
        reviewerInitials: initials,
        reviewerAvatar: undefined,
        rating: r.rating,
        date: new Date(r.created_at).toLocaleDateString(),
        content: r.content,
      };
    });
  }, [reviewData]);

  const learnings = course?.learning_objectives_list?.length
    ? course.learning_objectives_list
    : course?.learning_objectives
    ? course.learning_objectives.split('\n').filter(Boolean)
    : [];

  const requirements = course?.prerequisites
    ? course.prerequisites.split('\n').filter(Boolean)
    : [];

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleEnroll = () => {
    if (hasSubscription && courseId) {
      setEnrollError('');
      createEnrollment.mutate(
        { course: Number(courseId) },
        {
          onSuccess: () => {
            navigate(`/learner/course/${courseId}/learn`);
          },
          onError: (err: unknown) => {
            const message =
              err instanceof Error ? err.message : 'Failed to enroll. Please try again.';
            setEnrollError(message);
          },
        },
      );
    } else {
      // Phase 1: subscription unlocks catalog access; send learners to manage/activate subscription instead of checkout.
      navigate('/learner/subscription', {
        state: { fromCourseId: courseId, message: 'An active subscription is required to enroll in courses.' },
      });
    }
  };

  const handlePreview = () => {
    if (courseId && course?.sessions?.length) {
      const firstPreviewSession = course.sessions.find(s => s.is_free_preview);
      if (firstPreviewSession) {
        navigate(`/learner/course/${courseId}/learn?session=${firstPreviewSession.id}`);
      }
    }
  };

  if (courseLoading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
        <CircularProgress sx={{ color: '#ffa424' }} />
      </Box>
    );
  }

  if (courseError || !course || !courseHeroData) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>Failed to load course</Typography>
          <Typography color="text.secondary">Please try again later or contact support.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={handleMobileMenuToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
        }}
      >
        <Toolbar />

        {enrollError && (
          <Alert severity="error" sx={{ mx: { xs: 2, md: 4 }, mt: 2 }} onClose={() => setEnrollError('')}>
            {enrollError}
          </Alert>
        )}

        <CourseDetailHero
          course={courseHeroData}
          onEnroll={handleEnroll}
          onPreview={handlePreview}
          hasSubscription={hasSubscription}
          isEnrolling={createEnrollment.isPending}
          isLoadingSubscription={subLoading}
        />

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
            <Stack spacing={4}>
              {learnings.length > 0 && <WhatYouLearn learnings={learnings} />}

              {curriculumModules.length > 0 && (
                <CourseCurriculum modules={curriculumModules} />
              )}

              {requirements.length > 0 && <CourseRequirements requirements={requirements} />}

              {instructorData && (
                <CourseInstructor
                  instructor={instructorData}
                  onViewProfile={() => setToast('Instructor profiles coming soon')}
                />
              )}

              <CourseReviews
                averageRating={reviewData?.average || 0}
                totalReviews={reviewData?.total || 0}
                ratingDistribution={reviewDistribution}
                reviews={reviewsList}
                onWriteReview={() => setToast('Review submission coming soon')}
              />

              <CourseFAQ faqs={[]} />
            </Stack>

            {!isMobile && (
              <Box>
                <CourseSidebar
                  progress={0}
                  completedLessons={0}
                  totalLessons={course.total_sessions || 0}
                  completedHours={0}
                  totalHours={course.duration_hours || 0}
                  projects={0}
                />
              </Box>
            )}
          </Box>
        </Box>

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
      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" onClose={() => setToast('')} variant="filled">{toast}</Alert>
      </Snackbar>
    </Box>
  );
};

export default LearnerCourseDetailPage;
