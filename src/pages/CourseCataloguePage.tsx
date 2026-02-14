import React, { useState, useEffect } from 'react';
import { Box, Container, Stack } from '@mui/material';
// Reuse existing landing components
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import MobileDrawer from '../components/landing/MobileDrawer';
// Catalogue components
import '../styles/CourseCatalogue.css';
import CatalogueHero from '../components/catalogue/CatalogueHero';
import FiltersSidebar from '../components/catalogue/FiltersSidebar';
import CoursesGrid from '../components/catalogue/CoursesGrid';
import Pagination from '../components/catalogue/Pagination';
import FeaturedCategories from '../components/catalogue/FeaturedCategories';
import CatalogueCtaBanner from '../components/catalogue/CatalogueCtaBanner';
import MobileFilterDrawer from '../components/catalogue/MobileFilterDrawer';

const CourseCataloguePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobile(window.innerWidth < 768);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box sx={{ width: '100%', bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <Header scrolled={scrolled} onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobile={isMobile} />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} />

      {/* Hero Section */}
      <CatalogueHero isMobile={isMobile} />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          {/* Sidebar (Desktop only) */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <FiltersSidebar />
          </Box>

          {/* Grid Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CoursesGrid onMobileFilterOpen={() => setMobileFiltersOpen(true)} />
            <Pagination />
          </Box>
        </Stack>
      </Container>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* CTA Banner */}
      <CatalogueCtaBanner />

      {/* Footer */}
      <Footer isMobile={isMobile} />
    </Box>
  );
};

export default CourseCataloguePage;
