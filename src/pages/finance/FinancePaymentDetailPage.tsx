import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useFinancePayment } from '../../hooks/usePayments';

const statusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  failed: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  refunded: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  cancelled: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const FinancePaymentDetailPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  const { data: payment, isLoading } = useFinancePayment(paymentId);

  const status = (payment?.status || '').toLowerCase();
  const statusStyle = statusColors[status] || { bg: 'rgba(0,0,0,0.05)', color: '#6b7280' };

  const detailRows = [
    { label: 'Payment ID', value: payment?.id || '-' },
    { label: 'User Email', value: payment?.user_email || '-' },
    { label: 'Amount', value: payment ? `${payment.currency} ${payment.amount}` : '-' },
    { label: 'Payment Method', value: payment?.payment_method || '-' },
    { label: 'Provider Order ID', value: payment?.provider_order_id || '-' },
    { label: 'Provider Payment ID', value: payment?.provider_payment_id || '-' },
    { label: 'Created At', value: payment?.created_at ? new Date(payment.created_at).toLocaleString() : '-' },
    { label: 'Completed At', value: payment?.completed_at ? new Date(payment.completed_at).toLocaleString() : '-' },
    { label: 'Updated At', value: payment?.updated_at ? new Date(payment.updated_at).toLocaleString() : '-' },
    { label: 'Description', value: payment?.description || '-' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Payment Detail</Typography>
              <Typography variant="body2" color="text.secondary">Read-only payment event details</Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<BackIcon />}
              onClick={() => navigate('/finance/payments')}
              sx={{ textTransform: 'none' }}
            >
              Back to Payments
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress size={32} />
            </Box>
          ) : !payment ? (
            <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
              <Typography variant="body2" color="text.secondary">Payment not found.</Typography>
            </Paper>
          ) : (
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ p: 2.5, px: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography fontWeight={700}>{payment.id}</Typography>
                <Chip
                  label={payment.status}
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {detailRows.map((row) => (
                    <Grid key={row.label} size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>{row.value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FinancePaymentDetailPage;
