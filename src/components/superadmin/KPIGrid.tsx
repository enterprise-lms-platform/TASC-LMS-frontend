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
    // Soft Blue Theme
    bgColor: '#e3f2fd',
    badgeColor: '#64b5f6',
    valueColor: '#1565c0',
    labelColor: '#1976d2',
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
    // Dusty Lavender Theme
    bgColor: '#f3e5f5',
    badgeColor: '#ba68c8',
    valueColor: '#6a1b9a',
    labelColor: '#7b1fa2',
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
