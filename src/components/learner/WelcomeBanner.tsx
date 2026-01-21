import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { PlayArrow, Search } from '@mui/icons-material';

// User data (will come from backend later)
const userData = {
  name: 'Emma',
};

const WelcomeBanner: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffa424 0%, #f97316 100%)',
        color: 'white',
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {userData.name}!
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600 }}>
          You're making great progress! Continue learning where you left off or explore new courses.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            flex: { xs: 1, md: 'none' },
          }}
        >
          Resume Learning
        </Button>
        <Button
          variant="outlined"
          startIcon={<Search />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            flex: { xs: 1, md: 'none' },
          }}
        >
          Browse Courses
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
