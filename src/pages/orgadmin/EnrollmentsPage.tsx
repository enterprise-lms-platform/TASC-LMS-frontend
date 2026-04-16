import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import { PersonAdd as EnrollIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgEnrollments, useOrgAdminMembers, useOrgCourses, useEnrollMember } from '../../hooks/useOrgAdmin';
import type { CourseList } from '../../types/types';
import type { ManagerMemberItem } from '../../services/organization.services';

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

interface Enrollment {
  id: number;
  user: { id: number; name: string; email: string };
  course: { id: number; title: string };
  progress_percentage: number;
  status: 'enrolled' | 'completed' | 'in_progress';
  enrolled_at: string;
}

const EnrollmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<number | ''>('');
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [enrolling, setEnrolling] = useState(false);

  const { data: enrollmentsData, isLoading } = useOrgEnrollments({ page_size: 20 });
  const { data: membersData } = useOrgAdminMembers({ page_size: 200 });
  const { data: coursesData } = useOrgCourses({ page_size: 200 });
  const enrollMember = useEnrollMember();

  const members: ManagerMemberItem[] = membersData?.results ?? [];
  const courses: CourseList[] = coursesData?.results ?? [];
  const enrollments: Enrollment[] = (enrollmentsData as unknown as { results?: Enrollment[] })?.results ?? [];

  const filteredEnrollments = enrollments.filter((e) =>
    search ? e.user.name.toLowerCase().includes(search.toLowerCase()) || e.user.email.toLowerCase().includes(search.toLowerCase()) : true
  );

  const handleEnroll = () => {
    if (!selectedMember || !selectedCourse) return;
    setEnrolling(true);
    enrollMember.mutate(
      { user: selectedMember, course: selectedCourse },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Member enrolled successfully', severity: 'success' });
          setDialogOpen(false);
          setSelectedMember('');
          setSelectedCourse('');
          setEnrolling(false);
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Failed to enroll member', severity: 'error' });
          setEnrolling(false);
        },
      }
    );
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" size="small" sx={{ bgcolor: '#dcfce7', color: '#10b981', fontWeight: 600 }} />;
      case 'in_progress':
        return <Chip label="In Progress" size="small" sx={{ bgcolor: '#fff3e0', color: '#f59e0b', fontWeight: 600 }} />;
      default:
        return <Chip label="Enrolled" size="small" sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: '#6366f1', fontWeight: 600 }} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Enrollments" />

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
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <TextField
                size="small"
                placeholder="Search by member name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: '100%', sm: 300 } }}
              />
              <Button
                variant="contained"
                startIcon={<EnrollIcon />}
                onClick={() => setDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
              >
                Enroll Member
              </Button>
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={56} sx={{ mb: 1 }} />
                ))}
              </Box>
            ) : filteredEnrollments.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No enrollments yet
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Member</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enrolled Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {enrollment.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {enrollment.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{enrollment.course.title}</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={enrollment.progress_percentage}
                              sx={{ flex: 1, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
                              {enrollment.progress_percentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(enrollment.status)}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(enrollment.enrolled_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enroll Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Member</InputLabel>
              <Select value={selectedMember} label="Member" onChange={(e) => setSelectedMember(e.target.value as number)}>
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select value={selectedCourse} label="Course" onChange={(e) => setSelectedCourse(e.target.value as number)}>
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEnroll} disabled={!selectedMember || !selectedCourse || enrollMember.isPending}>
            {enrolling ? 'Enrolling...' : 'Enroll'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EnrollmentsPage;