import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
} from '@mui/material';
import {
  Extension as ExtensionIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

// ─── Mock Data ─────────────────────────────────────────────

interface Integration {
  name: string;
  description: string;
  connected: boolean;
  color: string;
}

const integrations: Integration[] = [
  {
    name: 'Google Workspace',
    description: 'Sync users and calendars with Google Workspace for seamless collaboration.',
    connected: true,
    color: '#4285F4',
  },
  {
    name: 'Microsoft 365',
    description: 'Integrate with Microsoft Teams, Outlook, and OneDrive for enterprise workflows.',
    connected: true,
    color: '#0078D4',
  },
  {
    name: 'Zoom',
    description: 'Enable live virtual classes and webinars with Zoom meeting integration.',
    connected: true,
    color: '#2D8CFF',
  },
  {
    name: 'Slack',
    description: 'Send course notifications and updates directly to Slack channels.',
    connected: false,
    color: '#4A154B',
  },
  {
    name: 'Pesapal Payments',
    description: 'Accept mobile money and card payments through Pesapal payment gateway.',
    connected: false,
    color: '#E8621A',
  },
  {
    name: 'SCORM Cloud',
    description: 'Import and manage SCORM-compliant e-learning content packages.',
    connected: false,
    color: '#00A651',
  },
  {
    name: 'Google Analytics',
    description: 'Track learner engagement and platform usage with Google Analytics.',
    connected: false,
    color: '#F9AB00',
  },
  {
    name: 'Mailchimp',
    description: 'Automate email marketing campaigns and learner communications.',
    connected: false,
    color: '#FFE01B',
  },
];

// ─── Component ─────────────────────────────────────────────

const ManagerIntegrationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {/* ── Page Header ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ExtensionIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Integrations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect third-party services
              </Typography>
            </Box>
          </Box>

          {/* ── Integration Cards Grid ── */}
          <Grid container spacing={3}>
            {integrations.map((integration) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={integration.name}>
                <Paper elevation={0} sx={{ ...cardSx, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={headerSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: integration.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            color: integration.name === 'Mailchimp' ? '#000' : '#fff',
                            fontWeight: 700,
                            fontSize: '1rem',
                          }}
                        >
                          {integration.name.charAt(0)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={700}>
                        {integration.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={integration.connected ? 'Connected' : 'Not Connected'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: '6px',
                        bgcolor: integration.connected ? 'rgba(16,185,129,0.1)' : 'rgba(158,158,158,0.1)',
                        color: integration.connected ? '#059669' : '#757575',
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
                      {integration.description}
                    </Typography>

                    <Button
                      variant={integration.connected ? 'outlined' : 'contained'}
                      fullWidth
                      sx={{
                        borderRadius: '10px',
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        ...(integration.connected
                          ? {
                              borderColor: '#ffa424',
                              color: '#ffa424',
                              '&:hover': {
                                borderColor: '#f97316',
                                bgcolor: 'rgba(255,164,36,0.04)',
                              },
                            }
                          : {
                              background: 'linear-gradient(135deg, #ffa424, #f97316)',
                              boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                                boxShadow: '0 6px 16px rgba(255,164,36,0.4)',
                              },
                            }),
                      }}
                    >
                      {integration.connected ? 'Configure' : 'Connect'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerIntegrationsPage;
