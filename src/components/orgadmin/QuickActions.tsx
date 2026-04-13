import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { PersonAdd as PersonAddIcon, Upload as UploadIcon, People as PeopleIcon } from '@mui/icons-material';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        onClick={() => navigate('/org-admin/invite')}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
          px: 2.5,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Add Member
      </Button>
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => navigate('/org-admin/import')}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
          px: 2.5,
          borderColor: 'divider',
          color: 'text.primary',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,164,36,0.04)' },
        }}
      >
        Import Members
      </Button>
      <Button
        variant="outlined"
        startIcon={<PeopleIcon />}
        onClick={() => navigate('/org-admin/members')}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
          px: 2.5,
          borderColor: 'divider',
          color: 'text.primary',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,164,36,0.04)' },
        }}
      >
        View All Members
      </Button>
    </Box>
  );
};

export default QuickActions;