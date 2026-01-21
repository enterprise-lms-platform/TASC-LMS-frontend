import React, { useState } from 'react';
import { Box, Toolbar, Grid, CssBaseline } from '@mui/material';
import '../styles/LearnerDashboard.css';

// Import learner components
import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';
import WelcomeBanner from '../components/learner/WelcomeBanner';
import QuickStats from '../components/learner/QuickStats';
import CourseGrid from '../components/learner/CourseGrid';
import UpcomingSessions from '../components/learner/UpcomingSessions';
import RecentActivity from '../components/learner/RecentActivity';
import Certificates from '../components/learner/Certificates';

const LearnerDashboard: React.FC = () => {
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
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Quick Stats */}
        <QuickStats />

        {/* Course Grid */}
        <CourseGrid />

        {/* Upcoming Sessions & Recent Activity */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <UpcomingSessions />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentActivity />
          </Grid>
        </Grid>

        {/* Certificates */}
        <Certificates />
      </Box>
    </Box>
  );
};

export default LearnerDashboard;
