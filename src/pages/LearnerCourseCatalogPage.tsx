import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Toolbar, CssBaseline, Typography, Grid, Stack, Link, Paper } from '@mui/material';
import { ChevronRight, MenuBook, People, School, Star } from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

// Import learner components
import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

// Import catalog components
import CatalogHero from '../components/learner/catalog/CatalogHero';
import CatalogFilterBar from '../components/learner/catalog/CatalogFilterBar';
import CatalogCategoryCard, { defaultCategories } from '../components/learner/catalog/CatalogCategoryCard';
import CatalogCourseCard, { sampleCourses } from '../components/learner/catalog/CatalogCourseCard';
import CatalogInstructorCard, { sampleInstructors } from '../components/learner/catalog/CatalogInstructorCard';
import CatalogPagination from '../components/learner/catalog/CatalogPagination';

/* Same color scheme as Learner Dashboard QuickStats */
const catalogKpis = [
  { label: 'Courses', value: '1000+', icon: <MenuBook />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Instructors', value: '200+', icon: <School />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
  { label: 'Learners', value: '50K+', icon: <People />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Avg Rating', value: '4.8', icon: <Star />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
];

const LearnerCourseCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFavoriteToggle = (courseId: string) => {
    setFavorites((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleEnroll = (course: any) => {
    console.log('Enrolling in:', course.title);
  };

  const handleCourseClick = (course: any) => {
    navigate(`/learner/course/${course.id}`);
  };

  const handleCategoryClick = (category: any) => {
    console.log('Browsing category:', category.name);
  };

  const handleInstructorProfile = (instructor: any) => {
    console.log('Viewing instructor:', instructor.name);
  };

  const SectionHeader = ({ title, viewAllText }: { title: string; viewAllText: string }) => (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      sx={{ mb: 4 }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#27272a',
          mb: { xs: 2, sm: 0 },
        }}
      >
        {title}
      </Typography>
      <Link
        href="#"
        underline="hover"
        sx={{
          color: '#ffa424',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.875rem',
        }}
      >
        {viewAllText}
        <ChevronRight sx={{ fontSize: 18 }} />
      </Link>
    </Stack>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* TopBar */}
      <TopBar onMobileMenuToggle={handleMobileMenuToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Page Title */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#27272a',
              mb: 1,
            }}
          >
            Course Catalog
          </Typography>
          <Typography
            sx={{
              color: '#71717a',
              fontSize: '1.125rem',
            }}
          >
            Discover 1000+ courses taught by industry experts. Start learning today!
          </Typography>
        </Box>

        {/* Hero Section */}
        <CatalogHero />

        {/* Stat Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {catalogKpis.map((k, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: 160,
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
                    bgcolor: k.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {k.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: k.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                  {k.value}
                </Typography>
                <Typography variant="body2" sx={{ color: k.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                  {k.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filter Bar */}
        <CatalogFilterBar />

        {/* Browse by Category */}
        <Box sx={{ mb: 6 }}>
          <SectionHeader title="Browse by Category" viewAllText="View All Categories" />
          <Grid container spacing={3}>
            {defaultCategories.slice(0, 3).map((category) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
                <CatalogCategoryCard
                  category={category}
                  onClick={handleCategoryClick}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Most Popular Courses */}
        <Box sx={{ mb: 6 }}>
          <SectionHeader title="Most Popular Courses" viewAllText="View All Courses" />
          <Grid container spacing={3}>
            {sampleCourses.map((course) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={course.id}>
                <CatalogCourseCard
                  course={course}
                  isFavorite={favorites.includes(course.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                  onEnroll={handleEnroll}
                  onClick={handleCourseClick}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Instructors */}
        <Box sx={{ mb: 6 }}>
          <SectionHeader title="Featured Instructors" viewAllText="View All Instructors" />
          <Grid container spacing={3}>
            {sampleInstructors.map((instructor) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={instructor.id}>
                <CatalogInstructorCard
                  instructor={instructor}
                  onViewProfile={handleInstructorProfile}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Pagination */}
        <CatalogPagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />

        {/* Footer */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid #e4e4e7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 TASC Learning Management System. Discover endless learning opportunities.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              Become an Instructor
            </Link>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              Help Center
            </Link>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              Terms
            </Link>
            <Link href="#" underline="hover" color="text.secondary" variant="body2">
              Privacy
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default LearnerCourseCatalogPage;
