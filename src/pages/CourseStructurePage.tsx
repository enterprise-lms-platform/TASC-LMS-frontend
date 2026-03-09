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
import { useCourse, useSessions, useCreateSession, useModules, useCreateModule, usePartialUpdateSession } from '../hooks/useCatalogue';
import { sessionApi } from '../services/catalogue.services';
import type { SessionType, Session, Module } from '../types/types';
import type { LessonType } from '../components/instructor/course-structure/LessonItem';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../utils/config';
import FeedbackSnackbar from '../components/common/FeedbackSnackbar';

function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '';
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

const sessionTypeToLessonType: Record<string, LessonType> = {
  video: 'video',
  document: 'document',
  quiz: 'quiz',
  assignment: 'assignment',
  scorm: 'scorm',
  live: 'livestream',
  text: 'html',
  html: 'html',
  livestream: 'livestream',
};

const contentBadgeStyles: Record<string, { bg: string; color: string }> = {
  pdf:      { bg: '#d1fae5', color: '#10b981' },
  video:    { bg: '#dbeafe', color: '#2563eb' },
  scorm:    { bg: '#fee2e2', color: '#ef4444' },
  external: { bg: '#ffedd5', color: '#ea580c' },
  uploaded: { bg: '#e4e4e7', color: '#52525b' },
  inline:   { bg: '#ede9fe', color: '#7c3aed' },
};

function deriveContentBadge(s: Session): {
  contentLabel?: string;
  contentBadgeBg?: string;
  contentBadgeColor?: string;
  contentTooltip?: string;
} {
  const fname = s.asset_original_filename ?? undefined;
  const mime = (s.asset_mime_type ?? '').toLowerCase();

  if (s.external_video_url) {
    const style = contentBadgeStyles.external;
    return { contentLabel: 'EXTERNAL', contentBadgeBg: style.bg, contentBadgeColor: style.color, contentTooltip: 'Open external video' };
  }
  if (mime.startsWith('application/pdf')) {
    const style = contentBadgeStyles.pdf;
    return { contentLabel: 'PDF', contentBadgeBg: style.bg, contentBadgeColor: style.color, contentTooltip: fname ? `Preview ${fname}` : 'Preview PDF' };
  }
  if (mime.startsWith('video/')) {
    const style = contentBadgeStyles.video;
    return { contentLabel: 'VIDEO', contentBadgeBg: style.bg, contentBadgeColor: style.color, contentTooltip: fname ? `Preview ${fname}` : 'Preview video' };
  }
  if (mime === 'application/zip' || mime === 'application/x-zip-compressed' || fname?.toLowerCase().endsWith('.zip')) {
    const style = contentBadgeStyles.scorm;
    return { contentLabel: 'SCORM', contentBadgeBg: style.bg, contentBadgeColor: style.color, contentTooltip: fname ? `Download ${fname}` : 'Open SCORM package' };
  }
  if (s.asset_object_key) {
    const style = contentBadgeStyles.uploaded;
    return { contentLabel: 'UPLOADED', contentBadgeBg: style.bg, contentBadgeColor: style.color, contentTooltip: fname ? `Preview ${fname}` : 'Open uploaded file' };
  }
  if (s.content_source === 'inline') {
    const style = contentBadgeStyles.inline;
    return { contentLabel: 'INLINE', contentBadgeBg: style.bg, contentBadgeColor: style.color, contentTooltip: 'Preview inline content' };
  }
  return { contentTooltip: 'No content to preview' };
}

function sessionToLessonData(s: Session): LessonData {
  const badge = deriveContentBadge(s);
  return {
    id: String(s.id),
    title: s.title,
    type: sessionTypeToLessonType[s.session_type] ?? 'video',
    duration: s.video_duration_seconds ? formatDuration(s.video_duration_seconds) : undefined,
    isComplete: s.status === 'published',
    isFreePreview: s.is_free_preview,
    ...badge,
  };
}

