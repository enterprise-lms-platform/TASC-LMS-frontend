import { useState, useMemo } from 'react';
import { Box, Toolbar, CssBaseline, LinearProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
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
import AddLessonModal from '../components/instructor/course-structure/AddLessonModal';
import type { LessonFormData } from '../components/instructor/course-structure/AddLessonModal';
import type { ModuleData } from '../components/instructor/course-structure/ModuleCard';
import type { LessonData } from '../components/instructor/course-structure/LessonItem';
import type { SaveStatus } from '../components/instructor/course-structure/StructureFooter';
import type { CourseHeaderData } from '../components/instructor/course-structure/CourseHeaderCard';
import { useCourse, useModules, useCreateModule, useCreateSession } from '../hooks/useCatalogue';
import type { Session, SessionType } from '../types/types';

// Convert a Session to the UI LessonData shape
const sessionToLesson = (s: Session): LessonData => ({
  id: String(s.id),
  title: s.title,
  type: s.session_type as string,
  duration: `${s.duration_minutes || 0} min`,
  isComplete: false,
  isFreePreview: s.is_free_preview,
});

const CourseStructurePage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId ? Number(courseId) : 0;

  // Load course data (includes sessions) and modules from API
  const { data: courseData, isLoading: courseLoading, isError: courseIsError } = useCourse(id, { enabled: !!courseId });
  const { data: apiModules = [] } = useModules({ course: id });
  const createModuleMutation = useCreateModule();
  const createSessionMutation = useCreateSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string>('');

  // Build UI modules from API modules + sessions
  const modules = useMemo((): (ModuleData & { lessons: LessonData[] })[] => {
    const sessions = courseData?.sessions ?? [];

    // Group sessions by module ID
    const sessionsByModule = new Map<number | null, Session[]>();
    sessions.forEach((s) => {
      const key = s.module ?? null;
      const existing = sessionsByModule.get(key) || [];
      existing.push(s);
      sessionsByModule.set(key, existing);
    });

    // Build module cards from API modules
    const moduleCards: (ModuleData & { lessons: LessonData[] })[] = apiModules.map((m) => {
      const moduleSessions = (sessionsByModule.get(m.id) || []).sort((a, b) => a.order - b.order);
      return {
        id: String(m.id),
        title: m.title,
        lessonCount: moduleSessions.length,
        duration: `${Math.round(moduleSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / 60)}h`,
        completionPercent: 0,
        status: m.status === 'published' ? 'published' as const : 'draft' as const,
        lessons: moduleSessions.map(sessionToLesson),
      };
    });

    // Sessions without a module go into an "Unassigned" bucket
    const unassigned = (sessionsByModule.get(null) || []).sort((a, b) => a.order - b.order);
    if (unassigned.length > 0) {
      moduleCards.push({
        id: 'unassigned',
        title: 'Unassigned Lessons',
        lessonCount: unassigned.length,
        duration: `${Math.round(unassigned.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / 60)}h`,
        completionPercent: 0,
        status: 'draft' as const,
        lessons: unassigned.map(sessionToLesson),
      });
    }

    return moduleCards;
  }, [courseData?.sessions, apiModules]);

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  // Build header data from API response
  const headerCourse: CourseHeaderData | null = courseData
    ? {
        title: courseData.title,
        thumbnail: courseData.thumbnail ?? undefined,
        modules: apiModules.length,
        lessons: courseData.total_sessions ?? totalLessons,
        duration: `${courseData.duration_hours ?? 0}h`,
        enrolled: courseData.enrollment_count,
        progress: 0,
        progressText: '—',
      }
    : null;

  const courseTitle = courseData?.title ?? 'Course';

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleBack = () => {
    navigate('/instructor');
  };

  const handleAddModule = () => {
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (data: ModuleFormData) => {
    try {
      setSaveStatus('saving');
      await createModuleMutation.mutateAsync({
        course: id,
        title: data.title,
        description: data.description || '',
      });
      setModuleModalOpen(false);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to create module:', err);
      setSaveStatus('saved');
    }
  };

  const handleAddLesson = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (data: LessonFormData) => {
    try {
      setSaveStatus('saving');

      // Determine the module ID (null for unassigned)
      const moduleNumericId = activeModuleId && activeModuleId !== 'unassigned'
        ? Number(activeModuleId)
        : null;

      // Calculate next order within the module (or globally for unassigned)
      const relevantLessons = modules.find((m) => m.id === activeModuleId)?.lessons ?? [];
      const nextOrder = relevantLessons.length + 1;

      const newSession = await createSessionMutation.mutateAsync({
        course: id,
        module: moduleNumericId,
        title: data.title,
        session_type: data.type as SessionType,
        status: 'draft',
        order: nextOrder,
        is_free_preview: data.isFreePreview,
        is_mandatory: false,
      });

      setLessonModalOpen(false);
      setSaveStatus('saved');

      // Navigate to the content page with the actual sessionId
      const lessonParam = encodeURIComponent(newSession.title);
      switch (data.type) {
        case 'video':
        case 'document':
        case 'scorm':
          navigate(`/instructor/course/${courseId}/upload?type=${data.type}&lesson=${lessonParam}&sessionId=${newSession.id}`);
          break;
        case 'quiz':
          navigate(`/instructor/course/${courseId}/quiz/builder?lesson=${lessonParam}&course=${encodeURIComponent(courseTitle)}&sessionId=${newSession.id}`);
          break;
        case 'assignment':
          navigate(`/instructor/assignment/create?lesson=${lessonParam}&course=${encodeURIComponent(courseTitle)}&sessionId=${newSession.id}`);
          break;
        case 'livestream':
          navigate(`/instructor/sessions/schedule?lesson=${lessonParam}&course=${encodeURIComponent(courseTitle)}&sessionId=${newSession.id}`);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setSaveStatus('saved');
    }
  };

  const activeModuleTitle = modules.find((m) => m.id === activeModuleId)?.title || '';

  const handleQuickAdd = (type: string) => {
    switch (type) {
      case 'video':
      case 'document':
      case 'scorm':
        navigate(`/instructor/course/${courseId}/upload?type=${type}`);
        break;
      case 'quiz':
        navigate(`/instructor/course/${courseId}/quiz/builder?course=${encodeURIComponent(courseTitle)}`);
        break;
      case 'assignment':
        navigate(`/instructor/assignment/create?course=${encodeURIComponent(courseTitle)}`);
        break;
      case 'livestream':
        navigate(`/instructor/sessions/schedule?course=${encodeURIComponent(courseTitle)}`);
        break;
      default:
        break;
    }
  };

  const handleSaveDraft = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1500);
  };

  const handlePreview = () => {
    navigate(`/instructor/course/${courseId}/preview`);
  };

  const handlePublish = () => {
    console.log('Publish changes');
  };

  const handleSettings = () => {
    navigate(`/instructor/course/${courseId}/edit`);
  };

  const handleEditInfo = () => {
    navigate(`/instructor/course/${courseId}/edit`);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Top Bar */}
      <StructureTopBar
        courseTitle={courseTitle}
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
          {/* Loading state */}
          {courseLoading && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Loading course...
              </Typography>
            </Box>
          )}

          {/* Error state */}
          {courseIsError && (
            <Typography color="error.main" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
              Failed to load course. Please try again.
            </Typography>
          )}

          {/* Course Header — only render when data is loaded */}
          {headerCourse && (
            <CourseHeaderCard course={headerCourse} onEditInfo={handleEditInfo} />
          )}

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
                  modules: apiModules.length,
                  lessons: totalLessons,
                  quizzes: (courseData?.sessions ?? []).filter((s) => s.session_type === 'quiz').length,
                  assignments: (courseData?.sessions ?? []).filter((s) => s.session_type === 'assignment').length,
                }}
              />
              <PublishChecklistWidget items={[
                { id: '1', text: 'Course info complete', complete: !!courseData?.description },
                { id: '2', text: 'Thumbnail uploaded', complete: !!courseData?.thumbnail },
                { id: '3', text: 'At least 5 lessons', complete: totalLessons >= 5 },
                { id: '4', text: 'Pricing configured', complete: !!courseData?.price && courseData.price !== '0.00' },
                { id: '5', text: 'All modules published', complete: apiModules.length > 0 && apiModules.every((m) => m.status === 'published') },
                { id: '6', text: 'Preview video added', complete: !!courseData?.trailer_video_url },
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

      {/* Add Lesson Modal */}
      <AddLessonModal
        open={lessonModalOpen}
        moduleTitle={activeModuleTitle}
        onClose={() => setLessonModalOpen(false)}
        onSave={handleSaveLesson}
      />
    </Box>
  );
};

export default CourseStructurePage;
