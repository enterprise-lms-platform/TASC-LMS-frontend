import React from 'react';
import { Grid } from '@mui/material';
import {
  People as UsersIcon,
  Business as OrganizationsIcon,
  AttachMoney as RevenueIcon,
  MenuBook as CoursesIcon,
} from '@mui/icons-material';
import KPICard from './KPICard';

const kpiData = [
  {
    title: 'Total Users',
    value: '24,587',
    trend: { direction: 'up' as const, value: '+12.5%', period: 'from last month' },
    icon: <UsersIcon />,
    iconBgColor: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  },
  {
    title: 'Active Organizations',
    value: '142',
    trend: { direction: 'up' as const, value: '+8.2%', period: 'from last month' },
    icon: <OrganizationsIcon />,
    iconBgColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
  {
    title: 'Monthly Revenue',
    value: '$186,450',
    trend: { direction: 'up' as const, value: '+15.3%', period: 'from last month' },
    icon: <RevenueIcon />,
    iconBgColor: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    title: 'Active Courses',
    value: '876',
    trend: { direction: 'up' as const, value: '+5.7%', period: 'from last month' },
    icon: <CoursesIcon />,
    iconBgColor: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
];

const KPIGrid: React.FC = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
      {kpiData.map((kpi) => (
        <Grid key={kpi.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard {...kpi} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIGrid;
