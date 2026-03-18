import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { sessionProgressApi, discussionApi } from '../../services/learning.services';
import { queryKeys } from '../../hooks/queryKeys';
import type { CourseDetail, Session, SessionProgress, Discussion } from '../../types/types';
import { useSessionAssetUrl } from '../../hooks/useUpload';
import { useQuizDetail } from '../../hooks/useCatalogue';
import ReactPlayer from 'react-player';
import QuizPlayer from '../../components/learner/quiz-player/QuizPlayer';
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
} from '@mui/icons-material';
import '../../styles/LearnerDashboard.css';

/* ── Types ── */
interface Note { id: number; text: string; timestamp: string; sessionTitle: string; }
interface Resource { id: number; name: string; type: string; size: string; }

const sampleResources: Resource[] = [
  { id: 1, name: 'Lesson Slides.pdf', type: 'PDF', size: '2.4 MB' },
];

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

/* ── Component ── */
const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // Load backend data from the router loader
  const { course: initialCourse, progress: initialProgress } = useLoaderData() as {
    course: CourseDetail;
    progress: SessionProgress[];
  };

  // Keep state synced via React Query
  const course = queryClient.getQueryData<CourseDetail>(queryKeys.courses.detail(Number(courseId))) || initialCourse;
  const recordedProgress = queryClient.getQueryData<SessionProgress[]>(queryKeys.sessionProgress.all({ course: Number(courseId) })) || initialProgress;

  const modules = useMemo(() => groupSessions(course?.sessions || []), [course?.sessions]);
  const allSessions = useMemo(() => modules.flatMap(m => m.sessions), [modules]);
  const totalSessions = allSessions.length;

  const [activeTab, setActiveTab] = useState(0);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(allSessions[0]?.id || null);
  const [expandedModules, setExpandedModules] = useState<string[]>(['module-1']);
  const [curriculumOpen, setCurriculumOpen] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  // Q&A discussions
  const { data: discussionsRes } = useQuery({
    queryKey: ['discussions', courseId],
    queryFn: () => discussionApi.getAll({ course: Number(courseId) }),
    enabled: !!courseId,
  });
  const discussions: Discussion[] = (() => {
    const raw = discussionsRes?.data;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : (raw as any).results || [];
  })();

  const createDiscussion = useMutation({
    mutationFn: (content: string) => discussionApi.create({ course: Number(courseId), session: activeSessionId, title: content.slice(0, 100), content }),
    onSuccess: () => {
      setNewQuestion('');
      queryClient.invalidateQueries({ queryKey: ['discussions', courseId] });
    },
  });
  
  // Real completed sessions array based on backend progress
  const completedSessions = recordedProgress.filter(p => p.is_completed).map(p => p.session);
  const progressPercent = totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 0;

  const activeSession = allSessions.find(s => s.id === activeSessionId) || allSessions[0];
  const activeSessionIndex = allSessions.findIndex(s => s.id === activeSessionId);

  // Use the presigned URL hook — only triggers if the activeSession needs it and has an ID
  const isPrivateAsset = activeSession?.content_source === 'upload' && !!activeSession?.asset_bucket;
  const { data: assetUrlData, isLoading: isAssetLoading } = useSessionAssetUrl(isPrivateAsset ? activeSessionId || undefined : undefined);

  // Video resume: persist playback position in localStorage
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const seekedRef = useRef(false);

  const storageKey = activeSessionId != null ? `video-pos-${activeSessionId}` : null;

  const handleVideoProgress = useCallback(
    (state: { playedSeconds: number }) => {
      if (storageKey && state.playedSeconds > 0) {
        localStorage.setItem(storageKey, String(Math.floor(state.playedSeconds)));
      }
    },
    [storageKey],
  );

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

  const toggleComplete = async (sessionId: number) => {
    const progRecord = recordedProgress.find(p => p.session === sessionId) || {
        id: Date.now(),
        enrollment: 1,
        session: sessionId,
        session_title: allSessions.find(s => s.id === sessionId)?.title || '',
        session_type: 'video',
        is_started: true,
        is_completed: false,
        time_spent_seconds: 0,
        time_spent_minutes: 0,
        last_accessed_at: new Date().toISOString(),
        duration_minutes: 0
    };
    
    queryClient.setQueryData(queryKeys.sessionProgress.all({ course: Number(courseId) }), (oldData: SessionProgress[] = []) => {
      const exists = oldData.find(p => p.session === sessionId);
      if (exists) {
        return oldData.map(p => p.session === sessionId ? { ...p, is_completed: !p.is_completed } : p);
      }
      return [...oldData, { ...progRecord, is_completed: true }];
    });
  };

  // Notes: read from session progress `notes` field (stored as JSON array)
  const activeProgressRecord = recordedProgress.find(p => p.session === activeSessionId);

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
      queryClient.setQueryData(queryKeys.sessionProgress.all({ course: Number(courseId) }), (old: SessionProgress[] = []) =>
        old.map(p => p.id === activeProgressRecord.id ? { ...p, notes: JSON.stringify(updatedNotes) } : p),
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
                  {/* @ts-ignore ReactPlayer typing issues with React 19 */}
                  {(ReactPlayer as any)({
                    ref: playerRef,
                    url: (assetUrlData?.url || activeSession?.video_url || '') as string,
                    controls: true,
                    width: "100%",
                    height: "100%",
                    style: { backgroundColor: '#000' },
                    onProgress: handleVideoProgress,
                    onReady: handleVideoReady,
                    progressInterval: 3000,
                  })}
                </Box>
              ) : (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
                  <VideoIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#fff' }}>Video content is not available.</Typography>
                </Box>
              )}
            </Box>
          ) : activeSession?.session_type === 'quiz' ? (
            /* Quiz Player */
            <QuizSessionRenderer sessionId={activeSession.id} onComplete={(score, passed) => {
              if (passed && !completedSessions.includes(activeSession.id)) {
                toggleComplete(activeSession.id);
              }
            }} />
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
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={!newQuestion.trim() || createDiscussion.isPending}
                    onClick={() => newQuestion.trim() && createDiscussion.mutate(newQuestion.trim())}
                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3, whiteSpace: 'nowrap', color: '#fff' }}
                  >
                    Ask
                  </Button>
                </Box>
                {discussions.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>No questions yet. Be the first to ask!</Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {discussions.map(q => (
                    <Box key={q.id} sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', '&:hover': { borderColor: '#ffa424' }, transition: 'border-color 0.2s' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#ffa424' }}>{q.user_name?.[0] || '?'}</Avatar>
                        <Typography variant="body2" fontWeight={600}>{q.user_name}</Typography>
                        <Typography variant="caption" color="text.secondary">· {new Date(q.created_at).toLocaleDateString()}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{q.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 1.5 }}>{q.content}</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>{q.reply_count} replies</Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── Resources ── */}
            {activeTab === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {sampleResources.map(r => (
                  <Box key={r.id} sx={{
                    p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                    display: 'flex', alignItems: 'center', gap: 2,
                    '&:hover': { borderColor: '#ffa424', boxShadow: '0 2px 8px rgba(255,164,36,0.1)' },
                    transition: 'all 0.2s',
                  }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: r.type === 'PDF' ? '#fee2e2' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArticleIcon sx={{ color: r.type === 'PDF' ? '#ef4444' : '#3b82f6' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{r.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{r.type} · {r.size}</Typography>
                    </Box>
                    <IconButton sx={{ color: '#ffa424' }}><DownloadIcon /></IconButton>
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

/* ── Quiz wrapper that fetches quiz data for a session ── */
const QuizSessionRenderer: React.FC<{ sessionId: number; onComplete?: (score: number, passed: boolean) => void }> = ({ sessionId, onComplete }) => {
  const { data: quiz, isLoading, isError } = useQuizDetail(sessionId);

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
        settings={quiz.settings}
        questions={quiz.questions}
        onComplete={onComplete}
      />
    </Box>
  );
};

export default CoursePlayerPage;
