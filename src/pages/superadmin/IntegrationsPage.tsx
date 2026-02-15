import React from 'react';
import {
  Box, Paper, Typography, Grid, Button, Chip, Switch,
} from '@mui/material';
import {
  Payment as FlutterwaveIcon, Cloud as CloudIcon,
  VideoCall as VideoIcon, Email as EmailIcon, Storage as StorageIcon,
  Analytics as AnalyticsIcon, School as LMSIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const integrations = [
  {
    name: 'Flutterwave',
    desc: 'Payment gateway for M-Pesa, MTN MoMo, Airtel Money, and card payments across Africa.',
    icon: <FlutterwaveIcon />,
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    status: 'Connected',
    category: 'Payments',
    lastSync: '2 minutes ago',
  },
  {
    name: 'Google Workspace',
    desc: 'Single Sign-On (SSO), Google Meet for live classes, and Google Drive integration.',
    icon: <CloudIcon />,
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    status: 'Connected',
    category: 'Authentication',
    lastSync: '5 minutes ago',
  },
  {
    name: 'Microsoft Teams',
    desc: 'Microsoft Teams integration for live virtual classes and collaboration.',
    icon: <VideoIcon />,
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    status: 'Connected',
    category: 'Communication',
    lastSync: '1 hour ago',
  },
  {
    name: 'Zoom',
    desc: 'Zoom video conferencing for live classes and webinars.',
    icon: <VideoIcon />,
    gradient: 'linear-gradient(135deg, #3b82f6, #93c5fd)',
    status: 'Disconnected',
    category: 'Communication',
    lastSync: 'Never',
  },
  {
    name: 'SendGrid',
    desc: 'Transactional email service for notifications, invitations, and password resets.',
    icon: <EmailIcon />,
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    status: 'Connected',
    category: 'Email',
    lastSync: '30 minutes ago',
  },
  {
    name: 'AWS S3',
    desc: 'Cloud storage for course materials, videos, and user uploads.',
    icon: <StorageIcon />,
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    status: 'Connected',
    category: 'Storage',
    lastSync: '10 minutes ago',
  },
  {
    name: 'Google Analytics',
    desc: 'Website and platform analytics tracking for user behavior insights.',
    icon: <AnalyticsIcon />,
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    status: 'Connected',
    category: 'Analytics',
    lastSync: '15 minutes ago',
  },
  {
    name: 'Coursera',
    desc: 'Content partnership integration for importing and syncing Coursera courses.',
    icon: <LMSIcon />,
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
    status: 'Connected',
    category: 'Content',
    lastSync: '3 hours ago',
  },
  {
    name: 'LinkedIn Learning',
    desc: 'Content partnership for professional development courses and certifications.',
    icon: <LMSIcon />,
    gradient: 'linear-gradient(135deg, #0077b5, #00a0dc)',
    status: 'Disconnected',
    category: 'Content',
    lastSync: 'Never',
  },
  {
    name: 'Odoo ERP',
    desc: 'Legacy ERP integration for data migration and HR system synchronization.',
    icon: <StorageIcon />,
    gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)',
    status: 'Migrating',
    category: 'ERP',
    lastSync: 'Feb 10, 2026',
  },
];

const statusConfig: Record<string, { bg: string; color: string }> = {
  Connected: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Disconnected: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
  Migrating: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const IntegrationsPage: React.FC = () => (
  <SuperadminLayout title="Integrations" subtitle="Manage external service connections and APIs">
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {integrations.filter((i) => i.status === 'Connected').length} of {integrations.length} integrations active
        </Typography>
      </Box>
      <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>Add Integration</Button>
    </Box>

    <Grid container spacing={3}>
      {integrations.map((intg) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={intg.name}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: intg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  {intg.icon}
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{intg.name}</Typography>
                  <Chip label={intg.category} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'grey.100' }} />
                </Box>
              </Box>
              <Switch checked={intg.status === 'Connected'} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
              {intg.desc}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                label={intg.status}
                size="small"
                sx={{
                  bgcolor: statusConfig[intg.status]?.bg,
                  color: statusConfig[intg.status]?.color,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Last sync: {intg.lastSync}
              </Typography>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" sx={{ textTransform: 'none', fontSize: '0.75rem', flex: 1 }}>
                Configure
              </Button>
              {intg.status === 'Disconnected' && (
                <Button size="small" variant="contained" sx={{ textTransform: 'none', fontSize: '0.75rem', flex: 1 }}>
                  Connect
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  </SuperadminLayout>
);

export default IntegrationsPage;
