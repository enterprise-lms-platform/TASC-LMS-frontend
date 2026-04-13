import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Button,
} from '@mui/material';
import { Search as SearchIcon, School as CourseIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgCourses } from '../../hooks/useOrgAdmin';
import type { CourseList } from '../../types/types';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const CoursesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: coursesData, isLoading } = useOrgCourses({ search, page_size: 20 });
  const courses: CourseList[] = coursesData?.results ?? [];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Courses" />

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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Browse available courses for your organisation
          </Typography>

          <TextField
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 3, width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {isLoading ? (
            <Grid container spacing={2.5}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
                    <Skeleton variant="rectangular" height={120} />
                    <Box sx={{ p: 2 }}>
                      <Skeleton width="80%" height={24} />
                      <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : courses.length === 0 ? (
            <Paper elevation={0} sx={{ ...cardSx, p: 6, textAlign: 'center' }}>
              <CourseIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body1" fontWeight={600} color="text.secondary">
                No courses available
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2.5}>
              {courses.map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...cardSx,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <Box
                      sx={{
                        height: 120,
                        bgcolor: 'grey.100',
                        backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!course.thumbnail && <CourseIcon sx={{ fontSize: 40, color: 'text.disabled' }} />}
                    </Box>
                    <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ mb: 1 }}>
                        {course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {course.category && (
                          <Chip label={course.category.name} size="small" sx={{ fontSize: '0.7rem' }} />
                        )}
                        <Chip
                          label={course.is_published ? 'Published' : 'Draft'}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            bgcolor: course.is_published ? '#dcfce7' : '#f4f4f5',
                            color: course.is_published ? '#10b981' : '#71717a',
                          }}
                        />
                      </Box>
                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => navigate('/org-admin/enrollments')}
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
                        >
                          Enroll
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CoursesPage;