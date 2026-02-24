import React from 'react';
import { Box, Grid, Toolbar, CssBaseline } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';
import WelcomeBanner from '../components/finance/WelcomeBanner';
import FinancialOverview from '../components/finance/FinancialOverview';
import RevenueChart from '../components/finance/RevenueChart';
import PaymentMethodsChart from '../components/finance/PaymentMethodsChart';
import TransactionsTable from '../components/finance/TransactionsTable';
import PaymentMethods from '../components/finance/PaymentMethods';
import RecentInvoices from '../components/finance/RecentInvoices';
import QuickActions from '../components/finance/QuickActions';

const FinanceDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileToggle} />

      {/* TopBar */}
      <TopBar onMenuClick={handleMobileToggle} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}

        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Financial Overview - 4 Cards */}
        <FinancialOverview />

        {/* Charts Section */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <RevenueChart />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <PaymentMethodsChart />
          </Grid>
        </Grid>

        {/* Data Section */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <TransactionsTable />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <PaymentMethods />
              <RecentInvoices />
              <QuickActions />
            </Box>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
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

export default FinanceDashboard;
