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
    icon: <UsersIcon />,
    // Mint Green Theme
    bgColor: '#e8f5e9',
    badgeColor: '#81c784',
    valueColor: '#2e7d32',
    labelColor: '#388e3c',
  },
  {
    title: 'Active Organizations',
    value: '142',
    icon: <OrganizationsIcon />,
    // Grey Theme
    bgColor: '#f4f4f5',
    badgeColor: '#a1a1aa',
    valueColor: '#27272a',
    labelColor: '#3f3f46',
  },
  {
    title: 'Monthly Revenue',
    value: '$186,450',
    icon: <RevenueIcon />,
    // Warm Peach Theme
    bgColor: '#fff3e0',
    badgeColor: '#ffb74d',
    valueColor: '#e65100',
    labelColor: '#f57c00',
  },
  {
    title: 'Active Courses',
    value: '876',
    icon: <CoursesIcon />,
    // Green Theme
    bgColor: '#f0fdf4',
    badgeColor: '#86efac',
    valueColor: '#14532d',
    labelColor: '#166534',
  },
];

const KPIGrid: React.FC = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 2.5 }} sx={{ mb: 3 }}>
      {kpiData.map((kpi, index) => (
        <Grid key={kpi.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <KPICard {...kpi} index={index} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPIGrid;
