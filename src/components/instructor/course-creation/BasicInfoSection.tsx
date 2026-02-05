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
} from '@mui/material';
import TagsInput from './TagsInput';

interface BasicInfoData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory: string;
  tags: string[];
}

interface BasicInfoSectionProps {
  data: BasicInfoData;
  onChange: (data: BasicInfoData) => void;
}

const categories = [
  { value: 'web-dev', label: 'Web Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'mobile-dev', label: 'Mobile Development' },
  { value: 'cloud', label: 'Cloud Computing' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
];

const subcategories: Record<string, { value: string; label: string }[]> = {
  'web-dev': [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'node', label: 'Node.js' },
  ],
  'data-science': [
    { value: 'python', label: 'Python' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'data-analysis', label: 'Data Analysis' },
  ],
  'mobile-dev': [
    { value: 'react-native', label: 'React Native' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'ios', label: 'iOS Development' },
    { value: 'android', label: 'Android Development' },
  ],
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof BasicInfoData, value: string | string[]) => {
    onChange({ ...data, [field]: value });
  };

  const availableSubcategories = data.category ? subcategories[data.category] || [] : [];

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
              handleChange('category', e.target.value);
              handleChange('subcategory', ''); // Reset subcategory when category changes
            }}
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!data.category}>
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={data.subcategory}
            label="Subcategory"
            onChange={(e) => handleChange('subcategory', e.target.value)}
          >
            <MenuItem value="">Select a subcategory</MenuItem>
            {availableSubcategories.map((sub) => (
              <MenuItem key={sub.value} value={sub.value}>
                {sub.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Tags */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Tags
        </Typography>
        <TagsInput
          tags={data.tags}
          onAdd={(tag) => handleChange('tags', [...data.tags, tag])}
          onRemove={(tag) => handleChange('tags', data.tags.filter((t) => t !== tag))}
          placeholder="Add a tag..."
        />
        <FormHelperText>
          Press Enter to add a tag. Tags help learners discover your course.
        </FormHelperText>
      </Box>
    </Paper>
  );
};

export default BasicInfoSection;
export type { BasicInfoData };
