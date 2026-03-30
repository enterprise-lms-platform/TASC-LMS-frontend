import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Paper, Typography, Grid, Button, Switch, FormControlLabel, TextField,
  Divider, Slider, Alert,
} from '@mui/material';
import {
  VpnKey as MFAIcon, AccessTime as SessionIcon,
  Lock as PasswordIcon, Shield as ShieldIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';
import { securityApi } from '../../services/organization.services';


const SecurityPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['security', 'stats'],
    queryFn: () => securityApi.getStats().then(r => r.data),
  });

  const kpis = [
    {
      label: 'Security Score',
      value: '—',
      icon: <ShieldIcon />,
      bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20',
    },
    {
      label: 'MFA Enabled',
      value: stats ? `${stats.mfa_adoption_percent}%` : '—',
      icon: <MFAIcon />,
      bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46',
    },
    {
      label: 'Failed Logins (24h)',
      value: stats ? String(stats.failed_logins_today) : '—',
      icon: <BlockIcon />,
      bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412',
    },
    {
      label: 'Active Sessions',
      value: stats ? stats.active_sessions.toLocaleString() : '—',
      icon: <SessionIcon />,
      bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534',
    },
  ];

  return (
  <SuperadminLayout title="Security" subtitle="Security settings, MFA configuration, and session management">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <KPICard
            title={k.label}
            value={k.value}
            icon={k.icon}
            bgColor={k.bgColor}
            badgeColor={k.badgeColor}
            valueColor={k.valueColor}
            labelColor={k.labelColor}
            index={index}
          />
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* MFA Configuration */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #ffa424, #ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <MFAIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>MFA Configuration</Typography>
          </Box>
          <FormControlLabel control={<Switch defaultChecked />} label="Enable MFA Platform-wide" sx={{ mb: 2 }} />
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Enforce MFA for roles:</Typography>
          {['Super Admins', 'LMS Managers', 'Finance Managers', 'Instructors', 'Learners'].map((role, i) => (
            <FormControlLabel
              key={role}
              control={<Switch defaultChecked={i < 3} size="small" />}
              label={<Typography variant="body2">{role}</Typography>}
              sx={{ display: 'block', mb: 0.5 }}
            />
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Allowed MFA methods:</Typography>
          {['Authenticator App (TOTP)', 'SMS Verification', 'Email Verification'].map((method, i) => (
            <FormControlLabel
              key={method}
              control={<Switch defaultChecked={i < 2} size="small" />}
              label={<Typography variant="body2">{method}</Typography>}
              sx={{ display: 'block', mb: 0.5 }}
            />
          ))}
          <Button variant="contained" sx={{ textTransform: 'none', mt: 2 }} fullWidth>Save MFA Settings</Button>
        </Paper>
      </Grid>

      {/* Password Policy */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #71717a, #a1a1aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <PasswordIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Password Policy</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Minimum Password Length</Typography>
            <Slider defaultValue={8} min={6} max={20} valueLabelDisplay="auto" marks={[{ value: 6, label: '6' }, { value: 12, label: '12' }, { value: 20, label: '20' }]} />
          </Box>
          <FormControlLabel control={<Switch defaultChecked />} label="Require uppercase letter" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Require lowercase letter" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Require number" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Require special character" sx={{ display: 'block', mb: 1 }} />
          <Divider sx={{ my: 2 }} />
          <TextField fullWidth label="Password Expiry (days)" defaultValue="90" type="number" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Password History (prevent reuse)" defaultValue="5" type="number" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Max Failed Attempts Before Lockout" defaultValue="5" type="number" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Lockout Duration (minutes)" defaultValue="30" type="number" sx={{ mb: 2 }} size="small" />
          <Button variant="contained" sx={{ textTransform: 'none' }} fullWidth>Save Password Policy</Button>
        </Paper>
      </Grid>

      {/* Session Management */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <SessionIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Session Settings</Typography>
          </Box>
          <TextField fullWidth label="Session Timeout (minutes)" defaultValue="60" type="number" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Idle Timeout (minutes)" defaultValue="15" type="number" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Max Concurrent Sessions" defaultValue="3" type="number" sx={{ mb: 2 }} size="small" />
          <Divider sx={{ my: 2 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Force single session per user" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch defaultChecked />} label="Log session activity" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch />} label="Restrict to known IP ranges" sx={{ display: 'block', mb: 1 }} />
          <Divider sx={{ my: 2 }} />
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            This will terminate all active user sessions immediately.
          </Alert>
          <Button variant="outlined" color="error" sx={{ textTransform: 'none' }} fullWidth>Terminate All Sessions</Button>
          <Button variant="contained" sx={{ textTransform: 'none', mt: 1 }} fullWidth>Save Session Settings</Button>
        </Paper>
      </Grid>
    </Grid>

    {/* Active Sessions Table */}
    <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Active Sessions</Typography>
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
        <SessionIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
        <Typography variant="body2">Active session list endpoint pending backend implementation</Typography>
        <Typography variant="caption">Session count shown in stats above is live</Typography>
      </Box>
    </Paper>
  </SuperadminLayout>
  );
};

export default SecurityPage;
