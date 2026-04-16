import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import TopBar from './TopBar';

interface OrgAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const OrgAdminLayout: React.FC<OrgAdminLayoutProps> = ({
  children,
  title = 'Organization Admin',
  subtitle = 'Manage your organization',
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <TopBar onMobileMenuToggle={handleMobileToggle} title={title} />

        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowX: 'hidden', overflowY: 'auto' }}>
          {children}
        </Box>

        <Box
          component="footer"
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 400, fontSize: '0.8rem' }}>
            © 2026 TASC Learning Management System. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgAdminLayout;
