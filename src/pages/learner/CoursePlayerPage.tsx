import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { sessionProgressApi, discussionApi, discussionReplyApi, quizSubmissionApi } from '../../services/learning.services';
import { queryKeys } from '../../hooks/queryKeys';
import type { CourseDetail, Session, SessionProgress, Discussion, DiscussionReply } from '../../types/types';

interface QuestionItem {
  id: number;
  author: string;
  user_name: string;
  title: string;
  content: string;
  reply_count: number;
  created_at: string;
  is_pinned: boolean;
  is_locked: boolean;
}
import { useSessionAssetUrl } from '../../hooks/useUpload';
import { useQuizDetail } from '../../hooks/useCatalogue';

/** Progress payload for ReactPlayer's `onProgress` (library typings merge with HTMLVideoElement and mis-type this as a native event). */
type ReactPlayerProgressState = {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
};

import QuizPlayer from '../../components/learner/quiz-player/QuizPlayer';
import AssignmentPlayer from '../../components/learner/assignment-player/AssignmentPlayer';
import {
  Box, Typography, IconButton, Button, Tabs, Tab, LinearProgress,
  Checkbox, Collapse, Drawer, Divider, TextField, Avatar, Chip,
  Tooltip, useMediaQuery, useTheme, AppBar, Toolbar, CircularProgress,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  SkipPrevious as PrevIcon, SkipNext as NextIcon,
  ExpandMore as ExpandIcon, ChevronRight as ChevronIcon,
  PlayCircleOutline as VideoIcon, Description as ArticleIcon, Quiz as QuizIcon,
  CheckCircle as CheckIcon, BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon, ThumbUpAltOutlined as LikeIcon,
  Send as SendIcon, NoteAdd as NoteIcon,
  MenuOpen as MenuOpenIcon, Menu as MenuIcon,
  PushPin as PinIcon, Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/LearnerDashboard.css';
import { sessionAttachmentApi } from '../../services/catalogue.services';
import type { SessionAttachment } from '../../services/catalogue.services';

/* ── Types ── */
interface Note { id: number; text: string; timestamp: string; sessionTitle: string; }


/* ── Helper to Group Sessions into logical modules ── */
// Note: TASC backend currently doesn't have a formal "Module" concept in the Session model,
// so we group them into a single "Course Content" module or just list them.
const groupSessions = (sessions: Session[]) => {
  return [
    {
      id: 'module-1',
      title: 'Course Sessions',
      sessions: [...sessions].sort((a, b) => a.order - b.order),
    }
  ];
};

/** Normalize list-like API responses to a plain array.
 * Supports:
 * - `T[]`
 * - `{ results: T[] }` paginated wrappers
 * - `undefined | null` -> `[]`
 */
const normalizeList = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object') {
    const maybeResults = (value as { results?: unknown }).results;
    if (Array.isArray(maybeResults)) return maybeResults as T[];
  }
  return [];
};

