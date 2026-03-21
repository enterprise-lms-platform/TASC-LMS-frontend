import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { publicCategoryApi } from '../../services/public.services';

const FilterSection: React.FC<{ title: string; children: React.ReactNode; defaultExpanded?: boolean }> = ({
  title,
  children,
  defaultExpanded = true,
}) => (
  <Accordion
    defaultExpanded={defaultExpanded}
    disableGutters
    elevation={0}
    sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid #e4e4e7' }}
  >
    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 16, color: '#a1a1aa' }} />}>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#3f3f46' }}>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ pt: 0, pb: 2 }}>{children}</AccordionDetails>
  </Accordion>
);

export interface FilterState {
  categories: number[];
  levels: string[];
}

interface FiltersSidebarProps {
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
  onClearAll?: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ filters, onFiltersChange, onClearAll }) => {
  const selectedCategories = filters?.categories ?? [];
  const selectedLevels = filters?.levels ?? [];

  const { data: categoriesData } = useQuery({
    queryKey: ['publicCategories'],
    queryFn: () => publicCategoryApi.getAll(),
  });

  const apiData = (categoriesData as any)?.data;
  const categories: { id: number; label: string }[] = (apiData?.results || []).map((cat: any) => ({
    id: cat.id,
    label: cat.name,
  }));

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const handleCategoryToggle = (catId: number) => {
    const updated = selectedCategories.includes(catId)
      ? selectedCategories.filter((id) => id !== catId)
      : [...selectedCategories, catId];
    onFiltersChange?.({ categories: updated, levels: selectedLevels });
  };

  const handleLevelToggle = (level: string) => {
    const updated = selectedLevels.includes(level)
      ? selectedLevels.filter((l) => l !== level)
      : [...selectedLevels, level];
    onFiltersChange?.({ categories: selectedCategories, levels: updated });
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedLevels.length > 0;

  return (
    <Box className="filters-sidebar" sx={{ width: 280, flexShrink: 0 }}>
      <Paper elevation={0} sx={{ border: '1px solid #e4e4e7', borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: '1px solid #e4e4e7',
            bgcolor: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <TuneIcon sx={{ color: '#ffa424', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600, color: '#27272a' }}>Filters</Typography>
          </Stack>
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={onClearAll}
              sx={{
                color: '#ffa424',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: 'auto',
                p: 0,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Category */}
        <FilterSection title="Category">
          <FormGroup>
            {categories.map((cat) => (
              <FormControlLabel
                key={cat.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                    sx={{ color: '#d4d4d8', '&.Mui-checked': { color: '#ffa424' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>{cat.label}</Typography>}
                sx={{ ml: 0, mr: 0 }}
              />
            ))}
          </FormGroup>
        </FilterSection>

        {/* Level */}
        <FilterSection title="Level">
          <FormGroup>
            {levels.map((lvl) => (
              <FormControlLabel
                key={lvl.value}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedLevels.includes(lvl.value)}
                    onChange={() => handleLevelToggle(lvl.value)}
                    sx={{ color: '#d4d4d8', '&.Mui-checked': { color: '#ffa424' } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>{lvl.label}</Typography>}
                sx={{ ml: 0 }}
              />
            ))}
          </FormGroup>
        </FilterSection>
      </Paper>
    </Box>
  );
};

export default FiltersSidebar;
