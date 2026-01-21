import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Download as DownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';

const WelcomeBanner: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffa424, #f97316)',
        color: 'white',
        p: 4,
        borderRadius: 3,
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, Super Admin!
        </Typography>
        <Typography sx={{ opacity: 0.9, maxWidth: 600 }}>
          Your platform is running smoothly. Here's what's happening across all organizations today.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          }}
        >
          Export Report
        </Button>
        <Button
          variant="contained"
          startIcon={<SettingsIcon />}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          }}
        >
          System Settings
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
