import React, { useState, useEffect, useCallback } from 'react';
import { Box, CssBaseline, Toolbar, Grid, LinearProgress, Alert } from '@mui/material';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  CalendarMonth as CalendarIcon,
  Star as PointsIcon,
  AttachFile as FileIcon,
  AccountTree as TypeIcon,
} from '@mui/icons-material';

// Layout
import InstructorSidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import ManagerSidebar from '../../components/manager/Sidebar';

// Assignment components
import AssignmentTopBar from '../../components/instructor/assignment/AssignmentTopBar';
import AssignmentFooter from '../../components/instructor/assignment/AssignmentFooter';
import BasicInfoSection from '../../components/instructor/assignment/BasicInfoSection';
import type { AssignmentType } from '../../components/instructor/assignment/BasicInfoSection';
import type { ModuleOption } from '../../components/instructor/assignment/BasicInfoSection';
import InstructionsSection from '../../components/instructor/assignment/InstructionsSection';
import DueDateSection from '../../components/instructor/assignment/DueDateSection';
import SubmissionRequirementsSection from '../../components/instructor/assignment/SubmissionRequirementsSection';
import type { FileType } from '../../components/instructor/assignment/SubmissionRequirementsSection';
import RubricBuilderSection from '../../components/instructor/assignment/RubricBuilderSection';
import type { RubricCriterionData } from '../../components/instructor/assignment/RubricCriterion';
import AssignmentSummaryCard from '../../components/instructor/assignment/AssignmentSummaryCard';
import SettingsPanel from '../../components/instructor/assignment/SettingsPanel';
import type { SettingOption } from '../../components/instructor/assignment/SettingsPanel';
import AssignmentPreviewCard from '../../components/instructor/assignment/AssignmentPreviewCard';
import ChecklistWidget from '../../components/instructor/assignment/ChecklistWidget';
import type { ChecklistItem } from '../../components/instructor/assignment/ChecklistWidget';

import { useQueryClient } from '@tanstack/react-query';
import {
  useSession,
  useAssignmentConfig,
  useCreateSession,
  usePartialUpdateSession,
  useCourse,
  useModules,
} from '../../hooks/useCatalogue';
import { sessionApi } from '../../services/catalogue.services';
import { queryKeys } from '../../hooks/queryKeys';
import axios from 'axios';
import { getErrorMessage } from '../../utils/config';
import FeedbackSnackbar from '../../components/common/FeedbackSnackbar';
import type { Session } from '../../types/types';

