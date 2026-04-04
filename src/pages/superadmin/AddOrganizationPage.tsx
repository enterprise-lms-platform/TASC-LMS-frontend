import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, MenuItem,
  CircularProgress, Snackbar, Alert,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { organizationApi } from '../../services/organization.services';

const AddOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    country: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false, msg: '', severity: 'success',
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => organizationApi.create({
      name: formData.name,
      contact_email: formData.contact_email || undefined,
      contact_phone: formData.contact_phone || undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      country: formData.country || undefined,
      description: formData.description || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      setSnack({ open: true, msg: 'Organization created successfully', severity: 'success' });
      setTimeout(() => navigate('/superadmin/organizations'), 1500);
    },
    onError: () => {
      setSnack({ open: true, msg: 'Failed to create organization', severity: 'error' });
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (formData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = () => {
    if (validate()) mutate();
  };

  return (
    <SuperadminLayout title="Add Organization" subtitle="Register a new organization">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Add Organization</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Register a new organization on the platform</Typography>

      <Paper elevation={0} sx={{ maxWidth: 600, p: 4, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <TextField
          fullWidth
          label="Organization Name *"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isPending}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Contact Email"
          type="email"
          value={formData.contact_email}
          onChange={handleChange('contact_email')}
          error={!!errors.contact_email}
          helperText={errors.contact_email}
          disabled={isPending}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          value={formData.contact_phone}
          onChange={handleChange('contact_phone')}
          disabled={isPending}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={2}
          value={formData.address}
          onChange={handleChange('address')}
          disabled={isPending}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField fullWidth label="City" value={formData.city} onChange={handleChange('city')} disabled={isPending} />
          <TextField fullWidth label="Country" value={formData.country} onChange={handleChange('country')} disabled={isPending} />
        </Box>
        <TextField
          fullWidth
          label="Notes / Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange('description')}
          disabled={isPending}
          sx={{ mb: 4 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ flex: 1, textTransform: 'none', fontWeight: 600, py: 1.5 }}
          >
            {isPending ? 'Creating...' : 'Create Organization'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/superadmin/organizations')}
            disabled={isPending}
            sx={{ flex: 1, textTransform: 'none', fontWeight: 600, py: 1.5 }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </SuperadminLayout>
  );
};

export default AddOrganizationPage;
