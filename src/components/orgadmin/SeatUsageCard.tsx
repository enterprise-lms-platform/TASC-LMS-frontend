import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Button,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery } from '@tanstack/react-query';
import { seatManagementApi } from '../../services/organization.services';

const SeatUsageCard: React.FC = () => {
  const { data: seatData, isLoading } = useQuery({
    queryKey: ['seat-usage'],
    queryFn: () => seatManagementApi.getSeatUsage().then((r) => r.data),
  });

  const maxSeats = seatData?.seats.max ?? 0;
  const usedSeats = seatData?.seats.used ?? 0;
  const remainingSeats = seatData?.seats.remaining ?? 0;
  const percentUsed = seatData?.seats.percent_used ?? 0;
  const atWarning = seatData?.seats.at_warning ?? false;
  const atCapacity = seatData?.seats.at_capacity ?? false;

  const getProgressColor = () => {
    if (atCapacity) return 'error';
    if (atWarning) return 'warning';
    return 'success';
  };

  if (isLoading) {
    return <Paper sx={{ p: 3 }}><Typography>Loading seat data...</Typography></Paper>;
  }

  if (!maxSeats) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PeopleIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Seat Usage</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          No seat limit configured for your organization.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PeopleIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Seat Usage
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {usedSeats} of {maxSeats} seats used
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {Math.round(percentUsed)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(percentUsed, 100)}
          color={getProgressColor() as any}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {atCapacity && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<WarningIcon />} label="Seat Limit Reached" color="error" size="small" />
        </Box>
      )}

      {atWarning && !atCapacity && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<WarningIcon />} label={`${remainingSeats} seats remaining`} color="warning" size="small" />
        </Box>
      )}

      {!atCapacity && !atWarning && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip icon={<CheckCircleIcon />} label={`${remainingSeats} seats available`} color="success" size="small" />
        </Box>
      )}

      {atCapacity && (
        <Box>
          <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
            You have reached your seat limit. Upgrade your subscription to add more learners.
          </Typography>
          <Button variant="contained" fullWidth disabled>
            At Seat Limit - Upgrade to Add More
          </Button>
        </Box>
      )}

      {atWarning && !atCapacity && (
        <Button variant="outlined" fullWidth size="small" href="/org-admin/billing">
          Upgrade Plan
        </Button>
      )}

      {!atCapacity && !atWarning && (
        <Button variant="outlined" fullWidth size="small" href="/org-admin/invite">
          Add Members
        </Button>
      )}
    </Paper>
  );
};

export default SeatUsageCard;