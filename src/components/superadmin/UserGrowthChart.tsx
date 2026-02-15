import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import {
  MoreHoriz as MoreIcon,
  PersonAdd as UserAddIcon,
} from '@mui/icons-material';

const UserGrowthChart: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        height: '100%',
        transition: 'box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>
          User Acquisition
        </Typography>
        <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}>
          <MoreIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      {/* Shimmer skeleton placeholder */}
      <Box
        sx={{
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          border: '1.5px dashed',
          borderColor: 'rgba(0,0,0,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          className="sa-shimmer"
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.5,
          }}
        />
        <UserAddIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, position: 'relative', zIndex: 1 }} />
        <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500, fontSize: '0.82rem', position: 'relative', zIndex: 1 }}>
          User Growth Chart
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, position: 'relative', zIndex: 1, fontSize: '0.75rem' }}>
          2,450 new users this month
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserGrowthChart;
