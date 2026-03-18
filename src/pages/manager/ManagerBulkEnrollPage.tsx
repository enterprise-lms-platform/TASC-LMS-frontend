import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  GroupWork as GroupWorkIcon,
  CloudUpload as UploadIcon,
  PersonSearch as SelectUsersIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { courseApi } from '../../services/main.api';

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

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

interface BulkEnrollmentHistory {
  id: number;
  course: string;
  learnersEnrolled: number;
  enrolledBy: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const mockHistory: BulkEnrollmentHistory[] = [
  { id: 1, course: 'Advanced React Patterns', learnersEnrolled: 45, enrolledBy: 'Admin User', date: 'Mar 5, 2026', status: 'Completed' },
  { id: 2, course: 'Python for Data Science', learnersEnrolled: 32, enrolledBy: 'Sarah Chen', date: 'Feb 28, 2026', status: 'Completed' },
  { id: 3, course: 'AWS Solutions Architect', learnersEnrolled: 28, enrolledBy: 'Admin User', date: 'Feb 20, 2026', status: 'Completed' },
  { id: 4, course: 'Machine Learning Fundamentals', learnersEnrolled: 51, enrolledBy: 'James Wilson', date: 'Feb 15, 2026', status: 'Pending' },
  { id: 5, course: 'Docker & Kubernetes', learnersEnrolled: 18, enrolledBy: 'Admin User', date: 'Feb 10, 2026', status: 'Failed' },
];

const statusChipColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Pending': return 'warning';
    case 'Failed': return 'error';
    default: return 'default';
  }
};

// ─── Component ─────────────────────────────────────────────

const ManagerBulkEnrollPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [learnerMethod, setLearnerMethod] = useState('csv');
  const [sendNotification, setSendNotification] = useState(true);
  const [setStartDate, setSetStartDate] = useState(false);
  const [grantCertificate, setGrantCertificate] = useState(true);

  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'bulk-enroll'],
    queryFn: () => courseApi.getAll({ limit: 100 }).then(r => r.data),
  });

  const courses = coursesData?.results ?? [];

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
          {/* Page Header */}
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
                color: 'white',
              }}
            >
              <GroupWorkIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Bulk Enrollment</Typography>
              <Typography variant="body2" color="text.secondary">Enroll multiple learners at once</Typography>
            </Box>
          </Box>

          {/* Steps Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Step 1: Select Course */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffa424, #f97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      1
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>Select Course</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose the course you want to enroll learners into.
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      label="Course"
                    >
                      {!selectedCourse && <MenuItem value="" disabled>Select a course...</MenuItem>}
                      {courses.map((c) => (
                        <MenuItem key={c.id} value={c.id.toString()}>
                          {c.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Paper>
            </Grid>

            {/* Step 2: Add Learners */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffa424, #f97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      2
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>Add Learners</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose how you would like to add learners for enrollment.
                  </Typography>
                  <RadioGroup value={learnerMethod} onChange={(e) => setLearnerMethod(e.target.value)}>
                    <FormControlLabel
                      value="csv"
                      control={<Radio sx={{ color: '#ffa424', '&.Mui-checked': { color: '#ffa424' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <UploadIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                          <Typography variant="body2">Upload CSV file</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="select"
                      control={<Radio sx={{ color: '#ffa424', '&.Mui-checked': { color: '#ffa424' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SelectUsersIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                          <Typography variant="body2">Select from user list</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>

                  {learnerMethod === 'csv' && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 3,
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: '12px',
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: '#ffa424' },
                      }}
                    >
                      <UploadIcon sx={{ fontSize: 36, color: '#d1d5db', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Drag & drop a CSV file here, or click to browse
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        Accepted format: .csv (max 5MB)
                      </Typography>
                    </Box>
                  )}

                  {learnerMethod === 'select' && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 3,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: '12px',
                        textAlign: 'center',
                        bgcolor: 'grey.50',
                      }}
                    >
                      <SelectUsersIcon sx={{ fontSize: 36, color: '#d1d5db', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        User selection panel will load here
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        Search and select users from the organization directory
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Step 3: Enrollment Options */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffa424, #f97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      3
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>Enrollment Options</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={sendNotification}
                            onChange={(e) => setSendNotification(e.target.checked)}
                            sx={{ color: '#ffa424', '&.Mui-checked': { color: '#ffa424' } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>Send notification email</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Notify learners about their enrollment via email
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={setStartDate}
                            onChange={(e) => setSetStartDate(e.target.checked)}
                            sx={{ color: '#ffa424', '&.Mui-checked': { color: '#ffa424' } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>Set start date</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Schedule enrollment to begin on a specific date
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={grantCertificate}
                            onChange={(e) => setGrantCertificate(e.target.checked)}
                            sx={{ color: '#ffa424', '&.Mui-checked': { color: '#ffa424' } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600}>Grant certificate on completion</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Automatically issue certificate when course is completed
                            </Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, #ffa424, #f97316)',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '10px',
                        px: 4,
                        boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                        '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
                      }}
                    >
                      Enroll Learners
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Step 4: Enrollment History */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ffa424, #f97316)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  4
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>Enrollment History</Typography>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Learners Enrolled</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Enrolled By</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockHistory.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{row.course}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{row.learnersEnrolled}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.enrolledBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{row.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          color={statusChipColor(row.status) as any}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerBulkEnrollPage;
