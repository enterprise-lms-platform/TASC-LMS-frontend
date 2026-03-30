import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Button,
  Chip,
  LinearProgress,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  MenuBook as CoursesIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  People as PeopleIcon,
  PlayCircle as LessonsIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  Send as SubmitIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import { useCourses, useSubmitCourseForApproval, useRequestCourseDeletion } from '../../hooks/useCatalogue';
import { useAuth } from '../../hooks/useAuth';
import type { CourseList } from '../../types/types';

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  published: { bg: '#d1fae5', color: '#059669', label: 'Published' },
  draft: { bg: '#fef3c7', color: '#d97706', label: 'Draft' },
  pending_approval: { bg: '#dbeafe', color: '#2563eb', label: 'Pending Approval' },
  approved: { bg: '#d1fae5', color: '#0d9488', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
  pending_deletion: { bg: '#ffedd5', color: '#ea580c', label: 'Pending Deletion' },
  archived: { bg: '#e5e7eb', color: '#6b7280', label: 'Archived' },
};

const formatDateLabel = (iso?: string | null): string => {
  if (!iso) return '\u2014';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '\u2014';
  }
};

const InstructorCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuCourse, setMenuCourse] = useState<CourseList | null>(null);

  // Confirmation dialogs
  const [submitDialog, setSubmitDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  // Fetch instructor's courses from API
  const { data, isLoading, isError } = useCourses(
    user?.id ? { instructor: user.id } : undefined,
  );
  const courses: CourseList[] = data?.results ?? [];

  // Mutations
  const submitForApproval = useSubmitCourseForApproval();
  const requestDeletion = useRequestCourseDeletion();

  // Tab filtering
  const tabFilters: (string | null)[] = [null, 'published', 'draft', 'pending_approval', 'rejected', 'archived'];
  const statusFilter = tabFilters[tab] ?? null;
  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countByStatus = (status: string) => courses.filter((c) => c.status === status).length;

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, course: CourseList) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuCourse(course);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuCourse(null);
  };

  const handleSubmitForApproval = async () => {
    if (!menuCourse) return;
    setSubmitDialog(false);
    try {
      await submitForApproval.mutateAsync(menuCourse.id);
      setSnackbar({ open: true, message: 'Course submitted for approval', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to submit course for approval', severity: 'error' });
    }
    closeMenu();
  };

  const handleRequestDeletion = async () => {
    if (!menuCourse) return;
    setDeleteDialog(false);
    try {
      await requestDeletion.mutateAsync(menuCourse.id);
      setSnackbar({ open: true, message: 'Deletion request submitted for approval', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to request course deletion', severity: 'error' });
    }
    closeMenu();
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CoursesIcon sx={{ color: 'primary.main' }} />
              My Courses
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/instructor/course/create')}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Create Course
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {isLoading && (
            <Box sx={{ mb: 3 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Loading courses...
              </Typography>
            </Box>
          )}

          {isError && (
            <Typography color="error.main" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
              Failed to load courses. Please try again.
            </Typography>
          )}

          {/* Search & Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              overflow: 'hidden',
              mb: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
            }}
          >
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 280 }}
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">{filtered.length} courses</Typography>
            </Box>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}
            >
              <Tab label={`All (${courses.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Published (${countByStatus('published')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Drafts (${countByStatus('draft')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Pending (${countByStatus('pending_approval')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Rejected (${countByStatus('rejected')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Archived (${countByStatus('archived')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Paper>

          {/* Course Grid */}
          <Grid container spacing={2}>
            {filtered.map((course) => {
              const statusInfo = statusColors[course.status] ?? statusColors.archived;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
                      transition: 'box-shadow 0.3s, transform 0.2s',
                      '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' },
                    }}
                    onClick={() => navigate(`/instructor/course/${course.id}/structure`)}
                  >
                    <Box sx={{ height: 140, bgcolor: 'grey.200', position: 'relative', overflow: 'hidden' }}>
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>
                            {course.title[0]}
                          </Avatar>
                        </Box>
                      )}
                      <Chip
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: statusInfo.bg,
                          color: statusInfo.color,
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body1" fontWeight={700} noWrap>{course.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{course.category?.name ?? '\u2014'}</Typography>
                        </Box>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, course)}>
                          <MoreIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Rejection reason banner */}
                      {course.status === 'rejected' && course.rejection_reason && (
                        <Tooltip title={course.rejection_reason} arrow>
                          <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 0.5, mb: 1,
                            p: 1, borderRadius: 1, bgcolor: '#fee2e2',
                          }}>
                            <WarningIcon sx={{ fontSize: 14, color: '#dc2626' }} />
                            <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 500 }} noWrap>
                              {course.rejection_reason}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}

                      <Box sx={{ display: 'flex', gap: 2, mb: 1.5, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 16 }} /> {course.enrollment_count}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LessonsIcon sx={{ fontSize: 16 }} /> {course.total_sessions ?? 0}
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1.5, display: 'block' }}>
                        {course.published_at ? `Published ${formatDateLabel(course.published_at)}` : '\u2014'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* Context Menu */}
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem onClick={() => { closeMenu(); if (menuCourse) navigate(`/instructor/course/${menuCourse.id}/edit`); }}>
              <EditIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Edit Course
            </MenuItem>
            <MenuItem onClick={() => { closeMenu(); if (menuCourse) navigate(`/instructor/course/${menuCourse.id}/preview`); }}>
              <ViewIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Preview
            </MenuItem>
            <MenuItem onClick={() => closeMenu()}>
              <DuplicateIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Duplicate
            </MenuItem>

            {/* Submit for Approval — only for draft or rejected courses */}
            {menuCourse && (menuCourse.status === 'draft' || menuCourse.status === 'rejected') && (
              <MenuItem onClick={() => setSubmitDialog(true)}>
                <SubmitIcon sx={{ fontSize: 18, mr: 1.5, color: '#2563eb' }} />
                <Typography sx={{ color: '#2563eb' }}>Submit for Approval</Typography>
              </MenuItem>
            )}

            {/* Request Deletion — only for published courses */}
            {menuCourse && menuCourse.status === 'published' && (
              <MenuItem onClick={() => setDeleteDialog(true)} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ fontSize: 18, mr: 1.5 }} /> Request Deletion
              </MenuItem>
            )}

            {/* Direct delete — only for draft courses */}
            {menuCourse && menuCourse.status === 'draft' && (
              <MenuItem onClick={() => closeMenu()} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ fontSize: 18, mr: 1.5 }} /> Delete Draft
              </MenuItem>
            )}
          </Menu>

          {/* Submit for Approval Dialog */}
          <Dialog open={submitDialog} onClose={() => { setSubmitDialog(false); closeMenu(); }}>
            <DialogTitle>Submit for Approval</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to submit <strong>{menuCourse?.title}</strong> for review?
                An LMS Manager or Super Admin will review your course before it can be published.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setSubmitDialog(false); closeMenu(); }} sx={{ textTransform: 'none' }}>Cancel</Button>
              <Button
                onClick={handleSubmitForApproval}
                variant="contained"
                disabled={submitForApproval.isPending}
                sx={{ textTransform: 'none', bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                {submitForApproval.isPending ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Request Deletion Dialog */}
          <Dialog open={deleteDialog} onClose={() => { setDeleteDialog(false); closeMenu(); }}>
            <DialogTitle>Request Course Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to request deletion of <strong>{menuCourse?.title}</strong>?
                This requires approval from an LMS Manager or Super Admin before the course is removed.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setDeleteDialog(false); closeMenu(); }} sx={{ textTransform: 'none' }}>Cancel</Button>
              <Button
                onClick={handleRequestDeletion}
                variant="contained"
                color="error"
                disabled={requestDeletion.isPending}
                sx={{ textTransform: 'none' }}
              >
                {requestDeletion.isPending ? 'Submitting...' : 'Request Deletion'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorCoursesPage;
