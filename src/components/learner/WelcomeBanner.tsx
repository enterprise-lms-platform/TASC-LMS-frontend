import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { PlayArrow, Search } from '@mui/icons-material';

// User data (will come from backend later)
const userData = {
  name: 'Emma',
};

const WelcomeBanner: React.FC = () => {
  const navigate = useNavigate();

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
      <Box sx={{ minWidth: 0 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
        >
          Welcome back, {userData.name}!
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            opacity: 0.9, 
            maxWidth: 600,
            fontSize: { xs: '0.875rem', md: '1rem' },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          You're making great progress! Continue learning where you left off or explore new courses.
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.9,
            display: { xs: 'block', sm: 'none' }
          }}
        >
          Continue learning where you left off!
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, md: 2 }, 
        width: { xs: '100%', md: 'auto' } 
      }}>
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          size="small"
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 1.5, md: 3 },
            py: { xs: 0.75, md: 1 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            flex: { xs: 1, sm: 'none' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Resume Learning
        </Button>
        <Button
          variant="outlined"
          startIcon={<Search />}
          size="small"
          onClick={() => navigate('/learner/courses')}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 1.5, md: 3 },
            py: { xs: 0.75, md: 1 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            flex: { xs: 1, sm: 'none' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Browse Courses
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
