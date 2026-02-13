import React from 'react';
import { Box, Typography, Stack, Button, ToggleButtonGroup, ToggleButton, Select, MenuItem, Grid } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CourseCard, { type Course } from './CourseCard';
import EnrollmentModal from './EnrollmentModal';

interface CoursesGridProps {
  onMobileFilterOpen: () => void;
}

const courses: Course[] = [
  { id: '1', title: 'Advanced React Patterns & Best Practices', category: 'Web Development', instructor: 'Michael Rodriguez', instructorInitials: 'MR', duration: '24 hours', level: 'Advanced', rating: 4.8, ratingCount: '1.2k', price: '$129.99', originalPrice: '$199.99', image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1074', badge: 'bestseller', badgeText: 'Bestseller' },
  { id: '2', title: 'Data Science & Machine Learning Fundamentals', category: 'Data Science', instructor: 'Emma Chen', instructorInitials: 'EC', duration: '36 hours', level: 'Beginner', rating: 4.9, ratingCount: '856', price: 'Free', image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1170', badge: 'new', badgeText: 'New', isFree: true },
  { id: '3', title: 'Cybersecurity Essentials: From Zero to Hero', category: 'Cybersecurity', instructor: 'David Wilson', instructorInitials: 'DW', duration: '28 hours', level: 'Intermediate', rating: 4.7, ratingCount: '642', price: '$89.99', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1171' },
  { id: '4', title: 'Complete Product Management Bootcamp', category: 'Business', instructor: 'Lisa Thompson', instructorInitials: 'LT', duration: '32 hours', level: 'Intermediate', rating: 4.6, ratingCount: '521', price: '$69.99', originalPrice: '$99.99', image: 'https://images.unsplash.com/photo-1693156467729-a2ffe893cc62?q=80&w=1332', badge: 'sale', badgeText: '30% OFF' },
  { id: '5', title: 'UX Design Masterclass: From Research to Prototype', category: 'Design', instructor: 'Amina Nakato', instructorInitials: 'AN', duration: '18 hours', level: 'Beginner', rating: 4.9, ratingCount: '1.5k', price: '$149.99', image: 'https://plus.unsplash.com/premium_photo-1711987533505-97c4f5dbe594?q=80&w=1355', badge: 'bestseller', badgeText: 'Bestseller' },
  { id: '6', title: 'Digital Marketing Strategy: Complete Guide 2025', category: 'Marketing', instructor: 'James Kariuki', instructorInitials: 'JK', duration: '22 hours', level: 'Beginner', rating: 4.5, ratingCount: '312', price: '$79.99', image: 'https://images.pexels.com/photos/25626587/pexels-photo-25626587.jpeg', badge: 'new', badgeText: 'New' },
  { id: '7', title: 'Node.js API Development with Express & MongoDB', category: 'Web Development', instructor: 'Peter Ochieng', instructorInitials: 'PO', duration: '20 hours', level: 'Intermediate', rating: 4.7, ratingCount: '489', price: '$99.99', image: 'https://images.pexels.com/photos/8464440/pexels-photo-8464440.jpeg' },
  { id: '8', title: 'Deep Learning with TensorFlow & PyTorch', category: 'Data Science', instructor: 'Sarah Kim', instructorInitials: 'SK', duration: '42 hours', level: 'Advanced', rating: 4.8, ratingCount: '978', price: '$179.99', originalPrice: '$249.99', image: 'https://images.pexels.com/photos/6966593/pexels-photo-6966593.jpeg', badge: 'bestseller', badgeText: 'Bestseller' },
  { id: '9', title: 'Ethical Hacking & Penetration Testing', category: 'Cybersecurity', instructor: 'Robert Brown', instructorInitials: 'RB', duration: '35 hours', level: 'Advanced', rating: 4.6, ratingCount: '387', price: '$159.99', image: 'https://images.pexels.com/photos/15410078/pexels-photo-15410078.jpeg' }
];

const CoursesGrid: React.FC<CoursesGridProps> = ({ onMobileFilterOpen }) => {
  const [view, setView] = React.useState('grid');
  const [sortBy, setSortBy] = React.useState('popular');
  const [enrollModalOpen, setEnrollModalOpen] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  return (
    <Box sx={{ flex: 1 }}>
      <EnrollmentModal open={enrollModalOpen} onClose={() => setEnrollModalOpen(false)} courseTitle={selectedCourse?.title || ''} coursePrice={selectedCourse?.price || ''} />

      {/* Results Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 3, gap: 2 }}>
        <Typography sx={{ color: '#52525b' }}>Showing <strong style={{ color: '#27272a' }}>713</strong> results</Typography>
        
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
