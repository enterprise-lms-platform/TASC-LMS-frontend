import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  AppBar,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import { getErrorMessage, adminApi } from '../../services/main.api';
import { useAuth } from '../../hooks/useAuth';

const ManagerInviteUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  const validateForm = (): boolean => {
    const newErrors = { email: '', first_name: '', last_name: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Manager invitations auto-assign instructor role and the manager's own organisation
      const response = await adminApi.inviteUser({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: 'instructor',
        // The backend should auto-assign the manager's org; we send it explicitly for clarity
        organization: (user as { organization?: number })?.organization ?? null,
      });
      setSnackbar({
        open: true,
        message: `Invitation sent successfully to ${response.data.email}`,
        severity: 'success',
      });
      setFormData({ email: '', first_name: '', last_name: '' });
    } catch (error) {
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { lg: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/manager')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon sx={{ color: 'primary.main' }} />
              Invite Instructor
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Invite Instructor
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            The instructor will be automatically assigned to your organisation
          </Typography>

          <Paper
            elevation={0}
            sx={{ maxWidth: 600, p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
          >
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                error={!!errors.first_name}
                helperText={errors.first_name}
                disabled={isLoading}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                error={!!errors.last_name}
                helperText={errors.last_name}
                disabled={isLoading}
                sx={{ mb: 3 }}
              />

              {/* Read-only role & org info */}
              <TextField
                fullWidth
                label="Role"
                value="Instructor"
                disabled
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Organisation"
                value="Your organisation (auto-assigned)"
                disabled
                helperText="Instructors invited by a manager are automatically assigned to the manager's organisation"
                sx={{ mb: 4 }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    flex: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Invitation'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/manager')}
                  disabled={isLoading}
                  sx={{ flex: 1, textTransform: 'none', fontWeight: 600, py: 1.5 }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerInviteUserPage;
