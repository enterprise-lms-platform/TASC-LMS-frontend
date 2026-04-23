import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CssBaseline,
  Grid,
  LinearProgress,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  CalendarMonth as MonthRevenueIcon,
  TaskAlt as CompletionRateIcon,
  ErrorOutline as FailedPaymentsIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useFinanceAnalyticsOverview } from '../../hooks/usePayments';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
};

const FinanceAnalyticsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [months, setMonths] = useState<6 | 12>(6);
  const { data, isLoading } = useFinanceAnalyticsOverview(months);

  const formatMoney = (amount: string | undefined) => {
    const value = Number(amount || 0);
    return `${data?.currency || 'UGX'} ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const outcomeRows = [
    { label: 'Completed', value: data?.payment_outcomes.completed ?? 0, color: '#10b981' },
    { label: 'Pending', value: data?.payment_outcomes.pending ?? 0, color: '#f59e0b' },
    { label: 'Failed', value: data?.payment_outcomes.failed ?? 0, color: '#ef4444' },
    { label: 'Cancelled', value: data?.payment_outcomes.cancelled ?? 0, color: '#6b7280' },
    { label: 'Refunded', value: data?.payment_outcomes.refunded ?? 0, color: '#6366f1' },
  ];
  const maxOutcome = Math.max(...outcomeRows.map((row) => row.value), 1);
  const trendMax = Math.max(...(data?.revenue_trend ?? []).map((r) => Number(r.collected_revenue || 0)), 1);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Finance Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                Aggregated payment, invoice, and subscription insights
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[6, 12].map((m) => (
                <Button
                  key={m}
                  variant={months === m ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setMonths(m as 6 | 12)}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Last {m} Months
                </Button>
              ))}
            </Box>
          </Box>

          {isLoading && <LinearProgress sx={{ mb: 2 }} />}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              {
                label: 'Total Collected Revenue',
                value: formatMoney(data?.payment_kpis.total_collected_revenue),
                icon: <RevenueIcon />,
                bgcolor: '#dcfce7',
                iconBg: '#4ade80',
                valueColor: '#14532d',
                labelColor: '#166534',
              },
              {
                label: 'Collected Revenue (This Month)',
                value: formatMoney(data?.payment_kpis.collected_revenue_this_month),
                icon: <MonthRevenueIcon />,
                bgcolor: '#f4f4f5',
                iconBg: '#a1a1aa',
                valueColor: '#27272a',
                labelColor: '#3f3f46',
              },
              {
                label: 'Payment Completion Rate',
                value: `${(data?.payment_kpis.payment_completion_rate_pct ?? 0).toFixed(1)}%`,
                icon: <CompletionRateIcon />,
                bgcolor: '#ecfeff',
                iconBg: '#06b6d4',
                valueColor: '#164e63',
                labelColor: '#0e7490',
              },
              {
                label: 'Failed Payments',
                value: (data?.payment_kpis.failed_payments_count ?? 0).toLocaleString(),
                icon: <FailedPaymentsIcon />,
                bgcolor: 'rgba(239,68,68,0.08)',
                iconBg: '#ef4444',
                valueColor: '#991b1b',
                labelColor: '#b91c1c',
              },
            ].map((kpi) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    ...cardSx,
                    bgcolor: kpi.bgcolor,
                    borderRadius: '20px',
                    p: 3,
                    position: 'relative',
                    minHeight: { xs: 110, md: 150 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'left',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      '& svg': { fontSize: 20 },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: kpi.valueColor }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.labelColor, opacity: 0.85 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Revenue Trend</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 280 }}>
                  {(data?.revenue_trend ?? []).map((point) => {
                    const amount = Number(point.collected_revenue || 0);
                    return (
                      <Box key={point.month} sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </Typography>
                        <Box
                          sx={{
                            height: `${(amount / trendMax) * 190}px`,
                            bgcolor: '#ffa424',
                            borderRadius: '6px 6px 0 0',
                            opacity: 0.85,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {point.month}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Payment Outcome Breakdown</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {outcomeRows.map((row) => (
                    <Box key={row.label} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>{row.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{row.value}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(row.value / maxOutcome) * 100}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: row.color } }}
                      />
                    </Box>
                  ))}
                  <Box sx={{ mt: 2.5 }}>
                    <Chip label={`Total Attempts: ${(data?.payment_outcomes.total ?? 0).toLocaleString()}`} size="small" />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Invoice Insights</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'grid', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Pending Invoices</Typography>
                    <Typography fontWeight={700}>{(data?.invoice_insights.pending_invoices_count ?? 0).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Pending Invoice Amount</Typography>
                    <Typography fontWeight={700}>{formatMoney(data?.invoice_insights.pending_invoices_amount)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Overdue Invoices</Typography>
                    <Typography fontWeight={700}>{(data?.invoice_insights.overdue_invoices_count ?? 0).toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Subscription Insights</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'grid', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Active</Typography>
                    <Typography fontWeight={700}>{(data?.subscription_insights.active ?? 0).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Cancelled</Typography>
                    <Typography fontWeight={700}>{(data?.subscription_insights.cancelled ?? 0).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography color="text.secondary">Expired</Typography>
                    <Typography fontWeight={700}>{(data?.subscription_insights.expired ?? 0).toLocaleString()}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceAnalyticsPage;
