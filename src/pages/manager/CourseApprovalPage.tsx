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
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Gavel as ApprovalIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerSidebar, { DRAWER_WIDTH as MANAGER_DRAWER_WIDTH } from '../../components/manager/Sidebar';
import SuperadminSidebar from '../../components/superadmin/Sidebar';

const SUPERADMIN_DRAWER_WIDTH = 280;
import { useApprovalRequests } from '../../hooks/useCatalogue';
import ApprovalActions from '../../components/manager/ApprovalActions';
import type { CourseApprovalRequest } from '../../types/types';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#dbeafe', color: '#2563eb', label: 'Pending' },
  approved: { bg: '#d1fae5', color: '#059669', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  create: { label: 'New Course', color: '#059669' },
  edit: { label: 'Course Edit', color: '#2563eb' },
  delete: { label: 'Deletion', color: '#dc2626' },
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
};

const CourseApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isManager = location.pathname.startsWith('/manager');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { data, isLoading, isError } = useApprovalRequests();
  const requests: CourseApprovalRequest[] = data?.results ?? [];

  const tabFilters: (string | null)[] = [null, 'pending', 'approved', 'rejected'];
  const statusFilter = tabFilters[tab] ?? null;

  const filtered = requests.filter((r) => {
    const matchSearch = r.course_title.toLowerCase().includes(search.toLowerCase()) ||
      r.requested_by_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const countByStatus = (status: string) => requests.filter((r) => r.status === status).length;
  const backPath = isManager ? '/manager' : '/superadmin';
  const drawerWidth = isManager ? MANAGER_DRAWER_WIDTH : SUPERADMIN_DRAWER_WIDTH;

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
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ApprovalIcon sx={{ color: 'primary.main' }} />
              Course Approvals
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {isLoading && <LinearProgress sx={{ mb: 3 }} />}

          {isError && (
            <Typography color="error.main" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
              Failed to load approval requests.
            </Typography>
          )}

          {/* Search & Tabs */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem', overflow: 'hidden', mb: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
            }}
          >
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search by course or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 300 }}
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">{filtered.length} requests</Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label={`All (${requests.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Pending (${countByStatus('pending')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Approved (${countByStatus('approved')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Rejected (${countByStatus('rejected')})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Paper>

          {/* Request List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map((request) => {
              const status = statusConfig[request.status] ?? statusConfig.pending;
              const type = typeConfig[request.request_type] ?? typeConfig.create;

              return (
                <Paper
                  key={request.id}
                  elevation={0}
                  sx={{
                    borderRadius: '1rem', p: 3,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s',
                    '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {/* Thumbnail */}
                    <Avatar
                      src={request.course_thumbnail ?? undefined}
                      variant="rounded"
                      sx={{ width: 56, height: 56, bgcolor: 'grey.200', fontSize: '1.2rem', fontWeight: 700 }}
                    >
                      {request.course_title?.[0] ?? 'C'}
                    </Avatar>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                        onClick={() => navigate(`${isManager ? '/manager' : '/superadmin'}/approvals/${request.id}`)}
                      >
                        {request.course_title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {request.requested_by_name} &middot; {formatDate(request.submitted_at)}
                      </Typography>
                    </Box>

                    {/* Type badge */}
                    <Chip
                      label={type.label}
                      size="small"
                      sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: `${type.color}10`, color: type.color }}
                    />

                    {/* Status badge */}
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: status.bg, color: status.color }}
                    />

                    {/* Actions for pending requests */}
                    {request.status === 'pending' && (
                      <ApprovalActions
                        requestId={request.id}
                        onSuccess={() => setSnackbar({ open: true, message: 'Action completed successfully', severity: 'success' })}
                      />
                    )}
                  </Box>

                  {/* Reviewer comments */}
                  {request.reviewer_comments && request.status !== 'pending' && (
                    <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: request.status === 'rejected' ? '#fef2f2' : '#f0fdf4' }}>
                      <Typography variant="caption" fontWeight={600} color="text.secondary">
                        Reviewer: {request.reviewed_by_name ?? 'Unknown'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {request.reviewer_comments}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              );
            })}

            {!isLoading && filtered.length === 0 && (
              <Paper elevation={0} sx={{ borderRadius: '1rem', p: 6, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  No approval requests found
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                  {statusFilter ? `No ${statusFilter} requests match your search.` : 'There are no course approval requests yet.'}
                </Typography>
              </Paper>
            )}
          </Box>
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

export default CourseApprovalPage;
