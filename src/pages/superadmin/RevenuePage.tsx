import React from 'react';
import {
  Box, Paper, Typography, Grid, Button,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon, TrendingUp as TrendIcon, ShowChart as ChartIcon,
  PieChart as PieIcon, Download as DownloadIcon,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useRevenueStats, statsApi } from '../../services/learning.services';
import { exportApi } from '../../services/superadmin.services';
import { useQuery } from '@tanstack/react-query';
import KPICard from '../../components/superadmin/KPICard';

const COLORS = ['#ffa424', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6'];

const RevenuePage: React.FC = () => {
  const { data: revenueData } = useRevenueStats(12);
  const { data: orgRevenueData } = useQuery({
    queryKey: ['revenue-by-org'],
    queryFn: () => statsApi.getRevenueByOrg().then((r) => r.data),
  });

  const latestMonth = revenueData?.monthly?.length ? revenueData.monthly[revenueData.monthly.length - 1] : null;
  const latestGrowth = latestMonth?.growth_percent;

  const kpis = [
    { label: 'Total Revenue', value: revenueData ? `$${parseFloat(revenueData.total_revenue).toLocaleString()}` : '—', icon: <MoneyIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
    { label: 'Latest Month', value: latestMonth ? `$${parseFloat(latestMonth.revenue).toLocaleString()}` : '—', icon: <TrendIcon />, bgColor: '#dcfce7', badgeColor: '#4ade80', valueColor: '#14532d', labelColor: '#166534' },
    { label: 'Months Tracked', value: String(revenueData?.monthly?.length ?? '—'), icon: <ChartIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { label: 'Growth Rate', value: latestGrowth != null ? `${latestGrowth > 0 ? '+' : ''}${latestGrowth}%` : '—', icon: <TrendIcon />, bgColor: '#f0fdf4', badgeColor: '#86efac', valueColor: '#14532d', labelColor: '#166534' },
  ];

  const chartData = (revenueData?.monthly ?? []).map((m) => ({
    month: m.month,
    revenue: parseFloat(m.revenue),
    growth: m.growth_percent ?? 0,
  }));

  // Derive a rough distribution from the last 6 months for the pie chart
  const last6 = chartData.slice(-6);
  const pieData = last6.map((m) => ({ name: m.month, value: m.revenue }));

  const hasData = chartData.length > 0;

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
              <Button size="small" startIcon={<DownloadIcon />} onClick={() => exportApi.transactions()} sx={{ textTransform: 'none' }}>Export</Button>
            </Box>
            {hasData ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffa424" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ffa424" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => (v != null ? [`$${Number(v).toLocaleString()}`, 'Revenue'] : ['—', 'Revenue'])} />
                  <Area type="monotone" dataKey="revenue" stroke="#ffa424" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
                <ChartIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                <Typography color="text.secondary">No revenue data yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 2 }}>Revenue by Month (Last 6)</Typography>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="45%" outerRadius={90} dataKey="value" label={({ name }) => name}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => (v != null ? `$${Number(v).toLocaleString()}` : '—')} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
                <PieIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
                <Typography color="text.secondary">No data yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Revenue Breakdown by Organization</Typography>
        {orgRevenueData?.results?.length ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={orgRevenueData.results.map((r) => ({ name: r.organization, revenue: parseFloat(r.revenue) }))} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => (v != null ? [`$${Number(v).toLocaleString()}`, 'Revenue'] : ['—', 'Revenue'])} />
              <Bar dataKey="revenue" fill="#ffa424" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <PieIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography variant="body2">No organization revenue data yet</Typography>
          </Box>
        )}
      </Paper>
    </SuperadminLayout>
  );
};

export default RevenuePage;
