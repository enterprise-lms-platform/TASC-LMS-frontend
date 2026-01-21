import React from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import {
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Revenue Trends
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Filter
          </Button>
          <IconButton size="small">
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Chart Placeholder */}
      <Box
        sx={{
          height: 300,
          bgcolor: 'grey.50',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 100 60"
          sx={{ width: 120, height: 72, color: 'grey.300' }}
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points="5,50 20,40 35,45 50,25 65,30 80,15 95,20"
          />
          <circle cx="5" cy="50" r="2" fill="#8b5cf6" />
          <circle cx="20" cy="40" r="2" fill="#8b5cf6" />
          <circle cx="35" cy="45" r="2" fill="#8b5cf6" />
          <circle cx="50" cy="25" r="2" fill="#8b5cf6" />
          <circle cx="65" cy="30" r="2" fill="#8b5cf6" />
          <circle cx="80" cy="15" r="2" fill="#8b5cf6" />
          <circle cx="95" cy="20" r="2" fill="#8b5cf6" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Revenue Trend Chart
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenueChart;
