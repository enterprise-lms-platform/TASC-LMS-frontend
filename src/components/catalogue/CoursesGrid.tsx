import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Button, ToggleButtonGroup, ToggleButton, Select, MenuItem, Grid, Skeleton, Alert } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CourseCard, { type Course } from './CourseCard';
import EnrollmentModal from './EnrollmentModal';
import Pagination from './Pagination';
import { publicCatalogueApi, getErrorMessage } from '../../lib/api';
import type { PublicCourse } from '../../types/api';
import { getCourseThumbnail } from '../../utils/courseHelpers';

interface CoursesGridProps {
  onMobileFilterOpen: () => void;
}

// Helper to get initials from name
const getInitials = (name: string | null): string => {
  if (!name) return 'IN';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper to capitalize level
const capitalizeLevel = (level: string): string => {
  return level
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CoursesGrid: React.FC<CoursesGridProps> = ({ onMobileFilterOpen }) => {
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // API state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters state
  const [filters] = useState<{
    category?: number;
    level?: string;
    featured?: boolean;
  }>({});

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  // Calculate total pages (assuming DRF default page size of 10)
  // TODO: Get page size from backend settings if available
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await publicCatalogueApi.getCourses({
          ...filters,
          page: currentPage,
        });

        // Map API courses to CourseCard interface
        const mappedCourses: Course[] = response.results.map((course: PublicCourse) => ({
          id: String(course.id),
          title: course.title,
          category: course.category?.name || 'General',
          categorySlug: course.category?.slug,
          instructor: course.instructor_name || 'Instructor',
          instructorInitials: getInitials(course.instructor_name),
          duration: `${course.duration_hours} hours`,
          level: capitalizeLevel(course.level),
          rating: 4.7, // TODO: Backend doesn't provide ratings yet
          ratingCount: course.enrollment_count > 0 ? String(course.enrollment_count) : '0',
          price: course.price === '0.00' || course.price === '0' ? 'Free' : `$${course.price}`,
          originalPrice:
            course.discount_percentage > 0
              ? `$${(parseFloat(course.price) / (1 - course.discount_percentage / 100)).toFixed(2)}`
              : undefined,
          image: getCourseThumbnail({
            thumbnail: course.thumbnail,
            slug: course.slug,
            category: course.category,
          }),
          badge: course.featured ? 'bestseller' : undefined,
          badgeText: course.featured ? 'Bestseller' : undefined,
          isFree: course.price === '0.00' || course.price === '0',
        }));

        setCourses(mappedCourses);
        setTotalCount(response.count);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ flex: 1 }}>
      <EnrollmentModal open={enrollModalOpen} onClose={() => setEnrollModalOpen(false)} courseTitle={selectedCourse?.title || ''} coursePrice={selectedCourse?.price || ''} />

      {/* Results Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 3, gap: 2 }}>
        <Typography sx={{ color: '#52525b' }}>
          {loading ? (
            'Loading...'
          ) : (
            <>
              Showing <strong style={{ color: '#27272a' }}>{totalCount}</strong> results
            </>
          )}
        </Typography>
        
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

            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="small" MenuProps={{ disableScrollLock: true }} sx={{ minWidth: 160, fontSize: '0.875rem', bgcolor: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d4d4d8' } }}>
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </Stack>
        </Box>
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid key={n} size={{ xs: 12, sm: 6 }}>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#71717a', mb: 1 }}>
            No courses found
          </Typography>
          <Typography sx={{ color: '#a1a1aa' }}>
            Try adjusting your filters or check back later for new courses.
          </Typography>
        </Box>
      )}

      {/* Grid */}
      {!loading && !error && courses.length > 0 && (
        <>
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid key={course.id} size={{ xs: 12, sm: 6, md: 6, lg: view === 'grid' ? 6 : 12 }}>
                <CourseCard course={course} onEnroll={handleEnroll} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Box>
  );
};

export default CoursesGrid;
