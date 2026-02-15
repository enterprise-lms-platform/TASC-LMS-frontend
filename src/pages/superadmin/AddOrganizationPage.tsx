import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, MenuItem } from '@mui/material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const AddOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: '', city: '', country: '',
    plan: 'Professional', maxUsers: '', notes: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <SuperadminLayout title="Add Organization" subtitle="Register a new organization">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Add Organization</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Register a new organization on the platform</Typography>
      <Paper elevation={0} sx={{ maxWidth: 600, p: 4, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <TextField fullWidth label="Organization Name" value={formData.name} onChange={handleChange('name')} sx={{ mb: 3 }} />
        <TextField fullWidth label="Contact Person" value={formData.contactPerson} onChange={handleChange('contactPerson')} sx={{ mb: 3 }} />
        <TextField fullWidth label="Contact Email" type="email" value={formData.email} onChange={handleChange('email')} sx={{ mb: 3 }} />
        <TextField fullWidth label="Phone Number" value={formData.phone} onChange={handleChange('phone')} sx={{ mb: 3 }} />
        <TextField fullWidth label="Address" multiline rows={2} value={formData.address} onChange={handleChange('address')} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField fullWidth label="City" value={formData.city} onChange={handleChange('city')} />
          <TextField fullWidth label="Country" value={formData.country} onChange={handleChange('country')} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField fullWidth select label="Plan Type" value={formData.plan} onChange={handleChange('plan')}>
            {['Basic', 'Professional', 'Enterprise'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </TextField>
          <TextField fullWidth label="Max Users" type="number" value={formData.maxUsers} onChange={handleChange('maxUsers')} />
        </Box>
        <TextField fullWidth label="Notes" multiline rows={3} value={formData.notes} onChange={handleChange('notes')} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" sx={{ flex: 1, bgcolor: 'primary.main', color: 'white', textTransform: 'none', fontWeight: 600, py: 1.5, '&:hover': { bgcolor: 'primary.dark' } }}>
            Create Organization
          </Button>
          <Button variant="outlined" onClick={() => navigate('/superadmin/organizations')} sx={{ flex: 1, textTransform: 'none', fontWeight: 600, py: 1.5 }}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default AddOrganizationPage;
