import { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  CreateNewFolder as CreateNewIcon,
  FileCopy as FileCopyIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
  AccountTree as StructureIcon,
  CloudUpload as UploadIcon,
  Quiz as QuizIcon,
  Visibility as PreviewIcon,
  CalendarMonth as ScheduleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { courseApi } from '../../services/main.api';
import type { CourseList } from '../../types/types';

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

// ─── Quick Start Options ───────────────────────────────────

interface QuickStartOption {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: 'navigate' | 'disabled';
  path?: string;
  comingSoon?: boolean;
}

const quickStartOptions: QuickStartOption[] = [
  {
    title: 'From Scratch',
    description: 'Build a course step by step',
    icon: <CreateNewIcon sx={{ fontSize: 40, color: '#ffa424' }} />,
    action: 'navigate',
    path: '/manager/courses/create',
  },
  {
    title: 'From Template',
    description: 'Start from a pre-built template',
    icon: <FileCopyIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
    action: 'disabled',
    comingSoon: true,
  },
  {
    title: 'Import SCORM',
    description: 'Import an existing SCORM package',
    icon: <CloudUploadIcon sx={{ fontSize: 40, color: '#10b981' }} />,
    action: 'disabled',
    comingSoon: true,
  },
];

// ─── Helpers ───────────────────────────────────────────────

const getDisplayStatus = (status: string): string => {
  if (status === 'published') return 'Published';
  if (status === 'pending_approval') return 'In Review';
  if (status === 'approved') return 'Approved';
  if (status === 'rejected') return 'Rejected';
  if (status === 'archived') return 'Archived';
  return 'Draft';
};

const getStatusChipSx = (status: string) => {
  switch (status) {
    case 'Published':
      return { bgcolor: 'rgba(16,185,129,0.1)', color: '#059669' };
    case 'Approved':
      return { bgcolor: 'rgba(59,130,246,0.1)', color: '#2563eb' };
    case 'Draft':
      return { bgcolor: 'rgba(158,158,158,0.1)', color: '#757575' };
    case 'In Review':
      return { bgcolor: 'rgba(245,158,11,0.1)', color: '#d97706' };
    case 'Rejected':
      return { bgcolor: 'rgba(239,68,68,0.1)', color: '#dc2626' };
    default:
      return { bgcolor: 'rgba(158,158,158,0.1)', color: '#757575' };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Status tabs ──────────────────────────────────────────

type CourseTab = 'all' | 'draft' | 'pending_approval' | 'published' | 'rejected';

const tabFilters: { label: string; value: CourseTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Drafts', value: 'draft' },
  { label: 'In Review', value: 'pending_approval' },
  { label: 'Published', value: 'published' },
  { label: 'Rejected', value: 'rejected' },
];

// ─── Course action buttons ────────────────────────────────

const courseActions = [
  { icon: <EditIcon fontSize="small" />, label: 'Edit', suffix: 'edit' },
  { icon: <StructureIcon fontSize="small" />, label: 'Structure', suffix: 'structure' },
  { icon: <UploadIcon fontSize="small" />, label: 'Upload', suffix: 'upload' },
  { icon: <QuizIcon fontSize="small" />, label: 'Quiz Builder', suffix: 'quiz/builder' },
  { icon: <PreviewIcon fontSize="small" />, label: 'Preview', suffix: 'preview' },
];

// ─── Component ─────────────────────────────────────────────

const ManagerCreateCoursePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CourseTab>('all');
  const navigate = useNavigate();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', 'manager', 'all'],
    queryFn: () => courseApi.getAll().then(r => r.data),
  });

  const allCourses: CourseList[] = coursesData?.results ?? (Array.isArray(coursesData) ? coursesData : []);

  const filteredCourses = useMemo(() => {
    if (activeTab === 'all') return allCourses;
    return allCourses.filter(c => c.status === activeTab);
  }, [allCourses, activeTab]);

  const tabCounts = useMemo(() => ({
    all: allCourses.length,
    draft: allCourses.filter(c => c.status === 'draft').length,
    pending_approval: allCourses.filter(c => c.status === 'pending_approval').length,
    published: allCourses.filter(c => c.status === 'published').length,
    rejected: allCourses.filter(c => c.status === 'rejected').length,
  }), [allCourses]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* ── Page Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddCircleIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Course Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create, edit, and manage your courses
              </Typography>
            </Box>
          </Box>

          {/* ── Quick Start Cards ── */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Quick Start
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickStartOptions.map((option) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={option.title}>
                <Paper
                  elevation={0}
                  sx={{
                    ...cardSx,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    cursor: option.action === 'disabled' ? 'default' : 'pointer',
                    opacity: option.action === 'disabled' ? 0.7 : 1,
                    '&:hover': option.action === 'navigate'
                      ? { transform: 'translateY(-4px)', boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' }
                      : {},
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      bgcolor: 'rgba(255,164,36,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {option.icon}
                  </Box>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {option.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {option.description}
                  </Typography>

                  {option.comingSoon && (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: '6px',
                        bgcolor: 'rgba(158,158,158,0.1)',
                        color: '#757575',
                      }}
                    />
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={option.action === 'disabled'}
                    onClick={() => {
                      if (option.action === 'navigate' && option.path) {
                        navigate(option.path);
                      }
                    }}
                    sx={{
                      mt: 'auto',
                      borderRadius: '10px',
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: option.action === 'disabled' ? undefined : 'linear-gradient(135deg, #ffa424, #f97316)',
                      boxShadow: option.action === 'disabled' ? undefined : '0 4px 12px rgba(255,164,36,0.3)',
                      '&:hover': option.action === 'disabled' ? {} : {
                        background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                        boxShadow: '0 6px 16px rgba(255,164,36,0.4)',
                      },
                    }}
                  >
                    {option.action === 'navigate' ? 'Get Started' : 'Coming Soon'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ── Quick Tools ── */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Quick Tools
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { icon: <QuizIcon />, label: 'Quiz Builder', path: '/manager/courses', color: '#ffa424', note: 'Select a course first' },
              { icon: <UploadIcon />, label: 'Upload Content', path: '/manager/courses', color: '#10b981', note: 'Select a course first' },
              { icon: <AssignmentIcon />, label: 'Create Assignment', path: '/manager/assignment/create', color: '#8b5cf6' },
              { icon: <ScheduleIcon />, label: 'Schedule Session', path: '/manager/sessions/schedule', color: '#3b82f6' },
            ].map((tool) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={tool.label}>
                <Paper
                  elevation={0}
                  onClick={() => navigate(tool.path)}
                  sx={{
                    ...cardSx,
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: `${tool.color}14`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tool.color,
                    }}
                  >
                    {tool.icon}
                  </Box>
                  <Typography variant="body2" fontWeight={600}>{tool.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ── My Courses ── */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>My Courses</Typography>
              <Button
                size="small"
                onClick={() => navigate('/manager/courses')}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#ffa424' }}
              >
                View All Courses
              </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 44 },
                  '& .Mui-selected': { color: '#ffa424' },
                  '& .MuiTabs-indicator': { backgroundColor: '#ffa424' },
                }}
              >
                {tabFilters.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>{tab.label}</span>
                        <Chip
                          label={tabCounts[tab.value]}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: activeTab === tab.value ? 'rgba(255,164,36,0.1)' : 'rgba(0,0,0,0.06)',
                            color: activeTab === tab.value ? '#ffa424' : 'text.secondary',
                          }}
                        />
                      </Stack>
                    }
                  />
                ))}
              </Tabs>
            </Box>

            <Box>
              {isLoading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={28} />
                </Box>
              ) : filteredCourses.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {activeTab === 'all'
                      ? 'No courses yet. Create your first one above!'
                      : `No ${tabFilters.find(t => t.value === activeTab)?.label.toLowerCase()} courses.`}
                  </Typography>
                </Box>
              ) : (
                filteredCourses.map((course, i) => {
                  const displayStatus = getDisplayStatus(course.status);
                  return (
                    <Box
                      key={course.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        px: 3,
                        borderBottom: i < filteredCourses.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' },
                        transition: 'background 0.15s',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Course info */}
                      <Box
                        sx={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                        onClick={() => navigate(`/manager/courses/${course.id}`)}
                      >
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {course.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {course.category?.name || 'Uncategorized'}
                          {course.total_sessions ? ` · ${course.total_sessions} sessions` : ''}
                        </Typography>
                      </Box>

                      {/* Status chip */}
                      <Chip
                        label={displayStatus}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          borderRadius: '6px',
                          ...getStatusChipSx(displayStatus),
                        }}
                      />

                      {/* Quick action buttons */}
                      <Stack direction="row" spacing={0.5}>
                        {courseActions.map((action) => (
                          <Tooltip key={action.suffix} title={action.label} arrow>
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/manager/courses/${course.id}/${action.suffix}`)}
                              sx={{
                                color: 'text.secondary',
                                '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                              }}
                            >
                              {action.icon}
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Stack>

                      {/* Date */}
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90, textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        {course.published_at ? formatDate(course.published_at) : '—'}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerCreateCoursePage;
