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
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          User Acquisition
        </Typography>
        <IconButton size="small">
          <MoreIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          height: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          borderRadius: 2,
        }}
      >
        <UserAddIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          User Growth Chart
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          2,450 new users this month
        </Typography>
      </Box>
    </Paper>
  );
};

export default UserGrowthChart;
