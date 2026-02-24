import React from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import {
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

// Monthly revenue data for bar chart
const monthlyRevenue = [
  { month: 'Jul', amount: 142000 },
  { month: 'Aug', amount: 158000 },
  { month: 'Sep', amount: 134000 },
  { month: 'Oct', amount: 176000 },
  { month: 'Nov', amount: 168000 },
  { month: 'Dec', amount: 192000 },
  { month: 'Jan', amount: 186000 },
];
const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.amount));

const RevenueChart: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        height: '100%',
        '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 3,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight={700}>Revenue Trends</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Filter
          </Button>
          <IconButton size="small">
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Bar Chart */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 280 }}>
        {monthlyRevenue.map((d) => (
          <Box key={d.month} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              ${(d.amount / 1000).toFixed(0)}K
            </Typography>
            <Box
              sx={{
                height: `${(d.amount / maxRevenue) * 200}px`,
                background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.3s, opacity 0.2s',
                opacity: 0.85,
                '&:hover': { opacity: 1 },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {d.month}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default RevenueChart;
