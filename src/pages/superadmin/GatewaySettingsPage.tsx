import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Chip, Button, TextField, Alert, Snackbar, CircularProgress } from '@mui/material';
import { Payment as PaymentIcon, Check as CheckIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { gatewaySettingsApi } from '../../services/superadmin.services';

const GatewaySettingsPage: React.FC = () => {
  const [env, setEnv] = useState<'sandbox' | 'production'>('production');
  const [config, setConfig] = useState({
    consumer_key: '',
    consumer_secret: '',
    ipn_url: 'https://api.tasclms.com/webhooks/pesapal/',
    currencies: 'USD, KES, UGX',
  });

  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  });

  const saveMutation = useMutation({
    mutationFn: () => gatewaySettingsApi.save({ ...config, environment: env }),
    onSuccess: () => setSnack({ open: true, msg: 'Gateway configuration saved', severity: 'success' }),
    onError: () => setSnack({ open: true, msg: 'Failed to save configuration', severity: 'error' }),
  });

  const testMutation = useMutation({
    mutationFn: () => gatewaySettingsApi.test(),
    onSuccess: () => setSnack({ open: true, msg: 'Connection test successful', severity: 'success' }),
    onError: () => setSnack({ open: true, msg: 'Connection test failed — check your credentials', severity: 'error' }),
  });

  return (
    <SuperadminLayout title="Gateway Settings" subtitle="Payment gateway configuration">
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Pesapal is the active payment gateway for this platform. Additional gateways (Airtel Money, M-Pesa, MTN MoMo) are planned for a future release.
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #ffb74d, #ffa424)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <PaymentIcon />
              </Box>
              <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 500, fontSize: '0.75rem' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Pesapal</Typography>
            <Typography variant="body2" color="text.secondary">Primary payment gateway</Typography>
          </Paper>
        </Grid>

        {['Airtel Money', 'M-Pesa', 'MTN MoMo'].map((name) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={name}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', opacity: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.400' }}>
                  <PaymentIcon />
                </Box>
                <Chip label="Coming Soon" size="small" sx={{ bgcolor: 'grey.100', color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>{name}</Typography>
              <Typography variant="body2" color="text.secondary">Planned for future release</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ maxWidth: 700, p: 4, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 3 }}>Pesapal Configuration</Typography>
        <TextField
          fullWidth
          label="Consumer Key"
          value={config.consumer_key}
          onChange={(e) => setConfig({ ...config, consumer_key: e.target.value })}
          placeholder="Your Pesapal consumer key"
          disabled={saveMutation.isPending}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Consumer Secret"
          type="password"
          value={config.consumer_secret}
          onChange={(e) => setConfig({ ...config, consumer_secret: e.target.value })}
          placeholder="Your Pesapal consumer secret"
          disabled={saveMutation.isPending}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="IPN URL"
          value={config.ipn_url}
          onChange={(e) => setConfig({ ...config, ipn_url: e.target.value })}
          disabled={saveMutation.isPending}
          sx={{ mb: 3 }}
        />
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Environment</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={env === 'sandbox' ? 'contained' : 'outlined'}
              onClick={() => setEnv('sandbox')}
              disabled={saveMutation.isPending}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Sandbox
            </Button>
            <Button
              variant={env === 'production' ? 'contained' : 'outlined'}
              onClick={() => setEnv('production')}
              disabled={saveMutation.isPending}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Production
            </Button>
          </Box>
        </Box>
        <TextField
          fullWidth
          label="Supported Currencies"
          value={config.currencies}
          onChange={(e) => setConfig({ ...config, currencies: e.target.value })}
          disabled={saveMutation.isPending}
          sx={{ mb: 4 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || testMutation.isPending}
            startIcon={saveMutation.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
          </Button>
          <Button
            variant="outlined"
            startIcon={testMutation.isPending ? <CircularProgress size={16} /> : <CheckIcon />}
            onClick={() => testMutation.mutate()}
            disabled={saveMutation.isPending || testMutation.isPending}
            sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}
          >
            {testMutation.isPending ? 'Testing...' : 'Test Connection'}
          </Button>
        </Box>
      </Paper>

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
