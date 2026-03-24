import React from 'react';
import { Box, Paper, Typography, Chip, Button, Skeleton } from '@mui/material';
import { Receipt as InvoiceIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { invoiceApi } from '../../services/payments.services';
import type { PaginatedResponse } from '../../types/types';

interface InvoiceResult {
  id: number;
  customer_name?: string;
  total_amount?: string | number;
  due_date?: string | null;
  status?: string;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  overdue: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
};

const RecentInvoices: React.FC = () => {
  const navigate = useNavigate();

  const { data: invoicesRaw, isLoading } = useQuery({
    queryKey: ['finance', 'invoices', 'recent'],
    queryFn: () => invoiceApi.getAll({ limit: 4 }).then(r => r.data),
  });

  const invoices: InvoiceResult[] = Array.isArray(invoicesRaw)
    ? invoicesRaw
    : (invoicesRaw as PaginatedResponse<InvoiceResult> | undefined)?.results ?? [];

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
        <Typography fontWeight={700}>Recent Invoices</Typography>
        <Button size="small" onClick={() => navigate('/finance/invoices')}
          sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
          View All
        </Button>
      </Box>

      {/* Invoice rows */}
      {isLoading ? (
        [0, 1, 2, 3].map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3, borderBottom: i < 3 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="40%" /></Box>
          </Box>
        ))
      ) : invoices.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No recent invoices</Typography>
        </Box>
      ) : (
        invoices.map((invoice, i) => {
          const status = (invoice.status || 'pending').toLowerCase();
          const sc = statusColors[status] || statusColors.pending;
          const amount = typeof invoice.total_amount === 'number'
            ? `$${invoice.total_amount.toLocaleString()}`
            : invoice.total_amount || '$0';

          return (
            <Box
              key={invoice.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                px: 3,
                borderBottom: i < invoices.length - 1 ? 1 : 0,
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}
              onClick={() => navigate('/finance/invoices')}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,164,36,0.1)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InvoiceIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight={600}>INV-{invoice.id}</Typography>
                  <Typography variant="body2" fontWeight={700}>{amount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {invoice.customer_name || 'Customer'} · Due {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
                  </Typography>
                  <Chip
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      bgcolor: sc.bg,
                      color: sc.color,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })
      )}
    </Paper>
  );
};

export default RecentInvoices;
