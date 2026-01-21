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
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Recent Invoices
        </Typography>
        <Button size="small" sx={{ color: '#8b5cf6' }}>
          View All
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {invoices.map((invoice) => (
          <Box
            key={invoice.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'rgba(139, 92, 246, 0.1)',
                color: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InvoiceIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {invoice.id}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {invoice.amount}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {invoice.customer}
                </Typography>
                <Chip
                  label={invoice.status}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: statusColors[invoice.status].bg,
                    color: statusColors[invoice.status].color,
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default RecentInvoices;
