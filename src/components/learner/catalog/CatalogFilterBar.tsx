import React, { useState } from 'react';
import { Box, Chip, Button, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { FilterList, Sort, KeyboardArrowDown } from '@mui/icons-material';

const categories = [
  { name: 'All', count: 256 },
  { name: 'Web Development', count: 42 },
  { name: 'Data Science', count: 28 },
  { name: 'Cybersecurity', count: 15 },
  { name: 'Business', count: 36 },
];

const sortOptions = ['Popular', 'Newest', 'Highest Rated', 'Price: Low to High', 'Price: High to Low'];

interface CatalogFilterBarProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
}

const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  activeCategory = 'All',
  onCategoryChange,
  onSortChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = (sort?: string) => {
    setAnchorEl(null);
    if (sort) {
      setSelectedSort(sort);
      onSortChange?.(sort);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 3,
        mb: 4,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e4e4e7',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      {/* Filter icon and label */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <FilterList sx={{ color: 'text.secondary', fontSize: 20 }} />
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
          }}
        >
          Categories:
        </Typography>
      </Stack>

      {/* Category chips */}
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {categories.map((cat) => (
          <Chip
            key={cat.name}
            label={`${cat.name} (${cat.count})`}
            onClick={() => handleCategoryClick(cat.name)}
            sx={{
              bgcolor: selectedCategory === cat.name ? '#ffa424' : 'white',
              color: selectedCategory === cat.name ? 'white' : '#52525b',
              border: selectedCategory === cat.name ? 'none' : '1px solid #d4d4d8',
              fontWeight: 500,
              '&:hover': {
                bgcolor: selectedCategory === cat.name ? '#e59420' : 'rgba(255, 164, 36, 0.05)',
                borderColor: '#ffa424',
              },
            }}
          />
        ))}
      </Stack>

      {/* Sort dropdown */}
      <Box sx={{ ml: 'auto' }}>
        <Button
          onClick={handleSortClick}
          endIcon={<KeyboardArrowDown />}
          startIcon={<Sort />}
          sx={{
            bgcolor: 'white',
            color: '#52525b',
            border: '1px solid #d4d4d8',
            textTransform: 'none',
            px: 2,
            '&:hover': {
              bgcolor: '#fafafa',
              borderColor: '#a1a1aa',
            },
          }}
        >
          Sort by: {selectedSort}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleSortClose()}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleSortClose(option)}
              selected={option === selectedSort}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default CatalogFilterBar;
