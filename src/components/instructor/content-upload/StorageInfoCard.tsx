import React from 'react';
import { Box, Paper, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { quotaApi } from '../../../services/upload.services';

interface StorageInfoCardProps {
  used?: number;
  total?: number;
  wired?: boolean;
}

const formatSize = (gb: number) => `${gb.toFixed(1)} GB`;

const StorageInfoCard: React.FC<StorageInfoCardProps> = ({ used, total, wired }) => {
  if (wired) {
    const { data, isLoading } = quotaApi.getQuota().useQuery();

    if (isLoading) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200', textAlign: 'center' }}>
          <CircularProgress size={24} />
        </Paper>
      );
    }

    if (!data) {
      return (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
          <Typography variant="body2" color="text.secondary">Storage info unavailable</Typography>
        </Paper>
      );
    }

    const usedGb = data.used_bytes / (1024 * 1024 * 1024);
    const totalGb = data.total_bytes / (1024 * 1024 * 1024);
    const percentage = Math.round((usedGb / totalGb) * 100);

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
            {formatSize(usedGb)} used
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatSize(totalGb)} total
          </Typography>
        </Box>
      </Paper>
    );
  }

  const percentage = Math.round((used! / total!) * 100);

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
          {formatSize(used!)} used
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatSize(total!)} total
        </Typography>
      </Box>
    </Paper>
  );
};

export default StorageInfoCard;
