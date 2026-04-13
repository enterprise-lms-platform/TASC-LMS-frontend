import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, GroupAdd as BulkEnrollIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgAdminMembers, useOrgCourses, useBulkEnrollMembers } from '../../hooks/useOrgAdmin';
import type { CourseList, ManagerMemberItem } from '../../types/types';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const BulkEnrollPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: membersData } = useOrgAdminMembers({ page_size: 200 });
  const { data: coursesData } = useOrgCourses({ page_size: 200 });
  const bulkEnroll = useBulkEnrollMembers();

  const members: ManagerMemberItem[] = membersData?.results ?? [];
  const courses: CourseList[] = coursesData?.results ?? [];

  const filteredMembers = members.filter(
    (m) => memberSearch === '' || m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const selectedCourseName = courses.find((c) => c.id === selectedCourse)?.title ?? '';

  const handleEnrollAll = () => {
    if (!selectedCourse || selectedMembers.length === 0) return;

    setProgress({ current: 0, total: selectedMembers.length });

    bulkEnroll.mutate(
      { courseId: selectedCourse, memberIds: selectedMembers },
      {
        onSuccess: (results) => {
          setSnackbar({
            open: true,
            message: `Enrolled ${results.enrolled} member${results.enrolled !== 1 ? 's' : ''}${results.failed > 0 ? `, ${results.failed} failed` : ''}`,
            severity: results.failed > 0 ? 'error' : 'success',
          });
          setSelectedMembers([]);
          setSelectedCourse('');
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Bulk enrollment failed', severity: 'error' });
        },
      }
    );
  };

  React.useEffect(() => {
    if (bulkEnroll.isPending && bulkEnroll.variables) {
      const current = Math.min(bulkEnroll.variables.memberIds.length, progress.current + 1);
      setProgress({ current, total: bulkEnroll.variables.memberIds.length });
    }
  }, [bulkEnroll.isPending]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Bulk Enroll" />

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
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Step 1: Select a Course
                </Typography>
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
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3, minHeight: 200 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Step 2: Select Members
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search members..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  sx={{ mb: 2 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel>Members</InputLabel>
                  <Select
                    multiple
                    value={selectedMembers}
                    label="Members"
                    renderValue={(selected) => `${selected.length} selected`}
                    onChange={(e) => setSelectedMembers(e.target.value as number[])}
                  >
                    {filteredMembers.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        <Checkbox checked={selectedMembers.includes(m.id)} />
                        <ListItemText primary={m.name} secondary={m.email} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  Step 3: Preview & Confirm
                </Typography>
                {selectedCourse && selectedMembers.length > 0 ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Course:</strong> {selectedCourseName}
                      <br />
                      <strong>Members to enroll:</strong> {selectedMembers.length}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<BulkEnrollIcon />}
                      onClick={handleEnrollAll}
                      disabled={bulkEnroll.isPending}
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
                    >
                      {bulkEnroll.isPending ? 'Enrolling...' : `Enroll ${selectedMembers.length} Member${selectedMembers.length > 1 ? 's' : ''}`}
                    </Button>
                    {enrolling && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Enrolling {progress.current} of {progress.total}...
                        </Typography>
                        <LinearProgress variant="determinate" value={(progress.current / progress.total) * 100} />
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Select a course and members to continue
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkEnrollPage;