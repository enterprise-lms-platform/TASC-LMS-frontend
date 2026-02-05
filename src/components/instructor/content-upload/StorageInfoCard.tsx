import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';

interface StorageInfoCardProps {
  used: number;
  total: number;
}

const StorageInfoCard: React.FC<StorageInfoCardProps> = ({ used, total }) => {
  const percentage = Math.round((used / total) * 100);

  const formatSize = (gb: number) => {
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography fontWeight={700}>Storage</Typography>
        <Typography variant="body2" color="primary" fontWeight={600}>
          {percentage}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 1,
          mb: 1.5,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #ffb74d, #f97316)',
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {formatSize(used)} used
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatSize(total)} total
        </Typography>
      </Box>
    </Paper>
  );
};

export default StorageInfoCard;
