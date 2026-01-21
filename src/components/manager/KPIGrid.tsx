import React from 'react';
import { Box, Grid } from '@mui/material';
import { People as UsersIcon, MenuBook as CoursesIcon, School as EnrollmentsIcon, TrendingUp as CompletionIcon } from '@mui/icons-material';
import KPICard from './KPICard';

// KPI data (will come from backend later)
const kpiData = [
  {
    icon: <UsersIcon />,
    value: '2,450',
    label: 'Total Users',
    trend: 'up' as const,
    trendText: '+8.2% this month',
    linkText: 'View All',
    colorScheme: 'primary' as const,
  },
  {
    icon: <CoursesIcon />,
    value: '67',
    label: 'Active Courses',
    trend: 'up' as const,
    trendText: '+5 new this month',
    linkText: 'Manage',
    colorScheme: 'info' as const,
  },
  {
    icon: <EnrollmentsIcon />,
    value: '8,924',
    label: 'Total Enrollments',
    trend: 'up' as const,
    trendText: '+15.3% this month',
    linkText: 'View All',
    colorScheme: 'success' as const,
  },
  {
    icon: <CompletionIcon />,
    value: '68%',
    label: 'Completion Rate',
    trend: 'up' as const,
    trendText: '+3.5% this month',
    linkText: 'Details',
    colorScheme: 'warning' as const,
  },
];

const KPIGrid: React.FC = () => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KPIGrid;
