import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface FinancialCardProps {
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

const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  value,
  trend,
  icon,
  iconBgColor,
}) => {
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
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {trend.direction === 'up' ? (
          <TrendingUp sx={{ color: 'success.main', fontSize: 18 }} />
        ) : (
          <TrendingDown sx={{ color: 'error.main', fontSize: 18 }} />
        )}
        <Typography
          variant="caption"
          sx={{
            color: trend.direction === 'up' ? 'success.main' : 'error.main',
            fontWeight: 600,
          }}
        >
          {trend.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {trend.period}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FinancialCard;
