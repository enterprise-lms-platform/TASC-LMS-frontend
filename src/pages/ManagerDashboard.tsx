import React, { useState } from 'react';
import { Box, Toolbar, Grid, CssBaseline, Typography, Link } from '@mui/material';

// Import manager components
import Sidebar, { DRAWER_WIDTH } from '../components/manager/Sidebar';
import TopBar from '../components/manager/TopBar';
import WelcomeBanner from '../components/manager/WelcomeBanner';
import KPIGrid from '../components/manager/KPIGrid';
import QuickActions from '../components/manager/QuickActions';
import UsersCoursesTable from '../components/manager/UsersCoursesTable';
import EnrollmentChart from '../components/manager/EnrollmentChart';
import PendingTasks from '../components/manager/PendingTasks';
import TopCourses from '../components/manager/TopCourses';
import InstructorPerformance from '../components/manager/InstructorPerformance';
import RecentActivity from '../components/manager/RecentActivity';
import CourseCategories from '../components/manager/CourseCategories';
import LearningStatistics from '../components/manager/LearningStatistics';
import UpcomingSessions from '../components/manager/UpcomingSessions';

const ManagerDashboard: React.FC = () => {
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
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Dashboard Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* KPI Grid */}
          <KPIGrid />

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Grid - Left (2fr) + Right (1fr) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Left Column - Tables & Charts */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Users/Courses Tabbed Table */}
                <UsersCoursesTable />

                {/* Enrollment Chart */}
                <EnrollmentChart />
              </Box>
            </Grid>

            {/* Right Column - Widgets */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Pending Tasks */}
                <PendingTasks />

                {/* Top Courses */}
                <TopCourses />

                {/* Instructor Performance */}
                <InstructorPerformance />

                {/* Recent Activity */}
                <RecentActivity />
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Grid - 3 Columns */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CourseCategories />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <LearningStatistics />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <UpcomingSessions />
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
            © 2025 TASC LMS - Acme Corporation
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Help Center
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Documentation
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Support
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
