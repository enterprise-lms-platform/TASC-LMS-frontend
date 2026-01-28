import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  CssBaseline,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Snackbar,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as SuccessIcon,
  Schedule as PendingIcon,
  Cancel as FailedIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Sync as SyncIcon,
  Book as BookIcon,
  Undo as UndoIcon,
  PhoneAndroid as PhoneIcon,
  SimCard as SimCardIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

// Transaction data
const transactions = [
  { id: 'TXN-2025-1215-8745', title: 'Pro Plan - Monthly', type: 'subscription', date: 'Dec 15, 2025', method: 'M-Pesa (...4521)', methodType: 'mpesa', amount: '$29.99', status: 'completed', invoiceId: 'INV-2025-1215' },
  { id: 'TXN-2025-1210-3421', title: 'Advanced React Patterns', type: 'course', date: 'Dec 10, 2025', method: 'M-Pesa (...4521)', methodType: 'mpesa', amount: '$129.99', status: 'completed', invoiceId: 'INV-2025-1210' },
  { id: 'TXN-2025-1115-2198', title: 'Pro Plan - Monthly', type: 'subscription', date: 'Nov 15, 2025', method: 'M-Pesa (...4521)', methodType: 'mpesa', amount: '$29.99', status: 'completed', invoiceId: 'INV-2025-1115' },
  { id: 'TXN-2025-1108-7654', title: 'Data Science Bootcamp', type: 'course', date: 'Nov 8, 2025', method: 'MTN MoMo (...7892)', methodType: 'mtn', amount: '$199.99', status: 'pending', invoiceId: null },
  { id: 'TXN-2025-1015-5432', title: 'Pro Plan - Monthly', type: 'subscription', date: 'Oct 15, 2025', method: 'M-Pesa (...4521)', methodType: 'mpesa', amount: '$29.99', status: 'completed', invoiceId: 'INV-2025-1015' },
  { id: 'TXN-2025-1002-9876', title: 'Refund - JavaScript Masterclass', type: 'refund', date: 'Oct 2, 2025', method: 'M-Pesa (...4521)', methodType: 'mpesa', amount: '+$49.99', status: 'refunded', invoiceId: null },
  { id: 'TXN-2025-0915-1234', title: 'Pro Plan - Monthly', type: 'subscription', date: 'Sep 15, 2025', method: 'M-Pesa (...4521)', methodType: 'mpesa', amount: '$29.99', status: 'failed', invoiceId: null },
];

const PaymentHistoryPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'warning' | 'error' });

  const handleMobileMenuToggle = () => setMobileOpen(!mobileOpen);
  const showToast = (message: string, severity: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const openTransactionDetail = (txn: typeof transactions[0]) => {
    setSelectedTransaction(txn);
    setDetailModalOpen(true);
  };

  const handleDownloadReceipt = () => {
    setDetailModalOpen(false);
    showToast('Receipt downloaded successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'pending': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
      case 'failed': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      case 'refunded': return { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' };
      default: return { bg: '#f4f4f5', color: '#71717a' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <SyncIcon sx={{ color: '#3b82f6' }} />;
      case 'course': return <BookIcon sx={{ color: '#10b981' }} />;
      case 'refund': return <UndoIcon sx={{ color: '#ef4444' }} />;
      default: return <ReceiptIcon />;
    }
  };

  const getMethodIcon = (methodType: string) => {
    switch (methodType) {
      case 'mpesa': return <PhoneIcon sx={{ color: '#4caf50' }} />;
      case 'mtn': return <SimCardIcon sx={{ color: '#ffcc00' }} />;
      default: return <PhoneIcon />;
    }
  };

  // Stats
  const stats = [
    { icon: <MoneyIcon />, value: '$489.87', label: 'Total Spent (2025)', color: '#ffa424', bg: 'rgba(255, 164, 36, 0.1)' },
    { icon: <SuccessIcon />, value: '24', label: 'Successful Payments', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { icon: <PendingIcon />, value: '1', label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { icon: <FailedIcon />, value: '2', label: 'Failed', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={handleMobileMenuToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />

        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' }, mb: 4, flexWrap: 'wrap', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Payment History</Typography>
            <Typography variant="body2" color="text.secondary">View and manage your payment transactions</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}>
              Export CSV
            </Button>
            <Button variant="contained" startIcon={<DescriptionIcon />} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>
              Download Statement
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: stat.bg, color: stat.color, '& svg': { fontSize: 24 } }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7' }}>
          <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end', p: { xs: 2, md: 2.5 }, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: 'none' } }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 130 } }}>
                <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 0.5 }}>Status:</Typography>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 130 } }}>
                <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 0.5 }}>Type:</Typography>
                <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="subscription">Subscription</MenuItem>
                  <MenuItem value="course">Course Purchase</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 130 } }}>
                <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 0.5 }}>Date Range:</Typography>
                <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                  <MenuItem value="6months">Last 6 Months</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              size="small"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 }, width: { xs: '100%', sm: 'auto' } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#a1a1aa' }} /></InputAdornment>,
              }}
            />
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7', overflow: 'hidden' }}>
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2.5, borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              <ReceiptIcon sx={{ color: '#ffa424' }} /> Transaction History
            </Typography>
            <Typography variant="body2" color="text.secondary">27 transactions</Typography>
          </Box>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  {['Transaction', 'Date', 'Payment Method', 'Amount', 'Status', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a', whiteSpace: 'nowrap' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id} hover sx={{ cursor: 'pointer' }} onClick={() => openTransactionDetail(txn)}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: txn.type === 'subscription' ? 'rgba(59, 130, 246, 0.1)' : txn.type === 'course' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}>
                          {getTypeIcon(txn.type)}
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{txn.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{txn.id}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 32, height: 20, borderRadius: 1, bgcolor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getMethodIcon(txn.methodType)}
                        </Box>
                        <Typography variant="body2">{txn.method}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} sx={{ color: txn.status === 'refunded' ? '#10b981' : 'text.primary' }}>
                        {txn.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        size="small"
                        sx={{ bgcolor: getStatusColor(txn.status).bg, color: getStatusColor(txn.status).color, fontWeight: 500, '&::before': { content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: getStatusColor(txn.status).color, mr: 1 } }}
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" spacing={1}>
                        {txn.status === 'completed' && (
                          <>
                            <IconButton size="small" title="View Receipt"><ViewIcon fontSize="small" /></IconButton>
                            <IconButton size="small" title="Download"><DownloadIcon fontSize="small" /></IconButton>
                          </>
                        )}
                        {(txn.status === 'pending' || txn.status === 'failed') && (
                          <Button size="small" variant="contained" startIcon={<RefreshIcon />} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>
                            Retry
                          </Button>
                        )}
                        {txn.status === 'refunded' && (
                          <IconButton size="small" title="View Receipt"><ViewIcon fontSize="small" /></IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Showing 1-7 of 27 transactions</Typography>
            <Pagination count={4} page={page} onChange={(_, p) => setPage(p)} color="primary" size="small" sx={{ '& .Mui-selected': { bgcolor: '#ffa424 !important' } }} />
          </Box>
        </Card>
      </Box>

      {/* Transaction Detail Modal */}
      <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Transaction Details
          <IconButton onClick={() => setDetailModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ width: 64, height: 64, bgcolor: selectedTransaction.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : selectedTransaction.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  {selectedTransaction.status === 'completed' ? <CheckIcon sx={{ fontSize: 24, color: '#10b981' }} /> : selectedTransaction.status === 'pending' ? <PendingIcon sx={{ fontSize: 24, color: '#f59e0b' }} /> : <FailedIcon sx={{ fontSize: 24, color: '#ef4444' }} />}
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  {selectedTransaction.status === 'completed' ? 'Payment Successful' : selectedTransaction.status === 'pending' ? 'Payment Pending' : 'Payment Failed'}
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#ffa424' }}>{selectedTransaction.amount}</Typography>
              </Box>

              <Box sx={{ bgcolor: '#fafafa', p: 3, borderRadius: 2, mb: 2 }}>
                {[
                  { label: 'Transaction ID', value: selectedTransaction.id },
                  { label: 'Invoice Number', value: selectedTransaction.invoiceId || 'N/A' },
                  { label: 'Date & Time', value: `${selectedTransaction.date} at 10:30 AM` },
                  { label: 'Description', value: selectedTransaction.title },
                  { label: 'Payment Method', value: selectedTransaction.method },
                  { label: 'M-Pesa Receipt', value: 'QJK89XY2MP' },
                  { label: 'Status', value: selectedTransaction.status },
                ].map((row) => (
                  <Stack key={row.label} direction="row" justifyContent="space-between" sx={{ py: 1.5, borderBottom: '1px solid #e4e4e7', '&:last-child': { borderBottom: 'none' } }}>
                    <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                    {row.label === 'Status' ? (
                      <Chip label={row.value.charAt(0).toUpperCase() + row.value.slice(1)} size="small" sx={{ bgcolor: getStatusColor(row.value).bg, color: getStatusColor(row.value).color, fontWeight: 500 }} />
                    ) : (
                      <Typography variant="body2" fontWeight={500}>{row.value}</Typography>
                    )}
                  </Stack>
                ))}
              </Box>

              <Box sx={{ bgcolor: 'rgba(59, 130, 246, 0.05)', p: 2, borderRadius: 2, borderLeft: '3px solid #3b82f6' }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                  A receipt has been sent to your email: emma.chen@example.com
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e4e4e7', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button variant="outlined" onClick={() => setDetailModalOpen(false)} sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}>Close</Button>
          <Button variant="outlined" startIcon={<EmailIcon />} sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}>Email Receipt</Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadReceipt} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' }, width: { xs: '100%', sm: 'auto' } }}>Download Receipt</Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentHistoryPage;
