import React from 'react';
import { Box, TextField, InputAdornment, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as DetailViewIcon,
  ViewHeadline as CompactViewIcon,
} from '@mui/icons-material';
import type { GradeCategory, GradingScale } from '../../../utils/gradingUtils';
import WeightIndicator from './WeightIndicator';
import type { WeightingMode } from '../../../utils/gradingUtils';

interface GradebookToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  categories: GradeCategory[];
  onCategoryFilter: (categoryId: string | null) => void;
  gradingScale: GradingScale;
  weightingMode: WeightingMode;
  viewMode: 'compact' | 'expanded';
  onViewModeChange: (mode: 'compact' | 'expanded') => void;
}

const scaleLabels: Record<GradingScale, string> = {
  letter: 'Letter Grades (A-F)',
  percentage: 'Percentage',
  pass_fail: 'Pass / Fail',
};

const GradebookToolbar: React.FC<GradebookToolbarProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  categories,
  onCategoryFilter,
  gradingScale,
  weightingMode,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        px: 3,
        bgcolor: 'white',
        borderRadius: 2,
        border: 1,
        borderColor: 'grey.200',
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { md: 'center' },
        gap: 2,
      }}
    >
      {/* Left: Search + Category Filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'grey.400', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ width: 220 }}
        />
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          <Chip
            label="All"
            size="small"
            onClick={() => onCategoryFilter(null)}
            sx={{
              fontWeight: 600,
              bgcolor: activeCategory === null ? 'primary.main' : 'grey.100',
              color: activeCategory === null ? 'white' : 'text.secondary',
              '&:hover': { bgcolor: activeCategory === null ? 'primary.dark' : 'grey.200' },
            }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              size="small"
              onClick={() => onCategoryFilter(cat.id)}
              sx={{
                fontWeight: 600,
                bgcolor: activeCategory === cat.id ? cat.color : 'grey.100',
                color: activeCategory === cat.id ? 'white' : 'text.secondary',
                '&:hover': { opacity: 0.85 },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Right: Scale indicator + Weight + View toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          label={scaleLabels[gradingScale]}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: 'grey.300' }}
        />
        <WeightIndicator categories={categories} weightingMode={weightingMode} />
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && onViewModeChange(val)}
          size="small"
          sx={{ bgcolor: 'grey.100', borderRadius: 1, p: 0.25 }}
        >
          <ToggleButton value="expanded" sx={{ px: 1.5, py: 0.5, border: 0 }}>
            <DetailViewIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="compact" sx={{ px: 1.5, py: 0.5, border: 0 }}>
            <CompactViewIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default GradebookToolbar;
