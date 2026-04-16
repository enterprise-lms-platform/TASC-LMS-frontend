import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Paper, Typography, Grid, Button, Switch, FormControlLabel, TextField,
  Divider, Slider, Alert, CircularProgress, Snackbar, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from '@mui/material';
import {
  VpnKey as MFAIcon, AccessTime as SessionIcon,
  Lock as PasswordIcon, Shield as ShieldIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';
import { securityApi, type UserSession } from '../../services/organization.services';
import { useSecurityPolicy, useSaveSecurityPolicy, useTerminateSessions } from '../../hooks/useSuperadmin';
import type { SecurityPolicy } from '../../services/superadmin.services';

const SecurityPage: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['security', 'stats'],
    queryFn: () => securityApi.getStats().then(r => r.data),
  });

  const { data: sessionsData, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery({
    queryKey: ['security', 'sessions'],
    queryFn: () => securityApi.getSessions({ recent: true }).then(r => r.data.results),
  });

  const { data: policy } = useSecurityPolicy();
  const savePolicy = useSaveSecurityPolicy();
  const terminateSessions = useTerminateSessions();

  const [mfa, setMfa] = useState<Partial<SecurityPolicy>>({
    mfa_enabled: true,
    min_password_length: 8,
    require_uppercase: true,
    require_special: true,
    password_expiry_days: 90,
    password_history: 5,
    max_failed_attempts: 5,
    lockout_duration_minutes: 30,
    session_timeout_minutes: 60,
    idle_timeout_minutes: 15,
    max_concurrent_sessions: 3,
    force_single_session: true,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    if (policy) setMfa({ ...mfa, ...policy });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy]);

  const showSnack = (msg: string, severity: 'success' | 'error') =>
    setSnack({ open: true, msg, severity });

  const handleSavePolicy = (section: Partial<SecurityPolicy>) => {
    savePolicy.mutate(section, {
      onSuccess: () => showSnack('Policy saved', 'success'),
      onError: () => showSnack('Failed to save policy', 'error'),
    });
  };

  const handleTerminate = () => {
    setConfirmOpen(false);
    terminateSessions.mutate(undefined, {
      onSuccess: () => showSnack('All sessions terminated', 'success'),
      onError: () => showSnack('Failed to terminate sessions', 'error'),
    });
  };

  const kpis = [
    { label: 'Security Score', value: '—', icon: <ShieldIcon />, bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20' },
    { label: 'MFA Enabled', value: stats ? `${stats.mfa_adoption_percent}%` : '—', icon: <MFAIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { label: 'Failed Logins (24h)', value: stats ? String(stats.failed_logins_today) : '—', icon: <BlockIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
    { label: 'Active Sessions', value: stats ? stats.active_sessions.toLocaleString() : '—', icon: <SessionIcon />, bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534' },
  ];

  return (
    <SuperadminLayout title="Security" subtitle="Security settings, MFA configuration, and session management">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <KPICard title={k.label} value={k.value} icon={k.icon} bgColor={k.bgColor} badgeColor={k.badgeColor} valueColor={k.valueColor} labelColor={k.labelColor} index={index} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* MFA Configuration */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #ffa424, #ffb74d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <MFAIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>MFA Configuration</Typography>
            </Box>
            <FormControlLabel control={<Switch checked={!!mfa.mfa_enabled} onChange={(e) => setMfa({ ...mfa, mfa_enabled: e.target.checked })} />} label="Enable MFA Platform-wide" sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Enforce MFA for roles:</Typography>
            {['Super Admins', 'LMS Managers', 'Finance Managers', 'Instructors', 'Learners'].map((role, i) => (
              <FormControlLabel key={role} control={<Switch defaultChecked={i < 3} size="small" />} label={<Typography variant="body2">{role}</Typography>} sx={{ display: 'block', mb: 0.5 }} />
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Allowed MFA methods:</Typography>
            {['Authenticator App (TOTP)', 'SMS Verification', 'Email Verification'].map((method, i) => (
              <FormControlLabel key={method} control={<Switch defaultChecked={i < 2} size="small" />} label={<Typography variant="body2">{method}</Typography>} sx={{ display: 'block', mb: 0.5 }} />
            ))}
            <Button
              variant="contained"
              sx={{ textTransform: 'none', mt: 2 }}
              fullWidth
              disabled={savePolicy.isPending}
              startIcon={savePolicy.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
              onClick={() => handleSavePolicy({ mfa_enabled: mfa.mfa_enabled })}
            >
              Save MFA Settings
            </Button>
          </Paper>
        </Grid>

        {/* Password Policy */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #71717a, #a1a1aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <PasswordIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Password Policy</Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Minimum Password Length</Typography>
              <Slider value={mfa.min_password_length ?? 8} min={6} max={20} valueLabelDisplay="auto" marks={[{ value: 6, label: '6' }, { value: 12, label: '12' }, { value: 20, label: '20' }]} onChange={(_, v) => setMfa({ ...mfa, min_password_length: v as number })} />
            </Box>
            <FormControlLabel control={<Switch checked={!!mfa.require_uppercase} onChange={(e) => setMfa({ ...mfa, require_uppercase: e.target.checked })} />} label="Require uppercase letter" sx={{ display: 'block', mb: 1 }} />
            <FormControlLabel control={<Switch defaultChecked />} label="Require lowercase letter" sx={{ display: 'block', mb: 1 }} />
            <FormControlLabel control={<Switch defaultChecked />} label="Require number" sx={{ display: 'block', mb: 1 }} />
            <FormControlLabel control={<Switch checked={!!mfa.require_special} onChange={(e) => setMfa({ ...mfa, require_special: e.target.checked })} />} label="Require special character" sx={{ display: 'block', mb: 1 }} />
            <Divider sx={{ my: 2 }} />
            <TextField fullWidth label="Password Expiry (days)" value={mfa.password_expiry_days ?? 90} type="number" onChange={(e) => setMfa({ ...mfa, password_expiry_days: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <TextField fullWidth label="Password History (prevent reuse)" value={mfa.password_history ?? 5} type="number" onChange={(e) => setMfa({ ...mfa, password_history: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <TextField fullWidth label="Max Failed Attempts Before Lockout" value={mfa.max_failed_attempts ?? 5} type="number" onChange={(e) => setMfa({ ...mfa, max_failed_attempts: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <TextField fullWidth label="Lockout Duration (minutes)" value={mfa.lockout_duration_minutes ?? 30} type="number" onChange={(e) => setMfa({ ...mfa, lockout_duration_minutes: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              fullWidth
              disabled={savePolicy.isPending}
              startIcon={savePolicy.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
              onClick={() => handleSavePolicy({
                min_password_length: mfa.min_password_length,
                require_uppercase: mfa.require_uppercase,
                require_special: mfa.require_special,
                password_expiry_days: mfa.password_expiry_days,
                password_history: mfa.password_history,
                max_failed_attempts: mfa.max_failed_attempts,
                lockout_duration_minutes: mfa.lockout_duration_minutes,
              })}
            >
              Save Password Policy
            </Button>
          </Paper>
        </Grid>

        {/* Session Management */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <SessionIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Session Settings</Typography>
            </Box>
            <TextField fullWidth label="Session Timeout (minutes)" value={mfa.session_timeout_minutes ?? 60} type="number" onChange={(e) => setMfa({ ...mfa, session_timeout_minutes: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <TextField fullWidth label="Idle Timeout (minutes)" value={mfa.idle_timeout_minutes ?? 15} type="number" onChange={(e) => setMfa({ ...mfa, idle_timeout_minutes: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <TextField fullWidth label="Max Concurrent Sessions" value={mfa.max_concurrent_sessions ?? 3} type="number" onChange={(e) => setMfa({ ...mfa, max_concurrent_sessions: Number(e.target.value) })} sx={{ mb: 2 }} size="small" />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel control={<Switch checked={!!mfa.force_single_session} onChange={(e) => setMfa({ ...mfa, force_single_session: e.target.checked })} />} label="Force single session per user" sx={{ display: 'block', mb: 1 }} />
            <FormControlLabel control={<Switch defaultChecked />} label="Log session activity" sx={{ display: 'block', mb: 1 }} />
            <FormControlLabel control={<Switch />} label="Restrict to known IP ranges" sx={{ display: 'block', mb: 1 }} />
            <Divider sx={{ my: 2 }} />
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              This will terminate all active user sessions immediately.
            </Alert>
            <Button
              variant="outlined"
              color="error"
              sx={{ textTransform: 'none' }}
              fullWidth
              onClick={() => setConfirmOpen(true)}
              disabled={terminateSessions.isPending}
              startIcon={terminateSessions.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              Terminate All Sessions
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: 'none', mt: 1 }}
              fullWidth
              disabled={savePolicy.isPending}
              startIcon={savePolicy.isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
              onClick={() => handleSavePolicy({
                session_timeout_minutes: mfa.session_timeout_minutes,
                idle_timeout_minutes: mfa.idle_timeout_minutes,
                max_concurrent_sessions: mfa.max_concurrent_sessions,
                force_single_session: mfa.force_single_session,
              })}
            >
              Save Session Settings
            </Button>
          </Paper>
        </Grid>
      </Grid>

{/* Active Sessions Table */}
<Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>Active Sessions</Typography>
    <Button size="small" onClick={() => refetchSessions()} sx={{ textTransform: 'none' }}>Refresh</Button>
  </Box>
  {sessionsLoading ? (
    <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={24} /></Box>
  ) : sessionsData && sessionsData.length > 0 ? (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell><Typography variant="caption" fontWeight={600}>User</Typography></TableCell>
            <TableCell><Typography variant="caption" fontWeight={600}>Email</Typography></TableCell>
            <TableCell><Typography variant="caption" fontWeight={600}>IP Address</Typography></TableCell>
            <TableCell><Typography variant="caption" fontWeight={600}>Last Activity</Typography></TableCell>
            <TableCell><Typography variant="caption" fontWeight={600}>Status</Typography></TableCell>
            <TableCell align="right"><Typography variant="caption" fontWeight={600}>Actions</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessionsData.slice(0, 10).map((session: UserSession) => (
            <TableRow key={session.id} hover>
              <TableCell><Typography variant="body2" fontWeight={500}>{session.user_name}</Typography></TableCell>
              <TableCell><Typography variant="body2" color="text.secondary">{session.user_email}</Typography></TableCell>
              <TableCell><Typography variant="body2" color="text.secondary">{session.ip_address || '—'}</Typography></TableCell>
              <TableCell><Typography variant="body2" color="text.secondary">{new Date(session.last_activity).toLocaleString()}</Typography></TableCell>
              <TableCell>
                <Chip 
                  label={session.is_active ? 'Active' : 'Inactive'} 
                  size="small" 
                  sx={{ height: 20, fontSize: '0.7rem', bgcolor: session.is_active ? '#d1fae5' : '#f3f4f6', color: session.is_active ? '#059669' : '#6b7280' }} 
                />
              </TableCell>
              <TableCell align="right">
                <Button size="small" color="error" onClick={async () => {
                  try {
                    await securityApi.terminateSession(session.id);
                    refetchSessions();
                    showSnack('Session terminated', 'success');
                  } catch {
                    showSnack('Failed to terminate session', 'error');
                  }
                }}>Terminate</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
      <SessionIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
      <Typography variant="body2">No active sessions found</Typography>
    </Box>
  )}
  {sessionsData && sessionsData.length > 10 && (
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
      Showing 10 of {sessionsData.length} sessions
    </Typography>
  )}
</Paper>

      {/* Confirm terminate dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Terminate All Sessions?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will immediately log out all users across the platform. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleTerminate} color="error" variant="contained">Terminate</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default SecurityPage;
