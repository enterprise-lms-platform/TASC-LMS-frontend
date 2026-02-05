import React from 'react';
import { Box, Typography } from '@mui/material';
import { Lightbulb as TipIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

const QuizTipsCard: React.FC = () => {
  const tips = [
    'Include a mix of question types to keep students engaged',
    'Use clear, concise language in your questions',
    'Avoid trick questions - focus on testing actual knowledge',
    'Set a reasonable time limit based on question difficulty',
    'Always preview your quiz before publishing',
  ];

  return (
    <Box
      sx={{
        bgcolor: '#dbeafe',
        border: 1,
        borderColor: '#3b82f6',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#3b82f6' }}>
        <TipIcon fontSize="small" />
        <Typography fontWeight={600}>Quiz Creation Tips</Typography>
      </Box>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {tips.map((tip, index) => (
          <Box
            component="li"
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              mb: 1,
              '&:last-child': { mb: 0 },
            }}
          >
            <CheckIcon sx={{ fontSize: 16, color: '#3b82f6', mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary">{tip}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuizTipsCard;
