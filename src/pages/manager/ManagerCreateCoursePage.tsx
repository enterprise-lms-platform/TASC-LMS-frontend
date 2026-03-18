import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  CreateNewFolder as CreateNewIcon,
  FileCopy as FileCopyIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

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

// ─── Mock Data ─────────────────────────────────────────────

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
    path: '/instructor/course/create',
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

interface RecentCourse {
  id: number;
  title: string;
  instructor: string;
  status: 'Published' | 'Draft' | 'In Review';
  date: string;
}

const recentCourses: RecentCourse[] = [
  { id: 1, title: 'Advanced React Patterns', instructor: 'Dr. Sarah Chen', status: 'Published', date: 'Mar 5, 2026' },
  { id: 2, title: 'Machine Learning Fundamentals', instructor: 'James Wilson', status: 'In Review', date: 'Mar 3, 2026' },
  { id: 3, title: 'Cloud Architecture with AWS', instructor: 'Maria Garcia', status: 'Draft', date: 'Feb 28, 2026' },
  { id: 4, title: 'Cybersecurity Essentials', instructor: 'Alex Kim', status: 'Published', date: 'Feb 25, 2026' },
];

const getStatusChipSx = (status: string) => {
  switch (status) {
    case 'Published':
      return { bgcolor: 'rgba(16,185,129,0.1)', color: '#059669' };
    case 'Draft':
      return { bgcolor: 'rgba(158,158,158,0.1)', color: '#757575' };
    case 'In Review':
      return { bgcolor: 'rgba(245,158,11,0.1)', color: '#d97706' };
    default:
      return { bgcolor: 'rgba(158,158,158,0.1)', color: '#757575' };
  }
};

// ─── Component ─────────────────────────────────────────────

const ManagerCreateCoursePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
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
                Create Course
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start building a new course
              </Typography>
            </Box>
          </Box>

          {/* ── Quick Start Cards ── */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Quick Start
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickStartOptions.map((option) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={option.title}>
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

          {/* ── Recent Courses ── */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Recent Courses</Typography>
            </Box>
            <Box>
              {recentCourses.map((course, i) => (
                <Box
                  key={course.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    px: 3,
                    borderBottom: i < recentCourses.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' },
                    transition: 'background 0.15s',
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {course.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.instructor}
                    </Typography>
                  </Box>

                  <Chip
                    label={course.status}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      borderRadius: '6px',
                      ...getStatusChipSx(course.status),
                    }}
                  />

                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100, textAlign: 'right' }}>
                    {course.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerCreateCoursePage;
