import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, IconButton, Avatar,
} from '@mui/material';
import {
  Handshake as PartnerIcon, TrendingUp as TrendIcon, Edit as EditIcon,
  Delete as DeleteIcon, Add as AddIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Partners', value: '12', icon: <PartnerIcon />, gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)', trend: '+2 this quarter' },
  { label: 'Active Partnerships', value: '9', icon: <PartnerIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '75% active' },
  { label: 'Revenue from Partners', value: '$45,200', icon: <TrendIcon />, gradient: 'linear-gradient(135deg, #ffb74d, #ffa424)', trend: '+18% vs last quarter' },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  'Content Provider': { bg: 'rgba(255, 164, 36, 0.1)', color: '#e65100' },
  Technology: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
  'Certification Body': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Reseller: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  Active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Inactive: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
  Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const partners = [
  { name: 'Coursera', type: 'Content Provider', status: 'Active', revenue: '15%', start: 'Jan 2025', contact: 'partnerships@coursera.org' },
  { name: 'Udemy Business', type: 'Content Provider', status: 'Active', revenue: '12%', start: 'Mar 2025', contact: 'business@udemy.com' },
  { name: 'Microsoft', type: 'Certification Body', status: 'Active', revenue: '10%', start: 'Feb 2025', contact: 'learn@microsoft.com' },
  { name: 'AWS', type: 'Certification Body', status: 'Active', revenue: '10%', start: 'Apr 2025', contact: 'training@aws.com' },
  { name: 'Google Cloud', type: 'Technology', status: 'Pending', revenue: '8%', start: 'Pending', contact: 'cloud@google.com' },
  { name: 'LinkedIn Learning', type: 'Content Provider', status: 'Inactive', revenue: '12%', start: 'Jun 2025', contact: 'learning@linkedin.com' },
];

const PartnershipsPage: React.FC = () => (
  <SuperadminLayout title="Partnerships" subtitle="Manage platform partnerships">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 4 }} key={k.label}>
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

    <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Partnerships</Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none', fontWeight: 600 }}>Add Partnership</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Partner', 'Type', 'Status', 'Revenue Share', 'Start Date', 'Contact', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {partners.map((p) => (
              <TableRow key={p.name} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'grey.200', color: 'text.secondary', fontSize: '0.8rem' }}>{p.name[0]}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{p.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={p.type} size="small" sx={{ bgcolor: typeColors[p.type]?.bg, color: typeColors[p.type]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                <TableCell><Chip label={p.status} size="small" sx={{ bgcolor: statusColors[p.status]?.bg, color: statusColors[p.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                <TableCell><Typography variant="body2">{p.revenue}</Typography></TableCell>
                <TableCell><Typography variant="body2">{p.start}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{p.contact}</Typography></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'info.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><DeleteIcon fontSize="small" /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </SuperadminLayout>
);

export default PartnershipsPage;
