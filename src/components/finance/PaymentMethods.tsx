import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import {
  PhoneAndroid as MpesaIcon,
  CreditCard as CardIcon,
  SimCard as MtnIcon,
  Wifi as AirtelIcon,
  Payment as PesapalIcon,
} from '@mui/icons-material';

interface PaymentMethod {
  name: string;
  icon: React.ReactNode;
  amount: string;
  percentage: number;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  { name: 'Card Payments', icon: <CardIcon />, amount: '$892,400', percentage: 37, color: '#6366f1' },
  { name: 'M-Pesa', icon: <MpesaIcon />, amount: '$624,200', percentage: 26, color: '#10b981' },
  { name: 'MTN MoMo', icon: <MtnIcon />, amount: '$432,600', percentage: 18, color: '#f59e0b' },
  { name: 'Airtel Money', icon: <AirtelIcon />, amount: '$288,400', percentage: 12, color: '#ef4444' },
  { name: 'Pesapal Direct', icon: <PesapalIcon />, amount: '$168,200', percentage: 7, color: '#8b5cf6' },
];

const PaymentMethods: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
      }}
    >
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography fontWeight={700}>Payment Methods</Typography>
      </Box>

      <Box sx={{ p: 0 }}>
        {paymentMethods.map((method, i) => (
          <Box
            key={method.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              px: 3,
              borderBottom: i < paymentMethods.length - 1 ? 1 : 0,
              borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: `${method.color}15`,
                color: method.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '& svg': { fontSize: 18 },
              }}
            >
              {method.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>{method.name}</Typography>
                <Typography variant="body2" fontWeight={700}>{method.amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={method.percentage}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { bgcolor: method.color, borderRadius: 3 },
                  }}
                />
                <Typography variant="caption" fontWeight={600} sx={{ minWidth: 28 }}>{method.percentage}%</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PaymentMethods;
