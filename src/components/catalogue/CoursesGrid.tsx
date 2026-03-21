import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, Stack, Button, ToggleButtonGroup, ToggleButton, Select, MenuItem, Grid } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CourseCard, { type Course } from './CourseCard';
import EnrollmentModal from './EnrollmentModal';
import { publicCourseApi, type PublicCourseParams } from '../../services/public.services';

const SORT_TO_ORDERING: Record<string, string> = {
  popular: '-enrollment_count',
  newest: '-published_at',
  rating: '-published_at', // no rating field on backend yet, fallback to newest
  title_asc: 'title',
  title_desc: '-title',
};

interface CoursesGridProps {
  onMobileFilterOpen: () => void;
  category?: number;
  categories?: number[];
  level?: string;
  levels?: string[];
  search?: string;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  page?: number;
  onTotalCountChange?: (count: number) => void;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  onMobileFilterOpen,
  category,
  categories,
  level,
  levels,
  search,
  sortBy = 'newest',
  onSortChange,
  page = 1,
  onTotalCountChange,
}) => {
  const [view, setView] = React.useState('grid');
  const [enrollModalOpen, setEnrollModalOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  const params: PublicCourseParams = {
    page_size: 12,
    page,
  };

  // Single category from hero dropdown takes priority
  if (category) {
    params.category = category;
  }
  // Single level filter (backend only supports one at a time)
  if (level) {
    params.level = level as PublicCourseParams['level'];
  }
  if (search) params.search = search;

  // Map sort value to backend ordering param
  const ordering = SORT_TO_ORDERING[sortBy] || '-published_at';
  params.ordering = ordering;

  // For multiple categories/levels, we make separate queries per category
  // But the backend only supports one category at a time, so if multiple are selected
  // we skip the category param and filter client-side... or just use the first one.
  // For now: if multiple categories, don't filter by category (show all, let user narrow down)
  if (categories && categories.length > 1) {
    delete params.category;
  } else if (categories && categories.length === 1) {
    params.category = categories[0];
  }

  if (levels && levels.length > 1) {
    // Backend only supports single level, skip filter if multiple selected
    delete params.level;
  } else if (levels && levels.length === 1) {
    params.level = levels[0] as PublicCourseParams['level'];
  }

  const { data: coursesData } = useQuery({
    queryKey: ['publicCourses', params],
    queryFn: () => publicCourseApi.getAll(params),
  });

  const apiData = (coursesData as any)?.data;
  let courses: Course[] = (apiData?.results || []).map((course: any) => ({
    id: String(course.id),
    slug: course.slug,
    title: course.title,
    category: course.category?.name || 'General',
    categoryId: course.category?.id,
    instructor: course.instructor_name,
    instructorInitials: course.instructor_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '',
    duration: course.duration_hours ? `${course.duration_hours} hours` : 'N/A',
    level: course.level,
    rating: course.rating || 0,
    ratingCount: String(course.rating_count || 0),
    image: course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    badge: undefined,
    badgeText: undefined,
  }));

  // Client-side filtering for multi-select (when backend can't handle it)
  if (categories && categories.length > 1) {
    courses = courses.filter((c: any) => categories.includes(c.categoryId));
  }
  if (levels && levels.length > 1) {
    courses = courses.filter((c) => levels.includes(c.level));
  }

  const totalResults = apiData?.count || 0;

  React.useEffect(() => {
    if (onTotalCountChange) {
      onTotalCountChange(totalResults);
    }
  }, [totalResults, onTotalCountChange]);

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  return (
    <Box sx={{ flex: 1 }}>
      <EnrollmentModal
        open={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        courseTitle={selectedCourse?.title || ''}
        courseSlug={selectedCourse?.slug || selectedCourse?.id}
        courseId={selectedCourse ? Number(selectedCourse.id) : undefined}
        isFree={selectedCourse?.isFree}
      />

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

            <Select
              value={sortBy}
              onChange={(e) => onSortChange?.(e.target.value)}
              size="small"
              MenuProps={{ disableScrollLock: true }}
              sx={{ minWidth: 160, fontSize: '0.875rem', bgcolor: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4d4d8' } }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="title_asc">Title: A-Z</MenuItem>
              <MenuItem value="title_desc">Title: Z-A</MenuItem>
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

      {courses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No courses found</Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>Try adjusting your filters or search query</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CoursesGrid;
