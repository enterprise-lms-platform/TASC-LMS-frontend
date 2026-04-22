import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFinanceDashboardOverview } from '../../hooks/usePayments';

interface TransactionResult {
  payment_id: string;
  amount?: string | number;
  status?: string;
  payment_method?: string;
  created_at?: string;
  user_email?: string | null;
  provider_order_id?: string | null;
  provider_payment_id?: string | null;
  description?: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  failed: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const methodColors: Record<string, { bg: string; color: string }> = {
  pesapal: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
};

const TransactionsTable: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useFinanceDashboardOverview();
  const transactions: TransactionResult[] = data?.recent_payment_events || [];

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
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 3,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography fontWeight={700}>Recent Payment Events</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate('/finance/payments')}
          sx={{ borderColor: 'divider', color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem' }}
        >
          View All
        </Button>
      </Box>

      {/* Row-based list */}
      {isLoading ? (
        [0, 1, 2, 3, 4].map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3, borderBottom: i < 4 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}><Skeleton width="50%" /><Skeleton width="30%" /></Box>
            <Skeleton width={60} />
          </Box>
        ))
      ) : transactions.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No recent payment events</Typography>
        </Box>
      ) : (
        transactions.map((txn, i) => {
          const initials = (txn.user_email || 'user').slice(0, 2).toUpperCase();
          const status = (txn.status || 'pending').toLowerCase();
          const method = (txn.payment_method || '').toLowerCase();
          const sc = statusColors[status] || statusColors.pending;
          const mc = methodColors[method] || { bg: 'grey.100', color: 'text.secondary' };
          const amount = typeof txn.amount === 'number' ? txn.amount.toFixed(2) : txn.amount || '0.00';

          return (
            <Box
              key={txn.payment_id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                px: 3,
                borderBottom: i < transactions.length - 1 ? 1 : 0,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              <Avatar sx={{ width: 36, height: 36, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                {initials}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>{txn.user_email || `Payment ${txn.payment_id}`}</Typography>
                <Typography variant="caption" color="text.secondary">{txn.description || txn.provider_order_id || txn.provider_payment_id || txn.payment_id}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 80 }}>
                {txn.created_at ? new Date(txn.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
              </Typography>
              {txn.payment_method && (
                <Chip
                  label={txn.payment_method}
                  size="small"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    bgcolor: mc.bg,
                    color: mc.color,
                  }}
                />
              )}
              <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>
                {`UGX ${amount}`}
              </Typography>
              <Chip
                label={status.charAt(0).toUpperCase() + status.slice(1)}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: sc.bg,
                  color: sc.color,
                }}
              />
              <IconButton size="small" onClick={() => navigate('/finance/payments')}
                sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
                <ViewIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })
      )}
    </Paper>
  );
};

export default TransactionsTable;
