import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  colorScheme: 'primary' | 'info' | 'success' | 'warning';
}

const colorSchemes = {
  primary: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  info: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  success: 'linear-gradient(135deg, #10b981, #34d399)',
  warning: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, colorScheme }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        p: 2,
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colorSchemes[colorScheme],
          color: 'white',
          fontSize: 22,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;
