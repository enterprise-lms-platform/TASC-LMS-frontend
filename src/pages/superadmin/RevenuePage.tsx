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

import KPICard from '../../components/superadmin/KPICard';

const kpis = [
  { 
    label: 'Total Revenue', 
    value: '$2.4M', 
    icon: <MoneyIcon />, 
    // Orange Theme
    bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412'
  },
  { 
    label: 'Monthly Revenue', 
    value: '$186K', 
    icon: <TrendIcon />, 
    // Green Theme
    bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534'
  },
  { 
    label: 'Avg Revenue Per Org', 
    value: '$16,900', 
    icon: <ChartIcon />, 
    // Grey Theme
    bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46'
  },
  { 
    label: 'Growth Rate', 
    value: '+12.5%', 
    icon: <TrendIcon />, 
    // Green Alt Theme
    bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534'
  },
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
      {kpis.map((k, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <KPICard
            title={k.label}
            value={k.value}
            icon={k.icon}
            bgColor={k.bgColor}
            badgeColor={k.badgeColor}
            valueColor={k.valueColor}
            labelColor={k.labelColor}
            index={index}
          />
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
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
        <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Revenue by Organization</Typography>
          <Box sx={{ height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
            <PieIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography color="text.secondary">Distribution chart here</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>

    <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Revenue Breakdown by Organization</Typography>
        <Button size="small" variant="outlined" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Export CSV</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Organization', 'Course Revenue', 'Subscription Revenue', 'Total Revenue', '% of Platform', 'Trend'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orgs.map((o) => (
              <TableRow key={o.name} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
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
