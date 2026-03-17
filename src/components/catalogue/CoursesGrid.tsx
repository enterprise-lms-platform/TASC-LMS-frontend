import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Stack, Button, ToggleButtonGroup, ToggleButton, Select, MenuItem, Grid } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CourseCard, { type Course } from './CourseCard';
import EnrollmentModal from './EnrollmentModal';
import { publicCourseApi, type PublicCourseParams } from '../../services/public.services';

interface CoursesGridProps {
  onMobileFilterOpen: () => void;
  category?: number;
  level?: string;
  search?: string;
  sortBy?: string;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({ onMobileFilterOpen, category, level, sortBy = 'popular' }) => {
  const [view, setView] = React.useState('grid');
  const [sort, setSort] = React.useState(sortBy);
  const [enrollModalOpen, setEnrollModalOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  const params: PublicCourseParams = {
    page_size: 12,
  };
  
  if (category) params.category = category;
  if (level && level !== 'all_levels') params.level = level as 'beginner' | 'intermediate' | 'advanced';
  
  const { data: coursesData } = useQuery({
    queryKey: ['publicCourses', params],
    queryFn: () => publicCourseApi.getAll(params),
  });

  const apiData = (coursesData as any)?.data;
  const courses: Course[] = (apiData?.results || []).map((course: any) => ({
    id: String(course.id),
    title: course.title,
    category: course.category?.name || 'General',
    instructor: course.instructor_name,
    instructorInitials: course.instructor_name.split(' ').map(n => n[0]).join('').slice(0, 2),
    duration: course.duration_hours ? `${course.duration_hours} hours` : 'N/A',
    level: course.level,
    rating: course.rating || 0,
    ratingCount: String(course.rating_count || 0),
    image: course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    badge: undefined,
    badgeText: undefined,
  }));

  const totalResults = apiData?.count || 0;

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  return (
    <Box sx={{ flex: 1 }}>
      <EnrollmentModal open={enrollModalOpen} onClose={() => setEnrollModalOpen(false)} courseTitle={selectedCourse?.title || ''} />

      {/* Results Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 3, gap: 2 }}>
        <Typography sx={{ color: '#52525b' }}>Showing <strong style={{ color: '#27272a' }}>{totalResults}</strong> results</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
          <Button variant="outlined" startIcon={<TuneIcon />} onClick={onMobileFilterOpen} sx={{ display: { xs: 'flex', lg: 'none' }, color: '#52525b', borderColor: '#d4d4d8' }}>
            Filters
          </Button>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small" sx={{ bgcolor: '#f4f4f5', borderRadius: 1, p: 0.25 }}>
              <ToggleButton value="grid" sx={{ border: 'none', px: 1.5, '&.Mui-selected': { bgcolor: 'white', color: '#ffa424', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' } }}>
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" sx={{ border: 'none', px: 1.5, '&.Mui-selected': { bgcolor: 'white', color: '#ffa424', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' } }}>
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            <Select value={sort} onChange={(e) => setSort(e.target.value)} size="small" MenuProps={{ disableScrollLock: true }} sx={{ minWidth: 160, fontSize: '0.875rem', bgcolor: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4d4d8' } }}>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </Stack>
        </Box>
      </Box>

      {/* Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid key={course.id} size={{ xs: 12, sm: 6, md: 6, lg: view === 'grid' ? 6 : 12 }}>
            <CourseCard course={course} onEnroll={handleEnroll} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoursesGrid;
