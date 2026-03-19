import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';
import { ArrowBack as BackIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { useCourse } from '../../hooks/useCatalogue';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const statusLabel = (status?: string) => {
  if (status === 'published') return 'Published';
  if (status === 'archived') return 'Archived';
  if (status === 'pending_approval') return 'Under Review';
  return 'Draft';
};

const ManagerCourseDetailPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const id = Number(courseId);

  const { data: course, isLoading, isError } = useCourse(id, { enabled: !!id });

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
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Button startIcon={<BackIcon />} onClick={() => navigate('/manager/courses')} sx={{ textTransform: 'none' }}>
              Back to Courses
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/manager/courses/${id}/edit`)}
              sx={{ textTransform: 'none' }}
            >
              Edit Course
            </Button>
          </Box>

          {isLoading ? (
            <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Paper>
          ) : isError || !course ? (
            <Paper elevation={0} sx={{ ...cardSx, p: 4 }}>
              <Typography color="error.main" fontWeight={600}>Unable to load course details.</Typography>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>{course.title}</Typography>
                <Chip label={statusLabel(course.status)} size="small" />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {course.short_description || 'No short description provided.'}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Category</Typography>
                  <Typography variant="body2" fontWeight={600}>{course.category?.name || 'Uncategorized'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Instructor</Typography>
                  <Typography variant="body2" fontWeight={600}>{course.instructor?.name || course.instructor_name || 'Unknown Instructor'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Level</Typography>
                  <Typography variant="body2" fontWeight={600}>{course.level}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Price</Typography>
                  <Typography variant="body2" fontWeight={600}>{course.price}</Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Description</Typography>
              <Typography variant="body2" color="text.secondary">
                {course.description || 'No description provided.'}
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerCourseDetailPage;
