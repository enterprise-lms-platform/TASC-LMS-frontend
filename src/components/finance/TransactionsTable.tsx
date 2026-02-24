import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

interface Transaction {
  id: string;
  user: {
    name: string;
    email: string;
    initials: string;
  };
  amount: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed';
  method: 'M-Pesa' | 'Card' | 'MTN MoMo' | 'Airtel';
  description: string;
}

const transactions: Transaction[] = [
  {
    id: 'TXN-001',
    user: { name: 'John Kamau', email: 'john@company.com', initials: 'JK' },
    amount: '$128.00',
    date: 'Jan 20, 2026',
    status: 'Paid',
    method: 'M-Pesa',
    description: 'Biannual Subscription',
  },
  {
    id: 'TXN-002',
    user: { name: 'Mary Wambui', email: 'mary@company.com', initials: 'MW' },
    amount: '$128.00',
    date: 'Jan 19, 2026',
    status: 'Pending',
    method: 'Card',
    description: 'Biannual Subscription',
  },
  {
    id: 'TXN-003',
    user: { name: 'Peter Ochieng', email: 'peter@company.com', initials: 'PO' },
    amount: '$128.00',
    date: 'Jan 18, 2026',
    status: 'Paid',
    method: 'MTN MoMo',
    description: 'Biannual Subscription',
  },
  {
    id: 'TXN-004',
    user: { name: 'Grace Akinyi', email: 'grace@company.com', initials: 'GA' },
    amount: '$128.00',
    date: 'Jan 17, 2026',
    status: 'Failed',
    method: 'M-Pesa',
    description: 'Biannual Subscription',
  },
  {
    id: 'TXN-005',
    user: { name: 'David Mwangi', email: 'david@company.com', initials: 'DM' },
    amount: '$128.00',
    date: 'Jan 16, 2026',
    status: 'Paid',
    method: 'Card',
    description: 'Biannual Subscription',
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Failed: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const methodColors: Record<string, { bg: string; color: string }> = {
  'M-Pesa': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Card: { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
  'MTN MoMo': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Airtel: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const TransactionsTable: React.FC = () => {
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
        <Typography fontWeight={700}>Recent Transactions</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Row-based list (matches analytics page style) */}
      {transactions.map((txn, i) => (
        <Box
          key={txn.id}
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
            {txn.user.initials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{txn.user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{txn.id} · {txn.description}</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 80 }}>
            {txn.date}
          </Typography>
          <Chip
            label={txn.method}
            size="small"
            sx={{
              display: { xs: 'none', md: 'flex' },
              height: 22,
              fontSize: '0.7rem',
              fontWeight: 600,
              bgcolor: methodColors[txn.method]?.bg || 'grey.100',
              color: methodColors[txn.method]?.color || 'text.secondary',
            }}
          />
          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>
            {txn.amount}
          </Typography>
          <Chip
            label={txn.status}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.7rem',
              fontWeight: 600,
              bgcolor: statusColors[txn.status].bg,
              color: statusColors[txn.status].color,
            }}
          />
          <IconButton size="small" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }}>
            <ViewIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Paper>
  );
};

export default TransactionsTable;
