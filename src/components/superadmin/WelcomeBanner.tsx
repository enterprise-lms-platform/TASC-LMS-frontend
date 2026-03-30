import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Download as DownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { notificationApi } from '../../services/notifications.services';

const WelcomeBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.first_name || 'Super Admin';

  const { data: notifData } = useQuery({
    queryKey: ['superadminWelcomeNotification'],
    queryFn: () => notificationApi.getAll({ is_read: false, page_size: 1 }),
  });
  const notifications = Array.isArray(notifData?.data) ? notifData.data : notifData?.data?.results ?? [];
  const topNotification = notifications[0];
  const subtitle = topNotification?.description
    || "You have the full picture. Oversee every organization, manage platform settings, and ensure everything runs at peak performance.";

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundImage: 'url("/new banner images/Super Admin Dashboard.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: { xs: 3, md: 4 },
        borderRadius: '1.25rem',
        mb: 3,
        minHeight: 220,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        position: 'relative',
        overflow: 'hidden',
        /* Dark overlay for text readability */
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 70%, transparent 100%)',
          pointerEvents: 'none',
        },
        /* Subtle geometric pattern */
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 180,
          height: 180,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='90' cy='90' r='80' stroke='white' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='90' cy='90' r='55' stroke='white' stroke-width='1' fill='none'/%3E%3Ccircle cx='90' cy='90' r='30' stroke='white' stroke-width='0.8' fill='none'/%3E%3Cline x1='10' y1='90' x2='170' y2='90' stroke='white' stroke-width='0.5'/%3E%3Cline x1='90' y1='10' x2='90' y2='170' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          pointerEvents: 'none',
          display: { xs: 'none', md: 'block' },
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
        >
          Welcome back, {firstName}!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.9,
            maxWidth: 520,
            fontSize: { xs: '0.875rem', md: '1rem' },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {subtitle}
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.9, display: { xs: 'block', sm: 'none' } }}
        >
          {topNotification?.title || 'Oversee organizations and keep the platform at its best.'}
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        width: { xs: '100%', sm: 'auto' },
        position: 'relative',
        zIndex: 1,
      }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/superadmin/revenue')}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: 'none',
            fontWeight: 500,
            fontSize: '0.82rem',
            textTransform: 'none',
            borderRadius: '50px',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              boxShadow: 'none',
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Export Report
        </Button>
        <Button
          variant="contained"
          startIcon={<SettingsIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate('/superadmin/settings')}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: 'none',
            fontWeight: 500,
            fontSize: '0.82rem',
            textTransform: 'none',
            borderRadius: '50px',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              boxShadow: 'none',
            },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          System Settings
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
