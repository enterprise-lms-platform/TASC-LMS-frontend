import React, { useState } from 'react';
import { Box, CssBaseline, LinearProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PreviewHeader from '../components/instructor/course-preview/PreviewHeader';
import type { DeviceType, ViewMode } from '../components/instructor/course-preview/PreviewHeader';
import PreviewFrame from '../components/instructor/course-preview/PreviewFrame';
import CourseHero from '../components/instructor/course-preview/CourseHero';
import PurchaseCard from '../components/instructor/course-preview/PurchaseCard';
import CourseTabs from '../components/instructor/course-preview/CourseTabs';
import OverviewTab from '../components/instructor/course-preview/OverviewTab';
import CurriculumTab from '../components/instructor/course-preview/CurriculumTab';
import type { Module } from '../components/instructor/course-preview/CurriculumTab';
import InstructorTab from '../components/instructor/course-preview/InstructorTab';
import ReviewsTab from '../components/instructor/course-preview/ReviewsTab';
import type { Review } from '../components/instructor/course-preview/ReviewsTab';
import { useCourse } from '../hooks/useCatalogue';

/** Split a multi-line string into trimmed, non-empty lines */
const strToLines = (s?: string | null): string[] =>
  (s || '').split('\n').map((l) => l.trim()).filter(Boolean);

// Sample data (curriculum, reviews stay as sample until those APIs are wired)
const sampleModules: Module[] = [
  {
    id: '1',
    title: 'Module 1: Introduction to React',
    lessonCount: 5,
    duration: '45min',
    lessons: [
      { id: '1-1', title: 'Welcome to the Course', type: 'video', duration: '5:30', isPreview: true },
      { id: '1-2', title: 'Setting Up Your Environment', type: 'video', duration: '12:15' },
      { id: '1-3', title: 'Your First React Component', type: 'video', duration: '18:45' },
      { id: '1-4', title: 'React Basics Quiz', type: 'quiz', duration: '10min' },
      { id: '1-5', title: 'Course Resources', type: 'document', duration: '5min' },
    ],
  },
  {
    id: '2',
    title: 'Module 2: Advanced Patterns',
    lessonCount: 6,
    duration: '1h 20min',
    lessons: [
      { id: '2-1', title: 'Higher-Order Components', type: 'video', duration: '15:30' },
      { id: '2-2', title: 'Render Props Pattern', type: 'video', duration: '20:00' },
      { id: '2-3', title: 'Custom Hooks Deep Dive', type: 'video', duration: '25:15' },
      { id: '2-4', title: 'Practice Assignment', type: 'assignment', duration: '30min' },
    ],
  },
];

const sampleReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    rating: 5,
    date: '2 days ago',
    content: 'Excellent course! The instructor explains complex concepts in a very clear and understandable way. Highly recommended for anyone looking to master React patterns.',
  },
  {
    id: '2',
    userName: 'Michael Chen',
    userInitials: 'MC',
    rating: 5,
    date: '1 week ago',
    content: 'Best React course I have taken. The practical examples and hands-on projects really helped solidify my understanding.',
  },
  {
    id: '3',
    userName: 'Emma Davis',
    userInitials: 'ED',
    rating: 4,
    date: '2 weeks ago',
    content: 'Great content overall. Would love to see more advanced topics in future updates.',
  },
];

const CoursePreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId ? Number(courseId) : 0;

  // Load course data from API
  const { data: courseData, isLoading: courseLoading, isError: courseIsError } = useCourse(id, { enabled: !!courseId });

  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [activeTab, setActiveTab] = useState(0);

  const handleEdit = () => {
    navigate(`/instructor/course/${courseId}/edit`);
  };

  const handlePublish = () => {
    console.log('Publishing course...');
  };

  // Loading state
  if (courseLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CssBaseline />
        <LinearProgress sx={{ width: '50%', mb: 2 }} />
        <Typography color="text.secondary">Loading course...</Typography>
      </Box>
    );
  }

  // Error state
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

  // Derive display values from API data
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

      {/* Preview Header */}
      <PreviewHeader
        deviceType={deviceType}
        viewMode={viewMode}
        onDeviceChange={setDeviceType}
        onViewChange={setViewMode}
        onEdit={handleEdit}
        onPublish={handlePublish}
      />

      {/* Preview Frame */}
      <PreviewFrame deviceType={deviceType}>
        {/* Hero Section */}
        <Box sx={{ position: 'relative' }}>
          <CourseHero
            category={courseData.category?.name ?? '—'}
            title={courseData.title}
            subtitle={courseData.short_description ?? courseData.subtitle ?? ''}
            rating={4.8}
            ratingCount={0}
            studentCount={courseData.enrollment_count}
            duration={courseData.duration_hours ? `${courseData.duration_hours} hours` : '—'}
            level={courseData.level ?? 'Intermediate'}
            instructor={{
              name: instructorName,
              title: 'Instructor',
              initials: instructorInitials,
            }}
          />

          {/* Purchase Card - positioned absolutely on desktop */}
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

        {/* Purchase Card for tablet/mobile */}
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

        {/* Content Section */}
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
          {/* Main Content */}
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
                modules={sampleModules}
                totalSections={2}
                totalLessons={11}
                totalDuration="2h 5min"
              />
            )}

            {activeTab === 2 && (
              <InstructorTab
                instructor={{
                  name: instructorName,
                  title: 'Instructor',
                  initials: instructorInitials,
                  bio: 'Instructor biography will be loaded from the user profile API.',
                  stats: {
                    students: courseData.enrollment_count,
                    courses: 1,
                    rating: 4.8,
                    reviews: 0,
                  },
                }}
              />
            )}

            {activeTab === 3 && (
              <ReviewsTab
                averageRating={4.8}
                totalReviews={sampleReviews.length}
                ratingDistribution={[
                  { stars: 5, percentage: 75 },
                  { stars: 4, percentage: 18 },
                  { stars: 3, percentage: 5 },
                  { stars: 2, percentage: 1 },
                  { stars: 1, percentage: 1 },
                ]}
                reviews={sampleReviews}
              />
            )}
          </Box>

          {/* Sidebar - only on desktop */}
          {deviceType === 'desktop' && <Box>{/* Placeholder for potential sidebar content */}</Box>}
        </Box>
      </PreviewFrame>
    </Box>
  );
};

export default CoursePreviewPage;
