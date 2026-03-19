import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { useCourse, usePartialUpdateCourse, useCategories } from '../../hooks/useCatalogue';
import type { CourseCreateRequest, CourseStatus } from '../../types/types';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const ManagerCourseEditPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const id = Number(courseId);

  const { data: course, isLoading, isError } = useCourse(id, { enabled: !!id });
  const { data: categoriesData } = useCategories();
  const updateCourse = usePartialUpdateCourse();

  const [form, setForm] = useState<Partial<CourseCreateRequest>>({
    title: '',
    short_description: '',
    description: '',
    category: null,
    level: 'all_levels',
    status: 'draft',
    thumbnail: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const categories = useMemo(() => {
    if (!categoriesData) return [];
    if (Array.isArray(categoriesData)) return categoriesData;
    return categoriesData.results ?? [];
  }, [categoriesData]);

  useEffect(() => {
    if (!course) return;
    setForm({
      title: course.title || '',
      short_description: course.short_description || '',
      description: course.description || '',
      category: course.category?.id ?? null,
      level: course.level || 'all_levels',
      status: (course.status || 'draft') as CourseStatus,
      thumbnail: course.thumbnail || '',
    });
  }, [course]);

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateCourse.mutateAsync({ id, data: form });
      setSnackbar({ open: true, message: 'Course updated successfully.', severity: 'success' });
      navigate(`/manager/courses/${id}`);
    } catch {
      setSnackbar({ open: true, message: 'Failed to update course.', severity: 'error' });
    }
  };

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
          <Button startIcon={<BackIcon />} onClick={() => navigate(`/manager/courses/${id}`)} sx={{ textTransform: 'none', mb: 2 }}>
            Back to Course
          </Button>
          {isLoading ? (
            <Paper elevation={0} sx={{ ...cardSx, p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Paper>
          ) : isError || !course ? (
            <Paper elevation={0} sx={{ ...cardSx, p: 4 }}>
              <Typography color="error.main" fontWeight={600}>Unable to load course for editing.</Typography>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Edit Course</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={form.title || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Short Description"
                    value={form.short_description || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    minRows={4}
                    value={form.description || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={form.category ?? ''}
                      label="Category"
                      onChange={(e) => setForm((prev) => ({ ...prev, category: Number(e.target.value) || null }))}
                    >
                      <MenuItem value="">Uncategorized</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={form.status || 'draft'}
                      label="Status"
                      onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as CourseStatus }))}
                    >
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Thumbnail URL"
                    value={form.thumbnail || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, thumbnail: e.target.value }))}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={updateCourse.isPending}
                  sx={{ textTransform: 'none' }}
                >
                  {updateCourse.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerCourseEditPage;
