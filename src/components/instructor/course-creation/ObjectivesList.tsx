import React from 'react';
import { Box, TextField, IconButton, Button, Typography } from '@mui/material';
import {
  DragIndicator as DragIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface ObjectivesListProps {
  objectives: string[];
  onChange: (objectives: string[]) => void;
  minItems?: number;
  maxItems?: number;
}

const ObjectivesList: React.FC<ObjectivesListProps> = ({
  objectives,
  onChange,
  minItems = 1,
  maxItems = 10,
}) => {
  const handleChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    onChange(newObjectives);
  };

  const handleAdd = () => {
    if (objectives.length < maxItems) {
      onChange([...objectives, '']);
    }
  };

  const handleRemove = (index: number) => {
    if (objectives.length > minItems) {
      const newObjectives = objectives.filter((_, i) => i !== index);
      onChange(newObjectives);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {objectives.map((objective, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: 1,
              borderColor: 'grey.200',
            }}
          >
            <DragIcon
              sx={{
                color: 'grey.400',
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
              }}
            />
            <TextField
              fullWidth
              variant="standard"
              placeholder="What will learners be able to do after completing this course?"
              value={objective}
              onChange={(e) => handleChange(index, e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '0.95rem',
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemove(index)}
              disabled={objectives.length <= minItems}
              sx={{
                color: 'grey.400',
                '&:hover': { color: 'error.main' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Button
        startIcon={<AddIcon />}
        onClick={handleAdd}
        disabled={objectives.length >= maxItems}
        sx={{
          mt: 2,
          py: 1.5,
          width: '100%',
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'grey.300',
          bgcolor: 'transparent',
          color: 'text.secondary',
          fontWeight: 500,
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'rgba(255, 164, 36, 0.05)',
          },
        }}
      >
        Add Learning Objective
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Add at least {minItems} clear, measurable objectives (minimum {minItems}, maximum {maxItems})
      </Typography>
    </Box>
  );
};

export default ObjectivesList;
