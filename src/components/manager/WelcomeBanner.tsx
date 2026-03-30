import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, PersonAdd as PersonAddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Manager data (will come from backend later)
const managerData = {
  pendingCourses: 5,
  assignmentsToReview: 12,
  newUserRequests: 3,
  engagementIncrease: 15,
};

const WelcomeBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.first_name || 'there';
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundImage: 'url("/new banner images/Manager Dashboard.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        mb: 3,
        minHeight: 220,
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
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
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
            maxWidth: 500,
            fontSize: { xs: '0.875rem', md: '1rem' },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          You have {managerData.pendingCourses} courses pending approval, {managerData.assignmentsToReview} assignments to review,
          and {managerData.newUserRequests} new user requests. Your organization's learning engagement
          is up {managerData.engagementIncrease}% this month!
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            opacity: 0.9, 
            display: { xs: 'block', sm: 'none' }
          }}
        >
          {managerData.pendingCourses} pending courses • {managerData.assignmentsToReview} assignments
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, md: 1.5 }, 
        width: { xs: '100%', md: 'auto' }, 
        position: 'relative', 
        zIndex: 1, 
      }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          onClick={() => navigate('/manager/courses/create')}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 1.5, md: 3 },
            py: { xs: 0.75, md: 1 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: 'none',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)', boxShadow: 'none' },
            flex: { xs: 1, sm: 'none' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Create Course
        </Button>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          size="small"
          onClick={() => navigate('/manager/invite-user')}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 1.5, md: 3 },
            py: { xs: 0.75, md: 1 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            borderRadius: '50px',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            flex: { xs: 1, sm: 'none' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          Add Users
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          size="small"
          onClick={() => navigate('/manager/reports')}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 1.5, md: 3 },
            py: { xs: 0.75, md: 1 },
            fontSize: { xs: '0.8rem', md: '0.875rem' },
            borderRadius: '50px',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
            },
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          Export Report
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
