import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

// Sample data
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
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const [activeTab, setActiveTab] = useState(0);

  const handleEdit = () => {
    navigate('/instructor/course/1/edit');
  };

  const handlePublish = () => {
    console.log('Publishing course...');
  };

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
        {/* Hero Section - outside purchase card on desktop */}
        <Box sx={{ position: 'relative' }}>
          <CourseHero
            category="Web Development"
            title="Advanced React Patterns & Best Practices"
            subtitle="Master modern React development with hooks, context, HOCs, and advanced design patterns"
            rating={4.8}
            ratingCount={1234}
            studentCount={5678}
            duration="12 hours"
            level="Intermediate"
            instructor={{
              name: 'Michael Rodriguez',
              title: 'Senior React Developer',
              initials: 'MR',
            }}
          />

          {/* Purchase Card - positioned absolutely on desktop, inline on mobile */}
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
              currentPrice={49.99}
              originalPrice={149.99}
              discount={67}
              saleEndTime="in 2 days"
              onEnroll={() => console.log('Enroll clicked')}
              onAddToCart={() => console.log('Add to cart clicked')}
            />
          </Box>
        </Box>

        {/* Purchase Card for tablet/mobile */}
        {deviceType !== 'desktop' && (
          <Box sx={{ p: 3, bgcolor: 'grey.100' }}>
            <PurchaseCard
              currentPrice={49.99}
              originalPrice={149.99}
              discount={67}
              saleEndTime="in 2 days"
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
                description="This comprehensive course will take you from the basics to advanced React patterns. You'll learn how to build scalable, maintainable applications using modern React best practices including hooks, context API, custom hooks, and advanced component patterns."
                objectives={[
                  'Master React Hooks including useState, useEffect, useContext, and custom hooks',
                  'Understand advanced patterns like Higher-Order Components and Render Props',
                  'Build scalable applications with proper state management',
                  'Implement performance optimization techniques',
                  'Create reusable component libraries',
                  'Write clean, maintainable React code',
                ]}
                requirements={[
                  'Basic understanding of JavaScript (ES6+)',
                  'Familiarity with HTML and CSS',
                  'Node.js and npm installed',
                  'A code editor (VS Code recommended)',
                ]}
                targetAudience={[
                  'React developers looking to level up their skills',
                  'Frontend developers wanting to learn advanced patterns',
                  'Anyone building complex React applications',
                  'Developers preparing for senior-level positions',
                ]}
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
                  name: 'Michael Rodriguez',
                  title: 'Senior React Developer & Instructor',
                  initials: 'MR',
                  bio: 'With over 10 years of experience in web development, Michael has worked with companies ranging from startups to Fortune 500 enterprises. He specializes in React and modern JavaScript, and has trained thousands of developers through his online courses and workshops.',
                  stats: {
                    students: 15420,
                    courses: 8,
                    rating: 4.8,
                    reviews: 3240,
                  },
                }}
              />
            )}

            {activeTab === 3 && (
              <ReviewsTab
                averageRating={4.8}
                totalReviews={1234}
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
