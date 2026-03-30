import React from 'react';
import {
  Box, Paper, Typography, Grid, Button,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon, TrendingUp as TrendIcon, ShowChart as ChartIcon,
  PieChart as PieIcon, Download as DownloadIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useRevenueStats } from '../../services/learning.services';

import KPICard from '../../components/superadmin/KPICard';


const RevenuePage: React.FC = () => {
  const { data: revenueData } = useRevenueStats(12);

  const latestMonth = revenueData?.monthly?.length ? revenueData.monthly[revenueData.monthly.length - 1] : null;
  const latestGrowth = latestMonth?.growth_percent;

  const kpis = [
    { label: 'Total Revenue', value: revenueData ? `$${parseFloat(revenueData.total_revenue).toLocaleString()}` : '—', icon: <MoneyIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
    { label: 'Latest Month', value: latestMonth ? `$${parseFloat(latestMonth.revenue).toLocaleString()}` : '—', icon: <TrendIcon />, bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534' },
    { label: 'Months Tracked', value: String(revenueData?.monthly?.length ?? '—'), icon: <ChartIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { label: 'Growth Rate', value: latestGrowth != null ? `${latestGrowth > 0 ? '+' : ''}${latestGrowth}%` : '—', icon: <TrendIcon />, bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534' },
  ];

  return (
    <SuperadminLayout title="Revenue Reports" subtitle="Revenue analytics and financial insights">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <KPICard title={k.label} value={k.value} icon={k.icon} bgColor={k.bgColor} badgeColor={k.badgeColor} valueColor={k.valueColor} labelColor={k.labelColor} index={index} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
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
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
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
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Revenue Breakdown by Organization</Typography>
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <PieIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
          <Typography variant="body2">Per-organization revenue breakdown endpoint pending backend implementation</Typography>
          <Typography variant="caption">Overall revenue stats above are live</Typography>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default RevenuePage;
