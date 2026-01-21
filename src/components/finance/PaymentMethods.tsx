import React from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import {
  PhoneAndroid as MpesaIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';

interface PaymentMethod {
  name: string;
  icon: React.ReactNode;
  amount: string;
  percentage: number;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    name: 'M-Pesa',
    icon: <MpesaIcon />,
    amount: '$93,225',
    percentage: 50,
    color: '#8b5cf6',
  },
  {
    name: 'Card Payment',
    icon: <CardIcon />,
    amount: '$55,935',
    percentage: 30,
    color: '#3b82f6',
  },
  {
    name: 'Bank Transfer',
    icon: <BankIcon />,
    amount: '$37,290',
    percentage: 20,
    color: '#10b981',
  },
];

const PaymentMethods: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
        Payment Methods
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {paymentMethods.map((method) => (
          <Box key={method.name}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: `${method.color}15`,
                    color: method.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {method.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {method.name}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {method.amount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {method.percentage}%
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={method.percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': {
                  bgcolor: method.color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PaymentMethods;
