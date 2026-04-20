import React from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMySubscription, usePesapalPaymentStatus } from '../../hooks/usePayments';
import { queryKeys } from '../../hooks/queryKeys';
import { useAuth } from '../../contexts/AuthContext';

const PesapalReturnPage: React.FC = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const searchParams = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const trackingId = searchParams.get('tracking_id');
  const routeStatus = location.pathname.split('/').pop() ?? 'pending';
  const context = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('pesapal_checkout_context');
      return raw ? (JSON.parse(raw) as { paymentId?: string; subscriptionId?: number; planName?: string }) : {};
    } catch {
      return {};
    }
  }, []);

  const effectivePaymentId = context.paymentId ?? searchParams.get('ref') ?? undefined;

  const { data: paymentStatus } = usePesapalPaymentStatus(effectivePaymentId);
  const { data: subStatus, refetch, isFetching } = useMySubscription();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.myStatus });
    void refetch();
  }, [isAuthenticated, queryClient, refetch]);

  React.useEffect(() => {
    // Clean up stale checkout context when leaving this page
    return () => {
      localStorage.removeItem('pesapal_checkout_context');
    };
  }, []);

  const hasActiveSubscription = subStatus?.has_active_subscription ?? false;
  const shouldShowProcessingHint =
    isAuthenticated &&
    !hasActiveSubscription &&
    (isFetching ||
      routeStatus === 'success' ||
      ((paymentStatus?.status || '').toUpperCase() === 'COMPLETED'));
  const titleByStatus: Record<string, string> = {
    success: 'Payment Return Received',
    failed: 'Payment Failed',
    pending: 'Payment Pending',
  };

  const messageByStatus: Record<string, string> = {
    success:
      'We are confirming your payment and subscription activation from the backend. Access is unlocked only after backend confirmation.',
    failed: 'Your payment did not complete. Please try again from checkout.',
    pending: 'Your payment is still pending confirmation. Please wait a moment and refresh status.',
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, bgcolor: '#fafafa' }}>
      <Box sx={{ width: '100%', maxWidth: 640, bgcolor: 'white', borderRadius: 2, p: 4, boxShadow: 1 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            {titleByStatus[routeStatus] ?? 'Payment Status'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {messageByStatus[routeStatus] ?? messageByStatus.pending}
          </Typography>
          {trackingId && (
            <Typography variant="caption" color="text.secondary">
              Tracking ID: {trackingId}
            </Typography>
          )}
          {effectivePaymentId && (
            <Typography variant="caption" color="text.secondary">
              Payment ID: {effectivePaymentId}
            </Typography>
          )}
          {paymentStatus?.status && (
            <Typography variant="body2">
              Provider Status: <strong>{paymentStatus.status}</strong>
            </Typography>
          )}
          {!isAuthenticated ? (
            <Typography variant="body2" color="text.secondary">
              Your payment return was received. Please log in to refresh your subscription status.
            </Typography>
          ) : shouldShowProcessingHint ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} />
                <Typography variant="body2">Refreshing subscription truth...</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                We are still confirming activation in the background. This can take a short moment.
              </Typography>
            </>
          ) : (
            <Typography variant="body2">
              Subscription Active: <strong>{hasActiveSubscription ? 'Yes' : 'No'}</strong>
            </Typography>
          )}
          <Stack direction="row" spacing={2}>
            {!isAuthenticated ? (
              <Button
                component={Link}
                to={isAuthLoading ? '/login' : `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
                variant="contained"
              >
                Log In to Refresh Status
              </Button>
            ) : (
              <Button component={Link} to={hasActiveSubscription ? '/learner/my-courses' : '/learner/subscription'} variant="contained">
                {hasActiveSubscription ? 'Go to My Courses' : 'Go to Subscription'}
              </Button>
            )}
            <Button component={Link} to={isAuthenticated ? '/checkout' : '/login'} variant="outlined">
              {isAuthenticated ? 'Back to Subscription Checkout' : 'Go to Login'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default PesapalReturnPage;
