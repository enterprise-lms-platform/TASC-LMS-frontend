import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Skeleton } from '@mui/material';
import { PersonAdd as PersonAddIcon, Upload as UploadIcon, People as PeopleIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useOrgSettings, useOrgAdminMembers } from '../../hooks/useOrgAdmin';

const WelcomeBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.first_name || 'there';
  const { data: orgSettings, isLoading: orgLoading } = useOrgSettings();
  const { data: membersData, isLoading: membersLoading } = useOrgAdminMembers({ page_size: 1 });
  const totalMembers = membersData?.count ?? 0;

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
          }}
        >
          {orgLoading ? (
            <Skeleton variant="text" width={200} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          ) : membersLoading ? (
            <Skeleton variant="text" width={150} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
          ) : (
            <>Managing {orgSettings?.name || 'your organization'} · {totalMembers} members</>
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, md: 1.5 },
          width: { xs: '100%', md: 'auto' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          size="small"
          onClick={() => navigate('/org-admin/invite')}
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
          Add Member
        </Button>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          size="small"
          onClick={() => navigate('/org-admin/import')}
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
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          Import Members
        </Button>
        <Button
          variant="outlined"
          startIcon={<PeopleIcon />}
          size="small"
          onClick={() => navigate('/org-admin/members')}
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
            display: { xs: 'none', sm: 'inline-flex' },
          }}
        >
          View Members
        </Button>
      </Box>
    </Paper>
  );
};

export default WelcomeBanner;