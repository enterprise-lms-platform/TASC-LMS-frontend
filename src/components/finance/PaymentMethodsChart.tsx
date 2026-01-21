import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';

const PaymentMethodsChart: React.FC = () => {
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
          Payment Distribution
        </Typography>
        <IconButton size="small">
          <MoreIcon />
        </IconButton>
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
          viewBox="0 0 100 100"
          sx={{ width: 120, height: 120 }}
        >
          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="8"
            strokeDasharray="125.6 251.2"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray="75.4 251.2"
            strokeDashoffset="-125.6"
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeDasharray="50.2 251.2"
            strokeDashoffset="-201"
            transform="rotate(-90 50 50)"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Payment Methods Chart
        </Typography>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        {[
          { label: 'M-Pesa', value: '50%', color: '#8b5cf6' },
          { label: 'Card Payment', value: '30%', color: '#3b82f6' },
          { label: 'Bank Transfer', value: '20%', color: '#10b981' },
        ].map((item) => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PaymentMethodsChart;
