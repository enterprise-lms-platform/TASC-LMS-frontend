import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import Sidebar from '../components/superadmin/Sidebar';
import TopBar from '../components/superadmin/TopBar';
import { authApi, getErrorMessage } from '../lib/api';
import type { UserRole } from '../types/api';

const DRAWER_WIDTH = 280;

// Allowed roles for invitation (excluding learner and tasc_admin)
const INVITE_ROLES: { value: UserRole; label: string }[] = [
  { value: 'lms_manager', label: 'LMS Manager' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'finance', label: 'Finance' },
  { value: 'org_admin', label: 'Organization Admin' },
];

const InviteUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'lms_manager' as UserRole,
  });

  const [errors, setErrors] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      first_name: '',
      last_name: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.inviteUser(formData);
      setSnackbar({
        open: true,
        message: `Invitation sent successfully to ${response.email}`,
        severity: 'success',
      });
      // Reset form
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'lms_manager',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <TopBar onMenuClick={handleMobileToggle} />

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Invite User
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Send an invitation email to add a new user to the system
          </Typography>

          <Paper
            elevation={0}
            sx={{
              maxWidth: 600,
              p: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
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

              <TextField
                fullWidth
                select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                disabled={isLoading}
                sx={{ mb: 4 }}
              >
                {INVITE_ROLES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

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
                  onClick={() => navigate('/superadmin')}
                  disabled={isLoading}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                  }}
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
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InviteUserPage;
