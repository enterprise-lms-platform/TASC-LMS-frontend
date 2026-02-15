import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, Switch, FormControlLabel, TextField,
  Divider, Slider, IconButton, Alert,
} from '@mui/material';
import {
  VpnKey as MFAIcon, AccessTime as SessionIcon,
  Lock as PasswordIcon, Shield as ShieldIcon,
  Block as BlockIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Security Score', value: '87/100', icon: <ShieldIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: 'Good — 3 items to improve' },
  { label: 'MFA Enabled', value: '72.4%', icon: <MFAIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: '8,945 of 12,356 users' },
  { label: 'Failed Logins (24h)', value: '156', icon: <BlockIcon />, gradient: 'linear-gradient(135deg, #ef4444, #f87171)', trend: '23 accounts locked' },
  { label: 'Active Sessions', value: '3,456', icon: <SessionIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', trend: 'Across all users' },
];

const activeSessions = [
  { user: 'John Kamau', role: 'Super Admin', ip: '196.201.214.xx', device: 'Chrome / macOS', location: 'Nairobi, KE', started: '2 hours ago', status: 'Active' },
  { user: 'Mary Wambui', role: 'LMS Manager', ip: '41.89.162.xx', device: 'Firefox / Windows', location: 'Nairobi, KE', started: '45 min ago', status: 'Active' },
  { user: 'Peter Ochieng', role: 'Instructor', ip: '105.48.73.xx', device: 'Safari / iOS', location: 'Mombasa, KE', started: '3 hours ago', status: 'Active' },
  { user: 'Grace Akinyi', role: 'Learner', ip: '41.75.189.xx', device: 'Chrome / Android', location: 'Kisumu, KE', started: '1 hour ago', status: 'Active' },
  { user: 'David Mwangi', role: 'Finance', ip: '196.201.220.xx', device: 'Edge / Windows', location: 'Nairobi, KE', started: '20 min ago', status: 'Active' },
  { user: 'Sarah Nakamura', role: 'Learner', ip: '102.68.45.xx', device: 'Chrome / Windows', location: 'Kampala, UG', started: '5 hours ago', status: 'Idle' },
  { user: 'James Otieno', role: 'LMS Manager', ip: '41.89.55.xx', device: 'Chrome / Linux', location: 'Nairobi, KE', started: '30 min ago', status: 'Active' },
  { user: 'Faith Muthoni', role: 'Instructor', ip: '196.201.198.xx', device: 'Firefox / macOS', location: 'Nakuru, KE', started: '4 hours ago', status: 'Idle' },
];

const sessionStatusColors: Record<string, { bg: string; color: string }> = {
  Active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Idle: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const SecurityPage: React.FC = () => (
  <SuperadminLayout title="Security" subtitle="Security settings, MFA configuration, and session management">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px) scale(1.01)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
            <Typography variant="body2" color="text.secondary">{k.trend}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* MFA Configuration */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
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
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Active Sessions</Typography>
        <Typography variant="body2" color="text.secondary">{activeSessions.length} active sessions</Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['User', 'Role', 'IP Address', 'Device', 'Location', 'Started', 'Status', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {activeSessions.map((s, i) => (
              <TableRow key={i} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{s.user}</Typography></TableCell>
                <TableCell><Typography variant="body2">{s.role}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{s.ip}</Typography></TableCell>
                <TableCell><Typography variant="body2">{s.device}</Typography></TableCell>
                <TableCell><Typography variant="body2">{s.location}</Typography></TableCell>
                <TableCell><Typography variant="body2">{s.started}</Typography></TableCell>
                <TableCell><Chip label={s.status} size="small" sx={{ bgcolor: sessionStatusColors[s.status]?.bg, color: sessionStatusColors[s.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                <TableCell>
                  <IconButton size="small" color="error" sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </SuperadminLayout>
);

export default SecurityPage;
