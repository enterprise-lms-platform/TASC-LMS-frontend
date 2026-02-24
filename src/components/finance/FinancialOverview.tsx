import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp as MonthlyIcon,
  HourglassEmpty as PendingIcon,
  People as SubscribersIcon,
} from '@mui/icons-material';

// Finance stats data — styled like learner QuickStats
const stats = [
  {
    label: 'Total Revenue',
    value: '$2.4M',
    icon: <RevenueIcon />,
    // Green Theme
    bgcolor: '#dcfce7',
    iconBg: '#4ade80',
    color: '#14532d',
    subColor: '#166534',
  },
  {
    label: 'Monthly Revenue',
    value: '$186K',
    icon: <MonthlyIcon />,
    // Grey Theme
    bgcolor: '#f4f4f5',
    iconBg: '#a1a1aa',
    color: '#27272a',
    subColor: '#3f3f46',
  },
  {
    label: 'Pending Payments',
    value: '$24.9K',
    icon: <PendingIcon />,
    // Orange Theme
    bgcolor: '#fff3e0',
    iconBg: '#ffa424',
    color: '#7c2d12',
    subColor: '#9a3412',
  },
  {
    label: 'Active Subscribers',
    value: '1,248',
    icon: <SubscribersIcon />,
    // Green Theme (alt)
    bgcolor: '#f0fdf4',
    iconBg: '#86efac',
    color: '#14532d',
    subColor: '#166534',
  },
];

const FinancialOverview: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: stat.bgcolor,
              borderRadius: '20px',
              p: 3,
              position: 'relative',
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            {/* Icon Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: stat.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                '& svg': { fontSize: 20 },
              }}
            >
              {stat.icon}
            </Box>

            {/* Main Stat */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: stat.color,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1,
                mb: 1,
              }}
            >
              {stat.value}
            </Typography>

            {/* Label */}
            <Typography
              variant="body2"
              sx={{
                color: stat.subColor,
                fontWeight: 500,
                fontSize: '0.875rem',
                opacity: 0.8,
              }}
            >
              {stat.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default FinancialOverview;