// Default rubric criteria for new assignments (no backend data yet)
const defaultCriteria: RubricCriterionData[] = [
  {
    id: '1',
    name: 'Code Quality',
    description: 'Clean, readable, and well-organized code',
    points: 30,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
  {
    id: '2',
    name: 'Functionality',
    description: 'All features work as specified',
    points: 40,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
  {
    id: '3',
    name: 'Documentation',
    description: 'Clear README and inline comments',
    points: 20,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
  {
    id: '4',
    name: 'Testing',
    description: 'Comprehensive unit tests',
    points: 10,
    levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
  },
];

const defaultSettings: SettingOption[] = [
  { id: 'group', label: 'Group Assignment', description: 'Allow team submissions', enabled: false },
  { id: 'peer', label: 'Peer Review', description: 'Students review each other', enabled: true },
  { id: 'tutorial', label: 'Require Tutorial', description: 'Must complete tutorial first', enabled: false },
  { id: 'ai', label: 'Enable AI Assistance', description: 'Allow AI tools for help', enabled: true },
];

function parseIsoDate(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: '', time: '23:59' };
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return { date, time };
}

function toIsoDateTime(dateStr: string, timeStr: string): string | null {
  if (!dateStr) return null;
  const time = timeStr || '23:59';
  return `${dateStr}T${time}:00`;
}

const AssignmentCreationPage: React.FC = () => {
  const { pathname } = useLocation();
  const isManager = pathname.startsWith('/manager/');
  const Sidebar = isManager ? ManagerSidebar : InstructorSidebar;
  const [searchParams] = useSearchParams();
  const sessionIdParam = searchParams.get('sessionId');
  const courseIdParam = searchParams.get('courseId');
  const courseTitleParam = searchParams.get('course') || undefined;

  const sessionId = sessionIdParam ? Number(sessionIdParam) : null;
  const courseId = courseIdParam ? Number(courseIdParam) : null;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [snackMessage, setSnackMessage] = useState<string | null>(null);
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'error'>('success');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Basic Info
  const [title, setTitle] = useState('');
  const [module, setModule] = useState('');
  const [lesson, setLesson] = useState('');
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('project');

  // Instructions
  const [instructions, setInstructions] = useState('');

  // Due Date
  const [dueDate, setDueDate] = useState('2026-02-20');
  const [dueTime, setDueTime] = useState('23:59');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableFromTime, setAvailableFromTime] = useState('00:00');
  const [allowLate, setAllowLate] = useState(false);
  const [lateCutoffDate, setLateCutoffDate] = useState('');
  const [penaltyType, setPenaltyType] = useState<'percentage' | 'fixed' | 'none'>('none');
  const [penaltyPercent, setPenaltyPercent] = useState(10);

  // Submission Requirements
  const [maxPoints, setMaxPoints] = useState(100);
  const [maxAttempts, setMaxAttempts] = useState('unlimited');
  const [allowedFileTypes, setAllowedFileTypes] = useState<FileType[]>(['pdf', 'zip', 'code']);
  const [maxFileSize, setMaxFileSize] = useState<number>(50);

  // Rubric
  const [criteria, setCriteria] = useState<RubricCriterionData[]>(defaultCriteria);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>('1');

  // Settings
  const [settings, setSettings] = useState<SettingOption[]>(defaultSettings);

  const [resolvedSessionId, setResolvedSessionId] = useState<number | null>(sessionId);

  // API
  const { data: courseData } = useCourse(courseId ?? 0, { enabled: !!courseId && !courseTitleParam });
  const { data: modulesData = [] } = useModules(courseId ? { course: courseId } : undefined);
  const { data: sessionData } = useSession(resolvedSessionId ?? 0);
  const { data: assignmentData, isLoading: assignmentLoading, isError: assignmentError } = useAssignmentConfig(resolvedSessionId);

  const queryClient = useQueryClient();
  const createSession = useCreateSession();
  const updateSession = usePartialUpdateSession();

  const courseTitle = courseTitleParam ?? courseData?.title ?? 'Course';
  const moduleOptions: ModuleOption[] = modulesData.map((m) => ({ id: m.id, title: m.title }));
  const hasContext = !!(sessionId || courseId);
  const isConfigureMode = !!resolvedSessionId;
  const moduleTitleFromContext = sessionData && sessionData.module != null
    ? moduleOptions.find((m) => m.id === sessionData.module)?.title
    : undefined;

  // Prefill title and module from session as soon as session loads (Configure mode / from Course Structure)
  useEffect(() => {
    if (!sessionData || !resolvedSessionId) return;
    setTitle(sessionData.title);
    setModule(sessionData.module != null ? String(sessionData.module) : '');
  }, [sessionData, resolvedSessionId]);

  // Populate assignment config when assignment data loaded (edit mode)
  useEffect(() => {
    if (!sessionData || !assignmentData) return;

    setTitle(sessionData.title);
    setModule(sessionData.module != null ? String(sessionData.module) : '');
    setInstructions(assignmentData.instructions ?? '');
    setAssignmentType(assignmentData.assignment_type as AssignmentType);
    setMaxPoints(assignmentData.max_points);
    setMaxAttempts(assignmentData.max_attempts == null ? 'unlimited' : String(assignmentData.max_attempts));
    setAllowedFileTypes(assignmentData.allowed_file_types?.length ? assignmentData.allowed_file_types as FileType[] : []);
    setMaxFileSize(assignmentData.max_file_size_mb ?? 50);
    setAllowLate(assignmentData.allow_late ?? false);
    setPenaltyType(assignmentData.penalty_type);
    setPenaltyPercent(assignmentData.penalty_percent);

    const dueParsed = parseIsoDate(assignmentData.due_date);
    setDueDate(dueParsed.date);
    setDueTime(dueParsed.time);

    const availParsed = parseIsoDate(assignmentData.available_from);
    setAvailableFrom(availParsed.date);
    setAvailableFromTime(availParsed.time);

    if (assignmentData.allow_late && assignmentData.late_cutoff_date) {
      const lateParsed = parseIsoDate(assignmentData.late_cutoff_date);
      setLateCutoffDate(lateParsed.date);
    }

    if (assignmentData.rubric_criteria?.length) {
      setCriteria(
        assignmentData.rubric_criteria.map((r, i) => ({
          id: String(i + 1),
          name: r.name || 'Criterion',
          description: r.description ?? '',
          points: r.points ?? 0,
          levels: r.levels ?? { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
        }))
      );
    }

    if (assignmentData.settings && typeof assignmentData.settings === 'object') {
      setSettings((prev) =>
        prev.map((s) => ({
          ...s,
          enabled: (assignmentData.settings as Record<string, boolean>)[s.id] ?? s.enabled,
        }))
      );
    }
  }, [sessionData, assignmentData]);

  const buildAssignmentPayload = useCallback(() => {
    const rubric = criteria.map((c) => ({
      name: c.name,
      description: c.description || undefined,
      points: c.points,
      levels: c.levels,
    }));

    const settingsObj: Record<string, boolean> = {};
    settings.forEach((s) => {
      settingsObj[s.id] = s.enabled;
    });

    return {
      assignment_type: assignmentType,
      instructions,
      max_points: maxPoints,
      due_date: toIsoDateTime(dueDate, dueTime),
      available_from: availableFrom ? toIsoDateTime(availableFrom, availableFromTime) : null,
      allow_late: allowLate,
      late_cutoff_date: allowLate && lateCutoffDate ? toIsoDateTime(lateCutoffDate, '23:59') : null,
      penalty_type: penaltyType,
      penalty_percent: penaltyPercent,
      max_attempts: maxAttempts === 'unlimited' ? null : Number(maxAttempts),
      allowed_file_types: allowedFileTypes,
      max_file_size_mb: maxFileSize,
      rubric_criteria: rubric,
      settings: settingsObj,
    };
  }, [
    assignmentType,
    instructions,
    maxPoints,
    dueDate,
    dueTime,
    availableFrom,
    availableFromTime,
    allowLate,
    lateCutoffDate,
    penaltyType,
    penaltyPercent,
    maxAttempts,
    allowedFileTypes,
    maxFileSize,
    criteria,
    settings,
  ]);

  const handleSave = useCallback(async () => {
    if (!hasContext) {
      setSnackMessage('Create an assignment from a course structure to get started.');
      setSnackSeverity('error');
      return;
    }

    let sid = resolvedSessionId;

    // Create session first if we don't have one
    if (!sid && courseId) {
      try {
        const { data: paginatedSessions } = await sessionApi.getAll({ course: courseId });
        const freshSessions = paginatedSessions.results as Session[];
        const maxOrder = freshSessions.length > 0 ? Math.max(...freshSessions.map((s) => s.order)) : -1;

        const session = await createSession.mutateAsync({
          course: courseId,
          module: module ? Number(module) : null,
          title: title || 'Untitled Assignment',
          session_type: 'assignment',
          order: maxOrder + 1,
        });

        if (!session?.id) {
          setSnackMessage('Session was created but no ID returned. Please refresh.');
          setSnackSeverity('error');
          return;
        }

        sid = session.id;
        setResolvedSessionId(sid);
      } catch (err) {
        const msg = getErrorMessage(err, 'Failed to create assignment session.');
        setSnackMessage(msg);
        setSnackSeverity('error');
        if (axios.isAxiosError(err) && err.response?.status === 400) {
          setValidationError(msg);
        }
        return;
      }
    }

    if (!sid) {
      setSnackMessage('Missing session. Please create from course structure.');
      setSnackSeverity('error');
      return;
    }

    try {
      const payload = buildAssignmentPayload();

      // Update session title/module if changed (edit mode only)
      if (sessionData && (sessionData.title !== title || String(sessionData.module ?? '') !== module)) {
        await updateSession.mutateAsync({
          id: sid,
          data: {
            title: title || sessionData.title,
            module: module ? Number(module) : null,
          },
        });
      }

      await sessionApi.putAssignment(sid, payload);
      queryClient.invalidateQueries({ queryKey: queryKeys.assignment.detail(sid) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(sid) });
      setLastSaved(new Date());
      setValidationError(null);
      setSnackMessage('Assignment saved.');
      setSnackSeverity('success');
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to save assignment.');
      setSnackMessage(msg);
      setSnackSeverity('error');
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setValidationError(msg);
      } else {
        setValidationError(null);
      }
    }
  }, [
    hasContext,
    resolvedSessionId,
    courseId,
    sessionData,
    title,
    module,
    buildAssignmentPayload,
    createSession,
    updateSession,
    queryClient,
  ]);

  const handlePublish = useCallback(async () => {
    if (!resolvedSessionId) {
      setSnackMessage('Save the assignment first before publishing.');
      setSnackSeverity('error');
      return;
    }

    try {
      await updateSession.mutateAsync({
        id: resolvedSessionId,
        data: { status: 'published' as const },
      });
      setSnackMessage('Assignment published.');
      setSnackSeverity('success');
    } catch (err) {
      setSnackMessage(getErrorMessage(err, 'Failed to publish.'));
      setSnackSeverity('error');
    }
  }, [resolvedSessionId, updateSession]);

  const handleFileTypeToggle = (type: FileType) => {
    setAllowedFileTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleUpdateCriterion = (id: string, data: Partial<RubricCriterionData>) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCriterion = () => {
    const newId = String(Date.now());
    setCriteria((prev) => [
      ...prev,
      {
        id: newId,
        name: 'New Criterion',
        description: '',
        points: 10,
        levels: { excellent: '', good: '', satisfactory: '', needsImprovement: '' },
      },
    ]);
    setExpandedCriterion(newId);
  };

  const handleSettingToggle = (id: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const totalPoints = criteria.reduce((sum, c) => sum + c.points, 0);
  const checklistItems: ChecklistItem[] = [
    { id: '1', label: 'Add assignment title', complete: !!title },
    { id: '2', label: 'Write instructions', complete: instructions.length > 50 },
    { id: '3', label: 'Set due date', complete: !!dueDate },
    { id: '4', label: 'Configure points', complete: maxPoints > 0 },
    { id: '5', label: 'Add grading rubric', complete: criteria.length > 0 },
  ];

  const previewItems = [
    { icon: <CalendarIcon />, iconBg: '#dbeafe', iconColor: '#3b82f6', label: 'Due Date', value: dueDate || '—' },
    { icon: <PointsIcon />, iconBg: '#fef3c7', iconColor: '#f59e0b', label: 'Points', value: `${totalPoints} points` },
    { icon: <FileIcon />, iconBg: '#d1fae5', iconColor: '#10b981', label: 'Submissions', value: allowedFileTypes.join(', ').toUpperCase() || '—' },
    { icon: <TypeIcon />, iconBg: '#ede9fe', iconColor: '#8b5cf6', label: 'Type', value: assignmentType.charAt(0).toUpperCase() + assignmentType.slice(1) },
  ];

  const loading = isConfigureMode && (assignmentLoading || (!!resolvedSessionId && !sessionData));
  const noConfig = isConfigureMode && assignmentError; // GET 404 = no assignment config yet

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AssignmentTopBar
        courseName={courseTitle}
        isConfigureMode={isConfigureMode}
        onSave={handleSave}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        {loading && <LinearProgress sx={{ position: 'sticky', top: 0, zIndex: 1 }} />}

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {!hasContext && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Go to a course structure and add an assignment to get started.
            </Alert>
          )}

          {noConfig && !loading && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No assignment config yet. Fill in the form and click Save to create.
            </Alert>
          )}

          {validationError && (
            <Alert severity="error" onClose={() => setValidationError(null)} sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}

          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ maxWidth: 1400, mx: 'auto' }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <BasicInfoSection
                title={title}
                onTitleChange={setTitle}
                module={module}
                onModuleChange={setModule}
                modules={moduleOptions.length ? moduleOptions : undefined}
                hideLesson={!!courseId}
                contextFromSession={isConfigureMode && sessionData ? { title: sessionData.title, moduleTitle: moduleTitleFromContext } : undefined}
                lesson={lesson}
                onLessonChange={setLesson}
                assignmentType={assignmentType}
                onTypeChange={setAssignmentType}
              />

              <InstructionsSection
                instructions={instructions}
                onInstructionsChange={setInstructions}
              />

              <DueDateSection
                dueDate={dueDate}
                onDueDateChange={setDueDate}
                dueTime={dueTime}
                onDueTimeChange={setDueTime}
                availableFrom={availableFrom}
                onAvailableFromChange={setAvailableFrom}
                availableFromTime={availableFromTime}
                onAvailableFromTimeChange={setAvailableFromTime}
                allowLate={allowLate}
                onAllowLateChange={setAllowLate}
                lateCutoffDate={lateCutoffDate}
                onLateCutoffDateChange={setLateCutoffDate}
                penaltyType={penaltyType}
                onPenaltyTypeChange={(v) => setPenaltyType(v as 'percentage' | 'fixed' | 'none')}
                penaltyPercent={penaltyPercent}
                onPenaltyPercentChange={setPenaltyPercent}
              />

              <SubmissionRequirementsSection
                maxPoints={maxPoints}
                onMaxPointsChange={setMaxPoints}
                maxAttempts={maxAttempts}
                onMaxAttemptsChange={setMaxAttempts}
                allowedFileTypes={allowedFileTypes}
                onFileTypeToggle={handleFileTypeToggle}
                maxFileSize={maxFileSize}
                onMaxFileSizeChange={setMaxFileSize}
              />

              <RubricBuilderSection
                criteria={criteria}
                expandedCriterion={expandedCriterion}
                onToggleCriterion={(id) => setExpandedCriterion(expandedCriterion === id ? null : id)}
                onUpdateCriterion={handleUpdateCriterion}
                onDeleteCriterion={handleDeleteCriterion}
                onAddCriterion={handleAddCriterion}
              />
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <Box sx={{ mb: 2 }}>
                  <AssignmentSummaryCard
                    totalPoints={totalPoints}
                    criteriaCount={criteria.length}
                    allowedAttempts={maxAttempts === 'unlimited' ? '∞' : maxAttempts}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <SettingsPanel settings={settings} onToggle={handleSettingToggle} />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <AssignmentPreviewCard items={previewItems} />
                </Box>
                <ChecklistWidget items={checklistItems} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <AssignmentFooter
          lastSaved={lastSaved}
          onSaveDraft={handleSave}
          onPublish={handlePublish}
        />

        <FeedbackSnackbar
          message={snackMessage}
          severity={snackSeverity}
          onClose={() => setSnackMessage(null)}
        />
      </Box>
    </Box>
  );
};

export default AssignmentCreationPage;
