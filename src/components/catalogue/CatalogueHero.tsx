import React from 'react';
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface CatalogueHeroProps {
  isMobile: boolean;
  onSearch?: (query: string, category: string) => void;
}

const popularSearches = ['Python', 'React', 'Machine Learning', 'AWS', 'UX Design'];

const stats = [
  { value: '1,000+', label: 'Courses' },
  { value: '200+', label: 'Expert Instructors' },
  { value: '50K+', label: 'Happy Learners' },
  { value: '4.8', label: 'Average Rating' },
];

const CatalogueHero: React.FC<CatalogueHeroProps> = ({ isMobile, onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, category);
    }
  };

  const handlePopularClick = (term: string) => {
    setSearchQuery(term);
    if (onSearch) {
      onSearch(term, category);
    }
  };

  return (
    <Box className="catalogue-hero">
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <Chip
            icon={<MenuBookIcon sx={{ fontSize: 16 }} />}
            label="1000+ Courses Available"
            sx={{
              bgcolor: '#fff3e0',
              color: '#ffa424',
              fontWeight: 600,
              mb: 3,
              py: 2.5,
              px: 1,
              fontSize: '0.875rem',
              '& .MuiChip-icon': { color: '#ffa424' },
            }}
          />

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              color: '#18181b',
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Find Your Perfect{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Course
            </Box>
          </Typography>

          {/* Description */}
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b', mb: 4 }}>
            Explore our extensive library of courses taught by industry experts.
            Learn in-demand skills and earn recognized certifications.
          </Typography>

          {/* Search Box */}
          <Box className="search-box" sx={{ maxWidth: 700, mx: 'auto', mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', px: 3, py: 2 }}>
              <SearchIcon sx={{ color: '#a1a1aa', mr: 2, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => {
                  console.log('Typing:', e.target.value);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  width: '100%',
                  background: 'transparent',
                  color: 'inherit',
                  padding: 0,
                  margin: 0,
                  fontFamily: 'inherit',
                  cursor: 'text',
                  position: 'relative',
                  zIndex: 9999,
                  pointerEvents: 'auto',
                }}
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', md: 1 }, height: { xs: 1, md: 'auto' }, bgcolor: '#e4e4e7', my: { xs: 0, md: 1.5 } }} />

            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, borderBottom: { xs: '1px solid #e4e4e7', md: 'none' } }}>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                displayEmpty
                variant="standard"
                disableUnderline
                MenuProps={{ disableScrollLock: true }}
                sx={{ minWidth: 140, '& .MuiSelect-select': { fontSize: '0.875rem', color: '#52525b' } }}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="web">Web Development</MenuItem>
                <MenuItem value="data">Data Science</MenuItem>
                <MenuItem value="security">Cybersecurity</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </Select>
            </Box>

            <Button
              onClick={handleSearch}
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: '#ffa424',
                borderRadius: 0,
                px: 4,
                py: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#f97316', boxShadow: 'none' },
                width: { xs: '100%', md: 'auto' },
              }}
            >
              Search
            </Button>
          </Box>

          {/* Popular Searches */}
          {!isMobile && (
            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ mb: 5, gap: 1 }}>
              <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>Popular:</Typography>
              {popularSearches.map((term) => (
                <Chip
                  key={term}
                  label={term}
                  onClick={() => handlePopularClick(term)}
                  variant="outlined"
                  sx={{
                    borderColor: '#e4e4e7',
                    bgcolor: 'white',
                    color: '#52525b',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#ffb74d', bgcolor: '#fff3e0', color: '#ffa424' },
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Stats Bar */}
          <Stack
            direction="row"
            spacing={{ xs: 3, md: 8 }}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ pt: 5, borderTop: '1px solid rgba(0,0,0,0.05)', gap: { xs: 2, md: 0 } }}
          >
            {stats.map((stat) => (
              <Box key={stat.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700, color: '#27272a' }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>{stat.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CatalogueHero;
