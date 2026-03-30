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
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assignment as QuizIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Quiz as TotalQuizzesIcon,
  TrendingUp as PassRateIcon,
  People as AttemptsIcon,
  Score as ScoreIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

// ── Shared styles ──
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

// ── KPI data ──
const kpis = [
  { label: 'Total Quizzes', value: '89', icon: <TotalQuizzesIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Avg Pass Rate', value: '76.3%', icon: <PassRateIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Total Attempts', value: '4,521', icon: <AttemptsIcon />, bgcolor: '#eff6ff', iconBg: '#3b82f6', color: '#1e3a5f', subColor: '#1e40af' },
  { label: 'Avg Score', value: '72%', icon: <ScoreIcon />, bgcolor: '#fef9c3', iconBg: '#facc15', color: '#713f12', subColor: '#854d0e' },
];

// ── Mock quiz data ──
const quizzes = [
  { id: 1, title: 'React Fundamentals Quiz', course: 'Advanced React Patterns', questions: 25, timeLimit: '30 min', attempts: 842, passRate: 82, avgScore: 78, status: 'Active' },
  { id: 2, title: 'Python Basics Assessment', course: 'Python for Data Science', questions: 30, timeLimit: '45 min', attempts: 716, passRate: 74, avgScore: 71, status: 'Active' },
  { id: 3, title: 'AWS Cloud Practitioner Mock', course: 'AWS Solutions Architect', questions: 65, timeLimit: '90 min', attempts: 534, passRate: 68, avgScore: 65, status: 'Active' },
  { id: 4, title: 'TypeScript Generics Quiz', course: 'TypeScript Mastery', questions: 20, timeLimit: '25 min', attempts: 623, passRate: 79, avgScore: 76, status: 'Active' },
  { id: 5, title: 'Docker Essentials Test', course: 'Docker & Kubernetes', questions: 35, timeLimit: '40 min', attempts: 412, passRate: 71, avgScore: 69, status: 'Active' },
  { id: 6, title: 'SQL Joins & Subqueries', course: 'Database Management', questions: 20, timeLimit: '30 min', attempts: 389, passRate: 85, avgScore: 82, status: 'Active' },
  { id: 7, title: 'Cybersecurity Awareness', course: 'Cybersecurity Fundamentals', questions: 40, timeLimit: '50 min', attempts: 567, passRate: 48, avgScore: 54, status: 'Draft' },
  { id: 8, title: 'Agile & Scrum Principles', course: 'Project Management Pro', questions: 15, timeLimit: '20 min', attempts: 438, passRate: 91, avgScore: 88, status: 'Draft' },
];

const courses = ['All Courses', 'Advanced React Patterns', 'Python for Data Science', 'AWS Solutions Architect', 'TypeScript Mastery', 'Docker & Kubernetes', 'Database Management', 'Cybersecurity Fundamentals', 'Project Management Pro'];

const getPassRateColor = (rate: number) => {
  if (rate > 70) return '#16a34a';
  if (rate >= 50) return '#f59e0b';
  return '#ef4444';
};

const ManagerQuizzesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredQuizzes = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.course.toLowerCase().includes(search.toLowerCase());
    const matchCourse = courseFilter === 'All Courses' || q.course === courseFilter;
    const matchStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchSearch && matchCourse && matchStatus;
  });

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QuizIcon sx={{ color: '#ffa424', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Quizzes</Typography>
              <Typography variant="body2" color="text.secondary">Oversee quizzes across all courses</Typography>
            </Box>
          </Box>

          {/* KPI Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    height: '100%',
                    minHeight: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      '& svg': { fontSize: 20 },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Quizzes Table */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>All Quizzes</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Search quizzes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Course</InputLabel>
                  <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} label="Course" sx={{ borderRadius: '10px' }}>
                    {courses.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status" sx={{ borderRadius: '10px' }}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', bgcolor: 'grey.50', borderBottom: 2, borderColor: 'divider' } }}>
                    <TableCell>Quiz Title</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell align="center">Questions</TableCell>
                    <TableCell align="center">Time Limit</TableCell>
                    <TableCell align="center">Attempts</TableCell>
                    <TableCell align="center">Pass Rate</TableCell>
                    <TableCell align="center">Avg Score</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{quiz.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{quiz.course}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{quiz.questions}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{quiz.timeLimit}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{quiz.attempts.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={700} sx={{ color: getPassRateColor(quiz.passRate) }}>
                          {quiz.passRate}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{quiz.avgScore}%</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={quiz.status}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            height: 24,
                            bgcolor: quiz.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.15)',
                            color: quiz.status === 'Active' ? '#10b981' : '#6b7280',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                          <Tooltip title="View">
                            <IconButton size="small" sx={{ color: '#3b82f6' }}>
                              <ViewIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" sx={{ color: '#ffa424' }}>
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredQuizzes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No quizzes found matching your filters.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerQuizzesPage;
