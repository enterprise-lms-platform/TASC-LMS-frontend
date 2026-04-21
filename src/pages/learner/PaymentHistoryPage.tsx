import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  CircularProgress,
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
  CreditCard as CardIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { transactionApi } from '../../services/payments.services';
import { apiClient } from '../../utils/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction } from '../../types/types';

const PAGE_SIZE = 10;

const PaymentHistoryPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'warning' | 'error' });

  // Fetch transactions from API
  const { data: txnData, isLoading, refetch } = useQuery({
    queryKey: ['learnerTransactions', statusFilter, page],
    queryFn: () => transactionApi.getAll({
      ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
      page,
    }).then(r => {
      const d = r.data;
      if (Array.isArray(d)) return { results: d, count: d.length };
      return d as { results: Transaction[]; count: number };
    }),
  });

  const retryMutation = useMutation({
    mutationFn: (id: number) => transactionApi.retry(id),
    onSuccess: (data) => {
      setToast({ open: true, message: 'Payment reset for retry. Please complete payment.', severity: 'success' });
      setDetailModalOpen(false);
      refetch();
    },
    onError: () => {
      setToast({ open: true, message: 'Failed to retry payment. Please try again.', severity: 'error' });
    },
  });

  const transactions = txnData?.results ?? (Array.isArray(txnData) ? txnData as Transaction[] : []);
  const totalCount = (txnData as { count?: number })?.count ?? transactions.length;
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Client-side search filter
  const filtered = searchQuery
    ? transactions.filter((t: Transaction) =>
        t.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transactions;

  const handleMobileMenuToggle = () => setMobileOpen(!mobileOpen);
  const showToast = (message: string, severity: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleExportCsv = async () => {
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await apiClient.get('/api/v1/payments/transactions/export-csv/', {
        responseType: 'blob',
        params,
      });
      const url = URL.createObjectURL(response.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleDownloadStatement = async () => {
    try {
      const response = await apiClient.get('/api/v1/payments/transactions/export-csv/', {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'statement.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      showToast('Failed to download statement', 'error');
    }
  };

  const openTransactionDetail = (txn: Transaction) => {
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

  const getTypeIcon = (txn: Transaction) => {
    if (txn.course_title) return <BookIcon sx={{ color: '#10b981' }} />;
    if (parseFloat(txn.amount) < 0) return <UndoIcon sx={{ color: '#ef4444' }} />;
    return <SyncIcon sx={{ color: '#3b82f6' }} />;
  };

  const getMethodIcon = (method: string) => {
    if (method.includes('mobile_money')) return <PhoneIcon sx={{ color: '#4caf50' }} />;
    if (method.includes('credit_card')) return <CardIcon sx={{ color: '#3b82f6' }} />;
    if (method.includes('bank')) return <BankIcon sx={{ color: '#6366f1' }} />;
    if (method.includes('paypal')) return <SimCardIcon sx={{ color: '#ffcc00' }} />;
    return <PhoneIcon />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: string, currency: string) => {
    const symbol = currency === 'USD' ? '$' : currency === 'UGX' ? 'UGX ' : `${currency} `;
    return `${symbol}${parseFloat(amount).toLocaleString()}`;
  };

  // Compute stats from real data
  const completedTxns = transactions.filter((t: Transaction) => t.status === 'completed');
  const pendingTxns = transactions.filter((t: Transaction) => t.status === 'pending');
  const failedTxns = transactions.filter((t: Transaction) => t.status === 'failed');
  const totalSpent = completedTxns.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);
  const mainCurrency = transactions.length > 0 ? transactions[0].currency : 'USD';

  const stats = [
    { icon: <MoneyIcon />, value: formatCurrency(totalSpent.toFixed(2), mainCurrency), label: 'Total Spent', color: '#ffa424', bg: 'rgba(255, 164, 36, 0.1)' },
    { icon: <SuccessIcon />, value: String(completedTxns.length), label: 'Successful', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { icon: <PendingIcon />, value: String(pendingTxns.length), label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { icon: <FailedIcon />, value: String(failedTxns.length), label: 'Failed', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
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
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportCsv} sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none', fontSize: { xs: '0.75rem', sm: '0.8rem' }, whiteSpace: 'nowrap' }}>
              Export CSV
            </Button>
            <Button variant="contained" size="small" startIcon={<DescriptionIcon />} onClick={handleDownloadStatement} sx={{ bgcolor: '#ffa424', textTransform: 'none', fontSize: { xs: '0.75rem', sm: '0.8rem' }, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#f97316' } }}>
              Statement
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, i) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, p: { xs: 1.5, md: 2.5 } }}>
                  <Box sx={{ width: { xs: 40, md: 52 }, height: { xs: 40, md: 52 }, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: stat.bg, color: stat.color, '& svg': { fontSize: { xs: 20, md: 24 } }, flexShrink: 0 }}>
                    {stat.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }} noWrap>{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}>{stat.label}</Typography>
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
                <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
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
            <Typography variant="body2" color="text.secondary">{totalCount} transactions</Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <CircularProgress sx={{ color: '#ffa424' }} />
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
              <Typography color="text.secondary">No transactions found.</Typography>
            </Box>
          ) : (
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
                  {filtered.map((txn: Transaction) => (
                    <TableRow key={txn.id} hover sx={{ cursor: 'pointer' }} onClick={() => openTransactionDetail(txn)}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: txn.course_title ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
                            {getTypeIcon(txn)}
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{txn.course_title || 'Subscription Payment'}</Typography>
                            <Typography variant="caption" color="text.secondary">{txn.transaction_id}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{formatDate(txn.created_at)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 32, height: 20, borderRadius: 1, bgcolor: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getMethodIcon(txn.payment_method)}
                          </Box>
                          <Typography variant="body2">{txn.payment_method.replace('_', ' ')}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(txn.amount, txn.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                          size="small"
                          sx={{ bgcolor: getStatusColor(txn.status).bg, color: getStatusColor(txn.status).color, fontWeight: 500 }}
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
                          <Button size="small" variant="contained" startIcon={<RefreshIcon />} onClick={() => retryMutation.mutate(txn.id)} disabled={retryMutation.isPending} sx={{ bgcolor: '#ffa424', textTransform: 'none', fontSize: '0.7rem', px: 1.5, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#f97316' } }}>
                            Retry
                          </Button>
                        )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filtered.length > 0 ? ((page - 1) * PAGE_SIZE + 1) : 0}-{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} transactions
            </Typography>
            <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} color="primary" size="small" sx={{ '& .Mui-selected': { bgcolor: '#ffa424 !important' } }} />
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
                <Typography variant="h4" fontWeight={700} sx={{ color: '#ffa424' }}>
                  {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                </Typography>
              </Box>

              <Box sx={{ bgcolor: '#fafafa', p: 3, borderRadius: 2, mb: 2 }}>
                {[
                  { label: 'Transaction ID', value: selectedTransaction.transaction_id },
                  { label: 'Invoice Number', value: selectedTransaction.invoice_number || 'N/A' },
                  { label: 'Date', value: formatDate(selectedTransaction.created_at) },
                  { label: 'Description', value: selectedTransaction.course_title || 'Subscription Payment' },
                  { label: 'Payment Method', value: selectedTransaction.payment_method.replace('_', ' ') },
                  ...(selectedTransaction.payment_provider ? [{ label: 'Provider', value: selectedTransaction.payment_provider }] : []),
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
                  A receipt has been sent to your registered email address.
                </Typography>
              </Box>
            </Box>
          )}
</DialogContent>
  <DialogActions sx={{ p: 2, borderTop: '1px solid #e4e4e7', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
    <Button variant="outlined" onClick={() => setDetailModalOpen(false)} sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}>Close</Button>
    {selectedTransaction?.status === 'failed' && (
      <Button 
        variant="contained" 
        color="warning"
        startIcon={retryMutation.isPending ? undefined : <CreditCardIcon />}
        onClick={() => selectedTransaction && retryMutation.mutate(selectedTransaction.id)}
        disabled={retryMutation.isPending}
        sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
      >
        {retryMutation.isPending ? 'Retrying...' : 'Retry Payment'}
      </Button>
    )}
    {selectedTransaction?.status !== 'failed' && (
      <>
        <Button variant="outlined" startIcon={<EmailIcon />} sx={{ textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}>Email Receipt</Button>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadReceipt} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' }, width: { xs: '100%', sm: 'auto' } }}>Download Receipt</Button>
      </>
    )}
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
