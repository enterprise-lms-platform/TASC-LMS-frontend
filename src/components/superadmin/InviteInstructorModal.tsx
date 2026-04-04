import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../services/users.services';
import { getErrorMessage } from '../../utils/config';
import { UserRole, type InviteUserRequest } from '../../types/types';

export interface InviteInstructorModalProps {
  open: boolean;
  onClose: () => void;
}

function buildPayload(
  email: string,
  first_name: string,
  last_name: string
): InviteUserRequest {
  return {
    email: email.trim(),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    role: UserRole.INSTRUCTOR,
  };
}

const InviteInstructorModal: React.FC<InviteInstructorModalProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();

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

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (!open) return;
    setFormData({ email: '', first_name: '', last_name: '' });
    setErrors({ email: '', first_name: '', last_name: '' });
  }, [open]);

  const mutation = useMutation({
    mutationFn: (payload: InviteUserRequest) => usersApi.invite(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'instructors'] });
      setSnackbar({
        open: true,
        message: `Invitation sent to ${response.data.email}`,
        severity: 'success',
      });
      onClose();
    },
    onError: (error: unknown) => {
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error',
      });
    },
  });

  const validate = (): boolean => {
    const next = { email: '', first_name: '', last_name: '' };
    if (!formData.email) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Invalid email format';
    }
    if (!formData.first_name.trim()) next.first_name = 'First name is required';
    if (!formData.last_name.trim()) next.last_name = 'Last name is required';
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(buildPayload(formData.email, formData.first_name, formData.last_name));
  };

  return (
    <>
      <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Invite instructor</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We will email them a link to set their password. Their role will be Instructor.
            </Typography>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              disabled={mutation.isPending}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="First name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              error={!!errors.first_name}
              helperText={errors.first_name}
              disabled={mutation.isPending}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              error={!!errors.last_name}
              helperText={errors.last_name}
              disabled={mutation.isPending}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} disabled={mutation.isPending} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={mutation.isPending}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {mutation.isPending ? <CircularProgress size={22} color="inherit" /> : 'Send invitation'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InviteInstructorModal;
