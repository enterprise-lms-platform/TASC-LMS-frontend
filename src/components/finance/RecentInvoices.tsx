import React from 'react';
import { Box, Paper, Typography, Chip, Button } from '@mui/material';
import { Receipt as InvoiceIcon } from '@mui/icons-material';

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  dueDate: string;
  status: 'Overdue' | 'Due Soon' | 'Paid';
}

const invoices: Invoice[] = [
  { id: 'INV-2401', customer: 'TechCorp Ltd', amount: '$2,450', dueDate: 'Jan 25', status: 'Due Soon' },
  { id: 'INV-2400', customer: 'Startup Hub', amount: '$1,890', dueDate: 'Jan 22', status: 'Overdue' },
  { id: 'INV-2399', customer: 'Global Academy', amount: '$3,200', dueDate: 'Jan 28', status: 'Due Soon' },
  { id: 'INV-2398', customer: 'EduPro Inc', amount: '$850', dueDate: 'Jan 15', status: 'Paid' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Overdue: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  'Due Soon': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
};

const RecentInvoices: React.FC = () => {
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
        <Button size="small" sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
          View All
        </Button>
      </Box>

      {/* Invoice rows */}
      {invoices.map((invoice, i) => (
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
            '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
          }}
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
              <Typography variant="body2" fontWeight={600}>{invoice.id}</Typography>
              <Typography variant="body2" fontWeight={700}>{invoice.amount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">{invoice.customer} · Due {invoice.dueDate}</Typography>
              <Chip
                label={invoice.status}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  bgcolor: statusColors[invoice.status].bg,
                  color: statusColors[invoice.status].color,
                }}
              />
            </Box>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default RecentInvoices;
