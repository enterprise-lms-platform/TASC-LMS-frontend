import React, { useState, useEffect } from 'react';
import { Box, Container, Stack } from '@mui/material';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import '../../styles/CourseCatalogue.css';
import CatalogueHero from '../../components/catalogue/CatalogueHero';
import FiltersSidebar, { type FilterState } from '../../components/catalogue/FiltersSidebar';
import CoursesGrid from '../../components/catalogue/CoursesGrid';
import Pagination from '../../components/catalogue/Pagination';
import FeaturedCategories from '../../components/catalogue/FeaturedCategories';
import CatalogueCtaBanner from '../../components/catalogue/CatalogueCtaBanner';
import MobileFilterDrawer from '../../components/catalogue/MobileFilterDrawer';

const PAGE_SIZE = 12;

const defaultFilters: FilterState = { categories: [], levels: [] };

const CourseCataloguePage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [heroCategory, setHeroCategory] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');

  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleSearch = (query: string, category: string) => {
    setSearch(query);
    setHeroCategory(category ? Number(category) : undefined);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearAll = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  // Merge hero category with sidebar categories
  const effectiveCategory = heroCategory ?? (filters.categories.length === 1 ? filters.categories[0] : undefined);
  const effectiveCategories = heroCategory ? [heroCategory] : filters.categories;

  return (
    <Box sx={{ width: '100%', bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Header scrolled={scrolled} />

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAll}
      />

      <CatalogueHero isMobile={isMobile} onSearch={handleSearch} />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <FiltersSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={handleClearAll}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CoursesGrid
              onMobileFilterOpen={() => setMobileFiltersOpen(true)}
              page={page}
              search={search}
              category={effectiveCategory}
              categories={effectiveCategories}
              level={filters.levels.length === 1 ? filters.levels[0] : undefined}
              levels={filters.levels}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onTotalCountChange={setTotalCount}
            />
            {pageCount > 1 && <Pagination count={pageCount} page={page} onPageChange={handlePageChange} />}
          </Box>
        </Stack>
      </Container>

      <FeaturedCategories />
      <CatalogueCtaBanner />
      <Footer />
    </Box>
  );
};

export default CourseCataloguePage;
