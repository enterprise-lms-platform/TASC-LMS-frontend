import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, Videocam as VideoIcon } from '@mui/icons-material';

// Instructor data (will come from backend later)
const instructorData = {
  name: 'Michael',
  assignmentsToGrade: 12,
  sessionsThisWeek: 2,
};

const WelcomeBanner: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #ffa424 0%, #f97316 100%)',
        color: 'white',
        p: { xs: 2.5, md: 3 },
        borderRadius: 2,
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
        >
          Welcome back, {instructorData.name}!
        </Typography>
        <Typography
          variant="body2"
          sx={{ opacity: 0.9, maxWidth: 500 }}
        >
          You have {instructorData.assignmentsToGrade} assignments to grade and {instructorData.sessionsThisWeek} live sessions scheduled for this week.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          width: { xs: '100%', md: 'auto' },
          position: 'relative',
          zIndex: 1,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            py: 1,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          }}
        >
          Create Course
        </Button>
        <Button
          variant="outlined"
          startIcon={<VideoIcon />}
          size="small"
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            py: 1,
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Schedule Session
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
