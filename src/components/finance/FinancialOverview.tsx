import React from 'react';
import { Grid, Paper, Box, Typography, Skeleton } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  TrendingUp as MonthlyIcon,
  HourglassEmpty as PendingIcon,
  People as SubscribersIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { transactionApi, invoiceApi, userSubscriptionApi } from '../../services/payments.services';
import type { PaginatedResponse } from '../../types/types';

const formatCurrency = (amount: number) => {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
};

const FinancialOverview: React.FC = () => {
  const { data: txData, isLoading: lt } = useQuery({
    queryKey: ['finance', 'transactions', 'overview'],
    queryFn: () => transactionApi.getAll({ page_size: 200 }).then(r => r.data),
  });
  const { data: invoicesData, isLoading: li } = useQuery({
    queryKey: ['finance', 'invoices', 'pending'],
    queryFn: () => invoiceApi.getAll({ status: 'pending' }).then(r => r.data),
  });
  const { data: subsData, isLoading: ls } = useQuery({
    queryKey: ['finance', 'subscriptions', 'active'],
    queryFn: () => userSubscriptionApi.getAll({ status: 'active' }).then(r => r.data),
  });

  const transactions = (txData as PaginatedResponse<{ amount?: string; created_at?: string }> | undefined)?.results ?? [];
  const totalRevenue = transactions.reduce((sum, t) => sum + (parseFloat(t.amount || '0') || 0), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthlyTx = transactions.filter(t => (t.created_at || '') >= monthStart);
  const monthlyRevenue = monthlyTx.reduce((sum, t) => sum + (parseFloat(t.amount || '0') || 0), 0);

  const pendingInvoices = (invoicesData as PaginatedResponse<{ total_amount?: string }> | undefined)?.results ?? [];
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount || '0') || 0), 0);

  const activeSubs = (subsData as PaginatedResponse<unknown> | undefined)?.count
    ?? (subsData as PaginatedResponse<unknown> | undefined)?.results?.length ?? 0;

  const isLoading = lt || li || ls;

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: <RevenueIcon />,
      bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Monthly Revenue', value: formatCurrency(monthlyRevenue), icon: <MonthlyIcon />,
      bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
    { label: 'Pending Payments', value: formatCurrency(pendingTotal), icon: <PendingIcon />,
      bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Active Subscribers', value: activeSubs.toLocaleString(), icon: <SubscribersIcon />,
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
