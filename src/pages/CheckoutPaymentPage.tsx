// CheckoutPaymentPage.tsx - Updated version
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Lock as LockIcon,
  School as SchoolIcon,
  Check as CheckIcon,
  CreditCard as CreditCardIcon,
  PhoneAndroid as PhoneIcon,
  SimCard as SimCardIcon,
  Wifi as WifiIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  SignalCellularAlt as LevelIcon,
  Security as SecurityIcon,
  Undo as RefundIcon,
  VpnKey as PinIcon,
  Sms as OtpIcon,
} from '@mui/icons-material';
import { useFlutterwavePayment } from '../hooks/useFlutterwavePayment';

// Types
interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: string;
  originalPrice: number;
  currentPrice: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'mpesa', name: 'M-Pesa', description: 'Pay via M-Pesa', icon: <PhoneIcon />, color: '#4caf50' },
  { id: 'mtn', name: 'MTN MoMo', description: 'MTN Mobile Money', icon: <SimCardIcon />, color: '#ffcc00' },
  { id: 'airtel', name: 'Airtel Money', description: 'Airtel Pay', icon: <WifiIcon />, color: '#ff0000' },
  { id: 'flutterwave', name: 'Card Payment', description: 'Debit / Credit Card', icon: <CreditCardIcon />, color: '#f5a623' },
];

const countryCodes = [
  { code: '+254', flag: '🇰🇪', country: 'Kenya' },
  { code: '+256', flag: '🇺🇬', country: 'Uganda' },
  { code: '+255', flag: '🇹🇿', country: 'Tanzania' },
];

const sampleCourse: Course = {
  id: '1',
  title: 'Advanced React Patterns',
  instructor: 'Michael Rodriguez',
  duration: '24 hours',
  level: 'Advanced',
  originalPrice: 149.99,
  currentPrice: 129.99,
};

const CheckoutPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const course = (location.state as { course?: Course })?.course || sampleCourse;

  // Flutterwave hook
  const {
    step: flwStep,
    loading: flwLoading,
    error: flwError,
    transactionId,
    handleCardSubmit,
    handlePINSubmit,
    handleOTPSubmit,
    resetPayment,
  } = useFlutterwavePayment();

  // State
  const [selectedPayment, setSelectedPayment] = useState('mpesa');
  const [countryCode, setCountryCode] = useState('+254');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('Emma');
  const [lastName, setLastName] = useState('Chen');
  const [email, setEmail] = useState('emma.chen@example.com');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardExpiry, setCardExpiry] = useState(''); // MM/YY format

  // PIN/OTP dialog
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authValue, setAuthValue] = useState('');

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Calculate prices
  const subtotal = course.currentPrice;
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const processingFee = 0;
  const total = subtotal - discount + processingFee;

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoApplied(true);
      showToast('Promo code applied successfully!', 'success');
    } else if (promoCode) {
      showToast('Invalid promo code', 'error');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoCode('');
  };

  // Open auth dialog when PIN or OTP is needed
  React.useEffect(() => {
    if (flwStep === 'pin' || flwStep === 'otp') {
      setAuthDialogOpen(true);
      setAuthValue('');
    }
  }, [flwStep]);

  // Handle successful payment
  React.useEffect(() => {
    if (flwStep === 'success') {
      setIsProcessing(false);
      showToast('Payment successful! Redirecting...', 'success');
      
      setTimeout(() => {
        navigate('/invoice', {
          state: {
            customerName: `${firstName} ${lastName}`,
            customerEmail: email,
            customerPhone: selectedPayment === 'flutterwave' ? undefined : `${countryCode} ${phoneNumber}`,
            course: {
              title: course.title,
              instructor: course.instructor,
              unitPrice: course.currentPrice,
              originalPrice: course.currentPrice,
            },
            subtotal: subtotal,
            discount: discount,
            discountCode: promoApplied ? 'SAVE20' : undefined,
            total: total,
            paymentMethod: paymentMethods.find(m => m.id === selectedPayment)?.name,
            transactionId: transactionId,
          }
        });
      }, 1500);
    }
  }, [countryCode, course.currentPrice, course.instructor, course.title, discount, email, firstName, flwStep, lastName, navigate, phoneNumber, promoApplied, selectedPayment, subtotal, total, transactionId]);

  // Handle errors
  React.useEffect(() => {
    if (flwError) {
      setIsProcessing(false);
      showToast(flwError, 'error');
    }
  }, [flwError]);

  const handlePayment = async () => {
    if (!termsAccepted) {
      showToast('Please accept the terms and conditions', 'error');
      return;
    }

    // Card payment via Flutterwave
    if (selectedPayment === 'flutterwave') {
      if (!cardNumber || !cardCvv || !cardExpiry) {
        showToast('Please fill in all card details', 'error');
        return;
      }

      // Parse expiry MM/YY
      const [expiryMonth, expiryYear] = cardExpiry.split('/');
      if (!expiryMonth || !expiryYear || expiryMonth.length !== 2 || expiryYear.length !== 2) {
        showToast('Invalid expiry date format (use MM/YY)', 'error');
        return;
      }

      setIsProcessing(true);

      await handleCardSubmit({
        cardNumber: cardNumber.replace(/\s/g, ''),
        cvv: cardCvv,
        expiryMonth,
        expiryYear,
        email,
        amount: total,
        fullname: `${firstName} ${lastName}`,
      });

      return;
    }

    // Mobile money payments (existing logic)
    if (!phoneNumber) {
      showToast('Please enter your phone number', 'error');
      return;
    }

    setIsProcessing(true);

    // Simulate mobile money processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    showToast('Payment successful! Redirecting...', 'success');

    setTimeout(() => {
      navigate('/invoice', {
        state: {
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          customerPhone: `${countryCode} ${phoneNumber}`,
          course: {
            title: course.title,
            instructor: course.instructor,
            unitPrice: course.currentPrice,
            originalPrice: course.currentPrice,
          },
          subtotal: subtotal,
          discount: discount,
          discountCode: promoApplied ? 'SAVE20' : undefined,
          total: total,
          paymentMethod: paymentMethods.find(m => m.id === selectedPayment)?.name,
        }
      });
    }, 1500);
  };

  const handleAuthSubmit = () => {
    if (!authValue) {
      showToast(`Please enter ${flwStep === 'pin' ? 'PIN' : 'OTP'}`, 'error');
      return;
    }

    setAuthDialogOpen(false);
    
    if (flwStep === 'pin') {
      handlePINSubmit(authValue);
    } else if (flwStep === 'otp') {
      handleOTPSubmit(authValue);
    }
  };

  const isMobilePayment = ['mpesa', 'mtn', 'airtel'].includes(selectedPayment);
  const isCardPayment = selectedPayment === 'flutterwave';

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
          <SchoolIcon sx={{ color: '#ffa424', fontSize: 32 }} />
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
            { number: 1, label: 'Course Selected', completed: true },
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
          <Grid size={{ xs: 12, lg: 7 }}>
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
                <RadioGroup value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                  <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    {paymentMethods.map((method) => (
                      <Grid key={method.id} size={{ xs: 12, sm: 6 }}>
                        <Box
                          onClick={() => setSelectedPayment(method.id)}
                          sx={{
                            border: '2px solid',
                            borderColor: selectedPayment === method.id ? '#ffa424' : '#e4e4e7',
                            borderRadius: 2,
                            p: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            bgcolor: selectedPayment === method.id ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                            '&:hover': {
                              borderColor: '#ffa424',
                              bgcolor: 'rgba(255, 164, 36, 0.05)',
                            },
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
                                borderColor: selectedPayment === method.id ? '#ffa424' : '#d4d4d8',
                                bgcolor: selectedPayment === method.id ? '#ffa424' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {selectedPayment === method.id && <CheckIcon sx={{ fontSize: 12, color: 'white' }} />}
                            </Box>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>

                {/* Card Payment Form */}
                {isCardPayment && (
                  <Box
                    sx={{
                      bgcolor: 'rgba(245, 166, 35, 0.05)',
                      border: '1px solid rgba(245, 166, 35, 0.2)',
                      borderRadius: 2,
                      p: 2.5,
                      mb: 3,
                    }}
                  >
                    <Typography variant="body1" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#27272a' }}>
                      <CreditCardIcon sx={{ color: '#f5a623' }} />
                      Card Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Card Number <span style={{ color: '#ef4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => {
                            // Format card number with spaces
                            const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                            setCardNumber(value);
                          }}
                          inputProps={{ maxLength: 19 }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Expiry Date <span style={{ color: '#ef4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            // Format as MM/YY
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setCardExpiry(value);
                          }}
                          inputProps={{ maxLength: 5 }}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          CVV <span style={{ color: '#ef4444' }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type="password"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          inputProps={{ maxLength: 3 }}
                        />
                      </Grid>
                    </Grid>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                      Your card information is encrypted and secure
                    </Typography>
                  </Box>
                )}

                {/* Mobile Money Form */}
                {isMobilePayment && (
                  <Box
                    sx={{
                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                      border: '1px solid rgba(76, 175, 80, 0.2)',
                      borderRadius: 2,
                      p: 2.5,
                      mb: 3,
                    }}
                  >
                    <Typography variant="body1" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#27272a' }}>
                      <PhoneIcon sx={{ color: '#4caf50' }} />
                      {selectedPayment === 'mpesa' ? 'M-Pesa' : selectedPayment === 'mtn' ? 'MTN MoMo' : 'Airtel Money'} Payment Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Phone Number <span style={{ color: '#ef4444' }}>*</span>
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        size="small"
                        sx={{ width: 120 }}
                      >
                        {countryCodes.map((cc) => (
                          <MenuItem key={cc.code} value={cc.code}>
                            {cc.flag} {cc.code}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="712 345 678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Enter the phone number registered with your mobile money account
                    </Typography>
                  </Box>
                )}

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

                {/* Promo Code - same as before */}
                <Box sx={{ pt: 3, borderTop: '1px solid #e4e4e7' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Promo Code
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                      sx={{
                        borderColor: '#d4d4d8',
                        color: '#3f3f46',
                        textTransform: 'none',
                        '&:hover': { borderColor: '#ffa424', color: '#ffa424' },
                      }}
                    >
                      Apply
                    </Button>
                  </Stack>
                  {promoApplied && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        borderRadius: 1,
                      }}
                    >
                      <CheckIcon sx={{ color: '#10b981', mr: 1, fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500, flex: 1 }}>
                        SAVE20 applied - 20% off
                      </Typography>
                      <Button size="small" sx={{ color: '#71717a', minWidth: 'auto' }} onClick={handleRemovePromo}>
                        ✕
                      </Button>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Order Summary - Keep your existing code */}
          <Grid size={{ xs: 12, lg: 5 }}>
            {/* ... Your existing Order Summary code ... */}
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
                {/* Course Item */}
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
                    <SchoolIcon />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 0.5 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      by {course.instructor}
                    </Typography>
                    <Stack direction="row" spacing={1.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon sx={{ fontSize: 14 }} /> {course.duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LevelIcon sx={{ fontSize: 14 }} /> {course.level}
                      </Typography>
                    </Stack>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#a1a1aa', textDecoration: 'line-through' }}>
                      ${course.originalPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="text.primary">
                      ${course.currentPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                {/* Summary Details */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2" fontWeight={500} color="text.primary">${subtotal.toFixed(2)}</Typography>
                  </Stack>
                  {promoApplied && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Promo Discount (20%)</Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ color: '#10b981' }}>-${discount.toFixed(2)}</Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Processing Fee</Typography>
                    <Typography variant="body2" fontWeight={500} color="text.primary">$0.00</Typography>
                  </Stack>
                </Stack>

                {/* Total */}
                <Stack direction="row" justifyContent="space-between" sx={{ py: 2, borderTop: '2px solid #e4e4e7' }}>
                  <Typography variant="body1" fontWeight={600} color="text.primary">Total</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#ffa424' }}>${total.toFixed(2)}</Typography>
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
                      I agree to the <a href="#" style={{ color: '#ffa424' }}>Terms of Service</a> and{' '}
                      <a href="#" style={{ color: '#ffa424' }}>Privacy Policy</a>. I understand that my enrollment will be processed immediately after payment.
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
                  disabled={isProcessing || flwLoading}
                  startIcon={(isProcessing || flwLoading) ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
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
                  {(isProcessing || flwLoading) ? 'Processing...' : `Pay $${total.toFixed(2)}`}
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

      {/* PIN/OTP Dialog */}
      <Dialog 
        open={authDialogOpen} 
        onClose={() => {}}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {flwStep === 'pin' ? <PinIcon sx={{ color: '#ffa424' }} /> : <OtpIcon sx={{ color: '#ffa424' }} />}
          Enter {flwStep === 'pin' ? 'Card PIN' : 'OTP'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {flwStep === 'pin' 
              ? 'Please enter your 4-digit card PIN to complete the transaction'
              : 'An OTP has been sent to your phone/email. Please enter it below'}
          </Typography>
          <TextField
            fullWidth
            type={flwStep === 'pin' ? 'password' : 'text'}
            placeholder={flwStep === 'pin' ? '****' : '123456'}
            value={authValue}
            onChange={(e) => setAuthValue(e.target.value)}
            inputProps={{ 
              maxLength: flwStep === 'pin' ? 4 : 6,
              style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
            }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button 
            onClick={() => {
              setAuthDialogOpen(false);
              resetPayment();
              setIsProcessing(false);
            }}
            sx={{ color: '#71717a' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAuthSubmit}
            disabled={flwLoading}
            sx={{
              background: 'linear-gradient(135deg, #ffa424, #f97316)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {flwLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Overlay */}
      {(isProcessing || flwStep === 'processing') && (
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
            {isCardPayment 
              ? 'Please wait while we process your card payment'
              : `Please check your phone for the ${selectedPayment === 'mpesa' ? 'M-Pesa' : selectedPayment === 'mtn' ? 'MTN MoMo' : 'Airtel Money'} prompt`
            }
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