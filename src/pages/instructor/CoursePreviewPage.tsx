import React, { useState, useMemo } from 'react';
import { Box, CssBaseline, LinearProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PreviewHeader from '../../components/instructor/course-preview/PreviewHeader';
import type { DeviceType, ViewMode } from '../../components/instructor/course-preview/PreviewHeader';
import PreviewFrame from '../../components/instructor/course-preview/PreviewFrame';
import CourseHero from '../../components/instructor/course-preview/CourseHero';
import PurchaseCard from '../../components/instructor/course-preview/PurchaseCard';
import CourseTabs from '../../components/instructor/course-preview/CourseTabs';
import OverviewTab from '../../components/instructor/course-preview/OverviewTab';
import CurriculumTab from '../../components/instructor/course-preview/CurriculumTab';
import InstructorTab from '../../components/instructor/course-preview/InstructorTab';
import ReviewsTab from '../../components/instructor/course-preview/ReviewsTab';
import type { Module as PreviewModule, Lesson as PreviewLesson } from '../../components/instructor/course-preview/CurriculumTab';
import type { Review as PreviewReview } from '../../components/instructor/course-preview/ReviewsTab';
import { useCourse, useModules } from '../../hooks/useCatalogue';
import { useCourseReviews } from '../../hooks/usePublicCourse';

const strToLines = (s?: string | null): string[] =>
  (s || '').split('\n').map((l) => l.trim()).filter(Boolean);

const CoursePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId ? Number(courseId) : 0;

  const { data: courseData, isLoading: courseLoading, isError: courseIsError } = useCourse(id, { enabled: !!courseId });
  const { data: modulesData } = useModules({ course: id });
  const { data: reviewData } = useCourseReviews(id);

  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [activeTab, setActiveTab] = useState(0);

  const previewModules: PreviewModule[] = useMemo(() => {
    if (!modulesData?.length) return [];
    
    const moduleMap = new Map<number, { id: string; title: string; lessons: PreviewLesson[] }>();
    
    modulesData.forEach((mod) => {
      moduleMap.set(mod.id, {
        id: String(mod.id),
        title: mod.title,
        lessons: [],
      });
    });
    
    if (courseData?.sessions) {
      courseData.sessions.forEach((session) => {
        const moduleId = session.module || 0;
        if (!moduleMap.has(moduleId)) {
          moduleMap.set(moduleId, {
            id: String(moduleId || 'unassigned'),
            title: moduleId ? `Module ${moduleId}` : 'Additional Sessions',
            lessons: [],
          });
        }
        const mod = moduleMap.get(moduleId)!;
        const duration = session.video_duration_seconds
          ? `${Math.floor(session.video_duration_seconds / 60)} min`
          : session.duration_minutes
          ? `${session.duration_minutes} min`
          : 'N/A';
        const type: 'video' | 'document' | 'quiz' | 'assignment' =
          session.session_type === 'quiz' ? 'quiz' :
          session.session_type === 'assignment' ? 'assignment' :
          session.session_type === 'text' || session.session_type === 'html' || session.session_type === 'document' ? 'document' : 'video';
        
        mod.lessons.push({
          id: String(session.id),
          title: session.title,
          type,
          duration,
          isPreview: session.is_free_preview || false,
        });
      });
    }
    
    return Array.from(moduleMap.values()).map((mod) => ({
      ...mod,
      lessonCount: mod.lessons.length,
      duration: mod.lessons.length > 0 ? `${mod.lessons.length} lessons` : '0 lessons',
    }));
  }, [modulesData, courseData]);

  const totalLessons = previewModules.reduce((sum, m) => sum + m.lessonCount, 0);
  const totalDuration = courseData?.duration_hours ? `${courseData.duration_hours}h` : 'N/A';

  const previewReviews: PreviewReview[] = useMemo(() => {
    if (!reviewData?.reviews?.length) return [];
    return reviewData.reviews.map((r) => {
      const name = r.user_name || 'Anonymous';
      const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AN';
      return {
        id: String(r.id),
        userName: name,
        userInitials: initials,
        rating: r.rating,
        date: new Date(r.created_at).toLocaleDateString(),
        content: r.content,
      };
    });
  }, [reviewData]);

  const ratingDistribution = useMemo(() => {
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

  const handleEdit = () => {
    navigate(`/instructor/course/${courseId}/edit`);
  };

  const handlePublish = () => {
    console.log('Publishing course...');
  };

  if (courseLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CssBaseline />
        <LinearProgress sx={{ width: '50%', mb: 2 }} />
        <Typography color="text.secondary">Loading course...</Typography>
      </Box>
    );
  }

  if (courseIsError || !courseData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CssBaseline />
        <Typography color="error.main" fontWeight={600}>
          Failed to load course. Please try again.
        </Typography>
      </Box>
    );
  }

  const instructorName = courseData.instructor_name || 'Instructor';
  const instructorInitials = instructorName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const currentPrice = parseFloat(courseData.discounted_price) || parseFloat(courseData.price) || 0;
  const originalPrice = parseFloat(courseData.price) || 0;
  const discount = courseData.discount_percentage ?? 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      <PreviewHeader
        deviceType={deviceType}
        viewMode={viewMode}
        onDeviceChange={setDeviceType}
        onViewChange={setViewMode}
        onEdit={handleEdit}
        onPublish={handlePublish}
      />

      <PreviewFrame deviceType={deviceType}>
        <Box sx={{ position: 'relative' }}>
          <CourseHero
            category={courseData.category?.name ?? '—'}
            title={courseData.title}
            subtitle={courseData.short_description ?? courseData.subtitle ?? ''}
            rating={reviewData?.average || 0}
            ratingCount={reviewData?.total || 0}
            studentCount={courseData.enrollment_count}
            duration={courseData.duration_hours ? `${courseData.duration_hours} hours` : '—'}
            level={courseData.level ?? 'Intermediate'}
            instructor={{
              name: instructorName,
              title: 'Instructor',
              initials: instructorInitials,
            }}
          />

          <Box
            sx={{
              display: deviceType === 'desktop' ? 'block' : 'none',
              position: 'absolute',
              top: { md: 80 },
              right: { md: 60 },
              width: 400,
              zIndex: 10,
            }}
          >
            <PurchaseCard
              currentPrice={currentPrice}
              originalPrice={originalPrice}
              discount={discount}
              onEnroll={() => console.log('Enroll clicked')}
              onAddToCart={() => console.log('Add to cart clicked')}
            />
          </Box>
        </Box>

        {deviceType !== 'desktop' && (
          <Box sx={{ p: 3, bgcolor: 'grey.100' }}>
            <PurchaseCard
              currentPrice={currentPrice}
              originalPrice={originalPrice}
              discount={discount}
              onEnroll={() => console.log('Enroll clicked')}
              onAddToCart={() => console.log('Add to cart clicked')}
            />
          </Box>
        )}

        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            p: { xs: 2, md: 4 },
            display: 'grid',
            gridTemplateColumns: deviceType === 'desktop' ? '1fr 380px' : '1fr',
            gap: 4,
          }}
        >
          <Box>
            <CourseTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 0 && (
              <OverviewTab
                description={courseData.description}
                objectives={courseData.learning_objectives_list ?? strToLines(courseData.learning_objectives)}
                requirements={strToLines(courseData.prerequisites)}
                targetAudience={strToLines(courseData.target_audience)}
              />
            )}

            {activeTab === 1 && (
              <CurriculumTab
                modules={previewModules}
                totalSections={previewModules.length}
                totalLessons={totalLessons}
                totalDuration={totalDuration}
              />
            )}

            {activeTab === 2 && (
              <InstructorTab
                instructor={{
                  name: instructorName,
                  title: 'Instructor',
                  initials: instructorInitials,
                  bio: 'Experienced instructor dedicated to helping students achieve their learning goals.',
                  stats: {
                    students: courseData.enrollment_count,
                    courses: 1,
                    rating: reviewData?.average || 0,
                    reviews: reviewData?.total || 0,
                  },
                }}
              />
            )}

            {activeTab === 3 && (
              <ReviewsTab
                averageRating={reviewData?.average || 0}
                totalReviews={reviewData?.total || 0}
                ratingDistribution={ratingDistribution}
                reviews={previewReviews}
              />
            )}
          </Box>

          {deviceType === 'desktop' && <Box />}
        </Box>
      </PreviewFrame>
    </Box>
  );
};

export default CoursePreviewPage;
