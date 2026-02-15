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
  index?: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, iconBgColor, index = 0 }) => {
  return (
    <Paper
      elevation={0}
      className={`sa-fade-in sa-fade-in-${index}`}
      sx={{
        p: 2.5,
        borderRadius: '1rem',
        border: 'none',
        borderTop: '2px solid',
        borderImage: 'linear-gradient(90deg, #ffa424, #f97316) 1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
          transform: 'translateY(-3px) scale(1.01)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.8rem' }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            background: iconBgColor,
            '& .MuiSvgIcon-root': { fontSize: 22 },
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75, fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
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
          <TrendingUpIcon sx={{ fontSize: 16 }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16 }} />
        )}
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
          {trend.value} {trend.period}
        </Typography>
      </Box>
    </Paper>
  );
};

export default KPICard;
