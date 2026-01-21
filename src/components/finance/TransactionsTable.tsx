import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  method: 'M-Pesa' | 'Card' | 'Bank';
  description: string;
}

const transactions: Transaction[] = [
  {
    id: 'TXN-001',
    user: { name: 'John Kamau', email: 'john@company.com', initials: 'JK' },
    amount: '$450.00',
    date: 'Jan 20, 2026',
    status: 'Paid',
    method: 'M-Pesa',
    description: 'Course Subscription',
  },
  {
    id: 'TXN-002',
    user: { name: 'Mary Wambui', email: 'mary@company.com', initials: 'MW' },
    amount: '$320.00',
    date: 'Jan 19, 2026',
    status: 'Pending',
    method: 'Card',
    description: 'Team License',
  },
  {
    id: 'TXN-003',
    user: { name: 'Peter Ochieng', email: 'peter@company.com', initials: 'PO' },
    amount: '$180.00',
    date: 'Jan 18, 2026',
    status: 'Paid',
    method: 'Bank',
    description: 'Certificate Fee',
  },
  {
    id: 'TXN-004',
    user: { name: 'Grace Akinyi', email: 'grace@company.com', initials: 'GA' },
    amount: '$95.00',
    date: 'Jan 17, 2026',
    status: 'Failed',
    method: 'M-Pesa',
    description: 'Course Purchase',
  },
  {
    id: 'TXN-005',
    user: { name: 'David Mwangi', email: 'david@company.com', initials: 'DM' },
    amount: '$275.00',
    date: 'Jan 16, 2026',
    status: 'Refunded',
    method: 'Card',
    description: 'Annual Subscription',
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Paid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Failed: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  Refunded: { bg: 'rgba(156, 163, 175, 0.1)', color: '#6b7280' },
};

const methodColors: Record<string, { bg: string; color: string }> = {
  'M-Pesa': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  Card: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  Bank: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
};

const TransactionsTable: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Recent Transactions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ExportIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Export
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ borderColor: 'divider', color: 'text.secondary' }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Transaction</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Method</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {txn.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {txn.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: '#8b5cf6' }}>
                      {txn.user.initials}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {txn.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {txn.user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {txn.amount}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {txn.date}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={txn.method}
                    size="small"
                    sx={{
                      bgcolor: methodColors[txn.method].bg,
                      color: methodColors[txn.method].color,
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={txn.status}
                    size="small"
                    sx={{
                      bgcolor: statusColors[txn.status].bg,
                      color: statusColors[txn.status].color,
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionsTable;
