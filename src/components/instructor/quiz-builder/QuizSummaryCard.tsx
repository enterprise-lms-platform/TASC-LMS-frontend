import React from 'react';
import { Box, Typography } from '@mui/material';

interface QuizSummaryCardProps {
  totalQuestions: number;
  totalPoints: number;
  estimatedTime: number;
  passingScore: number;
}

const QuizSummaryCard: React.FC<QuizSummaryCardProps> = ({
  totalQuestions,
  totalPoints,
  estimatedTime,
  passingScore,
}) => {
  const stats = [
    { label: 'Questions', value: totalQuestions },
    { label: 'Total Points', value: totalPoints },
    { label: 'Est. Time', value: `${estimatedTime}m` },
    { label: 'Pass Score', value: `${passingScore}%` },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
        borderRadius: 2,
        p: 3,
        color: 'white',
      }}
    >
      <Typography fontWeight={700} mb={2}>Quiz Summary</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default QuizSummaryCard;
