import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Button,
} from '@mui/material';
import {
  CardMembership as CertIcon, CheckCircle as ValidIcon, Warning as ExpiredIcon,
  Block as RevokedIcon, Visibility as ViewIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Issued', value: '4,567', icon: <CertIcon />, gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)', trend: '+234 this month' },
  { label: 'Active/Valid', value: '4,123', icon: <ValidIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '90.3% valid' },
  { label: 'Expired', value: '356', icon: <ExpiredIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: '7.8% of total' },
  { label: 'Revoked', value: '88', icon: <RevokedIcon />, gradient: 'linear-gradient(135deg, #ffa424, #ffb74d)', trend: '1.9% of total' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Valid: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Expired: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Revoked: { bg: 'rgba(255, 164, 36, 0.1)', color: '#ffa424' },
};

const certs = [
  { id: 'CERT-4567', recipient: 'John Kamau', course: 'Advanced React Patterns', issued: 'Feb 10, 2026', expiry: 'Feb 10, 2028', status: 'Valid' },
  { id: 'CERT-4566', recipient: 'Mary Wambui', course: 'Data Science Fundamentals', issued: 'Feb 8, 2026', expiry: 'Feb 8, 2028', status: 'Valid' },
  { id: 'CERT-4565', recipient: 'Peter Ochieng', course: 'Cybersecurity Essentials', issued: 'Jan 15, 2026', expiry: 'Jan 15, 2028', status: 'Valid' },
  { id: 'CERT-4521', recipient: 'Grace Akinyi', course: 'Cloud Architecture', issued: 'Dec 20, 2025', expiry: 'Dec 20, 2027', status: 'Revoked' },
  { id: 'CERT-4489', recipient: 'David Mwangi', course: 'Python for Beginners', issued: 'Nov 5, 2025', expiry: 'Nov 5, 2027', status: 'Valid' },
  { id: 'CERT-4322', recipient: 'Sarah Nakamura', course: 'Business Analytics', issued: 'Aug 12, 2024', expiry: 'Aug 12, 2025', status: 'Expired' },
  { id: 'CERT-4211', recipient: 'James Otieno', course: 'Digital Marketing', issued: 'Jul 3, 2024', expiry: 'Jul 3, 2025', status: 'Expired' },
  { id: 'CERT-4100', recipient: 'Faith Muthoni', course: 'UX/UI Design', issued: 'Jun 18, 2024', expiry: 'Jun 18, 2026', status: 'Valid' },
];

const templates = [
  { name: 'Course Completion', desc: 'Standard course completion certificate' },
  { name: 'Professional Development', desc: 'Professional training certificate' },
  { name: 'Workshop Attendance', desc: 'Workshop participation certificate' },
  { name: 'Specialization', desc: 'Multi-course specialization certificate' },
];

const CertificationsPage: React.FC = () => (
  <SuperadminLayout title="Certifications" subtitle="Certificate tracking and template management">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px) scale(1.01)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
            <Typography variant="body2" color="text.secondary">{k.trend}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 3 }}>Certificates</Typography>
          <TableContainer>
            <Table>
              <TableHead><TableRow>
                {['Certificate ID', 'Recipient', 'Course', 'Issued', 'Expiry', 'Status', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                ))}
              </TableRow></TableHead>
              <TableBody>
                {certs.map((c) => (
                  <TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{c.id}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{c.recipient}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{c.course}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{c.issued}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{c.expiry}</Typography></TableCell>
                    <TableCell><Chip label={c.status} size="small" sx={{ bgcolor: statusColors[c.status]?.bg, color: statusColors[c.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Certificate Templates</Typography>
          {templates.map((t, i) => (
            <Box key={t.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: i < templates.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{t.name}</Typography>
                <Typography variant="caption" color="text.secondary">{t.desc}</Typography>
              </Box>
              <Button size="small" sx={{ textTransform: 'none', fontSize: '0.75rem' }}>Edit</Button>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  </SuperadminLayout>
);

export default CertificationsPage;
