import React from 'react';
import { Box, Paper, Typography, Button, Skeleton } from '@mui/material';
import {
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useRevenueTrends } from '../../services/learning.services';
import { exportApi } from '../../services/superadmin.services';

const RevenueChartComponent: React.FC = () => {
  const { data, isLoading } = useRevenueTrends(6);

  const labels = data?.labels ?? [];
  const revenue = data?.revenue ?? [];
  const maxRevenue = revenue.length > 0 ? Math.max(...revenue) : 1;

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  height: '100%',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

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
          <Button size="small" variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />} onClick={() => exportApi.transactions()}
            sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            Export
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ p: 3, display: 'flex', gap: 2, height: 280 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton width="100%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 1 }} />
              <Skeleton width="100%" height={20} sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 280 }}>
          {labels.map((month, idx) => {
            const amount = revenue[idx] || 0;
            return (
              <Box key={month} sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  ${(amount / 1000).toFixed(0)}K
                </Typography>
                <Box
                  sx={{
                    height: `${(amount / maxRevenue) * 200}px`,
                    background: 'linear-gradient(180deg, #ffa424, #ffb74d)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s, opacity 0.2s',
                    opacity: 0.85,
                    '&:hover': { opacity: 1 },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default RevenueChartComponent;
