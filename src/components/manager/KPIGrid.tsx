import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  People as UsersIcon,
  MenuBook as CoursesIcon,
  School as EnrollmentsIcon,
  TrendingUp as CompletionIcon,
} from '@mui/icons-material';

const kpiData = [
  { label: 'Total Users', value: '2,450', icon: <UsersIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
  { label: 'Active Courses', value: '67', icon: <CoursesIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
  { label: 'Total Enrollments', value: '8,924', icon: <EnrollmentsIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
  { label: 'Completion Rate', value: '68%', icon: <CompletionIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
];

const KPIGrid: React.FC = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {kpiData.map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Paper elevation={0} sx={{
              bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
              position: 'relative', minHeight: 160, display: 'flex',
              flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
              '&:hover': { transform: 'translateY(-4px)' },
            }}>
              <Box sx={{
                position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                borderRadius: '50%', bgcolor: s.iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'white',
                '& svg': { fontSize: 20 },
              }}>{s.icon}</Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: s.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: s.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIGrid;
