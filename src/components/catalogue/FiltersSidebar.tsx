import React from 'react';
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
  TextField,
  Slider,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

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

interface FilterOption {
  label: string;
  count: number;
}

const categories: FilterOption[] = [
  { label: 'Web Development', count: 142 },
  { label: 'Data Science', count: 98 },
  { label: 'Cybersecurity', count: 67 },
  { label: 'Business', count: 124 },
  { label: 'Design', count: 89 },
  { label: 'Marketing', count: 76 },
];

const levels: FilterOption[] = [
  { label: 'Beginner', count: 245 },
  { label: 'Intermediate', count: 312 },
  { label: 'Advanced', count: 156 },
];

const durations: FilterOption[] = [
  { label: '0-5 hours', count: 145 },
  { label: '5-20 hours', count: 298 },
  { label: '20+ hours', count: 270 },
];

const features: string[] = ['Certificate Included', 'Hands-on Projects', 'Live Sessions', 'Subtitles Available'];

const FiltersSidebar: React.FC = () => {
  const [priceRange, setPriceRange] = React.useState<number[]>([0, 200]);
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);

  const renderFilterOption = (item: FilterOption) => (
    <FormControlLabel
      key={item.label}
      control={<Checkbox size="small" sx={{ color: '#d4d4d8', '&.Mui-checked': { color: '#ffa424' } }} />}
      label={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>{item.label}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', bgcolor: '#f4f4f5', px: 1, py: 0.25, borderRadius: 10 }}>
            {item.count}
          </Typography>
        </Box>
      }
      sx={{ ml: 0, mr: 0, width: '100%', '& .MuiFormControlLabel-label': { width: '100%' } }}
    />
  );

  const renderRatingOption = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    return (
      <Box
        key={rating}
        onClick={() => setSelectedRating(rating)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          py: 0.5,
          px: 0.5,
          borderRadius: 1,
          bgcolor: selectedRating === rating ? '#fff3e0' : 'transparent',
          '&:hover': { bgcolor: '#fff3e0' },
        }}
      >
        <Stack direction="row" spacing={0.25} sx={{ color: '#f59e0b', mr: 1 }}>
          {[...Array(fullStars)].map((_, i) => (
            <StarIcon key={i} sx={{ fontSize: 14 }} />
          ))}
          {hasHalf && <StarHalfIcon sx={{ fontSize: 14 }} />}
          {[...Array(5 - Math.ceil(rating))].map((_, i) => (
            <StarBorderIcon key={i} sx={{ fontSize: 14, color: '#d4d4d8' }} />
          ))}
        </Stack>
        <Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>{rating} & up</Typography>
      </Box>
    );
  };

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
          <Button
            size="small"
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
        </Box>

        {/* Category */}
        <FilterSection title="Category">
          <FormGroup>{categories.map(renderFilterOption)}</FormGroup>
        </FilterSection>

        {/* Level */}
        <FilterSection title="Level">
          <FormGroup>{levels.map(renderFilterOption)}</FormGroup>
        </FilterSection>

        {/* Price */}
        <FilterSection title="Price">
          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={<Checkbox size="small" sx={{ color: '#d4d4d8', '&.Mui-checked': { color: '#ffa424' } }} />}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>Free</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', bgcolor: '#f4f4f5', px: 1, py: 0.25, borderRadius: 10 }}>87</Typography>
                </Box>
              }
              sx={{ ml: 0, mr: 0, width: '100%', '& .MuiFormControlLabel-label': { width: '100%' } }}
            />
            <FormControlLabel
              control={<Checkbox size="small" sx={{ color: '#d4d4d8', '&.Mui-checked': { color: '#ffa424' } }} />}
              label={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>Paid</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#a1a1aa', bgcolor: '#f4f4f5', px: 1, py: 0.25, borderRadius: 10 }}>626</Typography>
                </Box>
              }
              sx={{ ml: 0, mr: 0, width: '100%', '& .MuiFormControlLabel-label': { width: '100%' } }}
            />
          </FormGroup>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <TextField size="small" value={`$${priceRange[0]}`} sx={{ width: 70, '& input': { textAlign: 'center', fontSize: '0.875rem' } }} />
            <Typography sx={{ color: '#a1a1aa' }}>-</Typography>
            <TextField size="small" value={`$${priceRange[1]}`} sx={{ width: 70, '& input': { textAlign: 'center', fontSize: '0.875rem' } }} />
          </Stack>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as number[])}
            max={500}
            sx={{ color: '#ffb74d' }}
          />
        </FilterSection>

        {/* Duration */}
        <FilterSection title="Duration">
          <FormGroup>{durations.map(renderFilterOption)}</FormGroup>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating">
          <Stack spacing={0.5}>
            {[4.5, 4.0, 3.5].map(renderRatingOption)}
          </Stack>
        </FilterSection>

        {/* Features */}
        <FilterSection title="Features">
          <FormGroup>
            {features.map((feature) => (
              <FormControlLabel
                key={feature}
                control={<Checkbox size="small" sx={{ color: '#d4d4d8', '&.Mui-checked': { color: '#ffa424' } }} />}
                label={<Typography sx={{ fontSize: '0.875rem', color: '#52525b' }}>{feature}</Typography>}
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
