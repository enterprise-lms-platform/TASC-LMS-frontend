import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, Button, Tabs, Tab, LinearProgress,
  Checkbox, Collapse, Drawer, Divider, TextField, Avatar, Chip,
  Tooltip, useMediaQuery, useTheme, AppBar, Toolbar,
} from '@mui/material';
import {
  ArrowBack as BackIcon, PlayArrow as PlayIcon,
  SkipPrevious as PrevIcon, SkipNext as NextIcon,
  ExpandMore as ExpandIcon, ChevronRight as ChevronIcon,
  PlayCircleOutline as VideoIcon, Description as ArticleIcon, Quiz as QuizIcon,
  CheckCircle as CheckIcon, BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon, ThumbUpAltOutlined as LikeIcon,
  Send as SendIcon, NoteAdd as NoteIcon,
  MenuOpen as MenuOpenIcon, Menu as MenuIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

/* ── Types ── */
interface Lesson { id: string; title: string; duration: string; type: 'video' | 'article' | 'quiz'; }
interface Module { id: string; title: string; lessons: Lesson[]; }
interface Note { id: number; text: string; timestamp: string; lessonTitle: string; }
interface Question { id: number; author: string; text: string; votes: number; replies: number; time: string; }
interface Resource { id: number; name: string; type: string; size: string; }

/* ── Sample Data ── */
const courseTitle = 'Advanced React Patterns';
const instructorName = 'Michael Rodriguez';

const modules: Module[] = [
  {
    id: '1', title: 'Module 1: React Fundamentals Review',
    lessons: [
      { id: '1-1', title: 'Introduction to Advanced Patterns', duration: '12:30', type: 'video' },
      { id: '1-2', title: 'Component Composition Deep Dive', duration: '18:45', type: 'video' },
      { id: '1-3', title: 'State Management Patterns', duration: '22:10', type: 'video' },
      { id: '1-4', title: 'Module 1 Reading Material', duration: '10 min', type: 'article' },
      { id: '1-5', title: 'Module 1 Quiz', duration: '15 min', type: 'quiz' },
    ],
  },
  {
    id: '2', title: 'Module 2: Advanced Component Patterns',
    lessons: [
      { id: '2-1', title: 'Render Props Pattern', duration: '25:00', type: 'video' },
      { id: '2-2', title: 'Higher-Order Components', duration: '20:15', type: 'video' },
      { id: '2-3', title: 'Compound Components', duration: '28:30', type: 'video' },
      { id: '2-4', title: 'Building a Modal with Compound Pattern', duration: '35:00', type: 'video' },
      { id: '2-5', title: 'Module 2 Quiz', duration: '20 min', type: 'quiz' },
    ],
  },
  {
    id: '3', title: 'Module 3: Custom Hooks Mastery',
    lessons: [
      { id: '3-1', title: 'Creating Custom Hooks', duration: '22:00', type: 'video' },
      { id: '3-2', title: 'useLocalStorage Hook', duration: '15:30', type: 'video' },
      { id: '3-3', title: 'useFetch Hook', duration: '18:45', type: 'video' },
      { id: '3-4', title: 'useDebounce and useThrottle', duration: '20:00', type: 'video' },
    ],
  },
  {
    id: '4', title: 'Module 4: Performance Optimization',
    lessons: [
      { id: '4-1', title: 'React.memo and useMemo', duration: '19:00', type: 'video' },
      { id: '4-2', title: 'useCallback Deep Dive', duration: '16:30', type: 'video' },
      { id: '4-3', title: 'Virtualization Techniques', duration: '24:00', type: 'video' },
      { id: '4-4', title: 'Performance Audit Workshop', duration: '30 min', type: 'article' },
      { id: '4-5', title: 'Final Assessment', duration: '30 min', type: 'quiz' },
    ],
  },
];

const sampleNotes: Note[] = [
  { id: 1, text: 'Key insight: Render props allow inversion of control for component rendering', timestamp: '5:23', lessonTitle: 'Render Props Pattern' },
  { id: 2, text: 'Remember to memoize callback functions passed as render props', timestamp: '12:45', lessonTitle: 'Render Props Pattern' },
];

const sampleQuestions: Question[] = [
  { id: 1, author: 'Sarah K.', text: 'How does this pattern compare to hooks for sharing logic?', votes: 12, replies: 3, time: '2 days ago' },
  { id: 2, author: 'James L.', text: 'Can we use render props with TypeScript generics?', votes: 8, replies: 2, time: '1 week ago' },
  { id: 3, author: 'Maria G.', text: 'What are the performance implications of using render props vs HOCs?', votes: 5, replies: 1, time: '3 days ago' },
];

const sampleResources: Resource[] = [
  { id: 1, name: 'Lesson Slides.pdf', type: 'PDF', size: '2.4 MB' },
  { id: 2, name: 'Code Examples.zip', type: 'ZIP', size: '1.1 MB' },
  { id: 3, name: 'React Patterns Cheat Sheet.pdf', type: 'PDF', size: '450 KB' },
];

/* ── Helpers ── */
const allLessons = modules.flatMap(m => m.lessons);
const totalLessons = allLessons.length;

/* ── Component ── */
const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState('2-1');
  const [expandedModules, setExpandedModules] = useState<string[]>(['1', '2']);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['1-1', '1-2', '1-3', '1-4', '1-5']);
  const [curriculumOpen, setCurriculumOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [newNote, setNewNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const goToLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    const mod = modules.find(m => m.lessons.some(l => l.id === lessonId));
    if (mod && !expandedModules.includes(mod.id)) {
      setExpandedModules(prev => [...prev, mod.id]);
    }
  };

  const toggleComplete = (lessonId: string) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId) ? prev.filter(l => l !== lessonId) : [...prev, lessonId]
    );
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [{ id: Date.now(), text: newNote, timestamp: '0:00', lessonTitle: activeLesson.title }, ...prev]);
    setNewNote('');
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
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
          <Typography variant="caption" color="text.secondary">{completedLessons.length}/{totalLessons} lessons complete</Typography>
          <Typography variant="caption" fontWeight={600} color="primary.main">{progress}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { borderRadius: 3 } }} />
      </Box>

      {/* Modules */}
      <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#d1d5db', borderRadius: 2 } }}>
        {modules.map(mod => {
          const modCompleted = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
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
                  <Typography variant="caption" color="text.secondary">{modCompleted}/{mod.lessons.length} completed</Typography>
                </Box>
              </Box>
              <Collapse in={isExpanded}>
                {mod.lessons.map(lesson => {
                  const isActive = lesson.id === activeLessonId;
                  const isDone = completedLessons.includes(lesson.id);
                  return (
                    <Box
                      key={lesson.id}
                      onClick={() => goToLesson(lesson.id)}
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
                        onClick={(e) => { e.stopPropagation(); toggleComplete(lesson.id); }}
                        sx={{ p: 0.25, color: isDone ? '#10b981' : '#d1d5db', '&.Mui-checked': { color: '#10b981' } }}
                      />
                      <Box sx={{ color: isActive ? '#ffa424' : '#6b7280', display: 'flex', alignItems: 'center' }}>
                        {getLessonIcon(lesson.type)}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: isActive ? 600 : 400, color: isActive ? '#1a1a2e' : 'text.primary', fontSize: '0.82rem' }}>
                          {lesson.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>{lesson.duration}</Typography>
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
            {courseTitle}
          </Typography>

          {/* Progress pill */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.08)', px: 1.5, py: 0.5, borderRadius: '20px' }}>
            <LinearProgress variant="determinate" value={progress} sx={{ width: 80, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: '#ffa424' } }} />
            <Typography variant="caption" sx={{ color: '#ffa424', fontWeight: 600 }}>{progress}%</Typography>
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
          <Box
            onClick={togglePlayPause}
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%',
              background: '#000',
              cursor: 'pointer',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {/* Actual video element */}
            <video
              ref={videoRef}
              src="/video/Course_player.m4v"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                background: '#000',
              }}
            />

            {/* Play Button Overlay — hidden when playing */}
            {!isPlaying && (
              <>
                {/* Decorative grid */}
                <Box sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none',
                }} />

                {/* Play Button */}
                <Box
                  className="cp-play-btn"
                  sx={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80, height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,164,36,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 30px rgba(255,164,36,0.4)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': { transform: 'translate(-50%, -50%) scale(1.12)', boxShadow: '0 6px 40px rgba(255,164,36,0.6)' },
                    pointerEvents: 'none',
                  }}
                >
                  <PlayIcon sx={{ fontSize: 44, color: '#fff', ml: 0.5 }} />
                </Box>

                {/* Bottom gradient with lesson info */}
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2.5, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))', pointerEvents: 'none' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                    Module {modules.findIndex(m => m.lessons.some(l => l.id === activeLessonId)) + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mt: 0.25 }}>{activeLesson.title}</Typography>
                </Box>

                {/* Duration chip */}
                <Chip
                  icon={<TimeIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
                  label={activeLesson.duration}
                  size="small"
                  sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(6px)', fontSize: '0.75rem', pointerEvents: 'none' }}
                />
              </>
            )}
          </Box>

          {/* Lesson Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, md: 3 }, py: 1.5, bgcolor: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
            <Button
              startIcon={<PrevIcon />}
              disabled={activeLessonIndex <= 0}
              onClick={() => activeLessonIndex > 0 && goToLesson(allLessons[activeLessonIndex - 1].id)}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
            >
              Previous
            </Button>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Lesson {activeLessonIndex + 1} of {totalLessons}
            </Typography>
            <Button
              endIcon={<NextIcon />}
              disabled={activeLessonIndex >= totalLessons - 1}
              onClick={() => activeLessonIndex < totalLessons - 1 && goToLesson(allLessons[activeLessonIndex + 1].id)}
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 600, color: '#fff' }}
            >
              Next
            </Button>
          </Box>

          {/* Mark Complete + Lesson Title */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, bgcolor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flexShrink: 0 }}>
            <Button
              variant={completedLessons.includes(activeLessonId) ? 'contained' : 'outlined'}
              startIcon={<CheckIcon />}
              onClick={() => toggleComplete(activeLessonId)}
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 600,
                bgcolor: completedLessons.includes(activeLessonId) ? '#10b981' : 'transparent',
                borderColor: completedLessons.includes(activeLessonId) ? '#10b981' : '#d1d5db',
                color: completedLessons.includes(activeLessonId) ? '#fff' : 'text.secondary',
                '&:hover': { bgcolor: completedLessons.includes(activeLessonId) ? '#059669' : 'rgba(0,0,0,0.04)', borderColor: completedLessons.includes(activeLessonId) ? '#059669' : '#d1d5db' },
              }}
            >
              {completedLessons.includes(activeLessonId) ? 'Completed' : 'Mark Complete'}
            </Button>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700}>{activeLesson.title}</Typography>
              <Typography variant="body2" color="text.secondary">{instructorName}</Typography>
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
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>About this lesson</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                  In this lesson, we'll explore the Render Props pattern — one of the most powerful techniques for sharing
                  logic between React components. You'll learn how to create flexible, reusable components that can adapt
                  their rendering based on the consumer's needs. We'll cover real-world use cases, performance
                  considerations, and how this pattern compares to custom hooks.
                </Typography>

                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>Key Takeaways</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {['Understand the render props pattern and when to use it',
                    'Build reusable components with flexible rendering',
                    'Compare render props vs hooks for code sharing',
                    'Optimize performance with memoization techniques',
                  ].map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckIcon sx={{ fontSize: 18, color: '#10b981', mt: 0.3 }} />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* ── Notes ── */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  <TextField
                    fullWidth size="small"
                    placeholder="Add a note for this lesson..."
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
                          <Typography variant="caption" color="text.secondary">{note.lessonTitle}</Typography>
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
                    placeholder="Ask a question about this lesson..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  <Button variant="contained" startIcon={<SendIcon />} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, px: 3, whiteSpace: 'nowrap', color: '#fff' }}>Ask</Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {sampleQuestions.map(q => (
                    <Box key={q.id} sx={{ p: 2, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', '&:hover': { borderColor: '#ffa424' }, transition: 'border-color 0.2s' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#ffa424' }}>{q.author[0]}</Avatar>
                        <Typography variant="body2" fontWeight={600}>{q.author}</Typography>
                        <Typography variant="caption" color="text.secondary">· {q.time}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1.5 }}>{q.text}</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button size="small" startIcon={<LikeIcon />} sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>{q.votes}</Button>
                        <Button size="small" sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8rem' }}>{q.replies} replies</Button>
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

export default CoursePlayerPage;
