import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from '../../components/superadmin/Sidebar';
import TopBar from '../../components/superadmin/TopBar';
import MessagingPanel from '../../components/common/MessagingPanel';

const SuperadminMessagesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onMobileClose={() => setMobileOpen(false)} 
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: { md: `calc(100% - 280px)` }, 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} title="Messages" subtitle="Platform Messaging & Support" />
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <MessagingPanel height="100%" />
        </Box>
      </Box>
    </Box>
  );
};

export default SuperadminMessagesPage;
