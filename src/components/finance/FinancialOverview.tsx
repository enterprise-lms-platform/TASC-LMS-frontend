import React from 'react';
import { Grid } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp as MonthlyIcon,
  HourglassEmpty as PendingIcon,
  Undo as RefundIcon,
} from '@mui/icons-material';
import FinancialCard from './FinancialCard';

const financialData = [
  {
    title: 'Total Revenue',
    value: '$2,458,640',
    trend: { direction: 'up' as const, value: '+18.5%', period: 'vs last year' },
    icon: <RevenueIcon />,
    iconBgColor: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    title: 'Monthly Revenue',
    value: '$186,450',
    trend: { direction: 'up' as const, value: '+15.3%', period: 'vs last month' },
    icon: <MonthlyIcon />,
    iconBgColor: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
  {
    title: 'Pending Payments',
    value: '$24,890',
    trend: { direction: 'down' as const, value: '-5.2%', period: 'vs last month' },
    icon: <PendingIcon />,
    iconBgColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    title: 'Refunds',
    value: '$3,240',
    trend: { direction: 'down' as const, value: '-12.4%', period: 'vs last month' },
    icon: <RefundIcon />,
    iconBgColor: 'linear-gradient(135deg, #ef4444, #f87171)',
  },
];

const FinancialOverview: React.FC = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
      {financialData.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <FinancialCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FinancialOverview;
