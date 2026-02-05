import React from 'react';
import { Box, Chip, TextField } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface TagsInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add a tag...',
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (tags.length < maxTags && !tags.includes(inputValue.trim())) {
        onAdd(inputValue.trim());
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 1,
        p: 1,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        minHeight: 48,
        cursor: 'text',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: '0 0 0 3px rgba(255, 164, 36, 0.1)',
        },
      }}
      onClick={() => {
        const input = document.getElementById('tags-input');
        input?.focus();
      }}
    >
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          onDelete={() => onRemove(tag)}
          deleteIcon={<CloseIcon fontSize="small" />}
          sx={{
            bgcolor: 'rgba(255, 164, 36, 0.1)',
            color: 'primary.main',
            fontWeight: 500,
            '& .MuiChip-deleteIcon': {
              color: 'primary.main',
              '&:hover': {
                color: 'primary.dark',
              },
            },
          }}
        />
      ))}
      <TextField
        id="tags-input"
        variant="standard"
        placeholder={tags.length < maxTags ? placeholder : ''}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={tags.length >= maxTags}
        sx={{
          flex: 1,
          minWidth: 120,
          '& .MuiInput-root': {
            '&:before, &:after': {
              display: 'none',
            },
          },
          '& .MuiInputBase-input': {
            p: 0.5,
            fontSize: '0.875rem',
          },
        }}
        InputProps={{
          disableUnderline: true,
        }}
      />
    </Box>
  );
};

export default TagsInput;
