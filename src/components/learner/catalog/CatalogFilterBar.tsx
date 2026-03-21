import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Select, MenuItem, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { publicCategoryApi } from '../../../services/public.services';

interface CatalogFilterBarProps {
  searchQuery?: string;
  onSearch?: (query: string, categoryId?: number) => void;
}

const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  searchQuery: initialQuery = '',
  onSearch,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['publicCategories'],
    queryFn: () => publicCategoryApi.getAll(),
  });

  const categories = categoriesData?.data?.results ?? [];

  const handleSearch = () => {
    onSearch?.(query, category ? Number(category) : undefined);
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        mb: 4,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e4e4e7',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
      }}
    >
      {/* Search Input */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', px: 3, py: 1.5 }}>
        <SearchIcon sx={{ color: '#a1a1aa', mr: 1.5, flexShrink: 0 }} />
        <InputBase
          placeholder="What do you want to learn?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1, fontSize: '0.95rem' }}
          fullWidth
        />
      </Box>

      {/* Divider */}
      <Box sx={{ width: { xs: '100%', md: '1px' }, height: { xs: '1px', md: 'auto' }, bgcolor: '#e4e4e7', my: { xs: 0, md: 1.5 } }} />

      {/* Category Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
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
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={String(cat.id)}>{cat.name}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        variant="contained"
        startIcon={<SearchIcon />}
        sx={{
          bgcolor: '#ffa424',
          borderRadius: 0,
          px: 4,
          py: 1.5,
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
  );
};

export default CatalogFilterBar;
