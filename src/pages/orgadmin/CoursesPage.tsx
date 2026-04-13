import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon, MenuBook as CourseIcon, People as EnrolledIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgCourses, useOrgEnrollments } from '../../hooks/useOrgAdmin';
import { useDebounce } from '../../hooks/useDebounce';
import type { CourseList } from '../../types/types';

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
};

interface Enrollment {
  course: { id: number };
}

const CoursesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const debouncedSearch = useDebounce(search, 300);
  const { data: coursesData, isLoading } = useOrgCourses({ search: debouncedSearch, page_size: 100 });
  const { data: enrollmentsData } = useOrgEnrollments({ page_size: 500 });

  const courses: CourseList[] = coursesData?.results ?? [];
  const enrollments: Enrollment[] = (enrollmentsData as unknown as { results?: Enrollment[] })?.results ?? [];

  const summaryStats = useMemo(() => {
    if (!courses.length) return [];
    const published = courses.filter(c => c.is_published).length;
    const draft = courses.length - published;
    return [
      { label: 'Total Courses', value: courses.length, bgcolor: '#fff3e0', color: '#7c2d12' },
      { label: 'Published', value: published, bgcolor: '#dcfce7', color: '#14532d' },
      { label: 'With Enrollments', value: new Set(enrollments.map(e => e.course.id)).size, bgcolor: '#eff6ff', color: '#1e3a5f' },
      { label: 'Draft', value: draft, bgcolor: '#f3f4f6', color: '#374151' },
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      if (statusFilter === 'published') return c.is_published;
      if (statusFilter === 'draft') return !c.is_published;
      return true;
    });
  }, [courses, statusFilter]);

  const getEnrollmentCount = (courseId: number) => enrollments.filter(e => e.course.id === courseId).length;

  const getCourseStatus = (course: CourseList) => (course.is_published ? 'Published' : 'Draft');

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Browse Courses" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <CourseIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Browse Courses</Typography>
              <Typography variant="body2" color="text.secondary">Courses available for your organisation</Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {summaryStats.map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Paper elevation={0} sx={{ ...cardSx, p: 2.5, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Typography fontWeight={700}>All Courses</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> } }}
                  sx={{ width: 250 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>{[0,1,2,3,4].map(i => <Skeleton key={i} height={56} sx={{mb:1}} />)}</Box>
            ) : filteredCourses.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">No courses available</Typography></Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Enrollments</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCourses.map((course) => {
                      const status = getCourseStatus(course);
                      return (
                        <TableRow key={course.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: 'grey.100', backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {!course.thumbnail && <CourseIcon sx={{ color: 'text.disabled' }} />}
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>{course.title}</Typography>
                                {course.category && <Typography variant="caption" color="text.secondary">{course.category.name}</Typography>}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={status} size="small" sx={{ bgcolor: status === 'Published' ? '#dcfce7' : '#f3f4f6', color: status === 'Published' ? '#16a34a' : '#374151', fontWeight: 600, fontSize: '0.7rem' }} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EnrolledIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2">{getEnrollmentCount(course.id)}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" sx={{ textTransform: 'none', fontWeight: 600 }}>Enroll</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default CoursesPage;