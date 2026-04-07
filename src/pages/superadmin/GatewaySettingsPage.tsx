import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Chip, Button, Alert, Snackbar,
  CircularProgress, Divider, Skeleton,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Link as LinkIcon,
  Cloud as CloudIcon,
} from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { gatewaySettingsApi } from '../../services/superadmin.services';
import { pesapalApi } from '../../services/payments.services';

const cardSx = {
  p: 3,
  borderRadius: '1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{label}</Typography>
    <Box>{value}</Box>
  </Box>
);

const GatewaySettingsPage: React.FC = () => {
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  });

  const showSnack = (msg: string, severity: 'success' | 'error') =>
    setSnack({ open: true, msg, severity });

  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['gateway-status'],
    queryFn: () => gatewaySettingsApi.getStatus().then(r => r.data),
  });

  const testMutation = useMutation({
    mutationFn: () => gatewaySettingsApi.test(),
    onSuccess: (res) => showSnack((res.data as any)?.detail || 'Connection test successful', 'success'),
    onError: () => showSnack('Connection test failed — check server credentials', 'error'),
  });

  const registerIpnMutation = useMutation({
    mutationFn: () => pesapalApi.registerIPN(),
    onSuccess: () => {
      showSnack('IPN URL registered with Pesapal successfully', 'success');
      void refetchStatus();
    },
    onError: () => showSnack('IPN registration failed — check server credentials', 'error'),
  });

  const busy = testMutation.isPending || registerIpnMutation.isPending;

  const envLabel = statusData?.environment === 'production' ? 'Production' : statusData?.environment === 'sandbox' ? 'Sandbox' : null;
  const envColor = statusData?.environment === 'production' ? '#10b981' : '#f59e0b';
  const envBg = statusData?.environment === 'production' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)';

  return (
    <SuperadminLayout title="Gateway Settings" subtitle="Payment gateway configuration">
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Credentials are managed via server environment variables — not stored in the database.
        Use <strong>Test Connection</strong> to verify they are working, and <strong>Register IPN</strong> once per environment to enable payment notifications.
      </Alert>

      {/* Gateway cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #ffb74d, #ffa424)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <PaymentIcon />
              </Box>
              {statusLoading
                ? <Skeleton width={60} height={24} />
                : <Chip
                    icon={statusData?.configured ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : <ErrorIcon sx={{ fontSize: '14px !important' }} />}
                    label={statusData?.configured ? 'Configured' : 'Not configured'}
                    size="small"
                    sx={{
                      bgcolor: statusData?.configured ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: statusData?.configured ? '#10b981' : '#ef4444',
                      fontWeight: 500, fontSize: '0.72rem',
                    }}
                  />
              }
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Pesapal</Typography>
            <Typography variant="body2" color="text.secondary">Primary payment gateway</Typography>
          </Paper>
        </Grid>

        {['Airtel Money', 'M-Pesa', 'MTN MoMo'].map((name) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
            <Paper elevation={0} sx={{ ...cardSx, opacity: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.400' }}>
                  <PaymentIcon />
                </Box>
                <Chip label="Coming Soon" size="small" sx={{ bgcolor: 'grey.100', color: 'text.secondary', fontWeight: 500, fontSize: '0.72rem' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>{name}</Typography>
              <Typography variant="body2" color="text.secondary">Planned for future release</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Status panel */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={cardSx}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Pesapal Status</Typography>
            <Divider sx={{ mb: 1 }} />

            {statusLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} height={48} sx={{ my: 0.5 }} />)
            ) : (
              <>
                <InfoRow
                  label="Credentials"
                  value={
                    <Chip
                      icon={statusData?.configured ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : <ErrorIcon sx={{ fontSize: '14px !important' }} />}
                      label={statusData?.configured ? 'Set in environment' : 'Missing'}
                      size="small"
                      sx={{
                        bgcolor: statusData?.configured ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: statusData?.configured ? '#10b981' : '#ef4444',
                        fontWeight: 500, fontSize: '0.72rem',
                      }}
                    />
                  }
                />
                <InfoRow
                  label="Environment"
                  value={
                    envLabel
                      ? <Chip icon={<CloudIcon sx={{ fontSize: '14px !important' }} />} label={envLabel} size="small" sx={{ bgcolor: envBg, color: envColor, fontWeight: 600, fontSize: '0.72rem' }} />
                      : <Typography variant="caption" color="text.disabled">Unknown</Typography>
                  }
                />
                <InfoRow
                  label="IPN URL"
                  value={
                    statusData?.ipn_url
                      ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LinkIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {statusData.ipn_url}
                          </Typography>
                        </Box>
                      : <Typography variant="caption" color="text.disabled">Not set</Typography>
                  }
                />
              </>
            )}
          </Paper>
        </Grid>

        {/* Actions panel */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={cardSx}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Actions</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Credentials are set in server environment variables. Contact your system administrator to rotate keys.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => testMutation.mutate()}
                  disabled={busy}
                  startIcon={testMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  {testMutation.isPending ? 'Testing...' : 'Test Connection'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                  Verifies that the server credentials can authenticate with Pesapal.
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Button
                  variant="outlined"
                  onClick={() => registerIpnMutation.mutate()}
                  disabled={busy}
                  startIcon={registerIpnMutation.isPending ? <CircularProgress size={16} /> : <LinkIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  {registerIpnMutation.isPending ? 'Registering...' : 'Register IPN URL'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                  Run once per environment to register the IPN webhook URL with Pesapal.
                  Required for payment notifications to work.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default GatewaySettingsPage;
