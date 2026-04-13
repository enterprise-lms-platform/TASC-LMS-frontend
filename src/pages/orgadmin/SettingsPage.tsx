import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  TextField,
  Button,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgSettings, useUpdateOrgSettings } from '../../hooks/useOrgAdmin';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const SettingsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { data: orgSettings, isLoading } = useOrgSettings();
  const updateSettings = useUpdateOrgSettings();

  React.useEffect(() => {
    if (orgSettings?.name) {
      setOrgName(orgSettings.name);
    }
  }, [orgSettings]);

  const handleSave = () => {
    updateSettings.mutate(
      { name: orgName },
      {
        onSuccess: () => {
          setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
        },
        onError: () => {
          setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
        },
      }
    );
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Settings" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 3, maxWidth: 600 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
              Organisation Settings
            </Typography>

            {isLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton width="30%" height={24} />
                <Skeleton height={56} />
                <Skeleton width="30%" height={24} />
                <Skeleton height={56} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Organisation Name"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  fullWidth
                />
                <TextField label="Email" value={orgSettings?.email ?? ''} fullWidth disabled />
                <TextField label="Subdomain" value={orgSettings?.subdomain ?? ''} fullWidth disabled helperText="Contact support to change subdomain" />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={updateSettings.isPending || orgName === orgSettings?.name}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
                  >
                    {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;