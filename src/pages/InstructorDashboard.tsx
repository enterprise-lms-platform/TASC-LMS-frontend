import React, { useState } from 'react';
import { Box, Toolbar, Grid, CssBaseline, Typography } from '@mui/material';

// Import instructor components
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';
import TopBar from '../components/instructor/TopBar';
import WelcomeBanner from '../components/instructor/WelcomeBanner';
import KPIGrid from '../components/instructor/KPIGrid';
import CoursesSection from '../components/instructor/CoursesSection';
import PendingTasks from '../components/instructor/PendingTasks';
import UpcomingSessions from '../components/instructor/UpcomingSessions';
import QuickActions from '../components/instructor/QuickActions';

const InstructorDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* TopBar */}
      <TopBar onMobileMenuToggle={handleMobileMenuToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Dashboard Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowX: 'hidden' }}>
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* KPI Grid */}
          <KPIGrid />

          {/* Main Content Grid - Left (2fr) + Right (1fr) */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Left Column - Courses */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <CoursesSection />
            </Grid>

            {/* Right Column - Widgets */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Pending Tasks */}
                <PendingTasks />

                {/* Upcoming Sessions */}
                <UpcomingSessions />

                {/* Quick Actions */}
                <QuickActions />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
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
            © 2025 TASC LMS - Instructor Portal
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Last login: Today, 9:30 AM
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorDashboard;
