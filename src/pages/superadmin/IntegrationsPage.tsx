import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Button, Chip, Snackbar, Alert,
} from '@mui/material';
import {
  Payment as PaymentIcon, Cloud as CloudIcon,
  VideoCall as VideoIcon, Email as EmailIcon, Storage as StorageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const integrations = [
  {
    name: 'PesaPal',
    desc: 'Payment gateway for M-Pesa, MTN MoMo, Airtel Money, and card payments across Africa.',
    icon: <PaymentIcon />,
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    status: 'Connected',
    category: 'Payments',
    lastSync: '2 minutes ago',
    configRoute: '/superadmin/gateway-settings',
  },
  {
    name: 'Google Workspace',
    desc: 'Single Sign-On (SSO) and Google Meet for live classes.',
    icon: <CloudIcon />,
    gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)',
    status: 'Connected',
    category: 'Authentication',
    lastSync: '5 minutes ago',
    configRoute: null,
  },
  {
    name: 'Microsoft Teams',
    desc: 'Microsoft Teams integration for live virtual classes and collaboration.',
    icon: <VideoIcon />,
    gradient: 'linear-gradient(135deg, #3f3f46, #71717a)',
    status: 'Connected',
    category: 'Communication',
    lastSync: '1 hour ago',
    configRoute: null,
  },
  {
    name: 'Zoom',
    desc: 'Zoom video conferencing for live classes and webinars.',
    icon: <VideoIcon />,
    gradient: 'linear-gradient(135deg, #a1a1aa, #d4d4d8)',
    status: 'Disconnected',
    category: 'Communication',
    lastSync: 'Never',
    configRoute: null,
  },
  {
    name: 'SendGrid',
    desc: 'Transactional email service for notifications, invitations, and password resets.',
    icon: <EmailIcon />,
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    status: 'Connected',
    category: 'Email',
    lastSync: '30 minutes ago',
    configRoute: null,
  },
  {
    name: 'AWS S3',
    desc: 'Cloud storage for course materials, videos, and user uploads.',
    icon: <StorageIcon />,
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    status: 'Connected',
    category: 'Storage',
    lastSync: '10 minutes ago',
    configRoute: null,
  },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  Connected: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Disconnected: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
};

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [snackMsg, setSnackMsg] = useState('');

  return (
    <SuperadminLayout title="Integrations" subtitle="Manage external service connections and APIs">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {integrations.filter((i) => i.status === 'Connected').length} of {integrations.length} integrations active
          </Typography>
        </Box>
        <Button variant="contained" size="small" disabled title="Contact support to add new integrations" sx={{ textTransform: 'none' }}>
          Add Integration
        </Button>
      </Box>

      <Grid container spacing={3}>
        {integrations.map((intg) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={intg.name}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: intg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    {intg.icon}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{intg.name}</Typography>
                    <Chip label={intg.category} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'grey.100' }} />
                  </Box>
                </Box>
                <Chip
                  label={intg.status}
                  size="small"
                  sx={{ bgcolor: statusConfig[intg.status]?.bg, color: statusConfig[intg.status]?.color, fontWeight: 500, fontSize: '0.75rem' }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                {intg.desc}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Last sync: {intg.lastSync}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none', fontSize: '0.75rem', flex: 1 }}
                  onClick={() => {
                    if (intg.configRoute) {
                      navigate(intg.configRoute);
                    } else {
                      setSnackMsg(`${intg.name} is managed via environment configuration. Contact your system administrator.`);
                    }
                  }}
                >
                  Configure
                </Button>
                {intg.status === 'Disconnected' && (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: 'none', fontSize: '0.75rem', flex: 1 }}
                    onClick={() => setSnackMsg(`${intg.name} connection setup requires environment configuration. Contact your system administrator.`)}
                  >
                    Connect
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={!!snackMsg}
        autoHideDuration={5000}
        onClose={() => setSnackMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackMsg('')} sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default IntegrationsPage;
