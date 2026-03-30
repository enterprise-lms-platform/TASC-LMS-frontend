import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Chip, Button, TextField, Alert } from '@mui/material';
import { Payment as PaymentIcon, Check as CheckIcon } from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const GatewaySettingsPage: React.FC = () => {
  const [env, setEnv] = useState<'sandbox' | 'production'>('production');

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
        <TextField fullWidth label="Consumer Key" defaultValue="" sx={{ mb: 3 }} placeholder="Your Pesapal consumer key" />
        <TextField fullWidth label="Consumer Secret" type="password" defaultValue="" sx={{ mb: 3 }} placeholder="Your Pesapal consumer secret" />
        <TextField fullWidth label="IPN URL" defaultValue="https://api.tasclms.com/webhooks/pesapal/" sx={{ mb: 3 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Environment</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant={env === 'sandbox' ? 'contained' : 'outlined'} onClick={() => setEnv('sandbox')} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Sandbox
            </Button>
            <Button variant={env === 'production' ? 'contained' : 'outlined'} onClick={() => setEnv('production')} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Production
            </Button>
          </Box>
        </Box>
        <TextField fullWidth label="Supported Currencies" defaultValue="USD, KES, UGX" sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}>Save Configuration</Button>
          <Button variant="outlined" startIcon={<CheckIcon />} sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}>Test Connection</Button>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default GatewaySettingsPage;
