import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';

const RevenueChart: React.FC = () => {
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
          Revenue Growth (Last 6 Months)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ textTransform: 'none' }}
          >
            Filter
          </Button>
        </Box>
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
        <ChartIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Revenue Growth Chart
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          $186K total revenue this month
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenueChart;
