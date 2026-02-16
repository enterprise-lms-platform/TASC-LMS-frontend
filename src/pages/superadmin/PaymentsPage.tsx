import React, { useState } from 'react';
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

interface Transaction {
  id: string;
  userName: string;
  userEmail: string;
  amount: string;
  method: 'Card' | 'M-Pesa' | 'MTN MoMo' | 'Bank Transfer';
  status: 'Completed' | 'Pending' | 'Failed' | 'Cancelled';
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'FLW-8472-TX',
    userName: 'James Mwangi',
    userEmail: 'james.mwangi@gmail.com',
    amount: '$1,250.00',
    method: 'M-Pesa',
    status: 'Completed',
    date: '2026-02-14',
  },
  {
    id: 'FLW-8471-TX',
    userName: 'Sarah Okonkwo',
    userEmail: 'sarah.okonkwo@techcorp.ng',
    amount: '$3,400.00',
    method: 'Card',
    status: 'Completed',
    date: '2026-02-14',
  },
  {
    id: 'FLW-8470-TX',
    userName: 'David Kamau',
    userEmail: 'david.kamau@innovate.ke',
    amount: '$780.00',
    method: 'MTN MoMo',
    status: 'Pending',
    date: '2026-02-13',
  },
  {
    id: 'FLW-8469-TX',
    userName: 'Amina Hassan',
    userEmail: 'amina.hassan@edulearn.ug',
    amount: '$2,150.00',
    method: 'Bank Transfer',
    status: 'Completed',
    date: '2026-02-13',
  },
  {
    id: 'FLW-8468-TX',
    userName: 'Peter Ndegwa',
    userEmail: 'peter.ndegwa@safaricom.co.ke',
    amount: '$450.00',
    method: 'M-Pesa',
    status: 'Failed',
    date: '2026-02-12',
  },
  {
    id: 'FLW-8467-TX',
    userName: 'Grace Achieng',
    userEmail: 'grace.achieng@globaltech.com',
    amount: '$5,600.00',
    method: 'Card',
    status: 'Completed',
    date: '2026-02-12',
  },
  {
    id: 'FLW-8466-TX',
    userName: 'Emmanuel Okello',
    userEmail: 'emmanuel.okello@futuredyn.ug',
    amount: '$920.00',
    method: 'MTN MoMo',
    status: 'Cancelled',
    date: '2026-02-11',
  },
  {
    id: 'FLW-8465-TX',
    userName: 'Linda Njeri',
    userEmail: 'linda.njeri@acmecorp.ke',
    amount: '$1,800.00',
    method: 'M-Pesa',
    status: 'Completed',
    date: '2026-02-11',
  },
  {
    id: 'FLW-8464-TX',
    userName: 'Robert Otieno',
    userEmail: 'robert.otieno@nextgen.ng',
    amount: '$340.00',
    method: 'Bank Transfer',
    status: 'Pending',
    date: '2026-02-10',
  },
  {
    id: 'FLW-8463-TX',
    userName: 'Faith Wambui',
    userEmail: 'faith.wambui@learnhub.ke',
    amount: '$2,890.00',
    method: 'Card',
    status: 'Completed',
    date: '2026-02-10',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    case 'Pending':
      return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    case 'Failed':
      return { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
    case 'Cancelled':
      return { bgcolor: 'rgba(156, 163, 175, 0.1)', color: '#71717a' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'Card':
      return { bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
    case 'M-Pesa':
      return { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    case 'MTN MoMo':
      return { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    case 'Bank Transfer':
      return { bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' };
    default:
      return { bgcolor: 'grey.100', color: 'text.secondary' };
  }
};

import KPICard from '../../components/superadmin/KPICard';

// ... (Transaction interface and mockTransactions array remain unchanged)

// ... (getStatusColor and getMethodColor functions remain unchanged)

const kpiCards = [
  {
    title: 'Total Transactions',
    value: '8,456',
    icon: <ReceiptIcon />,
    // Light Amber Theme
    bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
  },
  {
    title: 'Completed',
    value: '$1.2M',
    icon: <CompletedIcon />,
    // Mint Green Theme
    bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
  },
  {
    title: 'Pending',
    value: '$45,200',
    icon: <PendingIcon />,
    // Soft Blue Theme
    bgColor: '#e3f2fd', badgeColor: '#64b5f6', valueColor: '#1565c0', labelColor: '#0d47a1'
  },
  {
    title: 'Failed',
    value: '23',
    icon: <FailedIcon />,
    // Soft Rose Theme
    bgColor: '#fce4ec', badgeColor: '#f06292', valueColor: '#ad1457', labelColor: '#880e4f'
  },
];

const PaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <SuperadminLayout title="Payments" subtitle="Payment transactions and processing">
      {/* KPI Cards */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        {kpiCards.map((card, index) => (
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

      {/* Transactions Table */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        {/* Filter Row */}
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
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
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
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="M-Pesa">M-Pesa</MenuItem>
              <MenuItem value="MTN MoMo">MTN MoMo</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
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
              {mockTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' }, '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      {tx.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tx.userName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {tx.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {tx.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.method}
                      size="small"
                      sx={{
                        ...getMethodColor(tx.method),
                        fontWeight: 500,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.status}
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
                      {tx.date}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SuperadminLayout>
  );
};

export default PaymentsPage;
