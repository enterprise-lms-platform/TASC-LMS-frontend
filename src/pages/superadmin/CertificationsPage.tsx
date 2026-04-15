import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, CircularProgress, Button,
} from '@mui/material';
import {
  CardMembership as CertIcon, CheckCircle as ValidIcon, Warning as ExpiredIcon,
  Block as RevokedIcon, Visibility as ViewIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useCertificateStats, managerCertificateApi } from '../../services/learning.services';

const templates = [
  { name: 'Course Completion', desc: 'Standard course completion certificate' },
  { name: 'Professional Development', desc: 'Professional training certificate' },
  { name: 'Workshop Attendance', desc: 'Workshop participation certificate' },
  { name: 'Specialization', desc: 'Multi-course specialization certificate' },
];

const CertificationsPage: React.FC = () => {
  const { data: stats } = useCertificateStats();

  const { data: certsRaw, isLoading } = useQuery({
    queryKey: ['superadmin', 'certificates'],
    queryFn: () => managerCertificateApi.getAll({ page: 1, page_size: 100 }).then((r) => r.data),
  });

  const certs = Array.isArray(certsRaw) ? certsRaw : (certsRaw as any)?.results ?? [];

  const kpis = [
    { label: 'Total Issued', value: String(stats?.total ?? '—'), icon: <CertIcon />, gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)', trend: `${stats?.this_month ?? 0} this month` },
    { label: 'Active/Valid', value: String(stats?.valid ?? '—'), icon: <ValidIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: stats?.total ? `${Math.round((stats.valid / stats.total) * 100)}% valid` : '' },
    { label: 'Courses with Certs', value: String(stats?.total_courses_with_certs ?? '—'), icon: <ExpiredIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: 'Unique courses' },
    { label: 'This Month', value: String(stats?.this_month ?? '—'), icon: <RevokedIcon />, gradient: 'linear-gradient(135deg, #ffa424, #ffb74d)', trend: 'Recent issuances' },
  ];

  return (
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
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 3 }}>Certificates</Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={28} /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead><TableRow>
                  {['Certificate #', 'Recipient', 'Course', 'Issued', 'Expiry', 'Status', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                  ))}
                </TableRow></TableHead>
                <TableBody>
                  {certs.map((c: any) => (
                    <TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{c.certificate_number}</Typography></TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{c.user_name}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{c.course_title}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{c.issued_at ? new Date(c.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No expiry'}</Typography></TableCell>
                      <TableCell>
                        <Chip
                          label={c.is_expired ? 'Expired' : c.is_valid ? 'Valid' : 'Revoked'}
                          size="small"
                          sx={{
                            bgcolor: c.is_expired ? 'rgba(245,158,11,0.1)' : c.is_valid ? 'rgba(16,185,129,0.1)' : 'rgba(255,164,36,0.1)',
                            color: c.is_expired ? '#f59e0b' : c.is_valid ? '#10b981' : '#ffa424',
                            fontWeight: 500, fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {certs.length === 0 && (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No certificates found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Certificate Templates</Typography>
          {templates.map((t, i) => (
            <Box key={t.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, borderBottom: i < templates.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{t.name}</Typography>
                <Typography variant="caption" color="text.secondary">{t.desc}</Typography>
              </Box>
              <Button size="small" disabled sx={{ textTransform: 'none', fontSize: '0.75rem' }} title="Edit certificate template">Edit</Button>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  </SuperadminLayout>
  );
};

export default CertificationsPage;
