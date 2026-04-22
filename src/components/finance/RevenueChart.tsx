import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useFinanceDashboardOverview } from '../../hooks/usePayments';

const RevenueChart: React.FC = () => {
  const { data } = useFinanceDashboardOverview();

  const monthlyRevenue = (data?.revenue_trend || []).map((row) => ({
    month: row.month,
    amount: Number(row.collected_revenue || 0),
  }));

  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.amount), 1);

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
        <Typography fontWeight={700}>Collected Revenue Trend</Typography>
      </Box>

      {/* Bar Chart */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 2, height: 280 }}>
        {monthlyRevenue.map((d) => (
          <Box key={d.month} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {Number(d.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
