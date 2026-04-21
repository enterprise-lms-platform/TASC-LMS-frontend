import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Grid } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import WelcomeBanner from '../../components/orgadmin/WelcomeBanner';
import KPIGrid from '../../components/orgadmin/KPIGrid';
import QuickActions from '../../components/orgadmin/QuickActions';
import SeatUsageCard from '../../components/orgadmin/SeatUsageCard';
import SubscriptionExpiryAlert from '../../components/orgadmin/SubscriptionExpiryAlert';
import RecentMembersTable from '../../components/orgadmin/RecentMembersTable';
import RecentActivity from '../../components/orgadmin/RecentActivity';
import TopCourses from '../../components/orgadmin/TopCourses';
import LearningStats from '../../components/orgadmin/LearningStats';

const OrgAdminDashboardPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Dashboard" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowX: 'hidden' }}>
        <WelcomeBanner />
        <SubscriptionExpiryAlert />
        <KPIGrid />
        <QuickActions />
        <SeatUsageCard />

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <RecentMembersTable />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <RecentActivity />
                <TopCourses />
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <LearningStats />
            </Grid>
          </Grid>
        </Box>

        <Box
          component="footer"
          sx={{
            p: 2,
            px: 3,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 TASC LMS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgAdminDashboardPage;