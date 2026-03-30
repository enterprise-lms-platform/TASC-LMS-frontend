import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { invoiceApi } from '../../services/main.api';
import { managerBillingApi } from '../../services/organization.services';

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

// ─── Component ─────────────────────────────────────────────

const ManagerBillingPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices', 'billing'],
    queryFn: () => invoiceApi.getAll({}).then(r => r.data),
  });

  const { data: plan } = useQuery({
    queryKey: ['manager', 'billing', 'plan'],
    queryFn: () => managerBillingApi.getPlan().then(r => r.data),
  });

  const { data: usage } = useQuery({
    queryKey: ['manager', 'billing', 'usage'],
    queryFn: () => managerBillingApi.getUsage().then(r => r.data),
  });

  const invoices = Array.isArray(invoicesData) ? invoicesData : (invoicesData as any)?.results ?? [];

  const billingHistory = useMemo(() => {
    return invoices.map((inv) => ({
      id: inv.id,
      date: inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : '-',
      description: inv.notes || `Invoice #${inv.invoice_number}`,
      amount: inv.total_amount ? `$${inv.total_amount}` : '$0.00',
      status: inv.status === 'paid' ? 'Paid' : inv.status === 'pending' ? 'Pending' : 'Failed',
      pdfUrl: inv.invoice_pdf_url || null,
    }));
  }, [invoices]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* ── Page Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCardIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Billing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage subscription and payments
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* ── Card 1: Current Plan ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Current Plan</Typography>
                  <Chip
                    label="Active"
                    size="small"
                    icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      bgcolor: 'rgba(16,185,129,0.1)',
                      color: '#059669',
                      '& .MuiChip-icon': { color: '#059669' },
                    }}
                  />
                </Box>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                    <Typography variant="h4" fontWeight={800} color="text.primary">
                      {plan?.plan_name ?? '—'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 3 }}>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#ffa424' }}>
                      {plan ? `${plan.currency} ${plan.price}` : '—'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      {plan?.billing_cycle ? `/${plan.billing_cycle}` : ''}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Renewal Date</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {plan?.renewal_date ? new Date(plan.renewal_date).toLocaleDateString() : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">User Limit</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {plan?.user_limit != null ? `${plan.user_limit} users` : 'Unlimited'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Storage</Typography>
                      <Typography variant="body2" fontWeight={600}>100 GB</Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: '10px',
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #ffa424, #f97316)',
                      boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                        boxShadow: '0 6px 16px rgba(255,164,36,0.4)',
                      },
                    }}
                  >
                    Upgrade Plan
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* ── Card 2: Usage ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Usage</Typography>
                </Box>
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Users */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>Users</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {usage?.active_users ?? '—'}{plan?.user_limit != null ? ` / ${plan.user_limit}` : ''}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        usage && plan?.user_limit
                          ? Math.min((usage.active_users / plan.user_limit) * 100, 100)
                          : 0
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #ffa424, #f97316)',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      {usage && plan?.user_limit
                        ? `${((usage.active_users / plan.user_limit) * 100).toFixed(1)}% of plan limit`
                        : 'Usage data unavailable'}
                    </Typography>
                  </Box>

                  {/* Storage */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>Storage</Typography>
                      <Typography variant="body2" color="text.secondary">42 GB / 100 GB</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={42}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      42% of plan limit
                    </Typography>
                  </Box>

                  {/* Courses */}
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>Active Courses</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {usage?.active_courses ?? '—'} / Unlimited
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          background: 'linear-gradient(90deg, #10b981, #34d399)',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                      Unlimited courses included
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* ── Card 3: Payment Method ── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Typography fontWeight={700}>Payment Method</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2.5,
                      borderRadius: '12px',
                      bgcolor: 'rgba(255,164,36,0.04)',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 32,
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #1a1f71, #2b3990)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.6rem' }}>
                        VISA
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        Visa ending in ****4242
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Expires 12/27
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: '#ffa424',
                        color: '#ffa424',
                        '&:hover': {
                          borderColor: '#f97316',
                          bgcolor: 'rgba(255,164,36,0.04)',
                        },
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* ── Card 4: Billing History ── */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ReceiptIcon sx={{ fontSize: 20, color: '#ffa424' }} />
                    <Typography fontWeight={700}>Billing History</Typography>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Description
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Amount
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">
                          Invoice
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billingHistory.map((entry) => (
                        <TableRow
                          key={entry.id}
                          sx={{
                            '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' },
                            transition: 'background 0.15s',
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight={500}>
                              {entry.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {entry.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {entry.amount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={entry.status}
                              size="small"
                              icon={entry.status === 'Paid' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <ScheduleIcon sx={{ fontSize: 14 }} />}
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                borderRadius: '6px',
                                bgcolor: entry.status === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                color: entry.status === 'Paid' ? '#059669' : '#d97706',
                                '& .MuiChip-icon': {
                                  color: entry.status === 'Paid' ? '#059669' : '#d97706',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title={entry.pdfUrl ? 'Download Invoice' : 'PDF not available'}>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={!entry.pdfUrl}
                                  onClick={() => entry.pdfUrl && window.open(entry.pdfUrl, '_blank')}
                                  sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: '#ffa424', bgcolor: 'rgba(255,164,36,0.08)' },
                                  }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerBillingPage;
