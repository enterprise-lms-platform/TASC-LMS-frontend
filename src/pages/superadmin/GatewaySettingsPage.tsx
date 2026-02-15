import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Chip, Button, TextField } from '@mui/material';
import { Payment as PaymentIcon, Check as CheckIcon } from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const gateways = [
  { name: 'Flutterwave', status: 'Active', lastTx: 'Feb 15, 2026', txCount: 6234, gradient: 'linear-gradient(135deg, #ffb74d, #ffa424)' },
  { name: 'M-Pesa Direct', status: 'Active', lastTx: 'Feb 15, 2026', txCount: 1456, gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
  { name: 'MTN MoMo', status: 'Active', lastTx: 'Feb 14, 2026', txCount: 534, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { name: 'Bank Transfer', status: 'Inactive', lastTx: 'Jan 28, 2026', txCount: 232, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
];

const GatewaySettingsPage: React.FC = () => {
  const [env, setEnv] = useState<'sandbox' | 'production'>('production');

  return (
    <SuperadminLayout title="Gateway Settings" subtitle="Payment gateway configuration">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {gateways.map((g) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={g.name}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px) scale(1.01)' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: g.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <PaymentIcon />
                </Box>
                <Chip label={g.status} size="small" sx={{
                  bgcolor: g.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)',
                  color: g.status === 'Active' ? '#10b981' : '#71717a', fontWeight: 500, fontSize: '0.75rem',
                }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 1 }}>{g.name}</Typography>
              <Typography variant="body2" color="text.secondary">Last: {g.lastTx}</Typography>
              <Typography variant="body2" color="text.secondary">{g.txCount.toLocaleString()} transactions</Typography>
              <Button size="small" sx={{ mt: 2, textTransform: 'none', fontWeight: 500 }}>Configure</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ maxWidth: 700, p: 4, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 3 }}>Flutterwave Configuration</Typography>
        <TextField fullWidth label="API Key (Public)" defaultValue="FLWPUBK-••••••••••••••••••-X" sx={{ mb: 3 }} />
        <TextField fullWidth label="Secret Key" type="password" defaultValue="FLWSECK-••••••••••••••••••-X" sx={{ mb: 3 }} />
        <TextField fullWidth label="Webhook URL" defaultValue="https://api.tasclms.com/webhooks/flutterwave" sx={{ mb: 3 }} />
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
        <TextField fullWidth label="Supported Currencies" defaultValue="USD, KES, UGX, NGN" sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}>Save Configuration</Button>
          <Button variant="outlined" startIcon={<CheckIcon />} sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}>Test Connection</Button>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default GatewaySettingsPage;
