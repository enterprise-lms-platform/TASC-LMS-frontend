import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Switch } from '@mui/material';
import { Chip } from '@mui/material';

interface ContentDetailsFormProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  requireCompletion: boolean;
  includeInProgress: boolean;
  downloadable: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  onRequireCompletionChange: (checked: boolean) => void;
  onIncludeInProgressChange: (checked: boolean) => void;
  onDownloadableChange: (checked: boolean) => void;
}

const ContentDetailsForm: React.FC<ContentDetailsFormProps> = ({
  title,
  description,
  category,
  tags,
  requireCompletion,
  includeInProgress,
  downloadable,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onTagsChange,
  onRequireCompletionChange,
  onIncludeInProgressChange,
  onDownloadableChange,
}) => {
  const [tagInput, setTagInput] = React.useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        onTagsChange([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Content Title"
        required
        fullWidth
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="e.g., Introduction to React Hooks"
      />

      <TextField
        label="Description"
        multiline
        rows={3}
        fullWidth
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Brief description of the content..."
      />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select value={category} label="Category" onChange={(e) => onCategoryChange(e.target.value)}>
          <MenuItem value="lesson">Lesson</MenuItem>
          <MenuItem value="tutorial">Tutorial</MenuItem>
          <MenuItem value="resource">Resource</MenuItem>
          <MenuItem value="supplementary">Supplementary Material</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <TextField
          label="Tags"
          fullWidth
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Press Enter to add tags"
          helperText="Add tags to help organize your content"
        />
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                sx={{ bgcolor: 'rgba(255, 164, 36, 0.1)', color: 'primary.main' }}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Require completion
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Learners must finish before proceeding
              </Typography>
            </Box>
            <Switch checked={requireCompletion} onChange={(e) => onRequireCompletionChange(e.target.checked)} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Include in progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Count towards course completion
              </Typography>
            </Box>
            <Switch checked={includeInProgress} onChange={(e) => onIncludeInProgressChange(e.target.checked)} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Downloadable
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Allow learners to download
              </Typography>
            </Box>
            <Switch checked={downloadable} onChange={(e) => onDownloadableChange(e.target.checked)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentDetailsForm;
