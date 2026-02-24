import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';

// Payment method breakdown with progress bars
const methods = [
  { label: 'Card Payments', amount: '$892,400', percentage: 37, color: '#6366f1' },
  { label: 'M-Pesa', amount: '$624,200', percentage: 26, color: '#10b981' },
  { label: 'MTN MoMo', amount: '$432,600', percentage: 18, color: '#f59e0b' },
  { label: 'Airtel Money', amount: '$288,400', percentage: 12, color: '#ef4444' },
  { label: 'Pesapal Direct', amount: '$168,200', percentage: 7, color: '#8b5cf6' },
];

const PaymentMethodsChart: React.FC = () => {
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
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography fontWeight={700}>Payment Distribution</Typography>
      </Box>

      {/* Donut Visual */}
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 1 }}>
        <Box component="svg" viewBox="0 0 100 100" sx={{ width: 140, height: 140 }}>
          {/* Background circle */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          {/* Card Payments - 37% */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#6366f1" strokeWidth="10"
            strokeDasharray={`${0.37 * 238.76} ${238.76}`} transform="rotate(-90 50 50)" />
          {/* M-Pesa - 26% */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="10"
            strokeDasharray={`${0.26 * 238.76} ${238.76}`} strokeDashoffset={`${-0.37 * 238.76}`} transform="rotate(-90 50 50)" />
          {/* MTN MoMo - 18% */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="10"
            strokeDasharray={`${0.18 * 238.76} ${238.76}`} strokeDashoffset={`${-0.63 * 238.76}`} transform="rotate(-90 50 50)" />
          {/* Airtel - 12% */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="10"
            strokeDasharray={`${0.12 * 238.76} ${238.76}`} strokeDashoffset={`${-0.81 * 238.76}`} transform="rotate(-90 50 50)" />
          {/* Pesapal - 7% */}
          <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="10"
            strokeDasharray={`${0.07 * 238.76} ${238.76}`} strokeDashoffset={`${-0.93 * 238.76}`} transform="rotate(-90 50 50)" />
          {/* Center text */}
          <text x="50" y="48" textAnchor="middle" fontSize="12" fontWeight="700" fill="#27272a">$2.4M</text>
          <text x="50" y="60" textAnchor="middle" fontSize="6" fill="#a1a1aa">Total</text>
        </Box>
      </Box>

      {/* Breakdown List */}
      <Box sx={{ p: 3, pt: 2 }}>
        {methods.map((m) => (
          <Box key={m.label} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
              <Typography variant="body2" color="text.secondary">{m.amount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={m.percentage}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: m.color },
                }}
              />
              <Typography variant="caption" fontWeight={600} sx={{ minWidth: 30 }}>{m.percentage}%</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PaymentMethodsChart;
