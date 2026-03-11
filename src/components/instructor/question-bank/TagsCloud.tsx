import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';

export interface TagsCloudProps {
  /** Tags to display. When empty, component returns null. */
  tags?: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TagsCloud: React.FC<TagsCloudProps> = ({
  tags = [],
  selectedTags,
  onTagToggle,
}) => {
  if (tags.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        mt: 2,
      }}
    >
      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
        Popular Tags
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            onClick={() => onTagToggle(tag)}
            sx={{
              bgcolor: selectedTags.includes(tag) ? 'primary.main' : 'grey.100',
              color: selectedTags.includes(tag) ? 'white' : 'text.secondary',
              fontWeight: 500,
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: selectedTags.includes(tag) ? 'primary.dark' : 'primary.light',
              },
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TagsCloud;
