import React from 'react';
import { Box, Grid } from '@mui/material';
import SuperadminLayout from '../components/superadmin/SuperadminLayout';
import WelcomeBanner from '../components/superadmin/WelcomeBanner';
import KPIGrid from '../components/superadmin/KPIGrid';
import RevenueChart from '../components/superadmin/RevenueChart';
import UserGrowthChart from '../components/superadmin/UserGrowthChart';
import OrganizationsTable from '../components/superadmin/OrganizationsTable';
import SystemHealth from '../components/superadmin/SystemHealth';
import QuickActions from '../components/superadmin/QuickActions';
import RecentActivity from '../components/superadmin/RecentActivity';

const SuperadminDashboard: React.FC = () => {
  return (
    <SuperadminLayout title="Super Admin Dashboard" subtitle="Platform Overview & System Management">
      <WelcomeBanner />
      <KPIGrid />

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <UserGrowthChart />
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <OrganizationsTable />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SystemHealth />
            <QuickActions />
            <RecentActivity />
          </Box>
        </Grid>
      </Grid>
    </SuperadminLayout>
  );
};

export default SuperadminDashboard;
