import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper } from '@mui/material';
import { CellTower as MtnIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';

const GatewayMtnPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MtnIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>MTN MoMo</Typography>
              <Typography variant="body2" color="text.secondary">MTN Mobile Money payment gateway</Typography>
            </Box>
          </Box>
          <Paper elevation={0} sx={{ p: 6, borderRadius: '1rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <MtnIcon sx={{ fontSize: 36, color: 'grey.400' }} />
            </Box>
            <Typography variant="h6" fontWeight={600} mb={1}>Coming Soon</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              MTN MoMo direct integration is planned for a future release. All MTN transactions are currently processed through PesaPal.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default GatewayMtnPage;
