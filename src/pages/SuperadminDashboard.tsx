import React from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from '../components/superadmin/Sidebar';
import TopBar from '../components/superadmin/TopBar';
import WelcomeBanner from '../components/superadmin/WelcomeBanner';
import KPIGrid from '../components/superadmin/KPIGrid';
import RevenueChart from '../components/superadmin/RevenueChart';
import UserGrowthChart from '../components/superadmin/UserGrowthChart';
import OrganizationsTable from '../components/superadmin/OrganizationsTable';
import SystemHealth from '../components/superadmin/SystemHealth';
import QuickActions from '../components/superadmin/QuickActions';
import RecentActivity from '../components/superadmin/RecentActivity';

const DRAWER_WIDTH = 280;

const SuperadminDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Bar */}
        <TopBar onMenuClick={handleMobileToggle} />

        {/* Dashboard Content */}
        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* KPI Grid */}
          <KPIGrid />

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <RevenueChart />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <UserGrowthChart />
            </Grid>
          </Grid>

          {/* Data Tables & Widgets Section */}
          <Grid container spacing={3}>
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
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            © 2025 TASC Learning Management System. All rights reserved.
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Support', 'Documentation'].map((link) => (
              <Box
                key={link}
                component="a"
                href="#"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                }}
              >
                {link}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SuperadminDashboard;
