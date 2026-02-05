import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface EssayQuestionProps {
  guidelines: string;
  minWords: number;
  maxWords: number;
  onGuidelinesChange: (value: string) => void;
  onMinWordsChange: (value: number) => void;
  onMaxWordsChange: (value: number) => void;
}

const EssayQuestion: React.FC<EssayQuestionProps> = ({
  guidelines,
  minWords,
  maxWords,
  onGuidelinesChange,
  onMinWordsChange,
  onMaxWordsChange,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Grading Guidelines / Rubric
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          placeholder="Enter grading criteria or rubric for this essay..."
          value={guidelines}
          onChange={(e) => onGuidelinesChange(e.target.value)}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Min words:</Typography>
          <TextField
            size="small"
            type="number"
            value={minWords}
            onChange={(e) => onMinWordsChange(Number(e.target.value))}
            sx={{ width: 80 }}
            inputProps={{ min: 0 }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Max words:</Typography>
          <TextField
            size="small"
            type="number"
            value={maxWords}
            onChange={(e) => onMaxWordsChange(Number(e.target.value))}
            sx={{ width: 80 }}
            inputProps={{ min: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EssayQuestion;
