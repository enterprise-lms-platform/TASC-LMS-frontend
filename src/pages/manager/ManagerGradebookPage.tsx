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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Star as StarIcon,
  School as SchoolIcon,
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

// ── Grade distribution data ──
const gradeDistribution = [
  { grade: 'A', range: '90-100', count: 42, percentage: 26, color: '#16a34a' },
  { grade: 'B', range: '80-89', count: 48, percentage: 30, color: '#3b82f6' },
  { grade: 'C', range: '70-79', count: 35, percentage: 22, color: '#ffa424' },
  { grade: 'D', range: '60-69', count: 22, percentage: 14, color: '#f97316' },
  { grade: 'F', range: '<60', count: 13, percentage: 8, color: '#ef4444' },
];
const maxGradeCount = Math.max(...gradeDistribution.map((g) => g.count));

// ── Mock student grade records ──
const studentGrades = [
  { id: 1, name: 'Emily Johnson', initials: 'EJ', course: 'Advanced React Patterns', assignmentsAvg: 88, quizzesAvg: 82, overall: 85, status: 'Pass' },
  { id: 2, name: 'Marcus Chen', initials: 'MC', course: 'Python for Data Science', assignmentsAvg: 92, quizzesAvg: 95, overall: 93, status: 'Pass' },
  { id: 3, name: 'Sarah Williams', initials: 'SW', course: 'AWS Solutions Architect', assignmentsAvg: 74, quizzesAvg: 68, overall: 71, status: 'Pass' },
  { id: 4, name: 'David Kim', initials: 'DK', course: 'TypeScript Mastery', assignmentsAvg: 96, quizzesAvg: 98, overall: 97, status: 'Pass' },
  { id: 5, name: 'Aisha Patel', initials: 'AP', course: 'Docker & Kubernetes', assignmentsAvg: 45, quizzesAvg: 38, overall: 42, status: 'Fail' },
  { id: 6, name: 'James Rodriguez', initials: 'JR', course: 'Database Management', assignmentsAvg: 78, quizzesAvg: 82, overall: 80, status: 'Pass' },
  { id: 7, name: 'Olivia Brown', initials: 'OB', course: 'Cybersecurity Fundamentals', assignmentsAvg: 55, quizzesAvg: 52, overall: 54, status: 'Fail' },
  { id: 8, name: 'Liam Nguyen', initials: 'LN', course: 'Project Management Pro', assignmentsAvg: 86, quizzesAvg: 90, overall: 88, status: 'Pass' },
  { id: 9, name: 'Sophia Martinez', initials: 'SM', course: 'Advanced React Patterns', assignmentsAvg: 62, quizzesAvg: 58, overall: 60, status: 'Fail' },
  { id: 10, name: 'Noah Taylor', initials: 'NT', course: 'Python for Data Science', assignmentsAvg: 80, quizzesAvg: 76, overall: 78, status: 'Pass' },
];

const courseOptions = ['All Courses', 'Advanced React Patterns', 'Python for Data Science', 'AWS Solutions Architect', 'TypeScript Mastery', 'Docker & Kubernetes', 'Database Management', 'Cybersecurity Fundamentals', 'Project Management Pro'];

// ── Summary stats ──
const summaryStats = [
  { label: 'Class Average', value: '78.4%', color: '#ffa424' },
  { label: 'Highest', value: '98%', color: '#16a34a' },
  { label: 'Lowest', value: '42%', color: '#ef4444' },
  { label: 'Pass Rate', value: '84%', color: '#3b82f6' },
];

const ManagerGradebookPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState('All Courses');

  const filteredStudents = studentGrades.filter((s) => {
    return courseFilter === 'All Courses' || s.course === courseFilter;
  });

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StarIcon sx={{ color: '#ffa424', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>Gradebook</Typography>
                <Typography variant="body2" color="text.secondary">Organization-wide grade overview</Typography>
              </Box>
            </Box>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Course</InputLabel>
              <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} label="Course" sx={{ borderRadius: '10px' }}>
                {courseOptions.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3}>
            {/* Grade Distribution Card */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 20, color: '#ffa424' }} />
                    <Typography fontWeight={700}>Grade Distribution</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{gradeDistribution.reduce((sum, g) => sum + g.count, 0)} total students</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 3, height: 280 }}>
                  {gradeDistribution.map((g) => (
                    <Box key={g.grade} sx={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, color: g.color }}>
                        {g.count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        {g.percentage}%
                      </Typography>
                      <Box
                        sx={{
                          width: '100%',
                          maxWidth: 80,
                          height: `${(g.count / maxGradeCount) * 170}px`,
                          background: `linear-gradient(180deg, ${g.color}, ${g.color}88)`,
                          borderRadius: '8px 8px 0 0',
                          transition: 'height 0.3s, opacity 0.2s',
                          opacity: 0.85,
                          '&:hover': { opacity: 1 },
                        }}
                      />
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: g.color }}>{g.grade}</Typography>
                        <Typography variant="caption" color="text.secondary">{g.range}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Summary Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Summary</Typography>
                </Box>
                <Box sx={{ p: 0 }}>
                  {summaryStats.map((stat, i) => (
                    <Box
                      key={stat.label}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2.5,
                        px: 3,
                        borderBottom: i < summaryStats.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Grade Legend */}
              <Paper elevation={0} sx={{ ...cardSx, mt: 3 }}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Grade Scale</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {gradeDistribution.map((g) => (
                    <Box key={g.grade} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75 }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: `${g.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" fontWeight={700} sx={{ color: g.color }}>{g.grade}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">{g.range}%</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Student Grades Table */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Student Grades</Typography>
                  <Typography variant="body2" color="text.secondary">{filteredStudents.length} students</Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', bgcolor: 'grey.50', borderBottom: 2, borderColor: 'divider' } }}>
                        <TableCell>Student</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell align="center">Assignments Avg</TableCell>
                        <TableCell align="center">Quizzes Avg</TableCell>
                        <TableCell align="center">Overall Grade</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', fontWeight: 600, background: 'linear-gradient(135deg, #ffb74d, #f97316)' }}>
                                {student.initials}
                              </Avatar>
                              <Typography variant="body2" fontWeight={600}>{student.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">{student.course}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>{student.assignmentsAvg}%</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>{student.quizzesAvg}%</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                color: student.overall >= 90 ? '#16a34a' : student.overall >= 70 ? '#3b82f6' : student.overall >= 60 ? '#f59e0b' : '#ef4444',
                              }}
                            >
                              {student.overall}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={student.status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.72rem',
                                height: 24,
                                bgcolor: student.status === 'Pass' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: student.status === 'Pass' ? '#10b981' : '#ef4444',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredStudents.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">No student records found for the selected course.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerGradebookPage;
