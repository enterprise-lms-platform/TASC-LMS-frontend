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
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { getErrorMessage, adminApi } from '../../services/main.api';
import { useOrganizations } from '../../hooks/useOrganizations';
import type { UserRole } from '../../types/types';

// Allowed roles for invitation (excluding learner and tasc_admin)
const INVITE_ROLES: { value: UserRole; label: string }[] = [
  { value: 'lms_manager', label: 'LMS Manager' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'finance', label: 'Finance' },
];

// Roles that require an organization assignment
const ROLES_REQUIRING_ORG: UserRole[] = ['lms_manager', 'instructor'];

const InviteUserPage: React.FC = () => {
  const navigate = useNavigate();
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
    organization: null as number | null,
  });

  const [errors, setErrors] = useState({
    email: '',
    first_name: '',
    last_name: '',
    organization: '',
  });

  // Fetch organizations for the dropdown
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizations({ is_active: true });

  const requiresOrg = ROLES_REQUIRING_ORG.includes(formData.role);

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      first_name: '',
      last_name: '',
      organization: '',
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

    if (requiresOrg && !formData.organization) {
      newErrors.organization = 'Organisation is required for this role';
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
      const payload = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        ...(requiresOrg && formData.organization ? { organization: formData.organization } : {}),
      };
      const response = await adminApi.inviteUser(payload);
      setSnackbar({
        open: true,
        message: `Invitation sent successfully to ${response.data.email}`,
        severity: 'success',
      });
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'lms_manager',
        organization: null,
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

  const handleRoleChange = (role: UserRole) => {
    setFormData({
      ...formData,
      role,
      // Clear org when switching to a role that doesn't need it
      organization: ROLES_REQUIRING_ORG.includes(role) ? formData.organization : null,
    });
    if (!ROLES_REQUIRING_ORG.includes(role)) {
      setErrors({ ...errors, organization: '' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <SuperadminLayout title="Invite User" subtitle="Send an invitation to add a new user">
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
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            disabled={isLoading}
            sx={{ mb: 3 }}
          >
            {INVITE_ROLES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {requiresOrg && (
            <TextField
              fullWidth
              select
              label="Organisation"
              value={formData.organization ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, organization: e.target.value ? Number(e.target.value) : null })
              }
              error={!!errors.organization}
              helperText={errors.organization || (
                formData.role === 'lms_manager'
                  ? 'The manager will be scoped to this organisation only'
                  : 'The instructor will be assigned to this organisation'
              )}
              disabled={isLoading || orgsLoading}
              sx={{ mb: 4 }}
            >
              {orgsLoading ? (
                <MenuItem disabled>Loading organisations...</MenuItem>
              ) : organizations.length === 0 ? (
                <MenuItem disabled>No organisations available</MenuItem>
              ) : (
                organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}

          {!requiresOrg && <Box sx={{ mb: 1 }} />}

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
              sx={{ flex: 1, textTransform: 'none', fontWeight: 600, py: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

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
    </SuperadminLayout>
  );
};

export default InviteUserPage;
