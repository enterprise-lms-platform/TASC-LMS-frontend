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
  Button,
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
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Block as DisableIcon,
  Star as StarIcon,
} from '@mui/icons-material';
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

const summaryStats = [
  { label: 'Total Courses', value: '156', bgcolor: '#fff3e0', color: '#7c2d12' },
  { label: 'Published', value: '98', bgcolor: '#dcfce7', color: '#14532d' },
  { label: 'Under Review', value: '12', bgcolor: '#fff7ed', color: '#9a3412' },
  { label: 'Drafts', value: '46', bgcolor: '#f3f4f6', color: '#374151' },
];

interface CourseRow {
  id: number;
  title: string;
  category: string;
  instructor: string;
  instructorInitials: string;
  status: 'Published' | 'Draft' | 'Under Review' | 'Archived';
  enrollments: number;
  completionRate: number;
  rating: number;
}

const mockCourses: CourseRow[] = [
  { id: 1, title: 'Advanced React Patterns & Performance', category: 'Web Development', instructor: 'Dr. Sarah Chen', instructorInitials: 'SC', status: 'Published', enrollments: 452, completionRate: 72, rating: 4.8 },
  { id: 2, title: 'Python for Data Science', category: 'Data Science', instructor: 'James Wilson', instructorInitials: 'JW', status: 'Published', enrollments: 386, completionRate: 68, rating: 4.6 },
  { id: 3, title: 'AWS Solutions Architect Prep', category: 'Cloud Computing', instructor: 'Maria Garcia', instructorInitials: 'MG', status: 'Under Review', enrollments: 0, completionRate: 0, rating: 0 },
  { id: 4, title: 'TypeScript Mastery: Zero to Hero', category: 'Web Development', instructor: 'Alex Kim', instructorInitials: 'AK', status: 'Published', enrollments: 278, completionRate: 74, rating: 4.7 },
  { id: 5, title: 'Docker & Kubernetes in Production', category: 'DevOps', instructor: 'Priya Patel', instructorInitials: 'PP', status: 'Draft', enrollments: 0, completionRate: 0, rating: 0 },
  { id: 6, title: 'Machine Learning Fundamentals', category: 'Artificial Intelligence', instructor: 'Dr. Sarah Chen', instructorInitials: 'SC', status: 'Published', enrollments: 534, completionRate: 61, rating: 4.9 },
  { id: 7, title: 'Cybersecurity Essentials', category: 'Security', instructor: 'Robert Njoroge', instructorInitials: 'RN', status: 'Archived', enrollments: 198, completionRate: 82, rating: 4.3 },
  { id: 8, title: 'UX Design Principles', category: 'Design', instructor: 'Amina Osei', instructorInitials: 'AO', status: 'Draft', enrollments: 0, completionRate: 0, rating: 0 },
];

const statusChipColor = (status: string) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Draft': return 'default';
    case 'Under Review': return 'warning';
    case 'Archived': return 'error';
    default: return 'default';
  }
};

// ─── Component ─────────────────────────────────────────────

const ManagerCoursesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCourses = mockCourses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
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
              <MenuBookIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>All Courses</Typography>
              <Typography variant="body2" color="text.secondary">Oversee and manage organization courses</Typography>
            </Box>
          </Box>

          {/* Summary Stats */}
          <Grid container spacing={2} sx={{ my: 3 }}>
            {summaryStats.map((stat) => (
              <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: stat.bgcolor,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="body2" sx={{ color: stat.color, opacity: 0.8, fontWeight: 500 }}>{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Courses Table Card */}
          <Paper elevation={0} sx={cardSx}>
            {/* Toolbar */}
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search courses..."
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
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="All">All Statuses</MenuItem>
                    <MenuItem value="Published">Published</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Under Review">Under Review</MenuItem>
                    <MenuItem value="Archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  px: 3,
                  boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
                }}
              >
                Create Course
              </Button>
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Instructor</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Enrollments</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Completion Rate</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Rating</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                      {/* Course */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 40,
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <MenuBookIcon sx={{ fontSize: 20, color: '#6366f1' }} />
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{course.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{course.category}</Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Instructor */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', bgcolor: '#ffa424' }}>{course.instructorInitials}</Avatar>
                          <Typography variant="body2">{course.instructor}</Typography>
                        </Box>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={course.status}
                          size="small"
                          color={statusChipColor(course.status) as any}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                      </TableCell>

                      {/* Enrollments */}
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{course.enrollments.toLocaleString()}</Typography>
                      </TableCell>

                      {/* Completion Rate */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                          <LinearProgress
                            variant="determinate"
                            value={course.completionRate}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: course.completionRate >= 70
                                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                                  : course.completionRate >= 40
                                    ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                                    : 'linear-gradient(90deg, #f87171, #ef4444)',
                              },
                            }}
                          />
                          <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
                            {course.completionRate}%
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Rating */}
                      <TableCell align="center">
                        {course.rating > 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                            <Typography variant="body2" fontWeight={600}>{course.rating}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.disabled">N/A</Typography>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View">
                            <IconButton size="small" sx={{ color: '#3b82f6' }}><ViewIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" sx={{ color: '#f59e0b' }}><EditIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Disable">
                            <IconButton size="small" sx={{ color: '#ef4444' }}><DisableIcon fontSize="small" /></IconButton>
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

export default ManagerCoursesPage;
