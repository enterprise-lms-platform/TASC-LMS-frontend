import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, LinearProgress, TextField, Alert,
} from '@mui/material';
import {
  Storage as StorageIcon, CloudSync as SyncIcon, CheckCircle as DoneIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Records', value: '156,789', icon: <StorageIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: 'From Odoo ERP' },
  { label: 'Migrated', value: '142,345', icon: <DoneIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '90.8% complete' },
  { label: 'In Progress', value: '8,234', icon: <SyncIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: 'Currently migrating' },
  { label: 'Failed', value: '6,210', icon: <ErrorIcon />, gradient: 'linear-gradient(135deg, #ef4444, #f87171)', trend: '4.0% error rate' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Completed: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  'In Progress': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  Pending: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
  Failed: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const modules = [
  { name: 'Users & Accounts', records: 12450, migrated: 12450, failed: 0, progress: 100, status: 'Completed', lastRun: 'Feb 5, 2026' },
  { name: 'Organizations', records: 234, migrated: 234, failed: 0, progress: 100, status: 'Completed', lastRun: 'Feb 5, 2026' },
  { name: 'Course Catalog', records: 1567, migrated: 1567, failed: 0, progress: 100, status: 'Completed', lastRun: 'Feb 6, 2026' },
  { name: 'Enrollments', records: 45678, migrated: 45678, failed: 0, progress: 100, status: 'Completed', lastRun: 'Feb 7, 2026' },
  { name: 'Assessment Results', records: 34567, migrated: 30234, failed: 1890, progress: 87, status: 'In Progress', lastRun: 'Feb 14, 2026' },
  { name: 'Certificates', records: 8901, migrated: 8901, failed: 0, progress: 100, status: 'Completed', lastRun: 'Feb 8, 2026' },
  { name: 'Payment History', records: 23456, migrated: 19345, failed: 2320, progress: 82, status: 'In Progress', lastRun: 'Feb 14, 2026' },
  { name: 'Discussion Forums', records: 15670, migrated: 12890, failed: 1200, progress: 82, status: 'In Progress', lastRun: 'Feb 14, 2026' },
  { name: 'Attendance Records', records: 67890, migrated: 0, failed: 0, progress: 0, status: 'Pending', lastRun: 'Not started' },
  { name: 'HR Records', records: 3456, migrated: 2456, failed: 800, progress: 71, status: 'Failed', lastRun: 'Feb 12, 2026' },
];

const DataMigrationPage: React.FC = () => (
  <SuperadminLayout title="Data Migration" subtitle="Odoo ERP migration management and progress tracking">
    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
      Migration from Odoo ERP (v16) is in progress. The TASC LMS platform is replacing the legacy Odoo-based system. All historical data is being migrated in phases.
    </Alert>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
            <Typography variant="body2" color="text.secondary">{k.trend}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Migration Modules</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Retry Failed</Button>
              <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>Run Migration</Button>
            </Box>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Module', 'Total Records', 'Migrated', 'Failed', 'Progress', 'Status', 'Last Run'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((m) => (
                  <TableRow key={m.name} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{m.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{m.records.toLocaleString()}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: '#10b981', fontWeight: 500 }}>{m.migrated.toLocaleString()}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: m.failed > 0 ? '#ef4444' : 'text.secondary', fontWeight: m.failed > 0 ? 500 : 400 }}>{m.failed.toLocaleString()}</Typography></TableCell>
                    <TableCell sx={{ minWidth: 140 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={m.progress}
                          sx={{
                            flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              bgcolor: m.progress === 100 ? '#10b981' : m.status === 'Failed' ? '#ef4444' : '#3b82f6',
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 36 }}>{m.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={m.status} size="small" sx={{ bgcolor: statusColors[m.status]?.bg, color: statusColors[m.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} />
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{m.lastRun}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Odoo Connection</Typography>
          <TextField fullWidth label="Odoo Server URL" defaultValue="https://odoo.tascgroup.com" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="Database Name" defaultValue="tasc_production" sx={{ mb: 2 }} size="small" />
          <TextField fullWidth label="API Key" type="password" defaultValue="••••••••••••" sx={{ mb: 2 }} size="small" />
          <Chip label="Connected" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 500, mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" fullWidth sx={{ textTransform: 'none' }}>Test Connection</Button>
            <Button variant="contained" size="small" fullWidth sx={{ textTransform: 'none' }}>Save</Button>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Migration Log</Typography>
          {[
            { time: '14:32', msg: 'Payment History: batch 45/56 processing...', type: 'info' },
            { time: '14:30', msg: 'Assessment Results: 45 records failed validation', type: 'error' },
            { time: '14:28', msg: 'Discussion Forums: batch 89/120 complete', type: 'info' },
            { time: '14:15', msg: 'Certificates module migration completed', type: 'success' },
            { time: '13:50', msg: 'HR Records: connection timeout, retrying...', type: 'warning' },
            { time: '13:45', msg: 'Enrollments module migration completed', type: 'success' },
          ].map((log, i) => (
            <Box key={i} sx={{ py: 1.5, borderBottom: i < 5 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', minWidth: 40 }}>{log.time}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: log.type === 'error' ? '#ef4444' : log.type === 'success' ? '#10b981' : log.type === 'warning' ? '#f59e0b' : 'text.secondary',
                  }}
                >
                  {log.msg}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  </SuperadminLayout>
);

export default DataMigrationPage;