/* ── Component ── */
const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isModeratorRole = user?.role === 'instructor' || user?.role === 'lms_manager' || user?.role === 'tasc_admin';

  // Load backend data from the router loader
  const { course: initialCourse, progress: initialProgress } = useLoaderData() as {
    course: CourseDetail;
    progress: SessionProgress[];
  };

  // Keep state synced via React Query
  const course = queryClient.getQueryData<CourseDetail>(queryKeys.courses.detail(Number(courseId))) || initialCourse;
  const { data: recordedProgressRaw = initialProgress } = useQuery({
    queryKey: queryKeys.sessionProgress.all({ course: Number(courseId) }),
    queryFn: () => sessionProgressApi.getAll({ course: Number(courseId) }).then((r) => r.data),
    initialData: initialProgress,
  });

  const recordedProgressList: SessionProgress[] = useMemo(() => {
    if (Array.isArray(recordedProgressRaw)) return recordedProgressRaw;
    if (recordedProgressRaw && typeof recordedProgressRaw === 'object') {
      const maybeResults = (recordedProgressRaw as { results?: unknown }).results;
      if (Array.isArray(maybeResults)) return maybeResults as SessionProgress[];
    }
    return [];
  }, [recordedProgressRaw]);
  const enrollmentId = course?.enrollment_id ?? null;

  const modules = useMemo(() => groupSessions(course?.sessions || []), [course?.sessions]);
  const allSessions = useMemo(() => modules.flatMap(m => m.sessions), [modules]);
  const totalSessions = allSessions.length;

  const sessionParam = searchParams.get('session');
  const sessionInitForCourseRef = useRef<string | null>(null);
  /** Avoid repeated ensureProgressRecord calls for the same session in one visit. */
  const ensuredStartedSessionsRef = useRef<Set<number>>(new Set());

  const [activeTab, setActiveTab] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1']);
  const [curriculumOpen, setCurriculumOpen] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  // Fetch session attachments (resources)
  const { data: attachmentsData } = useQuery({
    queryKey: ['session-attachments', activeSessionId],
    queryFn: () => activeSessionId ? sessionAttachmentApi.getBySession(activeSessionId).then(r => r.data) : Promise.resolve([]),
    enabled: !!activeSessionId,
  });
  const attachments = Array.isArray(attachmentsData) ? attachmentsData : (attachmentsData as any)?.results ?? [];
  const [questionText, setQuestionText] = useState('');

  // Real completed sessions array based on backend progress
  const completedSessions = recordedProgressList.filter(p => p.is_completed).map(p => p.session);
  const progressPercent = totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 0;

  const activeSession = allSessions.find(s => s.id === activeSessionId) || allSessions[0];
  const activeSessionIndex = useMemo(() => {
    if (activeSessionId === null) return 0;
    const idx = allSessions.findIndex(s => s.id === activeSessionId);
    return idx >= 0 ? idx : 0;
  }, [activeSessionId, allSessions]);

  useEffect(() => {
    if (allSessions.length === 0) return;
    if (sessionInitForCourseRef.current === courseId) return;
    sessionInitForCourseRef.current = courseId ?? null;
    const parsed = sessionParam ? parseInt(sessionParam, 10) : NaN;
    const valid =
      Number.isFinite(parsed) &&
      parsed > 0 &&
      allSessions.some((s) => s.id === parsed);
    setActiveSessionId(valid ? parsed : (allSessions[0]?.id ?? null));
  }, [courseId, allSessions, sessionParam]);

  // Use the presigned URL hook — only triggers if the activeSession needs it and has an ID
  const isPrivateAsset = activeSession?.content_source === 'upload' && !!activeSession?.asset_object_key;
  const { data: assetUrlData, isLoading: isAssetLoading } = useSessionAssetUrl(isPrivateAsset ? activeSessionId || undefined : undefined);

  // Q&A: fetch discussions for the active session
  const { data: discussionsData } = useQuery({
    queryKey: ['discussions', 'session', activeSessionId],
    queryFn: () => discussionApi.getAll({ session: activeSessionId ?? undefined }).then(r => r.data),
    enabled: activeSessionId !== null,
  });

  // Q&A: replies for expanded question
  const { data: repliesData } = useQuery({
    queryKey: ['discussion-replies', expandedQuestionId],
    queryFn: () => discussionReplyApi.getAll({ discussion: expandedQuestionId ?? undefined }).then(r => r.data),
    enabled: expandedQuestionId !== null,
  });

  // Q&A: mutation to create a new question
  const createQuestionMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      discussionApi.create({ ...data, session: activeSessionId ?? null, course: Number(courseId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions', 'session', activeSessionId] });
      setQuestionText('');
    },
  });

  // Q&A: pin/lock mutations (instructor/admin only)
  const pinMutation = useMutation({
    mutationFn: (id: number) => discussionApi.pin(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discussions', 'session', activeSessionId] }),
  });
  const lockMutation = useMutation({
    mutationFn: (id: number) => discussionApi.lock(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discussions', 'session', activeSessionId] }),
  });

  const handleAskQuestion = () => {
    if (!questionText.trim()) return;
    createQuestionMutation.mutate({ title: questionText.trim(), content: questionText.trim() });
  };

  const discussions = normalizeList<Discussion>(discussionsData);
  const replies = normalizeList<DiscussionReply>(repliesData);

  const questions: QuestionItem[] = discussions.map((d) => ({
    id: d.id,
    author: d.user_name || 'Learner',
    user_name: d.user_name || 'Learner',
    title: d.title,
    content: d.content,
    reply_count: d.reply_count,
    created_at: d.created_at,
    is_pinned: d.is_pinned,
    is_locked: d.is_locked,
  }));

  // Video resume: persist playback position in localStorage
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const seekedRef = useRef(false);

  const storageKey = activeSessionId != null ? `video-pos-${activeSessionId}` : null;

  const handleVideoProgress = useCallback((state: ReactPlayerProgressState) => {
    if (storageKey && state.playedSeconds > 0) {
      localStorage.setItem(storageKey, String(Math.floor(state.playedSeconds)));
    }
  }, [storageKey]);

  const handleVideoReady = useCallback(() => {
    if (seekedRef.current || !storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved && Number(saved) > 2) {
      if (playerRef.current) playerRef.current.currentTime = Number(saved);
    }
    seekedRef.current = true;
  }, [storageKey]);

  // Reset seek flag when session changes
  useEffect(() => {
    seekedRef.current = false;
  }, [activeSessionId]);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const goToSession = (sessionId: number) => {
    setActiveSessionId(sessionId);
    const mod = modules.find(m => m.sessions.some(s => s.id === sessionId));
    if (mod && !expandedModules.includes(mod.id)) {
      setExpandedModules(prev => [...prev, mod.id]);
    }
  };

  const mergeProgressIntoCache = useCallback((record: SessionProgress) => {
    queryClient.setQueryData(queryKeys.sessionProgress.all({ course: Number(courseId) }), (oldData: unknown) => {
      const oldList: SessionProgress[] = Array.isArray(oldData)
        ? oldData
        : Array.isArray((oldData as { results?: unknown })?.results)
          ? ((oldData as { results?: SessionProgress[] }).results ?? [])
          : [];

      const idx = oldList.findIndex(p => p.id === record.id);
      if (idx >= 0) {
        return oldList.map((p, i) => (i === idx ? { ...p, ...record } : p));
      }
      return [...oldList, record];
    });
  }, [courseId, queryClient]);

  const invalidateEnrollmentCaches = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['learner', 'my-courses'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.enrollments.all });
  }, [queryClient]);

  const ensureProgressRecord = useCallback(async (sessionId: number): Promise<SessionProgress> => {
    const existing = recordedProgressList.find(p => p.session === sessionId);
    if (existing) return existing;

    if (!enrollmentId) {
      console.error('Cannot create session progress without enrollment id', { sessionId, courseId });
      throw new Error('Missing enrollment id for session progress.');
    }

    const created = (await sessionProgressApi.create({
      enrollment: enrollmentId,
      session: sessionId,
    })).data;
    mergeProgressIntoCache(created);
    invalidateEnrollmentCaches();
    return created;
  }, [recordedProgressList, enrollmentId, courseId, mergeProgressIntoCache, invalidateEnrollmentCaches]);

  useEffect(() => {
    ensuredStartedSessionsRef.current.clear();
  }, [courseId]);

  const ensureStartedForSession = useCallback(async (sessionId: number) => {
    if (ensuredStartedSessionsRef.current.has(sessionId)) return;
    ensuredStartedSessionsRef.current.add(sessionId);
    try {
      await ensureProgressRecord(sessionId);
    } catch (err) {
      ensuredStartedSessionsRef.current.delete(sessionId);
      console.error('Failed to ensure session progress record', { sessionId, err });
    }
  }, [ensureProgressRecord]);

  useEffect(() => {
    if (activeSessionId == null || !enrollmentId) return;
    void ensureStartedForSession(activeSessionId);
  }, [activeSessionId, enrollmentId, ensureStartedForSession]);

  const setSessionCompleted = useCallback(async (sessionId: number, completed: boolean): Promise<void> => {
    const progressRecord = await ensureProgressRecord(sessionId);
    const updatedPatch = (await sessionProgressApi.partialUpdate(progressRecord.id, {
      is_completed: completed,
      time_spent_seconds: progressRecord.time_spent_seconds ?? 0,
    })).data;
    const updated: SessionProgress = {
      ...progressRecord,
      ...updatedPatch,
    };
    mergeProgressIntoCache(updated);
    invalidateEnrollmentCaches();
  }, [ensureProgressRecord, mergeProgressIntoCache, invalidateEnrollmentCaches]);

  const toggleComplete = useCallback(async (sessionId: number) => {
    try {
      const existing = recordedProgressList.find(p => p.session === sessionId);
      const nextCompleted = !(existing?.is_completed ?? false);
      await setSessionCompleted(sessionId, nextCompleted);
    } catch (error) {
      console.error('Failed to persist session completion state', { sessionId, error });
    }
  }, [recordedProgressList, setSessionCompleted]);

  // Notes: read from session progress `notes` field (stored as JSON array)
  const activeProgressRecord = recordedProgressList.find(p => p.session === activeSessionId);

  const notes: Note[] = useMemo(() => {
    if (!activeProgressRecord?.notes) return [];
    try {
      return JSON.parse(activeProgressRecord.notes) as Note[];
    } catch {
      return [];
    }
  }, [activeProgressRecord?.notes]);

  const saveNotesMutation = useMutation({
    mutationFn: ({ progressId, updatedNotes }: { progressId: number; updatedNotes: Note[] }) =>
      sessionProgressApi.partialUpdate(progressId, { notes: JSON.stringify(updatedNotes) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionProgress.all({ course: Number(courseId) }) });
    },
  });

  const addNote = () => {
    if (!newNote.trim() || !activeSession) return;
    const note: Note = { id: Date.now(), text: newNote, timestamp: '0:00', sessionTitle: activeSession.title };
    const updatedNotes = [note, ...notes];

    // Optimistic update
    if (activeProgressRecord) {
      queryClient.setQueryData(queryKeys.sessionProgress.all({ course: Number(courseId) }), (old: unknown) => {
        const oldList: SessionProgress[] = Array.isArray(old)
          ? old
          : Array.isArray((old as { results?: unknown })?.results)
            ? ((old as { results?: SessionProgress[] }).results ?? [])
            : [];

        return oldList.map(p =>
          p.id === activeProgressRecord.id ? { ...p, notes: JSON.stringify(updatedNotes) } : p
        );
      },
      );
      saveNotesMutation.mutate({ progressId: activeProgressRecord.id, updatedNotes });
    }
    setNewNote('');
  };



  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoIcon sx={{ fontSize: 18 }} />;
      case 'article': return <ArticleIcon sx={{ fontSize: 18 }} />;
      case 'quiz': return <QuizIcon sx={{ fontSize: 18 }} />;
      default: return <VideoIcon sx={{ fontSize: 18 }} />;
    }
  };

  /* ── Curriculum Panel ── */
  const curriculumContent = (
    <Box sx={{ width: isMobile ? 320 : 360, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" fontWeight={700}>Course Content</Typography>
        <IconButton size="small" onClick={() => setCurriculumOpen(false)}><MenuOpenIcon /></IconButton>
      </Box>

      {/* Progress */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{completedSessions.length}/{totalSessions} sessions complete</Typography>
          <Typography variant="caption" fontWeight={600} color="primary.main">{progressPercent}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { borderRadius: 3 } }} />
      </Box>

      {/* Modules */}
      <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#d1d5db', borderRadius: 2 } }}>
        {modules.map(mod => {
          const modCompleted = mod.sessions.filter(s => completedSessions.includes(s.id)).length;
          const isExpanded = expandedModules.includes(mod.id);
          return (
            <Box key={mod.id}>
              <Box
                onClick={() => toggleModule(mod.id)}
                sx={{
                  px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1,
                  cursor: 'pointer',
                  bgcolor: isExpanded ? 'rgba(255,164,36,0.04)' : 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  transition: 'background 0.2s',
                }}
              >
                {isExpanded ? <ExpandIcon sx={{ fontSize: 20, color: '#ffa424' }} /> : <ChevronIcon sx={{ fontSize: 20 }} />}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{mod.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{modCompleted}/{mod.sessions.length} completed</Typography>
                </Box>
              </Box>
              <Collapse in={isExpanded}>
                {mod.sessions.map(session => {
                  const isActive = session.id === activeSessionId;
                  const isDone = completedSessions.includes(session.id);
                  return (
                    <Box
                      key={session.id}
                      onClick={() => goToSession(session.id)}
                      sx={{
                        pl: 2, pr: 1.5, py: 1,
                        display: 'flex', alignItems: 'center', gap: 1,
                        cursor: 'pointer',
                        bgcolor: isActive ? 'rgba(255,164,36,0.08)' : 'transparent',
                        borderLeft: isActive ? '3px solid #ffa424' : '3px solid transparent',
                        '&:hover': { bgcolor: isActive ? 'rgba(255,164,36,0.12)' : 'rgba(0,0,0,0.02)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Checkbox
                        checked={isDone}
                        size="small"
                        onClick={(e) => { e.stopPropagation(); toggleComplete(session.id); }}
                        sx={{ p: 0.25, color: isDone ? '#10b981' : '#d1d5db', '&.Mui-checked': { color: '#10b981' } }}
                      />
                      <Box sx={{ color: isActive ? '#ffa424' : '#6b7280', display: 'flex', alignItems: 'center' }}>
                        {getLessonIcon(session.session_type)}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: isActive ? 600 : 400, color: isActive ? '#1a1a2e' : 'text.primary', fontSize: '0.82rem' }}>
                          {session.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>{session.duration_minutes} min</Typography>
                    </Box>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  /* ── Render ── */
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>

      {/* ─── Dark Top Bar ─── */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: '#1a1a2e', boxShadow: '0 2px 12px rgba(0,0,0,0.3)', zIndex: 1300 }}>
        <Toolbar sx={{ minHeight: '56px !important', gap: 1 }}>
          <Tooltip title="Back to course">
            <IconButton onClick={() => navigate(`/learner/course/${courseId}`)} sx={{ color: '#fff' }}>
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.15)', mx: 0.5 }} />
          <Typography variant="body2" noWrap sx={{ flex: 1, color: '#e5e7eb', fontWeight: 500 }}>
            {course?.title || 'Course Player'}
          </Typography>

          {/* Progress pill */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.08)', px: 1.5, py: 0.5, borderRadius: '20px' }}>
            <LinearProgress variant="determinate" value={progressPercent} sx={{ width: 80, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: '#ffa424' } }} />
            <Typography variant="caption" sx={{ color: '#ffa424', fontWeight: 600 }}>{progressPercent}%</Typography>
          </Box>

          <Tooltip title="Bookmark"><IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}><BookmarkIcon /></IconButton></Tooltip>
          <Tooltip title="Share"><IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}><ShareIcon /></IconButton></Tooltip>

          {!curriculumOpen && (
            <Tooltip title="Show curriculum">
              <IconButton onClick={() => setCurriculumOpen(true)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {/* ─── Main Content ─── */}
      <Box sx={{ display: 'flex', flex: 1, pt: '56px' }}>

        {/* ── Left: Video + Tabs ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0, height: 'calc(100vh - 56px)' }}>

          {/* Video Player */}
          {activeSession?.session_type === 'video' && activeSession?.content_source === 'external' && activeSession?.external_video_embed_url ? (
            /* External Video (YouTube/Vimeo/Loom) via iframe */
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                background: '#000',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <iframe
                src={activeSession.external_video_embed_url}
                title={activeSession.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          ) : activeSession?.session_type === 'video' ? (
            /* Uploaded Presigned Asset via ReactPlayer */
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                background: '#000',
                flexShrink: 0,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAssetLoading ? (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress sx={{ color: '#ffa424' }} />
                </Box>
              ) : assetUrlData?.url || activeSession?.video_url ? (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <video
                    ref={playerRef}
                    src={(assetUrlData?.url || activeSession?.video_url || '') as string}
                    controls
                    style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                    onLoadedMetadata={handleVideoReady}
                    onCanPlay={handleVideoReady}
                    onTimeUpdate={(e) => {
                      const el = e.currentTarget;
                      const playedSeconds = el.currentTime || 0;
                      const duration = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 0;
                      const played = duration > 0 ? playedSeconds / duration : 0;
                      handleVideoProgress({
                        played,
                        playedSeconds,
                        loaded: played,
                        loadedSeconds: playedSeconds,
                      });
                    }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      console.error('Learner uploaded video playback error', {
                        sessionId: activeSession?.id,
                        src: el.currentSrc || el.src,
                        mediaErrorCode: el.error?.code,
                        mediaErrorMessage: el.error?.message,
                      });
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
                  <VideoIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#fff' }}>Video content is not available.</Typography>
                </Box>
              )}
            </Box>
          ) : activeSession?.session_type === 'document' ? (
            /* Document/PDF Viewer via signed asset URL */
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: { xs: 420, md: 560 },
                bgcolor: '#f8f9fa',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {isAssetLoading ? (
                <Box sx={{ flex: 1, minHeight: { xs: 420, md: 560 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress sx={{ color: '#ffa424' }} />
                </Box>
              ) : assetUrlData?.url || activeSession?.video_url ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, borderBottom: '1px solid #e5e7eb', bgcolor: '#fff' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => window.open((assetUrlData?.url || activeSession?.video_url || '') as string, '_blank', 'noopener,noreferrer')}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Open document in new tab
                    </Button>
                  </Box>
                  <Box sx={{ flex: 1, minHeight: { xs: 360, md: 500 }, bgcolor: '#f8f9fa' }}>
                    <iframe
                      src={(assetUrlData?.url || activeSession?.video_url || '') as string}
                      title={activeSession?.title || 'Document'}
                      style={{ width: '100%', height: '100%', minHeight: 'inherit', border: 'none', background: '#fff' }}
                    />
                  </Box>
                </>
              ) : (
                <Box sx={{ flex: 1, minHeight: { xs: 420, md: 560 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
                  <ArticleIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>Document is not available.</Typography>
                </Box>
              )}
            </Box>
          ) : activeSession?.session_type === 'scorm' ? (
            /* SCORM: temporary fallback — package download only; no in-app playback yet */
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                minHeight: { xs: 420, md: 560 },
                bgcolor: '#f8f9fa',
                borderBottom: '1px solid #e5e7eb',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                py: 4,
                textAlign: 'center',
              }}
            >
              {isAssetLoading ? (
                <CircularProgress sx={{ color: '#ffa424' }} />
              ) : assetUrlData?.url || activeSession?.video_url ? (
                <>
                  <ArticleIcon sx={{ fontSize: 56, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, mb: 1, maxWidth: 480 }}>
                    SCORM playback is not available in the player yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 480 }}>
                    You can download the uploaded package to open it in a compatible tool or LMS.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => window.open((assetUrlData?.url || activeSession?.video_url || '') as string, '_blank', 'noopener,noreferrer')}
                    sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#ffa424', color: '#fff', '&:hover': { bgcolor: '#e6931f' } }}
                  >
                    Download SCORM package
                  </Button>
                </>
              ) : (
                <>
                  <ArticleIcon sx={{ fontSize: 56, color: 'rgba(0,0,0,0.2)', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 480 }}>
                    SCORM package is not available for this session.
                  </Typography>
                </>
              )}
            </Box>
          ) : activeSession?.session_type === 'quiz' ? (
            /* Quiz Player */
            <QuizSessionRenderer
              sessionId={activeSession.id}
              enrollmentId={enrollmentId}
              onComplete={(_score, passed) => {
                if (passed && !completedSessions.includes(activeSession.id)) {
                  void setSessionCompleted(activeSession.id, true).catch((error) => {
                    console.error('Failed to persist quiz session completion', {
                      sessionId: activeSession.id,
                      error,
                    });
                  });
                }
              }}
            />
          ) : (
            /* Non-video content placeholder */
            <Box sx={{ width: '100%', pt: '30%', bgcolor: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e5e7eb' }}>
               {getLessonIcon(activeSession?.session_type || 'text')}
               <Typography variant="body1" fontWeight={600} sx={{ mt: 2, color: 'text.secondary' }}>Non-video Content: {activeSession?.title}</Typography>
            </Box>
          )}

          {/* Session Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, md: 3 }, py: 1.5, bgcolor: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
            <Button
              startIcon={<PrevIcon />}
              disabled={activeSessionIndex <= 0}
              onClick={() => activeSessionIndex > 0 && goToSession(allSessions[activeSessionIndex - 1].id)}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
            >
              Previous
            </Button>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Session {activeSessionIndex + 1} of {totalSessions}
            </Typography>
            <Button
              endIcon={<NextIcon />}
              disabled={activeSessionIndex >= totalSessions - 1}
              onClick={() => activeSessionIndex < totalSessions - 1 && goToSession(allSessions[activeSessionIndex + 1].id)}
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600, color: '#fff' }}
            >
              Next
            </Button>
          </Box>

          {/* Mark Complete + Session Title */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, bgcolor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
            <Button
              variant={activeSession && completedSessions.includes(activeSession.id) ? 'contained' : 'outlined'}
              startIcon={<CheckIcon />}
              onClick={() => activeSession && toggleComplete(activeSession.id)}
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 600,
                bgcolor: activeSession && completedSessions.includes(activeSession.id) ? '#10b981' : 'transparent',
                borderColor: activeSession && completedSessions.includes(activeSession.id) ? '#10b981' : '#d1d5db',
                color: activeSession && completedSessions.includes(activeSession.id) ? '#fff' : 'text.secondary',
                '&:hover': { bgcolor: activeSession && completedSessions.includes(activeSession.id) ? '#059669' : 'rgba(0,0,0,0.04)', borderColor: activeSession && completedSessions.includes(activeSession.id) ? '#059669' : '#d1d5db' },
              }}
            >
              {activeSession && completedSessions.includes(activeSession.id) ? 'Completed' : 'Mark Complete'}
            </Button>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>{activeSession?.title}</Typography>
              <Typography variant="body2" color="text.secondary">{course?.instructor_name || 'Instructor'}</Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                px: { xs: 2, md: 3 },
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 48 },
                '& .MuiTabs-indicator': { bgcolor: '#ffa424', height: 3, borderRadius: '3px 3px 0 0' },
              }}
            >
              <Tab label="Overview" />
              <Tab label="Notes" />
              <Tab label="Q&A" />
              <Tab label="Resources" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }} className="cp-fade-in" key={activeTab}>

            {/* ── Overview ── */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>About this session</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                  {activeSession?.description || activeSession?.content_text || 'No additional description provided for this session.'}
                </Typography>
              </Box>
            )}

            {/* ── Notes ── */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <TextField
                    fullWidth size="small"
                    placeholder="Add a note for this session..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  <IconButton onClick={addNote} sx={{ bgcolor: '#ffa424', color: '#fff', borderRadius: '12px', '&:hover': { bgcolor: '#e6931f' } }}>
                    <NoteIcon />
                  </IconButton>
                </Box>
                {notes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>No notes yet. Start taking notes!</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {notes.map(note => (
                      <Box key={note.id} sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: '12px', borderLeft: '3px solid #ffa424' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Chip label={note.timestamp} size="small" sx={{ bgcolor: '#ffa424', color: '#fff', fontSize: '0.7rem', height: 22 }} />
                          <Typography variant="caption" color="text.secondary">{note.sessionTitle}</Typography>
                        </Box>
                        <Typography variant="body2">{note.text}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* ── Q&A ── */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <TextField
                    fullWidth size="small"
                    placeholder="Ask a question about this session..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleAskQuestion}
                    disabled={createQuestionMutation.isPending || !questionText.trim()}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3, whiteSpace: 'nowrap', color: '#fff' }}
                  >
                    {createQuestionMutation.isPending ? 'Posting...' : 'Ask'}
                  </Button>
                </Box>
                {discussions.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>No questions yet. Be the first to ask!</Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {questions.length > 0 ? questions.map(q => (
                    <Box key={q.id} sx={{ p: 2, bgcolor: q.is_pinned ? 'rgba(255,164,36,0.04)' : '#fff', borderRadius: '12px', border: q.is_pinned ? '1px solid #ffa424' : '1px solid #e5e7eb', '&:hover': { borderColor: '#ffa424' }, transition: 'border-color 0.2s' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#ffa424' }}>{q.user_name?.[0] || '?'}</Avatar>
                        <Typography variant="body2" fontWeight={600}>{q.user_name}</Typography>
                        <Typography variant="caption" color="text.secondary">· {new Date(q.created_at).toLocaleDateString()}</Typography>
                        {q.is_pinned && <Chip icon={<PinIcon sx={{ fontSize: 14 }} />} label="Pinned" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(255,164,36,0.12)', color: '#ffa424', fontWeight: 600 }} />}
                        {q.is_locked && <Chip icon={<LockIcon sx={{ fontSize: 14 }} />} label="Locked" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 600 }} />}
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{q.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 1.5 }}>{q.content}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>{q.reply_count} replies</Button>
                        {isModeratorRole && (
                          <>
                            <Tooltip title={q.is_pinned ? 'Unpin' : 'Pin'}>
                              <IconButton size="small" onClick={() => pinMutation.mutate(q.id)} disabled={pinMutation.isPending} sx={{ color: q.is_pinned ? '#ffa424' : 'text.disabled' }}>
                                <PinIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={q.is_locked ? 'Unlock' : 'Lock'}>
                              <IconButton size="small" onClick={() => lockMutation.mutate(q.id)} disabled={lockMutation.isPending} sx={{ color: q.is_locked ? '#ef4444' : 'text.disabled' }}>
                                <LockIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </Box>
                  )) : (
                    <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <Typography color="text.secondary">No questions yet. Be the first to ask!</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* ── Resources ── */}
            {activeTab === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {(attachments ?? []).length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <Typography color="text.secondary">No resources attached to this session yet.</Typography>
                  </Box>
                ) : (attachments ?? []).map((r: SessionAttachment) => (
                  <Box key={r.id} sx={{
                    p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', gap: 2,
                    '&:hover': { borderColor: '#ffa424', boxShadow: '0 2px 8px rgba(255,164,36,0.1)' },
                    transition: 'all 0.2s',
                  }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: r.file_type === 'pdf' ? '#fee2e2' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArticleIcon sx={{ color: r.file_type === 'pdf' ? '#ef4444' : '#3b82f6' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{r.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{r.file_type.toUpperCase()} · {(r.file_size / 1024 / 1024).toFixed(1)} MB</Typography>
                    </Box>
                    <IconButton sx={{ color: '#ffa424' }} component="a" href={r.file_url || r.file} target="_blank" rel="noopener"><DownloadIcon /></IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Right: Curriculum Panel (Desktop) ── */}
        {!isMobile && curriculumOpen && (
          <Box sx={{ borderLeft: '1px solid #e5e7eb', height: 'calc(100vh - 56px)', position: 'sticky', top: 56, flexShrink: 0 }}>
            {curriculumContent}
          </Box>
        )}

        {/* ── Mobile Curriculum Drawer ── */}
        {isMobile && (
          <Drawer
            anchor="right"
            open={curriculumOpen}
            onClose={() => setCurriculumOpen(false)}
            PaperProps={{ sx: { top: 56, height: 'calc(100% - 56px)' } }}
            ModalProps={{ keepMounted: true }}
          >
            {curriculumContent}
          </Drawer>
        )}
      </Box>
    </Box>
  );
};

/* ── Quiz wrapper that fetches quiz data + past attempts for a session ── */
const QuizSessionRenderer: React.FC<{
  sessionId: number;
  enrollmentId: number | null;
  onComplete?: (score: number, passed: boolean) => void;
}> = ({ sessionId, enrollmentId, onComplete }) => {
  const { data: quiz, isLoading, isError } = useQuizDetail(sessionId);

  // Fetch past attempts for this quiz
  const { data: pastAttemptsData } = useQuery({
    queryKey: ['quizSubmissions', quiz?.quiz_id, enrollmentId],
    queryFn: () => quizSubmissionApi.getAll({
      ...(quiz?.quiz_id ? { quiz: quiz.quiz_id } : {}),
      ...(enrollmentId ? { enrollment: enrollmentId } : {}),
    }).then(r => {
      const data = r.data;
      return Array.isArray(data) ? data : (data as { results?: typeof data })?.results ?? [];
    }),
    enabled: !!quiz?.quiz_id,
  });
  const pastAttempts = pastAttemptsData ?? [];

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', py: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#ffa424' }} />
      </Box>
    );
  }

  if (isError || !quiz || !quiz.questions?.length) {
    return (
      <Box sx={{ width: '100%', py: 8, textAlign: 'center' }}>
        <QuizIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          {isError ? 'Failed to load quiz. Please try again.' : 'This quiz has no questions yet.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', minHeight: 400 }}>
      <QuizPlayer
        sessionId={sessionId}
        quizId={quiz.quiz_id}
        enrollmentId={enrollmentId}
        settings={quiz.settings}
        questions={quiz.questions}
        previousAttempts={pastAttempts.length}
        pastAttempts={pastAttempts}
        onComplete={onComplete}
      />
    </Box>
  );
};

/* ── Assignment wrapper ── */
const AssignmentSessionRenderer: React.FC<{ sessionId: number; onComplete?: (score: number | null, passed: boolean | null) => void }> = ({ sessionId, onComplete }) => {
  return (
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', minHeight: 400 }}>
      <AssignmentPlayer
        sessionId={sessionId}
        onComplete={onComplete}
      />
    </Box>
  );
};

export default CoursePlayerPage;

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}
