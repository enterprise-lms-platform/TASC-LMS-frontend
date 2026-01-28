import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import {
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  PhoneAndroid as PhoneIcon,
  QrCode2 as QrCodeIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  List as ListIcon,
} from '@mui/icons-material';

// Types
interface InvoiceData {
  invoiceNumber: string;
  date: string;
  status: 'paid' | 'pending';
  customer: {
    name: string;
    email: string;
    phone: string;
    accountType: string;
  };
  course: {
    title: string;
    instructor: string;
    unitPrice: number;
  };
  subtotal: number;
  discount: number;
  discountCode?: string;
  processingFee: number;
  tax: number;
  total: number;
  paymentMethod: {
    type: string;
    maskedNumber: string;
  };
  transactionId: string;
  receiptNumber: string;
}

// Generate invoice data from location state or use sample
const generateInvoiceData = (state: any): InvoiceData => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const invoiceNum = `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  
  return {
    invoiceNumber: invoiceNum,
    date: dateStr,
    status: 'paid',
    customer: {
      name: state?.customerName || 'Emma Chen',
      email: state?.customerEmail || 'emma.chen@example.com',
      phone: state?.customerPhone || '+254 *** *** 4521',
      accountType: 'Pro Learner Account',
    },
    course: {
      title: state?.course?.title || 'Advanced React Patterns',
      instructor: state?.course?.instructor || 'Michael Rodriguez',
      unitPrice: state?.course?.originalPrice || 149.99,
    },
    subtotal: state?.subtotal || 149.99,
    discount: state?.discount || 30.00,
    discountCode: state?.discountCode || 'SAVE20',
    processingFee: 0,
    tax: 0,
    total: state?.total || 119.99,
    paymentMethod: {
      type: state?.paymentMethod || 'M-Pesa',
      maskedNumber: '+254 *** *** 4521',
    },
    transactionId: `TXN-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`,
    receiptNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 90) + 10}XY${Math.floor(Math.random() * 9)}MP`,
  };
};

const InvoiceReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const invoice = generateInvoiceData(location.state);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleDownload = () => {
    showToast('Downloading invoice as PDF...');
    setTimeout(() => {
      showToast('Invoice downloaded successfully!');
    }, 1500);
  };

  const handleEmail = () => {
    showToast(`Sending invoice to ${invoice.customer.email}...`);
    setTimeout(() => {
      showToast('Invoice sent to your email!');
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          '@media print': { display: 'none' },
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
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/learner')}
            sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              bgcolor: '#ffa424',
              textTransform: 'none',
              '&:hover': { bgcolor: '#f97316', transform: 'translateY(-1px)' },
            }}
          >
            Download PDF
          </Button>
        </Stack>
      </Box>

      {/* Invoice Container */}
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Invoice Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ffa424, #f97316)',
              color: 'white',
              p: { xs: 4, md: 6 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: 300,
                height: 300,
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
              spacing={3}
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SchoolIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight={700}>TASC LMS</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Learning Management System</Typography>
                </Box>
              </Stack>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>{invoice.invoiceNumber}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Issued: {invoice.date}</Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'rgba(16, 185, 129, 0.3)',
                    px: 2,
                    py: 0.5,
                    borderRadius: 999,
                    mt: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                  PAID
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Invoice Body */}
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            {/* Parties Section */}
            <Grid container spacing={4} sx={{ mb: 6, pb: 6, borderBottom: '1px solid #e4e4e7' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ bgcolor: '#fafafa', p: 2.5, borderRadius: 2, border: '1px solid #e4e4e7' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: '#71717a', mb: 1.5, display: 'block' }}>
                    From
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    TASC Learning Solutions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    123 Education Street<br />
                    Kampala, Uganda<br />
                    support@tasclms.com<br />
                    +256 700 123 456
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ bgcolor: '#fafafa', p: 2.5, borderRadius: 2, border: '1px solid #e4e4e7' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: '#71717a', mb: 1.5, display: 'block' }}>
                    Bill To
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                    {invoice.customer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {invoice.customer.email}<br />
                    {invoice.customer.phone}<br />
                    {invoice.customer.accountType}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Items Section */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#27272a' }}>
                <ListIcon sx={{ color: '#ffa424' }} />
                Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a', borderBottom: '2px solid #e4e4e7' }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a', borderBottom: '2px solid #e4e4e7' }}>
                        Type
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a', borderBottom: '2px solid #e4e4e7' }}>
                        Qty
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a', borderBottom: '2px solid #e4e4e7' }}>
                        Unit Price
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, color: '#71717a', borderBottom: '2px solid #e4e4e7' }}>
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                            }}
                          >
                            <CodeIcon />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="text.primary">{invoice.course.title}</Typography>
                            <Typography variant="caption" color="text.secondary">Course by {invoice.course.instructor}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ borderBottom: 'none' }}>
                        <Typography variant="body2" color="text.secondary">Course</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Typography variant="body2" color="text.secondary">1</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Typography variant="body2" color="text.secondary">${invoice.course.unitPrice.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: 'none' }}>
                        <Typography variant="body2" fontWeight={600} color="text.primary">${invoice.course.unitPrice.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Totals Section */}
            <Box sx={{ bgcolor: '#fafafa', p: 3, borderRadius: 2, mb: 6 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" fontWeight={500} color="text.primary">${invoice.subtotal.toFixed(2)}</Typography>
                </Stack>
                {invoice.discount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Discount ({invoice.discountCode} - 20%)</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ color: '#10b981' }}>-${invoice.discount.toFixed(2)}</Typography>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Processing Fee</Typography>
                  <Typography variant="body2" fontWeight={500} color="text.primary">${invoice.processingFee.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Tax (0%)</Typography>
                  <Typography variant="body2" fontWeight={500} color="text.primary">${invoice.tax.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ pt: 2, mt: 1.5, borderTop: '2px solid #d4d4d8' }}>
                  <Typography variant="body1" fontWeight={600} color="text.primary">Total Paid</Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#ffa424' }}>${invoice.total.toFixed(2)}</Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Payment Info */}
            <Grid container spacing={3} sx={{ mb: 6, pb: 6, borderBottom: '1px solid #e4e4e7' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ bgcolor: '#fafafa', p: 2.5, borderRadius: 2, border: '1px solid #e4e4e7' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: '#71717a', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <CreditCardIcon sx={{ fontSize: 14, color: '#ffa424' }} /> Payment Method
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 48, height: 32, bgcolor: 'white', border: '1px solid #e4e4e7', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4caf50' }}>
                      <PhoneIcon />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary">{invoice.paymentMethod.type}</Typography>
                      <Typography variant="caption" color="text.secondary">{invoice.paymentMethod.maskedNumber}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ bgcolor: '#fafafa', p: 2.5, borderRadius: 2, border: '1px solid #e4e4e7' }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: '#71717a', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <ReceiptIcon sx={{ fontSize: 14, color: '#ffa424' }} /> Transaction Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Transaction ID</Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', bgcolor: 'white', p: 1, px: 1.5, borderRadius: 1, border: '1px solid #e4e4e7', display: 'inline-block', mb: 1 }}>
                    {invoice.transactionId}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    M-Pesa Receipt: {invoice.receiptNumber}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* QR Code Section */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              spacing={3}
              sx={{ bgcolor: '#fafafa', p: 3, borderRadius: 2, mb: 4, textAlign: { xs: 'center', sm: 'left' } }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'white',
                  border: '1px solid #e4e4e7',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCodeIcon sx={{ fontSize: 64, color: '#27272a' }} />
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={500} color="text.primary" sx={{ mb: 0.5 }}>Verify this Invoice</Typography>
                <Typography variant="body2" color="text.secondary">
                  Scan to verify authenticity or visit:<br />
                  <Box component="a" href="#" sx={{ color: '#ffa424' }}>tasclms.com/verify/{invoice.invoiceNumber}</Box>
                </Typography>
              </Box>
            </Stack>

            {/* Notes Section */}
            <Box sx={{ bgcolor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 2, p: 2.5, mb: 4 }}>
              <Typography variant="body2" fontWeight={500} sx={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InfoIcon sx={{ fontSize: 18 }} />
                Important Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This invoice serves as proof of payment for your course enrollment. Your access to the course is now active and will not expire. If you have any questions about this transaction, please contact our support team.
              </Typography>
            </Box>
          </Box>

          {/* Invoice Footer */}
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#fafafa', borderTop: '1px solid #e4e4e7' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Thank you for learning with TASC LMS!
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Questions? Contact us at{' '}
              <Box component="a" href="mailto:support@tasclms.com" sx={{ color: '#ffa424', textDecoration: 'none' }}>support@tasclms.com</Box>
              {' '}or call{' '}
              <Box component="a" href="tel:+256700123456" sx={{ color: '#ffa424', textDecoration: 'none' }}>+256 700 123 456</Box>
            </Typography>
          </Box>

          {/* Actions Bar */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="center"
            spacing={2}
            sx={{ p: 3, bgcolor: 'white', borderTop: '1px solid #e4e4e7', '@media print': { display: 'none' } }}
          >
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={handleEmail}
              sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}
            >
              Email Invoice
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ borderColor: '#d4d4d8', color: '#3f3f46', textTransform: 'none' }}
            >
              Print Invoice
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ bgcolor: '#ffa424', textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}
            >
              Download PDF
            </Button>
          </Stack>
        </Box>
      </Box>

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

export default InvoiceReceiptPage;
