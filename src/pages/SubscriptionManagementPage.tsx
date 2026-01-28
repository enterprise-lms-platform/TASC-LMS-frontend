import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  LinearProgress,
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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  PhoneAndroid as PhoneIcon,
  SimCard as SimCardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpwardIcon,
  CalendarMonth as CalendarIcon,
  Warning as WarningIcon,
  Rocket as RocketIcon,
  Star as StarIcon,
  Add as AddIcon,
  PieChart as PieChartIcon,
  LocalOffer as LocalOfferIcon,
  AccountBalanceWallet as WalletIcon,
  ReceiptLong as InvoiceIcon,
  Book as BookIcon,
  EmojiEvents as CertificateIcon,
  Videocam as VideoIcon,
  CloudDownload as CloudDownloadIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

// --- Main Page Component ---
const SubscriptionManagementPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [cancelReason, setCancelReason] = useState('');
  const [paymentType, setPaymentType] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'warning' | 'error' });

  const handleMobileMenuToggle = () => setMobileOpen(!mobileOpen);
  const showToast = (message: string, severity: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCancelSubscription = () => {
    setCancelModalOpen(false);
    showToast('Your subscription has been cancelled. It will remain active until January 15, 2026.', 'warning');
  };

  const handleAddPayment = () => {
    setAddPaymentModalOpen(false);
    showToast('Payment method added successfully!');
    setPhoneNumber('');
    setSetAsDefault(false);
  };

  const handleUpgrade = () => {
    setUpgradeModalOpen(false);
    showToast('Your plan has been upgraded to Enterprise!');
  };

  const handleChangeBilling = () => {
    setBillingModalOpen(false);
    showToast('Billing cycle updated successfully!');
  };

  // Usage data
  const usageStats = [
    { icon: <BookIcon />, label: 'Courses Accessed', value: '8 / Unlimited', progress: 100, color: '#10b981', sublabel: 'Unlimited access with Pro plan' },
    { icon: <CertificateIcon />, label: 'Certificates Earned', value: '3 / 10', progress: 30, color: '#3b82f6', sublabel: '7 certificates remaining this month' },
    { icon: <VideoIcon />, label: 'Live Sessions', value: '12 / 20', progress: 60, color: '#ffa424', sublabel: '8 live sessions remaining' },
    { icon: <CloudDownloadIcon />, label: 'Downloads', value: '45 / 50', progress: 90, color: '#f59e0b', sublabel: '5 downloads remaining' },
  ];

  // Plans data
  const plans = [
    {
      name: 'Basic', price: '$9.99', period: '/ month', description: 'Perfect for getting started',
      features: [
        { text: 'Access to 50+ courses', enabled: true },
        { text: '5 certificates per month', enabled: true },
        { text: '5 live sessions per month', enabled: true },
        { text: 'Email support', enabled: true },
        { text: 'Offline downloads', enabled: false },
        { text: 'Priority support', enabled: false },
      ],
      current: false, popular: false, buttonText: 'Downgrade', buttonVariant: 'outlined' as const,
    },
    {
      name: 'Pro', price: '$29.99', period: '/ month', description: 'Best for serious learners',
      features: [
        { text: 'Unlimited course access', enabled: true },
        { text: '10 certificates per month', enabled: true },
        { text: '20 live sessions per month', enabled: true },
        { text: '50 offline downloads', enabled: true },
        { text: 'Priority email support', enabled: true },
        { text: '1-on-1 mentoring', enabled: false },
      ],
      current: true, popular: false, buttonText: 'Current Plan', buttonVariant: 'contained' as const,
    },
    {
      name: 'Enterprise', price: '$79.99', period: '/ month', description: 'For teams and organizations',
      features: [
        { text: 'Everything in Pro', enabled: true },
        { text: 'Unlimited certificates', enabled: true },
        { text: 'Unlimited live sessions', enabled: true },
        { text: 'Unlimited downloads', enabled: true },
        { text: '24/7 priority support', enabled: true },
        { text: 'Monthly 1-on-1 mentoring', enabled: true },
      ],
      current: false, popular: true, buttonText: 'Upgrade Now', buttonVariant: 'contained' as const,
    },
  ];

  // Billing history
  const billingHistory = [
    { id: 'INV-2025-1215', date: 'Dec 15, 2025', amount: '$29.99', status: 'Paid' },
    { id: 'INV-2025-1115', date: 'Nov 15, 2025', amount: '$29.99', status: 'Paid' },
    { id: 'INV-2025-1015', date: 'Oct 15, 2025', amount: '$29.99', status: 'Paid' },
  ];

  // Payment methods
  const paymentMethods = [
    { type: 'M-Pesa', number: '+254 *** *** 4521', icon: <PhoneIcon />, isDefault: true, color: '#4caf50' },
    { type: 'MTN MoMo', number: '+256 *** *** 7892', icon: <SimCardIcon />, isDefault: false, color: '#ffcc00' },
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
            <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Subscription Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage your subscription plan, billing, and payment methods</Typography>
          </Box>
          <Button variant="outlined" startIcon={<HelpIcon />} sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none', alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
            Help
          </Button>
        </Box>

        {/* Current Plan Card */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ffa424, #f97316)',
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            color: 'white',
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': { content: '""', position: 'absolute', top: '-50%', right: '-20%', width: 400, height: 400, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' },
            '&::after': { content: '""', position: 'absolute', bottom: '-30%', left: '-10%', width: 300, height: 300, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' },
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
            <Box>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', px: 2, py: 0.5, borderRadius: 999, mb: 2, fontSize: '0.875rem', fontWeight: 600 }}>
                <StarIcon sx={{ fontSize: 16 }} /> Active Plan
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>Pro Plan</Typography>
              <Typography variant="h5" sx={{ opacity: 0.9 }}>
                $29.99 <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>/ month</Typography>
              </Typography>
            </Box>
            <Box sx={{ mt: { xs: 2, md: 0 }, bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 2, backdropFilter: 'blur(10px)' }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Auto-renews Jan 15, 2026</Typography>
            </Box>
          </Stack>

          <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
            {[
              { label: 'Billing Cycle', value: 'Monthly' },
              { label: 'Member Since', value: 'March 15, 2025' },
              { label: 'Next Payment', value: '$29.99 on Jan 15, 2026' },
              { label: 'Payment Method', value: 'M-Pesa (...4521)' },
            ].map((item, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: 2, backdropFilter: 'blur(10px)' }}>
                  <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>{item.label}</Typography>
                  <Typography variant="body2" fontWeight={600}>{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            <Button variant="contained" startIcon={<ArrowUpwardIcon />} onClick={() => setUpgradeModalOpen(true)} sx={{ bgcolor: 'white', color: '#ffa424', '&:hover': { bgcolor: '#f4f4f5' }, textTransform: 'none' }}>
              Upgrade Plan
            </Button>
            <Button variant="contained" startIcon={<CalendarIcon />} onClick={() => setBillingModalOpen(true)} sx={{ bgcolor: 'white', color: '#ffa424', '&:hover': { bgcolor: '#f4f4f5' }, textTransform: 'none' }}>
              Change Billing Cycle
            </Button>
            <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => setCancelModalOpen(true)} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.5)' }, textTransform: 'none' }}>
              Cancel Subscription
            </Button>
          </Stack>
        </Box>

        {/* Usage Stats */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PieChartIcon sx={{ color: '#ffa424' }} /> Usage This Month
              </Typography>
              <Typography variant="body2" color="text.secondary">Resets on Jan 15, 2026</Typography>
            </Stack>
            <Grid container spacing={3}>
              {usageStats.map((stat, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                  <Box sx={{ bgcolor: '#fafafa', p: 2.5, borderRadius: 2, border: '1px solid #e4e4e7' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: stat.color }}>{stat.icon}</Box> {stat.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>{stat.value}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={stat.progress} sx={{ height: 8, borderRadius: 4, mb: 1, bgcolor: '#e4e4e7', '& .MuiLinearProgress-bar': { bgcolor: stat.color, borderRadius: 4 } }} />
                    <Typography variant="caption" color="text.secondary">{stat.sublabel}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalOfferIcon sx={{ color: '#ffa424' }} /> Available Plans
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}>Monthly</Button>
              <Button variant="contained" size="small" sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>Annual (Save 20%)</Button>
            </Stack>
          </Stack>
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid size={{ xs: 12, md: 4 }} key={plan.name}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: plan.current ? '2px solid #10b981' : plan.popular ? '2px solid #ffa424' : '2px solid #e4e4e7',
                    position: 'relative',
                    transition: 'all 0.3s',
                    pt: 2,
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
                    bgcolor: plan.current ? 'rgba(16, 185, 129, 0.02)' : 'white',
                  }}
                >
                  {plan.popular && (
                    <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#ffa424', color: 'white', px: 2, py: 0.5, borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, zIndex: 1, whiteSpace: 'nowrap' }}>
                      <StarIcon sx={{ fontSize: 14 }} /> Most Popular
                    </Box>
                  )}
                  {plan.current && (
                    <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#10b981', color: 'white', px: 2, py: 0.5, borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, zIndex: 1, whiteSpace: 'nowrap' }}>
                      <CheckIcon sx={{ fontSize: 14 }} /> Current Plan
                    </Box>
                  )}
                  <CardContent sx={{ p: 3, textAlign: 'center', pt: plan.popular || plan.current ? 5 : 3 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>{plan.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{plan.description}</Typography>
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 3 }}>
                      {plan.price} <Typography component="span" variant="body2" color="text.secondary">{plan.period}</Typography>
                    </Typography>
                    <Stack spacing={1.5} sx={{ mb: 3, textAlign: 'left' }}>
                      {plan.features.map((f, i) => (
                        <Stack key={i} direction="row" alignItems="center" spacing={1.5} sx={{ color: f.enabled ? 'text.secondary' : 'text.disabled' }}>
                          {f.enabled ? <CheckIcon fontSize="small" sx={{ color: '#10b981' }} /> : <CloseIcon fontSize="small" sx={{ color: '#d4d4d8' }} />}
                          <Typography variant="body2">{f.text}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      fullWidth
                      variant={plan.buttonVariant}
                      disabled={plan.current}
                      onClick={() => plan.popular && setUpgradeModalOpen(true)}
                      sx={{
                        py: 1.5,
                        textTransform: 'none',
                        bgcolor: plan.popular ? '#ffa424' : plan.current ? '#10b981' : 'transparent',
                        color: plan.popular || plan.current ? 'white' : '#3f3f46',
                        borderColor: plan.current ? '#10b981' : '#d4d4d8',
                        '&:hover': { bgcolor: plan.popular ? '#f97316' : '#f4f4f5' },
                        '&.Mui-disabled': { bgcolor: '#10b981', color: 'white' },
                      }}
                      startIcon={plan.popular ? <ArrowUpwardIcon /> : plan.current ? <CheckIcon /> : undefined}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Billing */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InvoiceIcon sx={{ color: '#ffa424' }} /> Recent Billing
              </Typography>
              <Button variant="outlined" size="small" endIcon={<ArrowUpwardIcon sx={{ transform: 'rotate(90deg)' }} />} sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}>
                View All
              </Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    {['Invoice', 'Date', 'Amount', 'Status', 'Action'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingHistory.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.id}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        <Chip label={row.status} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, '&::before': { content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', mr: 1 } }} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" startIcon={<DownloadIcon />} sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}>
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e4e4e7' }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WalletIcon sx={{ color: '#ffa424' }} /> Payment Methods
              </Typography>
              <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setAddPaymentModalOpen(true)} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' }, alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
                Add New
              </Button>
            </Stack>
            <Stack spacing={2}>
              {paymentMethods.map((method, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    border: method.isDefault ? '2px solid #ffa424' : '1px solid #e4e4e7',
                    borderRadius: 2,
                    bgcolor: method.isDefault ? 'rgba(255, 164, 36, 0.05)' : 'transparent',
                  }}
                >
                  <Box sx={{ width: 48, height: 32, bgcolor: '#f4f4f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: method.color, flexShrink: 0 }}>
                    {method.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>{method.type}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{method.number}</Typography>
                  </Box>
                  {method.isDefault && (
                    <Chip label="Default" size="small" sx={{ bgcolor: 'rgba(255, 164, 36, 0.1)', color: '#ffa424', fontWeight: 600, fontSize: '0.65rem', flexShrink: 0 }} />
                  )}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexShrink: 0 }}>
                    {!method.isDefault && (
                      <Button size="small" variant="outlined" sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none', fontSize: { xs: '0.7rem', sm: '0.8125rem' } }}>Set Default</Button>
                    )}
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#ef4444' }}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Cancel Subscription Modal */}
      <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Cancel Subscription
          <IconButton onClick={() => setCancelModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <WarningIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Are you sure you want to cancel?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your subscription will remain active until <strong>January 15, 2026</strong>. After that, you'll lose access to:
            </Typography>
            <Stack spacing={1} sx={{ textAlign: 'left', mb: 3 }}>
              {['Unlimited course access', 'Live session participation', 'Certificate generation', 'Offline downloads'].map((item) => (
                <Stack key={item} direction="row" spacing={1} alignItems="center">
                  <CloseIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                  <Typography variant="body2" color="text.secondary">{item}</Typography>
                </Stack>
              ))}
            </Stack>
            <FormControl fullWidth>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1, textAlign: 'left' }}>Reason for cancellation (optional)</Typography>
              <Select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} size="small" displayEmpty>
                <MenuItem value="">Select a reason...</MenuItem>
                <MenuItem value="expensive">Too expensive</MenuItem>
                <MenuItem value="not_using">Not using it enough</MenuItem>
                <MenuItem value="alternative">Found an alternative</MenuItem>
                <MenuItem value="features">Missing features</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e4e4e7' }}>
          <Button variant="outlined" onClick={() => setCancelModalOpen(false)} sx={{ textTransform: 'none' }}>Keep Subscription</Button>
          <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={handleCancelSubscription} sx={{ textTransform: 'none' }}>Cancel Subscription</Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Method Modal */}
      <Dialog open={addPaymentModalOpen} onClose={() => setAddPaymentModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add Payment Method
          <IconButton onClick={() => setAddPaymentModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>Payment Type</Typography>
              <Select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} size="small">
                <MenuItem value="mpesa">M-Pesa</MenuItem>
                <MenuItem value="mtn">MTN MoMo</MenuItem>
                <MenuItem value="airtel">Airtel Money</MenuItem>
                <MenuItem value="card">Credit/Debit Card</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Phone Number" placeholder="+254 7XX XXX XXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} size="small" fullWidth />
            <FormControlLabel control={<Checkbox checked={setAsDefault} onChange={(e) => setSetAsDefault(e.target.checked)} />} label="Set as default payment method" />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e4e4e7' }}>
          <Button variant="outlined" onClick={() => setAddPaymentModalOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddPayment} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>Add Payment Method</Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Plan Modal */}
      <Dialog open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Upgrade to Enterprise
          <IconButton onClick={() => setUpgradeModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <RocketIcon sx={{ fontSize: 48, color: '#ffa424', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>Upgrade to Enterprise</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Unlock unlimited access to all features</Typography>
            <Box sx={{ bgcolor: '#fafafa', p: 3, borderRadius: 2, mb: 3 }}>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="body2">Enterprise Plan (Monthly)</Typography>
                <Typography variant="body2" fontWeight={600}>$79.99</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="body2">Current Pro Plan Credit</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#10b981' }}>-$15.00</Typography>
              </Stack>
              <Box sx={{ borderTop: '1px solid #e4e4e7', pt: 1.5 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1" fontWeight={600}>Due Today</Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ color: '#ffa424' }}>$64.99</Typography>
                </Stack>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Your subscription will be upgraded immediately. The prorated amount will be charged to your default payment method.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e4e4e7' }}>
          <Button variant="outlined" onClick={() => setUpgradeModalOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" startIcon={<ArrowUpwardIcon />} onClick={handleUpgrade} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>Confirm Upgrade</Button>
        </DialogActions>
      </Dialog>

      {/* Change Billing Cycle Modal */}
      <Dialog open={billingModalOpen} onClose={() => setBillingModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Change Billing Cycle
          <IconButton onClick={() => setBillingModalOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Switch to annual billing and save 20% on your subscription.
          </Typography>
          <RadioGroup value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
            {[
              { value: 'monthly', label: 'Monthly', price: '$29.99/month', badge: 'Current', selected: true },
              { value: 'quarterly', label: 'Quarterly', price: '$79.99/quarter ($26.66/mo)', badge: 'Save 11%', selected: false },
              { value: 'annual', label: 'Annual', price: '$287.90/year ($23.99/mo)', badge: 'Save 20%', selected: false },
            ].map((option) => (
              <Box
                key={option.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 1.5,
                  border: billingCycle === option.value ? '2px solid #ffa424' : '2px solid #e4e4e7',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: billingCycle === option.value ? 'rgba(255, 164, 36, 0.05)' : 'transparent',
                }}
                onClick={() => setBillingCycle(option.value)}
              >
                <Radio value={option.value} sx={{ color: billingCycle === option.value ? '#ffa424' : undefined, '&.Mui-checked': { color: '#ffa424' } }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" fontWeight={600}>{option.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{option.price}</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: option.value === 'monthly' ? '#3f3f46' : '#10b981' }}>
                  {option.badge}
                </Typography>
              </Box>
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e4e4e7' }}>
          <Button variant="outlined" onClick={() => setBillingModalOpen(false)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" startIcon={<CheckIcon />} onClick={handleChangeBilling} sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>Update Billing Cycle</Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SubscriptionManagementPage;
