import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon, Download as DownloadIcon } from '@mui/icons-material';

// Manager data (will come from backend later)
const managerData = {
  name: 'Sarah',
  pendingCourses: 5,
  assignmentsToReview: 12,
  newUserRequests: 3,
  engagementIncrease: 15,
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
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {managerData.name}!
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 500 }}>
          You have {managerData.pendingCourses} courses pending approval, {managerData.assignmentsToReview} assignments to review,
          and {managerData.newUserRequests} new user requests. Your organization's learning engagement
          is up {managerData.engagementIncrease}% this month!
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' }, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            flex: { xs: 1, md: 'none' },
          }}
        >
          Create Course
        </Button>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            flex: { xs: 1, md: 'none' },
          }}
        >
          Add Users
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            flex: { xs: 1, md: 'none' },
          }}
        >
          Export Report
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
