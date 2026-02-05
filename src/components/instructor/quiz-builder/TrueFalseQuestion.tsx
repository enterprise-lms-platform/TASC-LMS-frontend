import React from 'react';
import { Box, Typography } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

interface TrueFalseQuestionProps {
  correctAnswer: boolean | null;
  onAnswerChange: (answer: boolean) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ correctAnswer, onAnswerChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Box
        onClick={() => onAnswerChange(true)}
        sx={{
          flex: 1,
          p: 3,
          border: 2,
          borderColor: correctAnswer === true ? '#10b981' : 'grey.200',
          borderRadius: 1,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: correctAnswer === true ? '#d1fae5' : 'transparent',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: '#10b981',
          },
        }}
      >
        <CheckIcon sx={{ fontSize: 32, color: '#10b981', mb: 1 }} />
        <Typography fontWeight={600}>True</Typography>
      </Box>

      <Box
        onClick={() => onAnswerChange(false)}
        sx={{
          flex: 1,
          p: 3,
          border: 2,
          borderColor: correctAnswer === false ? '#ef4444' : 'grey.200',
          borderRadius: 1,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: correctAnswer === false ? '#fee2e2' : 'transparent',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: '#ef4444',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 32, color: '#ef4444', mb: 1 }} />
        <Typography fontWeight={600}>False</Typography>
      </Box>
    </Box>
  );
};

export default TrueFalseQuestion;
