import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon, TrendingUp as TrendIcon, ShowChart as ChartIcon,
  PieChart as PieIcon, Download as DownloadIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Revenue', value: '$2.4M', gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '+15% YoY', icon: <MoneyIcon /> },
  { label: 'Monthly Revenue', value: '$186K', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: '+8% vs last month', icon: <TrendIcon /> },
  { label: 'Avg Revenue Per Org', value: '$16,900', gradient: 'linear-gradient(135deg, #ffb74d, #ffa424)', trend: '+5% vs last quarter', icon: <ChartIcon /> },
  { label: 'Growth Rate', value: '+12.5%', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', trend: 'Quarter over quarter', icon: <TrendIcon /> },
];

const orgs = [
  { name: 'Acme Corporation', course: '$124,500', subscription: '$89,200', total: '$213,700', pct: '28.4%', trend: '+12%' },
  { name: 'Global Tech Inc', course: '$98,300', subscription: '$67,800', total: '$166,100', pct: '22.1%', trend: '+8%' },
  { name: 'Innovate Solutions', course: '$76,200', subscription: '$54,100', total: '$130,300', pct: '17.3%', trend: '+15%' },
  { name: 'Future Dynamics', course: '$62,400', subscription: '$41,200', total: '$103,600', pct: '13.8%', trend: '+6%' },
  { name: 'NextGen Partners', course: '$45,800', subscription: '$32,600', total: '$78,400', pct: '10.4%', trend: '+22%' },
  { name: 'TechBridge Africa', course: '$28,900', subscription: '$31,100', total: '$60,000', pct: '8.0%', trend: '+18%' },
];

const RevenuePage: React.FC = () => (
  <SuperadminLayout title="Revenue Reports" subtitle="Revenue analytics and financial insights">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', transition: 'all 0.3s', '&:hover': { boxShadow: 3, transform: 'translateY(-2px)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>{k.trend}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Revenue Growth Trend</Typography>
            <Button size="small" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Export</Button>
          </Box>
          <Box sx={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
            <ChartIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography color="text.secondary">Revenue growth chart will be rendered here</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Revenue by Organization</Typography>
          <Box sx={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
            <PieIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography color="text.secondary">Distribution chart here</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>

    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Revenue Breakdown by Organization</Typography>
        <Button size="small" variant="outlined" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Export CSV</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Organization', 'Course Revenue', 'Subscription Revenue', 'Total Revenue', '% of Platform', 'Trend'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.secondary' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orgs.map((o) => (
              <TableRow key={o.name} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{o.name}</Typography></TableCell>
                <TableCell><Typography variant="body2">{o.course}</Typography></TableCell>
                <TableCell><Typography variant="body2">{o.subscription}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{o.total}</Typography></TableCell>
                <TableCell><Typography variant="body2">{o.pct}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>{o.trend}</Typography></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </SuperadminLayout>
);

export default RevenuePage;
