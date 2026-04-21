// CheckoutPaymentPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import {
  Lock as LockIcon,
  Check as CheckIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Undo as RefundIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useMySubscription, usePesapalInitiateSubscriptionOnetime, useSubscriptions } from '../../hooks/usePayments';
import { initiatePaymentError } from '../../utils/paymentErrors';
import type { Subscription } from '../../types/types';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pesapal',
    name: 'Pesapal',
    description: 'Pay securely on hosted Pesapal checkout',
    icon: <CreditCardIcon />,
    color: '#f5a623',
  },
];

const CheckoutPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: subStatus } = useMySubscription();
  const { data: plansResponse = [], isLoading: plansLoading } = useSubscriptions();
  const pesapalInitiate = usePesapalInitiateSubscriptionOnetime();

  // ── State declared before any conditional return (Rules of Hooks) ──
  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const plans = (plansResponse ?? []) as Subscription[];
  const isPaidPlan = (p: Subscription) => {
    const price = parseFloat(p.price || '0');
    return (p.trial_days ?? 0) <= 0 && price > 0 && !/trial/i.test(p.name || '');
  };
  const paidPlans = plans.filter(isPaidPlan);
  const plan =
    paidPlans.find((p) => p.status === 'active') ??
    paidPlans[0] ??
    plans.find((p) => p.status === 'active') ??
    plans[0];
  const hasActiveSubscription = subStatus?.has_active_subscription ?? false;

  if (hasActiveSubscription) {
    navigate('/learner/subscription', { replace: true });
    return null;
  }

  const subtotal = plan ? parseFloat(plan.price) : 0;
  const processingFee = 0;
  const total = subtotal + processingFee;
  const currency = plan?.currency || 'USD';

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const handlePayment = async () => {
    if (!termsAccepted) {
      showToast('Please accept the terms and conditions', 'error');
      return;
    }
    if (!plan?.id) {
      showToast('No subscription plan is available right now. Please try again later.', 'error');
      return;
    }
    setIsProcessing(true);
    try {
      const response = await pesapalInitiate.mutateAsync({
        subscription_id: plan.id,
        currency: plan.currency || 'UGX',
      });
      localStorage.setItem(
        'pesapal_checkout_context',
        JSON.stringify({
          paymentId: response.payment_id,
          subscriptionId: plan.id,
          planName: plan.name,
        }),
      );
      window.location.assign(response.redirect_url);
    } catch (err) {
      setIsProcessing(false);
      const msg = initiatePaymentError(err, { planName: plan?.name, currency: plan?.currency });
      showToast(msg, 'error');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f4f5' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'white',
          p: 2,
          px: { xs: 2, md: 4 },
          borderBottom: '1px solid #e4e4e7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Box component="img" src="/TASC logo.png" alt="TASC Logo" sx={{ width: 48, height: 48, objectFit: 'contain' }} />
          <Typography variant="h6" fontWeight={700} color="text.primary">
            TASC LMS
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#10b981' }}>
          <LockIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            Secure Checkout
          </Typography>
        </Stack>
      </Box>

      {/* Main Container */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Steps - same as before */}
        <Stack direction="row" justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ mb: 4, gap: 2 }}>
          {[
            { number: 1, label: 'Plan Selected', completed: true },
            { number: 2, label: 'Payment', active: true },
            { number: 3, label: 'Confirmation', completed: false },
          ].map((step, index) => (
            <React.Fragment key={step.number}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    bgcolor: step.completed ? '#10b981' : step.active ? '#ffa424' : '#e4e4e7',
                    color: step.completed || step.active ? 'white' : '#71717a',
                  }}
                >
                  {step.completed ? <CheckIcon sx={{ fontSize: 16 }} /> : step.number}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: step.active ? '#27272a' : '#71717a',
                    fontWeight: step.active ? 500 : 400,
                  }}
                >
                  {step.label}
                </Typography>
              </Stack>
              {index < 2 && (
                <Box
                  sx={{
                    width: 60,
                    height: 2,
                    bgcolor: step.completed ? '#10b981' : '#e4e4e7',
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Stack>

        {/* Grid Layout */}
        <Grid container spacing={4}>
          {/* Payment Section */}
          <Grid size={{ xs: 12, md: 7, lg: 7 }}>
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              {/* Payment Methods Header */}
              <Box sx={{ p: 2.5, px: 3, bgcolor: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CreditCardIcon sx={{ color: '#ffa424' }} />
                  Payment Method
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Payment Methods Grid */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  {paymentMethods.map((method) => (
                    <Grid key={method.id} size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{
                          border: '2px solid',
                          borderColor: '#ffa424',
                          borderRadius: 2,
                          p: 2,
                          bgcolor: 'rgba(255, 164, 36, 0.1)',
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Box
                            sx={{
                              width: 48,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#f4f4f5',
                              borderRadius: 1,
                              color: method.color,
                            }}
                          >
                            {method.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                              {method.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: '#ffa424',
                              bgcolor: '#ffa424',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 12, color: 'white' }} />
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box
                  sx={{
                    bgcolor: 'rgba(245, 166, 35, 0.05)',
                    border: '1px solid rgba(245, 166, 35, 0.2)',
                    borderRadius: 2,
                    p: 2.5,
                    mb: 3,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    When you click pay, you will be redirected to Pesapal hosted checkout to complete payment securely.
                  </Typography>
                </Box>

                {/* Billing Information - same as before */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#27272a' }}>
                    <PersonIcon sx={{ color: '#ffa424' }} />
                    Billing Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        First Name <span style={{ color: '#ef4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Last Name <span style={{ color: '#ef4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Email Address <span style={{ color: '#ef4444' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        slotProps={{
                          input: {
                            startAdornment: <EmailIcon sx={{ color: '#a1a1aa', mr: 1, fontSize: 20 }} />,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Receipt will be sent to this email
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

              </Box>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 5, lg: 5 }}>
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                position: { lg: 'sticky' },
                top: { lg: 32 },
              }}
            >
              <Box sx={{ p: 2.5, px: 3, borderBottom: '1px solid #e4e4e7' }}>
                <Typography variant="h6" fontWeight={600}>
                  Order Summary
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Plan Item */}
                <Stack direction="row" spacing={2} sx={{ pb: 2.5, mb: 2.5, borderBottom: '1px solid #e4e4e7' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <CreditCardIcon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                      {plan?.name || (plansLoading ? 'Loading plan…' : 'Subscription')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Subscription activation (6 months)
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Unlock all courses after backend confirmation.
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" fontWeight={700} color="text.primary">
                      {currency} {total.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                {/* Summary Details */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2" fontWeight={500} color="text.primary">{currency} {subtotal.toFixed(2)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Processing Fee</Typography>
                    <Typography variant="body2" fontWeight={500} color="text.primary">$0.00</Typography>
                  </Stack>
                </Stack>

                {/* Total */}
                <Stack direction="row" justifyContent="space-between" sx={{ py: 2, borderTop: '2px solid #e4e4e7' }}>
                  <Typography variant="body1" fontWeight={600} color="text.primary">Total</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#ffa424' }}>{currency} {total.toFixed(2)}</Typography>
                </Stack>

                {/* Terms */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      sx={{ '&.Mui-checked': { color: '#ffa424' } }}
                    />
                  }
                  label={
                    <Typography variant="caption" color="text.secondary">
                      I agree to the <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" style={{ color: '#ffa424' }}>Terms of Service</a> and{' '}
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#ffa424' }}>Privacy Policy</a>. I understand that my enrollment will be processed immediately after payment.
                    </Typography>
                  }
                  sx={{ mt: 2, alignItems: 'flex-start' }}
                />

                {/* Pay Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePayment}
                  disabled={isProcessing || pesapalInitiate.isPending}
                  startIcon={(isProcessing || pesapalInitiate.isPending) ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #ffa424, #f97316)',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    },
                    '&:disabled': {
                      background: '#d4d4d8',
                    },
                  }}
                >
                  {(isProcessing || pesapalInitiate.isPending) ? 'Redirecting to Pesapal...' : `Activate Subscription — ${currency} ${total.toFixed(2)}`}
                </Button>

                {/* Security Info */}
                <Box sx={{ mt: 2.5, p: 2, bgcolor: '#fafafa', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <SecurityIcon sx={{ color: '#10b981', fontSize: 16 }} />
                    Your payment is secured with 256-bit SSL encryption
                  </Typography>
                </Box>

                {/* Guarantee */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    mt: 2.5,
                    p: 2,
                    bgcolor: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  <RefundIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500} color="text.primary">
                      30-Day Money-Back Guarantee
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Not satisfied? Get a full refund within 30 days.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Loading Overlay */}
      {(isProcessing || pesapalInitiate.isPending) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <CircularProgress size={50} sx={{ color: '#ffa424', mb: 2 }} />
          <Typography variant="h6" color="text.primary" fontWeight={500}>
            Processing your payment...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Redirecting you to Pesapal hosted checkout...
          </Typography>
        </Box>
      )}

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPaymentPage;