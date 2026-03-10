import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/manager/Sidebar';
import TopBar from '../components/manager/TopBar';

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

const kpis = [
  { label: 'Total Enrollments', value: '3,847', bgcolor: '#fff3e0', color: '#7c2d12' },
  { label: 'Active', value: '2,156', bgcolor: '#dcfce7', color: '#14532d' },
  { label: 'Completed', value: '1,248', bgcolor: '#eff6ff', color: '#1e3a5f' },
  { label: 'Dropped', value: '443', bgcolor: '#fee2e2', color: '#991b1b' },
];

const courseOptions = [
  'All Courses',
  'Advanced React Patterns',
  'Python for Data Science',
  'AWS Solutions Architect',
  'TypeScript Mastery',
  'Docker & Kubernetes',
  'Machine Learning Fundamentals',
];

interface Enrollment {
  id: number;
  learnerName: string;
  learnerEmail: string;
  learnerInitials: string;
  course: string;
  enrolledDate: string;
  progress: number;
  status: 'Active' | 'Completed' | 'Dropped';
  lastActivity: string;
}

const mockEnrollments: Enrollment[] = [
  { id: 1, learnerName: 'John Mwangi', learnerEmail: 'john.mwangi@company.com', learnerInitials: 'JM', course: 'Advanced React Patterns', enrolledDate: 'Jan 15, 2026', progress: 78, status: 'Active', lastActivity: '2 hours ago' },
  { id: 2, learnerName: 'Fatima Al-Rashid', learnerEmail: 'fatima.alrashid@company.com', learnerInitials: 'FA', course: 'Python for Data Science', enrolledDate: 'Dec 8, 2025', progress: 100, status: 'Completed', lastActivity: 'Feb 28, 2026' },
  { id: 3, learnerName: 'David Ochieng', learnerEmail: 'david.ochieng@company.com', learnerInitials: 'DO', course: 'AWS Solutions Architect', enrolledDate: 'Feb 1, 2026', progress: 45, status: 'Active', lastActivity: '1 day ago' },
  { id: 4, learnerName: 'Grace Wanjiku', learnerEmail: 'grace.wanjiku@company.com', learnerInitials: 'GW', course: 'TypeScript Mastery', enrolledDate: 'Nov 20, 2025', progress: 12, status: 'Dropped', lastActivity: 'Dec 15, 2025' },
  { id: 5, learnerName: 'Michael Otieno', learnerEmail: 'michael.otieno@company.com', learnerInitials: 'MO', course: 'Machine Learning Fundamentals', enrolledDate: 'Jan 3, 2026', progress: 92, status: 'Active', lastActivity: '5 hours ago' },
  { id: 6, learnerName: 'Amina Yusuf', learnerEmail: 'amina.yusuf@company.com', learnerInitials: 'AY', course: 'Docker & Kubernetes', enrolledDate: 'Feb 14, 2026', progress: 100, status: 'Completed', lastActivity: 'Mar 6, 2026' },
  { id: 7, learnerName: 'Peter Kamau', learnerEmail: 'peter.kamau@company.com', learnerInitials: 'PK', course: 'Advanced React Patterns', enrolledDate: 'Jan 22, 2026', progress: 34, status: 'Active', lastActivity: '3 days ago' },
  { id: 8, learnerName: 'Lisa Ndungu', learnerEmail: 'lisa.ndungu@company.com', learnerInitials: 'LN', course: 'Python for Data Science', enrolledDate: 'Oct 5, 2025', progress: 8, status: 'Dropped', lastActivity: 'Nov 2, 2025' },
  { id: 9, learnerName: 'Samuel Kiprop', learnerEmail: 'samuel.kiprop@company.com', learnerInitials: 'SK', course: 'AWS Solutions Architect', enrolledDate: 'Feb 20, 2026', progress: 61, status: 'Active', lastActivity: '12 hours ago' },
  { id: 10, learnerName: 'Esther Akinyi', learnerEmail: 'esther.akinyi@company.com', learnerInitials: 'EA', course: 'TypeScript Mastery', enrolledDate: 'Dec 12, 2025', progress: 100, status: 'Completed', lastActivity: 'Mar 1, 2026' },
];

const statusChipColor = (status: string) => {
  switch (status) {
    case 'Active': return 'success';
    case 'Completed': return 'info';
    case 'Dropped': return 'error';
    default: return 'default';
  }
};

// ─── Component ─────────────────────────────────────────────

const ManagerEnrollmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredEnrollments = mockEnrollments.filter((e) => {
    const matchSearch =
      e.learnerName.toLowerCase().includes(search.toLowerCase()) ||
      e.learnerEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.course.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === 'All Courses' || e.course === courseFilter;
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

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

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
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
              <SchoolIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>All Enrollments</Typography>
              <Typography variant="body2" color="text.secondary">Track and manage course enrollments</Typography>
            </Box>
          </Box>

          {/* KPI Row */}
          <Grid container spacing={2} sx={{ my: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, sm: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: kpi.bgcolor,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} sx={{ color: kpi.color }}>{kpi.value}</Typography>
                  <Typography variant="body2" sx={{ color: kpi.color, opacity: 0.8, fontWeight: 500 }}>{kpi.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Enrollments Table Card */}
          <Paper elevation={0} sx={cardSx}>
            {/* Toolbar */}
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search learners or courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ minWidth: 240 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Course</InputLabel>
                  <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} label="Course">
                    {courseOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Dropped">Dropped</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Learner</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Enrolled Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Last Activity</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      {/* Learner */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: '#ffa424', fontWeight: 600 }}>
                            {enrollment.learnerInitials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{enrollment.learnerName}</Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>{enrollment.learnerEmail}</Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Course */}
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>{enrollment.course}</Typography>
                      </TableCell>

                      {/* Enrolled Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{enrollment.enrolledDate}</Typography>
                      </TableCell>

                      {/* Progress */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 130 }}>
                          <LinearProgress
                            variant="determinate"
                            value={enrollment.progress}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: enrollment.progress === 100
                                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                                  : enrollment.progress >= 50
                                    ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                    : 'linear-gradient(90deg, #f87171, #ef4444)',
                              },
                            }}
                          />
                          <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
                            {enrollment.progress}%
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={enrollment.status}
                          size="small"
                          color={statusChipColor(enrollment.status) as any}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>

                      {/* Last Activity */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{enrollment.lastActivity}</Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" sx={{ color: '#3b82f6' }}><ViewIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" sx={{ color: '#f59e0b' }}><EditIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="More">
                            <IconButton size="small" sx={{ color: '#6b7280' }}><MoreIcon fontSize="small" /></IconButton>
                          </Tooltip>
                        </Box>
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

export default ManagerEnrollmentsPage;
