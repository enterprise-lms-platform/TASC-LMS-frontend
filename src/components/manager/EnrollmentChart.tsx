import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Grid, CircularProgress } from '@mui/material';
import { ShowChart as ChartIcon, CalendarMonth as CalendarIcon, Download as DownloadIcon } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEnrollmentTrends, useLearningStats } from '../../services/learning.services';

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
        {payload.map((entry: any) => (
          <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
            <Typography variant="body2" color="text.secondary">
              {entry.name}: <Typography component="span" fontWeight={600} color="text.primary">{entry.value}</Typography>
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

const EnrollmentChart: React.FC = () => {
  const [months, setMonths] = useState(6);
  const { data, isLoading, isError } = useEnrollmentTrends(months);
  const { data: statsDataRes, isLoading: statsLoading } = useLearningStats();

  // Transform data for Recharts
  const chartData = data?.labels?.map((label, index) => ({
    name: label,
    Enrollments: data.enrollments?.[index] || 0,
    Completions: data.completions?.[index] || 0,
  })) || [];

  // Calculate dynamic stats from API response
  const totalEnrollments = data?.enrollments?.reduce((a, b) => a + b, 0) || 0;
  const totalCompletions = data?.completions?.reduce((a, b) => a + b, 0) || 0;
  
  const statsData = [
    { value: totalEnrollments.toLocaleString(), label: `New Enrollments (${months}m)`, color: '#6366f1' },
    { value: totalCompletions.toLocaleString(), label: `Completions (${months}m)`, color: '#10b981' },
    { value: statsDataRes?.total_completed_courses?.toLocaleString() || '0', label: 'Completed Courses', color: '#ffa424' },
    { value: `${statsDataRes?.avg_completion_rate?.toFixed(1) || '0'}%`, label: 'Avg. Completion Rate', color: '#8b5cf6' },
  ];

  return (
    <Paper elevation={0} sx={cardSx}>
      {/* Header */}
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Enrollment & Completion Trends</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<CalendarIcon />}
            onClick={() => setMonths(months === 6 ? 12 : 6)}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem',
              '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}
          >
            Last {months} Months
          </Button>
          <Button variant="outlined" size="small" startIcon={<DownloadIcon />}
            sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem',
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Chart Area */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ height: 280, width: '100%', position: 'relative' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={32} sx={{ color: '#6366f1' }} />
            </Box>
          ) : isError ? (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography>Failed to load trends data.</Typography>
            </Box>
          ) : chartData.length === 0 ? (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography>No enrollment data available for this period.</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Enrollments" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorEnrollments)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Completions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCompletions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Dynamic Stats Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {statsData.map((stat) => (
            <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
              <Box
                sx={{
                  textAlign: 'center', p: 2, borderRadius: '12px',
                  bgcolor: `${stat.color}0a`,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>
                  {isLoading || statsLoading ? '...' : stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default EnrollmentChart;
