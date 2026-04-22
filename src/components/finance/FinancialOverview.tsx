import React from 'react';
import { Grid, Paper, Box, Typography, Skeleton } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp as MonthlyIcon,
  HourglassEmpty as PendingIcon,
  People as SubscribersIcon,
} from '@mui/icons-material';
import { useFinanceDashboardOverview } from '../../hooks/usePayments';

const formatCurrency = (amount: string | number, currency: string) => {
  const value = Number(amount || 0);
  return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

const FinancialOverview: React.FC = () => {
  const { data, isLoading } = useFinanceDashboardOverview();
  const currency = data?.currency || 'UGX';

  const stats = [
    { label: 'Total Collected Revenue', value: formatCurrency(data?.kpis?.total_collected_revenue || '0', currency), icon: <RevenueIcon />,
      bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Collected Revenue (This Month)', value: formatCurrency(data?.kpis?.collected_revenue_this_month || '0', currency), icon: <MonthlyIcon />,
      bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
    { label: 'Pending Invoices', value: `${data?.kpis?.pending_invoices_count ?? 0} (${formatCurrency(data?.kpis?.pending_invoices_amount || '0', currency)})`, icon: <PendingIcon />,
      bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Active Subscribers', value: `${data?.kpis?.active_subscribers ?? 0}`, icon: <SubscribersIcon />,
      bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
  ];

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
            {isLoading ? (
              <Skeleton variant="text" width={80} height={50} />
            ) : (
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
            )}

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
