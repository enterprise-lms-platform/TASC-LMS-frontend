import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, Button, Switch, FormControlLabel,
  Divider, Alert, CircularProgress, Snackbar,
} from '@mui/material';
import {
  Settings as SettingsIcon, Email as EmailIcon, ToggleOn as ToggleIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import {
  useSystemSettings, useSaveSystemSettings, useSaveSmtp, useSendTestEmail,
} from '../../hooks/useSuperadmin';

const featureToggles = [
  { name: 'Self-Registration', desc: 'Allow users to register without admin invitation', key: 'allow_self_registration' },
  { name: 'Google SSO', desc: 'Enable Sign in with Google authentication', key: 'allow_google_sso' },
  { name: 'Course Reviews', desc: 'Allow learners to rate and review courses', key: 'allow_course_reviews' },
  { name: 'Discussion Forums', desc: 'Enable discussion forums on courses', key: 'allow_discussions' },
  { name: 'Live Classes', desc: 'Enable live class scheduling via external links', key: 'allow_live_classes' },
  { name: 'Certificate Auto-Issue', desc: 'Automatically issue certificates on course completion', key: 'auto_issue_certificates' },
  { name: 'Bulk CSV Import', desc: 'Allow bulk user import via CSV upload', key: 'allow_bulk_import' },
  { name: 'API Access', desc: 'Enable external API access for integrations', key: 'allow_api_access' },
];

const SystemSettingsPage: React.FC = () => {
  const { data: settings } = useSystemSettings();
  const saveSettings = useSaveSystemSettings();
  const saveSmtp = useSaveSmtp();
  const sendTest = useSendTestEmail();

  const [general, setGeneral] = useState({
    platform_name: '',
    platform_url: '',
    support_email: '',
    default_timezone: '',
    max_upload_mb: 50,
  });

  const [smtp, setSmtp] = useState({
    smtp_host: '',
    smtp_username: '',
    smtp_port: 587,
    smtp_password: '',
    from_name: '',
    from_email: '',
    smtp_use_tls: true,
  });

  const [testEmail, setTestEmail] = useState('');
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    if (settings) {
      setGeneral({
        platform_name: settings.platform_name ?? '',
        platform_url: (settings as any).platform_url ?? '',
        support_email: settings.support_email ?? '',
        default_timezone: (settings as any).default_timezone ?? '',
        max_upload_mb: settings.max_upload_mb ?? 50,
      });
    }
  }, [settings]);

  const showSnack = (msg: string, severity: 'success' | 'error') =>
    setSnack({ open: true, msg, severity });

  const handleSaveGeneral = () => {
    saveSettings.mutate(
      { platform_name: general.platform_name, support_email: general.support_email, max_upload_mb: general.max_upload_mb },
      {
        onSuccess: () => showSnack('General settings saved', 'success'),
        onError: () => showSnack('Failed to save settings', 'error'),
      },
    );
  };

  const handleSaveSmtp = () => {
    saveSmtp.mutate(smtp, {
      onSuccess: () => showSnack('Email settings saved', 'success'),
      onError: () => showSnack('Failed to save email settings', 'error'),
    });
  };

  const handleTestEmail = () => {
    sendTest.mutate(testEmail || undefined, {
      onSuccess: () => showSnack('Test email sent successfully', 'success'),
      onError: () => showSnack('Failed to send test email', 'error'),
    });
  };

  return (
    <SuperadminLayout title="System Settings" subtitle="Platform configuration and preferences">
      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <SettingsIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>General Settings</Typography>
            </Box>
            <TextField fullWidth label="Platform Name" value={general.platform_name} onChange={(e) => setGeneral({ ...general, platform_name: e.target.value })} sx={{ mb: 3 }} size="small" />
            <TextField fullWidth label="Platform URL" value={general.platform_url} onChange={(e) => setGeneral({ ...general, platform_url: e.target.value })} sx={{ mb: 3 }} size="small" />
            <TextField fullWidth label="Support Email" value={general.support_email} onChange={(e) => setGeneral({ ...general, support_email: e.target.value })} sx={{ mb: 3 }} size="small" />
            <TextField fullWidth label="Default Timezone" value={general.default_timezone} onChange={(e) => setGeneral({ ...general, default_timezone: e.target.value })} sx={{ mb: 3 }} size="small" />
            <TextField fullWidth label="Max File Upload Size (MB)" value={general.max_upload_mb} type="number" onChange={(e) => setGeneral({ ...general, max_upload_mb: Number(e.target.value) })} sx={{ mb: 3 }} size="small" />
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              onClick={handleSaveGeneral}
              disabled={saveSettings.isPending}
              startIcon={saveSettings.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              Save General Settings
            </Button>
          </Paper>
        </Grid>

        {/* Email Settings */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <EmailIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Email Configuration</Typography>
            </Box>
            <TextField fullWidth label="SMTP Host" value={smtp.smtp_host} onChange={(e) => setSmtp({ ...smtp, smtp_host: e.target.value })} sx={{ mb: 3 }} size="small" />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 8 }}>
                <TextField fullWidth label="SMTP Username" value={smtp.smtp_username} onChange={(e) => setSmtp({ ...smtp, smtp_username: e.target.value })} size="small" />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField fullWidth label="SMTP Port" value={smtp.smtp_port} type="number" onChange={(e) => setSmtp({ ...smtp, smtp_port: Number(e.target.value) })} size="small" />
              </Grid>
            </Grid>
            <TextField fullWidth label="SMTP Password" type="password" value={smtp.smtp_password} onChange={(e) => setSmtp({ ...smtp, smtp_password: e.target.value })} sx={{ mb: 3 }} size="small" />
            <TextField fullWidth label="From Name" value={smtp.from_name} onChange={(e) => setSmtp({ ...smtp, from_name: e.target.value })} sx={{ mb: 3 }} size="small" />
            <TextField fullWidth label="From Email" value={smtp.from_email} onChange={(e) => setSmtp({ ...smtp, from_email: e.target.value })} sx={{ mb: 3 }} size="small" />
            <FormControlLabel control={<Switch checked={smtp.smtp_use_tls} onChange={(e) => setSmtp({ ...smtp, smtp_use_tls: e.target.checked })} />} label="Enable TLS/SSL" sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                onClick={handleSaveSmtp}
                disabled={saveSmtp.isPending}
                startIcon={saveSmtp.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Save Email Settings
              </Button>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                onClick={handleTestEmail}
                disabled={sendTest.isPending}
                startIcon={sendTest.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
              >
                Send Test Email
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Test recipient (optional)"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              size="small"
              placeholder="Leave blank to use support email"
            />
          </Paper>
        </Grid>

        {/* Feature Toggles */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <ToggleIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Feature Toggles</Typography>
            </Box>
            {featureToggles.map((f, i) => (
              <React.Fragment key={f.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{f.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{f.desc}</Typography>
                  </Box>
                  <Switch defaultChecked={['allow_self_registration','allow_google_sso','allow_course_reviews','allow_live_classes','auto_issue_certificates','allow_bulk_import'].includes(f.key)} />
                </Box>
                {i < featureToggles.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Paper>
        </Grid>

        {/* Maintenance Mode */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <MaintenanceIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Maintenance Mode</Typography>
            </Box>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              Maintenance mode will show a maintenance page to all non-admin users.
            </Alert>
            <FormControlLabel control={<Switch />} label="Enable Maintenance Mode" sx={{ mb: 2 }} />
            <TextField fullWidth label="Maintenance Message" multiline rows={3} defaultValue="We are performing scheduled maintenance. Please check back shortly." sx={{ mb: 2 }} size="small" />
            <Button variant="outlined" color="warning" fullWidth sx={{ textTransform: 'none' }}>Activate Maintenance</Button>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>System Info</Typography>
            {[
              { label: 'Version', value: '2.1.0' },
              { label: 'Environment', value: 'Production' },
              { label: 'Database', value: 'PostgreSQL 16' },
              { label: 'Uptime', value: '—' },
            ].map((item, i, arr) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: i < arr.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default SystemSettingsPage;
