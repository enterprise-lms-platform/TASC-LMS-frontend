import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface ShortAnswerQuestionProps {
  sampleAnswer: string;
  charLimit: number;
  onSampleAnswerChange: (value: string) => void;
  onCharLimitChange: (value: number) => void;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  sampleAnswer,
  charLimit,
  onSampleAnswerChange,
  onCharLimitChange,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Sample Answer / Keywords
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          size="small"
          placeholder="Enter expected answer or keywords for grading..."
          value={sampleAnswer}
          onChange={(e) => onSampleAnswerChange(e.target.value)}
        />
        <Typography variant="caption" color="text.secondary">
          Used for auto-grading or as a reference for manual grading
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">Character limit:</Typography>
        <TextField
          size="small"
          type="number"
          value={charLimit}
          onChange={(e) => onCharLimitChange(Number(e.target.value))}
          sx={{ width: 80 }}
          inputProps={{ min: 0 }}
        />
      </Box>
    </Box>
  );
};

export default ShortAnswerQuestion;