function buildModulesFromBackend(
  modules: Module[],
  sessions: Session[],
  courseStatus: string,
): (ModuleData & { lessons: LessonData[] })[] {
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);
  const result: (ModuleData & { lessons: LessonData[] })[] = [];

  for (const module of sortedModules) {
    const moduleSessions = sessions.filter((s) => s.module === module.id);
    const lessons = moduleSessions.map(sessionToLessonData);
    const totalSeconds = lessons.reduce((acc, l) => {
      const s = moduleSessions.find((x) => String(x.id) === l.id);
      return acc + (s?.video_duration_seconds ?? 0);
    }, 0);
    const durationStr = formatDuration(totalSeconds);
    result.push({
      id: String(module.id),
      title: module.title,
      lessonCount: lessons.length,
      duration: durationStr,
      completionPercent: lessons.length > 0
        ? Math.round((lessons.filter((l) => l.isComplete).length / lessons.length) * 100)
        : 0,
      status: (module.status === 'published' ? 'published' : module.status === 'hidden' ? 'hidden' : 'draft') as ModuleData['status'],
      lessons,
    });
  }

  const ungroupedSessions = sessions.filter((s) => s.module == null);
  if (ungroupedSessions.length > 0) {
    const lessons = ungroupedSessions.map(sessionToLessonData);
    const totalSeconds = ungroupedSessions.reduce((acc, s) => acc + (s.video_duration_seconds ?? 0), 0);
    const durationStr = formatDuration(totalSeconds);
    result.push({
      id: 'ungrouped',
      title: 'Course Content',
      lessonCount: lessons.length,
      duration: durationStr,
      completionPercent: lessons.length > 0
        ? Math.round((lessons.filter((l) => l.isComplete).length / lessons.length) * 100)
        : 0,
      status: courseStatus === 'published' ? 'published' : 'draft',
      lessons,
    });
  }

  return result;
}

const ADMIN_ROLES = new Set(['tasc_admin', 'lms_manager']);

function extractUserId(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') { const n = Number(value); return Number.isFinite(n) ? n : undefined; }
  if (typeof value === 'object' && 'id' in value) return extractUserId((value as Record<string, unknown>).id);
  return undefined;
}

