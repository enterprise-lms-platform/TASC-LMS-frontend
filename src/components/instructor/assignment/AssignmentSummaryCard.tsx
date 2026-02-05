import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Star as PointsIcon,
  FormatListBulleted as CriteriaIcon,
  Timer as TimeIcon,
  Replay as AttemptsIcon,
} from '@mui/icons-material';

interface AssignmentSummaryCardProps {
  totalPoints: number;
  criteriaCount: number;
  estimatedTime: string;
  allowedAttempts: string;
}

const AssignmentSummaryCard: React.FC<AssignmentSummaryCardProps> = ({
  totalPoints,
  criteriaCount,
  estimatedTime,
  allowedAttempts,
}) => {
  const stats = [
    { icon: <PointsIcon />, value: totalPoints, label: 'Total Points' },
    { icon: <CriteriaIcon />, value: criteriaCount, label: 'Criteria' },
    { icon: <TimeIcon />, value: estimatedTime, label: 'Est. Time' },
    { icon: <AttemptsIcon />, value: allowedAttempts, label: 'Attempts' },
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
        borderRadius: 2,
        p: 3,
        color: 'white',
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Assignment Summary
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label} sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700}>
              {stat.value}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AssignmentSummaryCard;
