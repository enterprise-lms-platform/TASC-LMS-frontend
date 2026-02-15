import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import '../../styles/superadmin.css';

const DRAWER_WIDTH = 280;

interface SuperadminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const SuperadminLayout: React.FC<SuperadminLayoutProps> = ({
  children,
  title = 'Super Admin Dashboard',
  subtitle = 'Platform Overview & System Management',
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box className="sa-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <TopBar onMenuClick={handleMobileToggle} title={title} subtitle={subtitle} />

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
            © 2025 TASC Learning Management System. All rights reserved.
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Support', 'Documentation'].map((link) => (
              <Link
                key={link}
                href="#"
                underline="hover"
                sx={{
                  color: 'text.disabled',
                  fontSize: '0.8rem',
                  fontWeight: 400,
                  transition: 'color 0.2s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {link}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SuperadminLayout;
