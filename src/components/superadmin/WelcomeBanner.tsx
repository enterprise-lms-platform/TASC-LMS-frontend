import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Download as DownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';

const WelcomeBanner: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundImage: 'url("/dashboard banner images/super admin1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: { xs: 3, md: 4 },
        borderRadius: '1.25rem',
        mb: 3,
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
          background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 70%, transparent 100%)',
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
        <Typography sx={{ fontWeight: 700, mb: 0.75, fontSize: { xs: '1.15rem', md: '1.35rem' }, letterSpacing: '-0.01em' }}>
          Welcome back, Super Admin!
        </Typography>
        <Typography sx={{ opacity: 0.9, maxWidth: 520, fontSize: '0.88rem', fontWeight: 400, lineHeight: 1.5 }}>
          Your platform is running smoothly. Here's what's happening across all organizations today.
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
            borderRadius: 2,
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
            borderRadius: 2,
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
