import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  badgeColor: string;
  valueColor: string;
  labelColor: string;
  index?: number;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  icon, 
  bgColor, 
  badgeColor, 
  valueColor, 
  labelColor, 
  index = 0 
}) => {
  return (
    <Paper
      elevation={0}
      className={`sa-fade-in sa-fade-in-${index}`}
      sx={{
        p: 3,
        borderRadius: '20px',
        bgcolor: bgColor,
        position: 'relative',
        height: '100%',
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.2s',
        cursor: 'pointer',
        boxShadow: 'none',
        border: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Icon Badge - Top Right */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: badgeColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          '& svg': { fontSize: 20 },
        }}
      >
        {icon}
      </Box>

      {/* Main Stat */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: valueColor,
          fontSize: { xs: '2rem', md: '2.5rem' },
          lineHeight: 1,
          mb: 1,
          mt: 2
        }}
      >
        {value}
      </Typography>

      {/* Label */}
      <Typography
        variant="body2"
        sx={{
          color: labelColor,
          fontWeight: 500,
          fontSize: '0.875rem',
          opacity: 0.9,
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
};

export default KPICard;
