import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Chip, IconButton,
  Button, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Receipt as InvoiceIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

interface Invoice {
  id: string;
  customer: string;
  email: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: number;
}

const invoices: Invoice[] = [
  { id: 'INV-2405', customer: 'TechCorp Ltd', email: 'billing@techcorp.com', amount: '$4,200', issueDate: 'Feb 20, 2026', dueDate: 'Mar 20, 2026', status: 'pending', items: 3 },
  { id: 'INV-2404', customer: 'Startup Hub', email: 'finance@startuphub.io', amount: '$1,890', issueDate: 'Feb 18, 2026', dueDate: 'Feb 22, 2026', status: 'overdue', items: 2 },
  { id: 'INV-2403', customer: 'Global Academy', email: 'pay@globalacademy.org', amount: '$6,400', issueDate: 'Feb 15, 2026', dueDate: 'Mar 15, 2026', status: 'pending', items: 5 },
  { id: 'INV-2402', customer: 'EduPro Inc', email: 'ap@edupro.com', amount: '$850', issueDate: 'Feb 12, 2026', dueDate: 'Feb 15, 2026', status: 'paid', items: 1 },
  { id: 'INV-2401', customer: 'Acme Corporation', email: 'invoices@acme.co', amount: '$12,600', issueDate: 'Feb 10, 2026', dueDate: 'Mar 10, 2026', status: 'paid', items: 8 },
  { id: 'INV-2400', customer: 'NextGen Partners', email: 'billing@nextgen.com', amount: '$3,200', issueDate: 'Feb 8, 2026', dueDate: 'Mar 8, 2026', status: 'paid', items: 4 },
  { id: 'INV-2399', customer: 'Digital Futures', email: 'finance@digifutures.co', amount: '$2,100', issueDate: 'Feb 5, 2026', dueDate: 'Feb 20, 2026', status: 'overdue', items: 2 },
  { id: 'INV-2398', customer: 'InnovateTech', email: 'ap@innovatetech.io', amount: '$5,800', issueDate: 'Feb 1, 2026', dueDate: 'Mar 1, 2026', status: 'draft', items: 6 },
];

const statusColors: Record<InvoiceStatus, { bg: string; color: string }> = {
  paid: { bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
  pending: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1' },
  overdue: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  draft: { bg: 'rgba(156,163,175,0.1)', color: '#71717a' },
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const FinanceInvoicesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (search && !inv.customer.toLowerCase().includes(search.toLowerCase()) && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalOutstanding = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  const summaryCards = [
    { label: 'Total Invoices', value: invoices.length.toString(), color: '#6366f1' },
    { label: 'Paid', value: invoices.filter((i) => i.status === 'paid').length.toString(), color: '#10b981' },
    { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, color: '#f59e0b' },
    { label: 'Overdue', value: invoices.filter((i) => i.status === 'overdue').length.toString(), color: '#ef4444' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Invoices</Typography>
              <Typography variant="body2" color="text.secondary">Create, manage and track invoices</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<ExportIcon />}
                sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}>
                Export
              </Button>
              <Button size="small" variant="contained" startIcon={<AddIcon />}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                New Invoice
              </Button>
            </Box>
          </Box>

          {/* Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {summaryCards.map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                <Paper elevation={0} sx={{ ...cardSx, p: 2, px: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 8, height: 32, borderRadius: 4, bgcolor: s.color }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1 }}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.02)' } }}
              />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Invoices List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>All Invoices</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} invoice{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {filtered.map((inv, i) => (
              <Box key={inv.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,164,36,0.1)', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <InvoiceIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={700}>{inv.id}</Typography>
                    <Typography variant="body2" fontWeight={500} noWrap>— {inv.customer}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">{inv.items} item{inv.items !== 1 ? 's' : ''} · Due {inv.dueDate}</Typography>
                </Box>
                <Typography variant="body2" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>{inv.amount}</Typography>
                <Chip label={inv.status} size="small" sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize',
                  bgcolor: statusColors[inv.status].bg, color: statusColors[inv.status].color,
                }} />
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  {(inv.status === 'pending' || inv.status === 'overdue') && (
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
                      <SendIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceInvoicesPage;
