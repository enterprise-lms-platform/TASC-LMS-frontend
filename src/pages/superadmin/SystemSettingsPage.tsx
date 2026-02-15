import React from 'react';
import {
  Box, Paper, Typography, Grid, TextField, Button, Switch, FormControlLabel,
  Divider, Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon, Email as EmailIcon, ToggleOn as ToggleIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const featureToggles = [
  { name: 'Self-Registration', desc: 'Allow users to register without admin invitation', enabled: true },
  { name: 'Google SSO', desc: 'Enable Sign in with Google authentication', enabled: true },
  { name: 'Course Reviews', desc: 'Allow learners to rate and review courses', enabled: true },
  { name: 'Discussion Forums', desc: 'Enable discussion forums on courses', enabled: false },
  { name: 'Live Classes', desc: 'Enable live class scheduling via external links', enabled: true },
  { name: 'Certificate Auto-Issue', desc: 'Automatically issue certificates on course completion', enabled: true },
  { name: 'Bulk CSV Import', desc: 'Allow bulk user import via CSV upload', enabled: true },
  { name: 'API Access', desc: 'Enable external API access for integrations', enabled: false },
];

const SystemSettingsPage: React.FC = () => (
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
          <TextField fullWidth label="Platform Name" defaultValue="TASC Learning Management System" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="Platform URL" defaultValue="https://lms.tascgroup.com" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="Support Email" defaultValue="support@tascgroup.com" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="Default Timezone" defaultValue="Africa/Nairobi (EAT, UTC+3)" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="Default Language" defaultValue="English" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="Max File Upload Size (MB)" defaultValue="50" type="number" sx={{ mb: 3 }} size="small" />
          <Button variant="contained" sx={{ textTransform: 'none' }}>Save General Settings</Button>
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
          <TextField fullWidth label="SMTP Host" defaultValue="smtp.gmail.com" sx={{ mb: 3 }} size="small" />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 8 }}>
              <TextField fullWidth label="SMTP Username" defaultValue="noreply@tascgroup.com" size="small" />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField fullWidth label="SMTP Port" defaultValue="587" type="number" size="small" />
            </Grid>
          </Grid>
          <TextField fullWidth label="SMTP Password" type="password" defaultValue="••••••••" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="From Name" defaultValue="TASC LMS" sx={{ mb: 3 }} size="small" />
          <TextField fullWidth label="From Email" defaultValue="noreply@tascgroup.com" sx={{ mb: 3 }} size="small" />
          <FormControlLabel control={<Switch defaultChecked />} label="Enable TLS/SSL" sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ textTransform: 'none' }}>Save Email Settings</Button>
            <Button variant="outlined" sx={{ textTransform: 'none' }}>Send Test Email</Button>
          </Box>
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
                <Switch defaultChecked={f.enabled} />
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
            { label: 'Last Deploy', value: 'Feb 14, 2026' },
            { label: 'Database', value: 'PostgreSQL 16' },
            { label: 'Node.js', value: 'v20.11.0' },
            { label: 'Uptime', value: '45 days' },
          ].map((item, i) => (
            <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: i < 5 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.value}</Typography>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  </SuperadminLayout>
);

export default SystemSettingsPage;
