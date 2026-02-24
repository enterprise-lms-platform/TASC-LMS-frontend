import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const monthlyRevenue = [
  { month: 'Aug', amount: 98000 },
  { month: 'Sep', amount: 112000 },
  { month: 'Oct', amount: 124000 },
  { month: 'Nov', amount: 108000 },
  { month: 'Dec', amount: 142000 },
  { month: 'Jan', amount: 186000 },
];
const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.amount));

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  height: '100%',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const RevenueChart: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box
        sx={{
          p: 2, px: 3,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight={700}>Revenue Growth (Last 6 Months)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            Export
          </Button>
          <Button size="small" variant="outlined" startIcon={<FilterIcon sx={{ fontSize: 14 }} />}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            Filter
          </Button>
        </Box>
      </Box>

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
