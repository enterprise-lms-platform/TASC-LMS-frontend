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
          Revenue Growth (Last 6 Months)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderColor: 'rgba(0,0,0,0.08)',
              color: 'text.secondary',
              borderRadius: 2,
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterIcon sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderColor: 'rgba(0,0,0,0.08)',
              color: 'text.secondary',
              borderRadius: 2,
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
            }}
          >
            Filter
          </Button>
        </Box>
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
        <ChartIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, position: 'relative', zIndex: 1 }} />
        <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500, fontSize: '0.82rem', position: 'relative', zIndex: 1 }}>
          Revenue Growth Chart
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, position: 'relative', zIndex: 1, fontSize: '0.75rem' }}>
          $186K total revenue this month
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenueChart;
