import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Paper } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface InstructorPlaceholderPageProps {
  title: string;
  description?: string;
}

const InstructorPlaceholderPage: React.FC<InstructorPlaceholderPageProps> = ({
  title,
  description = 'This feature is currently under development and will be available soon.',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 72px)' }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              maxWidth: 500,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 164, 36, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <ConstructionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorPlaceholderPage;
