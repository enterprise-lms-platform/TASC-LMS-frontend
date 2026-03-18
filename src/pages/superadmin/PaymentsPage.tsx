import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CompletedIcon,
  HourglassEmpty as PendingIcon,
  ErrorOutline as FailedIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';
import { transactionApi } from '../../services/main.api';
import type { Transaction } from '../../types/types';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'Completed':
      return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    case 'pending':
    case 'Pending':
      return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    case 'failed':
    case 'Failed':
      return { bgcolor: 'rgba(113, 113, 122, 0.1)', color: '#71717a' };
    case 'cancelled':
    case 'Cancelled':
      return { bgcolor: 'rgba(156, 163, 175, 0.1)', color: '#71717a' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const getMethodColor = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes('card') || m.includes('credit') || m.includes('debit')) {
    return { bgcolor: 'rgba(113, 113, 122, 0.1)', color: '#71717a' };
  }
  if (m.includes('mpesa') || m.includes('m-pesa')) {
    return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
  }
  if (m.includes('mtn') || m.includes('momo')) {
    return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
  }
  if (m.includes('bank')) {
    return { bgcolor: 'rgba(255, 164, 36, 0.1)', color: '#e65100' };
  }
  return { bgcolor: 'grey.100', color: 'text.secondary' };
};

const formatMethod = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes('card') || m.includes('credit') || m.includes('debit')) return 'Card';
  if (m.includes('mpesa') || m.includes('m-pesa')) return 'M-Pesa';
  if (m.includes('mtn') || m.includes('momo')) return 'MTN MoMo';
  if (m.includes('bank')) return 'Bank Transfer';
  return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions', statusFilter, methodFilter, dateFrom, dateTo],
    queryFn: () => transactionApi.getAll({
      status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
      limit: 100,
    }),
  });

  const transactions = (transactionsData?.data ?? []) as Transaction[];

  const kpis = useMemo(() => {
    const completed = transactions.filter(t => t.status === 'completed');
    const pending = transactions.filter(t => t.status === 'pending');
    const failed = transactions.filter(t => t.status === 'failed');
    const totalRevenue = completed.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const pendingRevenue = pending.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

    return [
      {
        title: 'Total Transactions',
        value: transactions.length.toLocaleString(),
        icon: <ReceiptIcon />,
        bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
      },
      {
        title: 'Completed',
        value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        icon: <CompletedIcon />,
        bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
      },
      {
        title: 'Pending',
        value: `$${pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        icon: <PendingIcon />,
        bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46'
      },
      {
        title: 'Failed',
        value: failed.length.toLocaleString(),
        icon: <FailedIcon />,
        bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412'
      },
    ];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = !searchQuery ||
        tx.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.organization_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || tx.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesMethod = methodFilter === 'All' || tx.payment_method?.toLowerCase().includes(methodFilter.toLowerCase());
      const txDate = new Date(tx.created_at);
      const matchesDateFrom = !dateFrom || txDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || txDate <= new Date(dateTo + 'T23:59:59');
      return matchesSearch && matchesStatus && matchesMethod && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, searchQuery, statusFilter, methodFilter, dateFrom, dateTo]);

  return (
    <SuperadminLayout title="Payments" subtitle="Payment transactions and processing">
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpis.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <KPICard
              title={card.title}
              value={card.value}
              icon={card.icon}
              bgColor={card.bgColor}
              badgeColor={card.badgeColor}
              valueColor={card.valueColor}
              labelColor={card.labelColor}
              index={index}
            />
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            type="date"
            label="From"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Method</InputLabel>
            <Select
              value={methodFilter}
              label="Method"
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="mpesa">M-Pesa</MenuItem>
              <MenuItem value="mtn">MTN MoMo</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' }, '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      {tx.transaction_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tx.user_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {tx.organization_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${parseFloat(tx.amount).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatMethod(tx.payment_method ?? '')}
                      size="small"
                      sx={{
                        ...getMethodColor(tx.payment_method ?? ''),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(tx.status)}
                      size="small"
                      sx={{
                        ...getStatusColor(tx.status),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { color: 'info.main', borderColor: 'info.main' },
                      }}
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No transactions found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SuperadminLayout>
  );
};

export default PaymentsPage;
