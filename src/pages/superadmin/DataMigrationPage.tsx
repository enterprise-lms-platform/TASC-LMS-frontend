import React from 'react';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { CloudSync as SyncIcon } from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const DataMigrationPage: React.FC = () => (
  <SuperadminLayout title="Data Migration" subtitle="Odoo ERP migration management and progress tracking">
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      The data migration module will manage the transition from the legacy Odoo ERP system to TASC LMS. Backend implementation is pending.
    </Alert>
    <Paper elevation={0} sx={{ p: 6, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', textAlign: 'center' }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
        <SyncIcon sx={{ fontSize: 36, color: 'grey.400' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Data Migration — Coming Soon</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
        This module will provide real-time visibility into the Odoo → TASC LMS migration progress, including per-module status, error logs, and retry controls. Backend implementation is tracked in the pending tasks.
      </Typography>
    </Paper>
  </SuperadminLayout>
);

export default DataMigrationPage;
