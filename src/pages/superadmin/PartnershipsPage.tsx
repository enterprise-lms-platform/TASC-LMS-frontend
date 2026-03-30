import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Handshake as PartnerIcon } from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const PartnershipsPage: React.FC = () => (
  <SuperadminLayout title="Partnerships" subtitle="Manage platform partnerships">
    <Paper elevation={0} sx={{ p: 6, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', textAlign: 'center' }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
        <PartnerIcon sx={{ fontSize: 36, color: 'grey.400' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Partnerships — Coming Soon</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
        This module will manage content provider integrations, certification body partnerships, and revenue share agreements. Backend implementation is pending.
      </Typography>
    </Paper>
  </SuperadminLayout>
);

export default PartnershipsPage;
