import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Build as BuildIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import { useLogout } from '../../hooks/useLogout';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  p: 3,
  height: '100%',
};

const OrgAdminDashboardPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = useLogout();

  const cards = [
    {
      title: 'Member Oversight',
      description: 'View your organization learners and monitor participation trends.',
      icon: <VisibilityIcon sx={{ color: '#3b82f6' }} />,
    },
    {
      title: 'Progress Monitoring',
      description: 'Track learning completion signals for your organization members.',
      icon: <TrendingUpIcon sx={{ color: '#10b981' }} />,
    },
    {
      title: 'Performance Tracking',
      description: 'Review assessment performance across your organization cohort.',
      icon: <StarIcon sx={{ color: '#ffa424' }} />,
    },
    {
      title: 'Upcoming Tools',
      description: 'More organization-level monitoring tools will be added in upcoming phases.',
      icon: <BuildIcon sx={{ color: '#7c3aed' }} />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Organization Oversight
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Paper elevation={0} sx={{ ...cardSx, mb: 3, p: 3.5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Organization Oversight
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Org Admin is an organization-level monitoring role focused on learner oversight, progress visibility,
              and performance tracking. This role does not include global manager powers or course authoring.
            </Typography>
          </Paper>

          <Grid container spacing={3}>
            {cards.map((card) => (
              <Grid size={{ xs: 12, sm: 6 }} key={card.title}>
                <Paper elevation={0} sx={cardSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
                    {card.icon}
                    <Typography variant="h6" fontWeight={700}>
                      {card.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default OrgAdminDashboardPage;
