import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Button,
  Chip,
  LinearProgress,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Gavel as ApprovalIcon,
  Person as PersonIcon,
  CalendarMonth as DateIcon,
  Category as TypeIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ManagerSidebar, { DRAWER_WIDTH as MANAGER_DRAWER_WIDTH } from '../components/manager/Sidebar';
import SuperadminSidebar from '../components/superadmin/Sidebar';

const SUPERADMIN_DRAWER_WIDTH = 280;
import { useApprovalRequest, useCourse } from '../hooks/useCatalogue';
import ApprovalActions from '../components/manager/ApprovalActions';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#dbeafe', color: '#2563eb', label: 'Pending Review' },
  approved: { bg: '#d1fae5', color: '#059669', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
};

const typeLabels: Record<string, string> = {
  create: 'New Course Submission',
  edit: 'Course Edit Request',
  delete: 'Course Deletion Request',
};

const formatDate = (iso?: string | null): string => {
  if (!iso) return '\u2014';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const CourseApprovalDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestId } = useParams<{ requestId: string }>();
  const isManager = location.pathname.startsWith('/manager');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const id = Number(requestId);
  const { data: request, isLoading: requestLoading } = useApprovalRequest(id);
  const { data: course, isLoading: courseLoading } = useCourse(request?.course ?? 0, { enabled: !!request?.course });

  const isLoading = requestLoading || courseLoading;
  const backPath = isManager ? '/manager/approvals' : '/superadmin/approvals';
  const drawerWidth = isManager ? MANAGER_DRAWER_WIDTH : SUPERADMIN_DRAWER_WIDTH;
  const status = statusConfig[request?.status ?? 'pending'] ?? statusConfig.pending;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      {isManager ? (
        <ManagerSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      ) : (
        <SuperadminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      )}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { lg: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate(backPath)} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back to Approvals
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ApprovalIcon sx={{ color: 'primary.main' }} />
              Review Request
            </Typography>
          </Box>
          {request?.status === 'pending' && (
            <ApprovalActions
              requestId={id}
              onSuccess={() => {
                setSnackbar({ open: true, message: 'Action completed', severity: 'success' });
              }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
          {isLoading && <LinearProgress sx={{ mb: 3 }} />}

          {request && (
            <>
              {/* Request Info Card */}
              <Paper elevation={0} sx={{ borderRadius: '1rem', p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
                    {request.course_title}
                  </Typography>
                  <Chip label={status.label} sx={{ height: 28, fontWeight: 600, bgcolor: status.bg, color: status.color }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {typeLabels[request.request_type] ?? request.request_type}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Submitted by <strong>{request.requested_by_name}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(request.submitted_at)}
                    </Typography>
                  </Box>
                </Box>

                {/* Review info */}
                {request.reviewed_by_name && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: request.status === 'rejected' ? '#fef2f2' : '#f0fdf4' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">
                        Reviewed by {request.reviewed_by_name} on {formatDate(request.reviewed_at)}
                      </Typography>
                      {request.reviewer_comments && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {request.reviewer_comments}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Paper>

              {/* Course Details */}
              {course && (
                <Paper elevation={0} sx={{ borderRadius: '1rem', p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Course Content
                  </Typography>

                  {course.banner && (
                    <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                      <img src={course.banner} alt="Banner" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">Description</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{course.description || 'No description provided.'}</Typography>
                    </Box>

                    {course.prerequisites && (
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Prerequisites</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>{course.prerequisites}</Typography>
                      </Box>
                    )}

                    {course.learning_objectives && (
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Learning Objectives</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>{course.learning_objectives}</Typography>
                      </Box>
                    )}

                    <Divider />

                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Category</Typography>
                        <Typography variant="body2">{course.category?.name ?? '\u2014'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Level</Typography>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{course.level}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Price</Typography>
                        <Typography variant="body2">{course.price === '0.00' ? 'Free' : `$${course.price}`}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">Sessions</Typography>
                        <Typography variant="body2">{course.sessions?.length ?? 0}</Typography>
                      </Box>
                    </Box>

                    {/* Sessions list */}
                    {course.sessions && course.sessions.length > 0 && (
                      <>
                        <Divider />
                        <Typography variant="subtitle2" fontWeight={700}>
                          Course Sessions ({course.sessions.length})
                        </Typography>
                        {course.sessions.map((session, index) => (
                          <Box
                            key={session.id}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                              borderRadius: 1, bgcolor: index % 2 === 0 ? 'grey.50' : 'transparent',
                            }}
                          >
                            <Typography variant="caption" fontWeight={700} sx={{ minWidth: 24, color: 'text.disabled' }}>
                              {index + 1}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600}>{session.title}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                {session.session_type} &middot; {session.duration_minutes} min
                              </Typography>
                            </Box>
                            <Chip
                              label={session.status}
                              size="small"
                              sx={{ height: 20, fontSize: '0.65rem', textTransform: 'capitalize' }}
                            />
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                </Paper>
              )}
            </>
          )}
        </Box>
      </Box>

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
  );
};

export default CourseApprovalDetailPage;
