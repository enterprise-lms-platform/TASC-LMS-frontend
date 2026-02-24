import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Download as DownloadIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const WelcomeBanner: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.first_name || 'there';

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundImage: 'url("/dashboard banner images/finance3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: { xs: 3, md: 4 },
        borderRadius: '1rem',
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
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
      {/* Geometric pattern */}
      <Box
        component="svg"
        viewBox="0 0 200 200"
        sx={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          width: 200,
          height: 200,
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <circle cx="60" cy="60" r="50" fill="white" />
        <rect x="120" y="20" width="60" height="60" rx="10" fill="white" />
        <polygon points="140,140 180,180 100,180" fill="white" />
      </Box>

      <Box sx={{ minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}
        >
          Finance Overview, {firstName}!
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
          Track revenue, manage payments, and generate financial reports across your organization.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            display: { xs: 'block', sm: 'none' }
          }}
        >
          Track revenue and manage payments.
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, md: 2 },
        width: { xs: '100%', md: 'auto' },
        position: 'relative',
        zIndex: 1,
      }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          size="small"
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
          Export Report
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
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
          New Invoice
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;
