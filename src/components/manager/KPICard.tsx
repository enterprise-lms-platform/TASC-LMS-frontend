import React from 'react';
import { Box, Typography, Paper, IconButton, Link } from '@mui/material';
import { MoreVert as MoreVertIcon, TrendingUp, TrendingDown } from '@mui/icons-material';

interface KPICardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: 'up' | 'down';
  trendText: string;
  linkText: string;
  colorScheme: 'primary' | 'info' | 'success' | 'warning';
}

const colorSchemes = {
  primary: {
    gradient: 'linear-gradient(135deg, #ffb74d, #ffa424)',
    stripe: 'linear-gradient(90deg, #ffb74d, #ffa424)',
  },
  info: {
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    stripe: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
  },
  success: {
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    stripe: 'linear-gradient(90deg, #10b981, #34d399)',
  },
  warning: {
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    stripe: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
  },
};

const KPICard: React.FC<KPICardProps> = ({
  icon,
  value,
  label,
  trend,
  trendText,
  linkText,
  colorScheme,
}) => {
  const colors = colorSchemes[colorScheme];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: 2.5,
        border: 1,
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: colors.stripe,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.gradient,
            color: 'white',
            fontSize: 24,
          }}
        >
          {icon}
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Body */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" lineHeight={1.2}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: trend === 'up' ? 'success.main' : 'error.main',
          }}
        >
          {trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
          <Typography variant="caption" fontWeight={600}>
            {trendText}
          </Typography>
        </Box>
        <Link
          href="#"
          underline="hover"
          sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.dark' }}
        >
          {linkText}
        </Link>
      </Box>
    </Paper>
  );
};

export default KPICard;
