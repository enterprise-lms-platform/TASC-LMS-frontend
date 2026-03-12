import React, { useState, useMemo } from 'react';
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
  LinearProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { submissionApi } from '../../services/learning.services';
import { courseApi } from '../../services/catalogue.services';

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

// ── Helper functions ──
const getGradeColor = (score: number): string => {
  if (score >= 90) return '#16a34a';
  if (score >= 80) return '#3b82f6';
  if (score >= 70) return '#ffa424';
  if (score >= 60) return '#f97316';
  return '#ef4444';
};

const getInitials = (name: string): string => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ManagerGradebookPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState('All');

  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionApi.getAll({}).then(r => r.data),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll({ page_size: 100 }).then(r => r.data),
  });

  const submissions = (submissionsData as any)?.results || (submissionsData as any) || [];
  const courses = (coursesData as any)?.results || (coursesData as any) || [];
  const courseOptions = ['All', ...courses.map((c: any) => c.title)];

  const filteredSubmissions = useMemo(() => {
    if (courseFilter === 'All') return submissions;
    return submissions.filter((s: any) => s.course_name === courseFilter);
  }, [submissions, courseFilter]);

  const gradeDistribution = useMemo(() => {
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    let total = 0;
    let highest = 0;
    let lowest = 100;
    let passCount = 0;
    
    filteredSubmissions.forEach((s: any) => {
      const score = Number(s.grade_percentage) || 0;
      total += score;
      if (score > highest) highest = score;
      if (score < lowest) lowest = score;
      if (score >= 60) passCount++;
      
      if (score >= 90) grades.A++;
      else if (score >= 80) grades.B++;
      else if (score >= 70) grades.C++;
      else if (score >= 60) grades.D++;
      else grades.F++;
    });
    
    const count = filteredSubmissions.length || 1;
    const dist = [
      { grade: 'A', range: '90-100', count: grades.A, percentage: Math.round((grades.A / count) * 100), color: '#16a34a' },
      { grade: 'B', range: '80-89', count: grades.B, percentage: Math.round((grades.B / count) * 100), color: '#3b82f6' },
      { grade: 'C', range: '70-79', count: grades.C, percentage: Math.round((grades.C / count) * 100), color: '#ffa424' },
      { grade: 'D', range: '60-69', count: grades.D, percentage: Math.round((grades.D / count) * 100), color: '#f97316' },
      { grade: 'F', range: '<60', count: grades.F, percentage: Math.round((grades.F / count) * 100), color: '#ef4444' },
    ];
    
    const avg = filteredSubmissions.length > 0 ? Math.round(total / filteredSubmissions.length) : 0;
    const passRate = filteredSubmissions.length > 0 ? Math.round((passCount / filteredSubmissions.length) * 100) : 0;
    
    return { distribution: dist, avg, highest: highest || 0, lowest: lowest || 0, passRate };
  }, [filteredSubmissions]);

  const maxGradeCount = Math.max(...gradeDistribution.distribution.map((g: any) => g.count), 1);

  const summaryStats = [
    { label: 'Class Average', value: `${gradeDistribution.avg}%`, color: '#ffa424' },
    { label: 'Highest', value: `${gradeDistribution.highest}%`, color: '#16a34a' },
    { label: 'Lowest', value: `${gradeDistribution.lowest}%`, color: '#ef4444' },
    { label: 'Pass Rate', value: `${gradeDistribution.passRate}%`, color: '#3b82f6' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}
          
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
                  <Typography variant="body2" color="text.secondary">{gradeDistribution.distribution.reduce((sum: number, g: any) => sum + g.count, 0)} total students</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 3, height: 280 }}>
                  {gradeDistribution.distribution.map((g: any) => (
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
                  {gradeDistribution.distribution.map((g: any) => (
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
                  <Typography variant="body2" color="text.secondary">{filteredSubmissions.length} students</Typography>
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
                      {filteredSubmissions.map((student: any) => (
                        <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '& td': { py: 1.5 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', fontWeight: 600, background: 'linear-gradient(135deg, #ffb74d, #f97316)' }}>
                                {getInitials(student.student_name)}
                              </Avatar>
                              <Typography variant="body2" fontWeight={600}>{student.student_name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">{student.course_name}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>-</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>-</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                color: getGradeColor(Number(student.grade_percentage) || 0),
                              }}
                            >
                              {Math.round(Number(student.grade_percentage) || 0)}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={Number(student.grade_percentage) >= 60 ? 'Pass' : 'Fail'}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.72rem',
                                height: 24,
                                bgcolor: Number(student.grade_percentage) >= 60 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: Number(student.grade_percentage) >= 60 ? '#10b981' : '#ef4444',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredSubmissions.length === 0 && (
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
