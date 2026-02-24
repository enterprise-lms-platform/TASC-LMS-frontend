import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Autocomplete,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useCategories, useTags } from '../../../hooks/useCatalogue';

export interface BasicInfoData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: number | '';
  subcategory: string;
  tags: number[];
}

interface BasicInfoSectionProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ data, onChange }) => {
  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  // Fetch all tags from API
  const { data: tagsData, isLoading: tagsLoading } = useTags();

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any)?.results ?? [];

  const tags = Array.isArray(tagsData)
    ? tagsData
    : (tagsData as any)?.results ?? [];

  const handleChange = (field: keyof BasicInfoData, value: string | number | number[]) => {
    onChange({ ...data, [field]: value });
  };

  // Find selected tag objects for Autocomplete value
  const selectedTags = tags.filter((t: any) => data.tags.includes(t.id));

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      {/* Section Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
          Basic Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the essential details of your course
        </Typography>
      </Box>

      {/* Course Title */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Course Title"
          placeholder="e.g., Advanced React Patterns for Modern Web Development"
          value={data.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          inputProps={{ maxLength: 100 }}
          helperText={
            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>A clear, compelling title that describes what learners will achieve</span>
              <span>{data.title.length}/100 characters</span>
            </Box>
          }
        />
      </Box>

      {/* Short Description */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Short Description"
          placeholder="Write a brief summary that captures the essence of your course..."
          value={data.shortDescription}
          onChange={(e) => handleChange('shortDescription', e.target.value)}
          required
          inputProps={{ maxLength: 250 }}
          helperText={
            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>This will appear in course cards and search results</span>
              <span>{data.shortDescription.length}/250 characters</span>
            </Box>
          }
        />
      </Box>

      {/* Full Description */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Full Description"
          placeholder="Provide a comprehensive description of your course..."
          value={data.fullDescription}
          onChange={(e) => handleChange('fullDescription', e.target.value)}
          required
          helperText="Describe what learners will gain, course structure, and any unique aspects"
        />
      </Box>

      {/* Category & Subcategory */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={data.category}
            label="Category"
            onChange={(e) => {
              const raw = String(e.target.value);
              const val = raw === '' ? '' : Number(raw);
              onChange({ ...data, category: val as typeof data.category, subcategory: '' });
            }}
            disabled={categoriesLoading}
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((cat: any) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {categoriesLoading && <FormHelperText>Loading categories...</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          label="Subcategory (Optional)"
          placeholder="e.g., React, Machine Learning"
          value={data.subcategory}
          onChange={(e) => handleChange('subcategory', e.target.value)}
        />
      </Box>

      {/* Tags - Autocomplete from API */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Tags
        </Typography>
        <Autocomplete
          multiple
          options={tags}
          getOptionLabel={(option: any) => option.name}
          value={selectedTags}
          loading={tagsLoading}
          onChange={(_e, newValue) => {
            handleChange('tags', newValue.map((t: any) => t.id));
          }}
          isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={data.tags.length < 10 ? 'Search and add tags...' : ''}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {tagsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option: any, index: number) => {
              const { key, ...rest } = getTagProps({ index });
              return (
                <Chip
                  key={key}
                  label={option.name}
                  size="small"
                  deleteIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    bgcolor: 'rgba(255, 164, 36, 0.1)',
                    color: 'primary.main',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                      '&:hover': { color: 'primary.dark' },
                    },
                  }}
                  {...rest}
                />
              );
            })
          }
          limitTags={10}
          sx={{
            '& .MuiOutlinedInput-root': {
              minHeight: 48,
            },
          }}
        />
        <FormHelperText>
          Select tags to help learners discover your course.
        </FormHelperText>
      </Box>
    </Paper>
  );
};

export default BasicInfoSection;
