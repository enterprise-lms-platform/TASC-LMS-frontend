import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';

interface KPICardProps {
  title: string;
  value: string;
  trend: {
    direction: 'up' | 'down';
    value: string;
    period: string;
  };
  icon: React.ReactNode;
  iconBgColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, iconBgColor }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            background: iconBgColor,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
        {value}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: trend.direction === 'up' ? 'success.main' : 'error.main',
        }}
      >
        {trend.direction === 'up' ? (
          <TrendingUpIcon sx={{ fontSize: 18 }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 18 }} />
        )}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {trend.value} {trend.period}
        </Typography>
      </Box>
    </Paper>
  );
};

export default KPICard;
