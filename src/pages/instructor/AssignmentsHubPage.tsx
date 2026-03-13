import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  AppBar,
  IconButton,
} from '@mui/material';
import {
  Task as AssignmentsIcon,
  Settings as ConfigureIcon,
  Add as AddIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { useSessions, useCourses } from '../../hooks/useCatalogue';
import { useAuth } from '../../hooks/useAuth';
import type { Session } from '../../types/types';
import type { CourseList } from '../../types/types';

const AssignmentsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: sessionsData, isLoading: sessionsLoading } = useSessions(
    user?.id ? { type: 'assignment' } : undefined
  );
  const { data: coursesData } = useCourses(user?.id ? { instructor: user.id } : undefined);

  const assignmentSessions = (sessionsData ?? []) as Session[];
  const courses = (coursesData?.results ?? []) as CourseList[];
  const courseTitleById = Object.fromEntries(courses.map((c) => [c.id, c.title]));

  const handleConfigure = (session: Session) => {
    const courseTitle = courseTitleById[session.course] ?? 'Course';
    navigate(
      `/instructor/assignment/create?sessionId=${session.id}&courseId=${session.course}&course=${encodeURIComponent(courseTitle)}`
    );
  };

  const handleGoToCourseStructure = () => {
    navigate('/instructor/courses');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

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
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { md: `${DRAWER_WIDTH}px` },
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ minHeight: '72px !important' }}>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' }, color: 'text.secondary', mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>
              Assignments
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        {sessionsLoading && (
          <LinearProgress sx={{ position: 'sticky', top: 0, zIndex: 1 }} />
        )}

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto', width: '100%' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Assignments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure assignment instructions, due dates, rubrics, and publish. Assignments are created from Course Structure.
            </Typography>
          </Box>

          {assignmentSessions.length > 0 ? (
            <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              <List disablePadding>
                {assignmentSessions.map((session) => (
                  <ListItem key={session.id} disablePadding divider>
                    <ListItemButton
                      onClick={() => handleConfigure(session)}
                      sx={{ py: 2, px: 3 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ListItemText
                          primary={session.title || 'Untitled assignment'}
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondary={courseTitleById[session.course] ?? `Course #${session.course}`}
                          secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                        />
                      </Box>
                      <Chip
                        size="small"
                        label={session.status === 'published' ? 'Published' : 'Draft'}
                        sx={{
                          bgcolor: session.status === 'published' ? 'success.light' : 'grey.200',
                          color: session.status === 'published' ? 'success.dark' : 'text.secondary',
                          fontWeight: 500,
                        }}
                      />
                      <ConfigureIcon sx={{ ml: 1, color: 'text.secondary', fontSize: 20 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
              }}
            >
              <AssignmentsIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                No assignments yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Assignments are session-based. Add an assignment from a course structure, then configure it here.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleGoToCourseStructure}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Go to My Courses
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentsHubPage;