const CourseStructurePage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId ? Number(courseId) : 0;
  const { user } = useAuth();

  // Load course data from API
  const { data: courseData, isLoading: courseLoading, isError: courseIsError } = useCourse(id, { enabled: !!courseId });

  const isOwnerOrAdmin = useMemo(() => {
    if (!courseData || !user) return true; // still loading — don't block
    if (ADMIN_ROLES.has(user.role ?? '')) return true;

    const uid = extractUserId(user.id);
    const instructorId = extractUserId(courseData.instructor);
    const createdById = extractUserId(courseData.created_by);

    if (uid === undefined) return true; // can't determine user — don't block
    return uid === instructorId || uid === createdById;
  }, [courseData, user]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [draggedLessonId, setDraggedLessonId] = useState<number | null>(null);
  const [snackError, setSnackError] = useState<string | null>(null);

  const updateSession = usePartialUpdateSession();

  const { data: sessions } = useSessions(id ? { course: id } : undefined);
  const createSession = useCreateSession();
  const { data: backendModules = [] } = useModules(id ? { course: id } : undefined);
  const createModule = useCreateModule();

  const backendSessions = courseData?.sessions ?? sessions ?? [];

  const modules = useMemo(
    () => buildModulesFromBackend(backendModules, backendSessions, courseData?.status ?? 'draft'),
    [backendModules, backendSessions, courseData?.status],
  );

  const headerCourse: CourseHeaderData | null = useMemo(
    () =>
      courseData
        ? {
            title: courseData.title,
            thumbnail: courseData.thumbnail ?? undefined,
            modules: modules.length,
            lessons: backendSessions.length,
            duration: `${courseData.duration_hours ?? 0}h`,
            enrolled: courseData.enrollment_count,
            progress: 0,
            progressText: '\u2014',
          }
        : null,
    [courseData, modules.length, backendSessions.length],
  );

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
    if (!id) return;
    try {
      setSaveStatus('saving');
      await createModule.mutateAsync({
        course: id,
        title: data.title.trim(),
        description: data.description || '',
        status: data.status,
        icon: data.icon,
        require_sequential: data.requireSequential,
        allow_preview: data.allowPreview,
      });
      setModuleModalOpen(false);
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('saved');
      const msg = getErrorMessage(err, 'Failed to create module. Please try again.');
      setSnackError(msg);
    }
  };

  const handleDragStartLesson = (lessonId: number) => {
    setDraggedLessonId(lessonId);
  };

  const handleDragEndLesson = () => {
    setDraggedLessonId(null);
  };

  const handleDropModule = async (moduleId: number | string) => {
    if (!draggedLessonId) return;
    const targetModule = moduleId === 'ungrouped' ? null : Number(moduleId);
    try {
      await updateSession.mutateAsync({
        id: draggedLessonId,
        data: { module: targetModule },
      });
    } finally {
      setDraggedLessonId(null);
    }
  };

  const handleAddLesson = (moduleId?: number | string) => {
    if (typeof moduleId === 'number') {
      setActiveModuleId(moduleId);
    } else if (typeof moduleId === 'string' && moduleId !== 'ungrouped') {
      const n = Number(moduleId);
      setActiveModuleId(Number.isFinite(n) ? n : null);
    } else {
      setActiveModuleId(null);
    }
    setLessonModalOpen(true);
  };

  const uploadTypes = new Set(['video', 'document', 'scorm']);

  const handleEditLesson = (lessonId: string) => {
    const session = backendSessions.find((s) => String(s.id) === lessonId);
    if (!session) {
      setSnackError('Session not found. Please refresh the page.');
      return;
    }

    const lessonParam = encodeURIComponent(session.title);

    if (uploadTypes.has(session.session_type)) {
      navigate(
        `/instructor/course/${courseId}/upload?type=${session.session_type}&lesson=${lessonParam}&sessionId=${session.id}`
      );
      return;
    }

    switch (session.session_type) {
      case 'quiz':
        navigate(`/instructor/course/${courseId}/quiz/builder?lesson=${lessonParam}&sessionId=${session.id}&course=${encodeURIComponent(courseTitle)}`);
        break;
      case 'assignment':
        navigate(`/instructor/assignment/create?lesson=${lessonParam}&sessionId=${session.id}&course=${encodeURIComponent(courseTitle)}`);
        break;
      case 'live':
        navigate(`/instructor/sessions/schedule?lesson=${lessonParam}&sessionId=${session.id}&course=${encodeURIComponent(courseTitle)}`);
        break;
      default:
        setSnackError(`No editor available for "${session.session_type}" sessions yet.`);
        break;
    }
  };

  const handlePreviewLesson = async (lessonId: string) => {
    const session = backendSessions.find((s) => String(s.id) === lessonId);
    if (!session) {
      setSnackError('Session not found. Please refresh the page.');
      return;
    }

    if (session.external_video_url) {
      window.open(session.external_video_url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (session.asset_object_key) {
      try {
        const { data } = await sessionApi.getAssetUrl(session.id);
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } catch (err) {
        const msg = getErrorMessage(err, 'Failed to open preview. Please try again.');
        setSnackError(msg);
      }
      return;
    }

    setSnackError('No content to preview for this lesson.');
  };

  const handleSaveLesson = async (data: LessonFormData) => {
    const lessonParam = encodeURIComponent(data.title);

    if (uploadTypes.has(data.type) && id) {
      try {
        setSaveStatus('saving');
        setLessonModalOpen(false);

        const { data: paginatedSessions } = await sessionApi.getAll({ course: id });
        const freshSessions = paginatedSessions.results;
        const maxOrder = freshSessions.length > 0
          ? Math.max(...freshSessions.map((s: Session) => s.order))
          : -1;
        const nextOrder = maxOrder + 1;

        const session = await createSession.mutateAsync({
          course: id,
          ...(activeModuleId != null && { module: activeModuleId }),
          title: data.title,
          description: data.description || undefined,
          session_type: data.type as SessionType,
          is_free_preview: data.isFreePreview,
          order: nextOrder,
        });

        setActiveModuleId(null);
        setSaveStatus('saved');

        if (!session?.id) {
          setSnackError('Session was created but the server did not return an ID. Please refresh and try again.');
          return;
        }

        navigate(
          `/instructor/course/${courseId}/upload?type=${data.type}&lesson=${lessonParam}&sessionId=${session.id}`
        );
      } catch (err) {
        setSaveStatus('saved');
        const msg = getErrorMessage(err, 'Failed to create lesson. Please try again.');
        setSnackError(msg);
      }
      return;
    }

    // Non-upload types: close modal and navigate to their respective builders
    setLessonModalOpen(false);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1500);

    switch (data.type) {
      case 'quiz':
        navigate(`/instructor/course/${courseId}/quiz/builder?lesson=${lessonParam}&course=${encodeURIComponent(courseTitle)}`);
        break;
      case 'assignment':
        navigate(`/instructor/assignment/create?lesson=${lessonParam}&course=${encodeURIComponent(courseTitle)}`);
        break;
      case 'livestream':
        navigate(`/instructor/sessions/schedule?lesson=${lessonParam}&course=${encodeURIComponent(courseTitle)}`);
        break;
      default:
        break;
    }
  };

  const activeModuleTitle = modules.find((m) => m.id === String(activeModuleId))?.title || '';

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
    // TODO: implement publish flow
  };

  const handleSettings = () => {
    navigate(`/instructor/course/${courseId}/edit`);
  };

  const handleEditInfo = () => {
    navigate(`/instructor/course/${courseId}/edit`);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
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

          {/* Access denied — instructor viewing another instructor's course */}
          {!courseLoading && courseData && !isOwnerOrAdmin && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" fontWeight={700} color="error.main" gutterBottom>
                Access Denied
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You do not have permission to edit this course. You can only manage courses you created.
              </Typography>
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate('/instructor')}
              >
                Return to Dashboard
              </Typography>
            </Box>
          )}

          {/* Course Header — only render when data is loaded */}
          {isOwnerOrAdmin && headerCourse && (
            <CourseHeaderCard course={headerCourse} onEditInfo={handleEditInfo} />
          )}

          {/* Two Column Layout — only for authorized editors */}
          {isOwnerOrAdmin && (
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
              onEditLesson={handleEditLesson}
              onPreviewLesson={handlePreviewLesson}
              onDragStartLesson={handleDragStartLesson}
              onDragEndLesson={handleDragEndLesson}
              onDropModule={handleDropModule}
            />

            {/* Right: Sidebar Widgets */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <QuickAddWidget onAdd={handleQuickAdd} />
              <ContentLibraryWidget />
              <CourseStatsWidget
                stats={{
                  modules: modules.length,
                  lessons: backendSessions.length,
                  quizzes: backendSessions.filter((s) => s.session_type === 'quiz').length,
                  assignments: backendSessions.filter((s) => s.session_type === 'assignment').length,
                }}
              />
              <PublishChecklistWidget items={[
                { id: '1', text: 'Course info complete', complete: !!courseData?.description },
                { id: '2', text: 'Thumbnail uploaded', complete: !!courseData?.thumbnail },
                { id: '3', text: 'At least 1 lesson', complete: backendSessions.length >= 1 },
                { id: '4', text: 'Pricing configured', complete: !!courseData?.price },
                { id: '5', text: 'All lessons published', complete: backendSessions.length > 0 && backendSessions.every((s) => s.status === 'published') },
                { id: '6', text: 'Preview video added', complete: !!courseData?.trailer_video_url },
              ]} />
            </Box>
          </Box>
          )}
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

      <FeedbackSnackbar message={snackError} onClose={() => setSnackError(null)} />
    </Box>
  );
};

export default CourseStructurePage;
