import { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';
import StructureTopBar from '../components/instructor/course-structure/StructureTopBar';
import StructureFooter from '../components/instructor/course-structure/StructureFooter';
import CourseHeaderCard from '../components/instructor/course-structure/CourseHeaderCard';
import CurriculumBuilder from '../components/instructor/course-structure/CurriculumBuilder';
import QuickAddWidget from '../components/instructor/course-structure/QuickAddWidget';
import ContentLibraryWidget from '../components/instructor/course-structure/ContentLibraryWidget';
import CourseStatsWidget from '../components/instructor/course-structure/CourseStatsWidget';
import PublishChecklistWidget from '../components/instructor/course-structure/PublishChecklistWidget';
import AddModuleModal from '../components/instructor/course-structure/AddModuleModal';
import type { ModuleFormData } from '../components/instructor/course-structure/AddModuleModal';
import type { ModuleData } from '../components/instructor/course-structure/ModuleCard';
import type { LessonData } from '../components/instructor/course-structure/LessonItem';
import type { SaveStatus } from '../components/instructor/course-structure/StructureFooter';

// Sample data
const initialCourseData = {
  title: 'Advanced React Patterns',
  modules: 5,
  lessons: 24,
  duration: '12h 30m',
  enrolled: 452,
  progress: 75,
  progressText: '75% Complete - 6 lessons remaining',
};

const initialModules: (ModuleData & { lessons: LessonData[] })[] = [
  {
    id: '1',
    title: 'Module 1: Introduction to Advanced Patterns',
    lessonCount: 5,
    duration: '2h 15m',
    completionPercent: 100,
    status: 'published',
    lessons: [
      { id: '1-1', title: 'Welcome & Course Overview', type: 'video', duration: '12:30', isComplete: true, isFreePreview: true },
      { id: '1-2', title: 'Understanding Component Patterns', type: 'video', duration: '25:45', isComplete: true },
      { id: '1-3', title: 'Pattern Cheat Sheet (PDF)', type: 'document', meta: '2.4 MB', isComplete: true },
      { id: '1-4', title: 'Module 1 Quiz', type: 'quiz', meta: '10 Questions • 15 min', isComplete: true },
    ],
  },
  {
    id: '2',
    title: 'Module 2: Higher-Order Components (HOC)',
    lessonCount: 6,
    duration: '3h 20m',
    completionPercent: 100,
    status: 'published',
    lessons: [
      { id: '2-1', title: 'What are Higher-Order Components?', type: 'video', duration: '18:20', isComplete: true },
    ],
  },
  {
    id: '3',
    title: 'Module 3: Render Props Pattern',
    lessonCount: 5,
    duration: '2h 45m',
    completionPercent: 60,
    status: 'draft',
    lessons: [
      { id: '3-1', title: 'Introduction to Render Props', type: 'video', duration: '22:15', isComplete: true },
    ],
  },
  {
    id: '4',
    title: 'Module 4: Custom Hooks',
    lessonCount: 8,
    duration: '4h 10m',
    completionPercent: 25,
    status: 'draft',
    lessons: [
      { id: '4-1', title: 'Live Coding: Building Custom Hooks', type: 'livestream', meta: 'Scheduled: Feb 10', isComplete: false },
    ],
  },
  {
    id: '5',
    title: 'Module 5: Final Project & Assessment',
    lessonCount: 3,
    duration: '1h 30m',
    completionPercent: 0,
    status: 'hidden',
    lessons: [
      { id: '5-1', title: 'Final Project: Build a Pattern Library', type: 'assignment', meta: '100 Points', isComplete: false },
    ],
  },
];

const CourseStructurePage: React.FC = () => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [modules, setModules] = useState(initialModules);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBack = () => {
    navigate('/instructor');
  };

  const handleAddModule = () => {
    setModuleModalOpen(true);
  };

  const handleSaveModule = (data: ModuleFormData) => {
    const newModule: ModuleData & { lessons: LessonData[] } = {
      id: String(modules.length + 1),
      title: data.title,
      lessonCount: 0,
      duration: '0m',
      completionPercent: 0,
      status: data.status,
      lessons: [],
    };
    setModules((prev: (ModuleData & { lessons: LessonData[] })[]) => [...prev, newModule]);
    setModuleModalOpen(false);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1500);
  };

  const handleAddLesson = (moduleId: string) => {
    console.log('Add lesson to module:', moduleId);
    // Would open lesson modal
  };

  const handleQuickAdd = (type: string) => {
    console.log('Quick add:', type);
    // Would open appropriate modal
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1500);
  };

  const handlePreview = () => {
    navigate('/instructor/course/1/preview');
  };

  const handlePublish = () => {
    console.log('Publish changes');
  };

  const handleSettings = () => {
    console.log('Course settings');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Top Bar */}
      <StructureTopBar
        courseTitle={initialCourseData.title}
        onBack={handleBack}
        onMobileMenuToggle={handleMobileMenuToggle}
        onPreview={handlePreview}
        onSettings={handleSettings}
        onPublish={handlePublish}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pb: 10,
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Course Header */}
          <CourseHeaderCard course={initialCourseData} />

          {/* Two Column Layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
              gap: 3,
            }}
          >
            {/* Left: Curriculum Builder */}
            <CurriculumBuilder
              data={{ modules }}
              onAddModule={handleAddModule}
              onAddLesson={handleAddLesson}
            />

            {/* Right: Sidebar Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <QuickAddWidget onAdd={handleQuickAdd} />
              <ContentLibraryWidget />
              <CourseStatsWidget
                stats={{
                  modules: modules.length,
                  lessons: modules.reduce((acc: number, m: ModuleData & { lessons: LessonData[] }) => acc + m.lessons.length, 0),
                  quizzes: 3,
                  assignments: 2,
                }}
              />
              <PublishChecklistWidget items={[
                { id: '1', text: 'Course info complete', complete: true },
                { id: '2', text: 'Thumbnail uploaded', complete: true },
                { id: '3', text: 'At least 5 lessons', complete: true },
                { id: '4', text: 'Pricing configured', complete: true },
                { id: '5', text: 'All modules published', complete: false },
                { id: '6', text: 'Preview video added', complete: false },
              ]} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <StructureFooter
        saveStatus={saveStatus}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
      />

      {/* Add Module Modal */}
      <AddModuleModal
        open={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        onSave={handleSaveModule}
      />
    </Box>
  );
};

export default CourseStructurePage;
