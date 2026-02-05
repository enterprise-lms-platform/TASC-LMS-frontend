import React from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Chip } from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  Videocam as SessionIcon,
  Book as CourseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DRAWER_WIDTH } from '../Sidebar';

interface SessionTopBarProps {
  courseName?: string;
  onCancel?: () => void;
  onSchedule?: () => void;
  onMobileMenuToggle: () => void;
}

const SessionTopBar: React.FC<SessionTopBarProps> = ({
  courseName = 'Advanced React Development',
  onCancel,
  onSchedule,
  onMobileMenuToggle,
}) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'white',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
        <IconButton
          onClick={onMobileMenuToggle}
          sx={{ display: { md: 'none' }, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>

        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}
        >
          Back
        </Button>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            noWrap
            sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}
          >
            <SessionIcon sx={{ color: '#ef4444', fontSize: { xs: 20, sm: 24 } }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Schedule Livestream Session</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Schedule Session</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Set up a live session for your learners
          </Typography>
        </Box>

        <Chip
          icon={<CourseIcon sx={{ fontSize: 16 }} />}
          label={courseName}
          size="small"
          sx={{
            bgcolor: '#dbeafe',
            color: '#3b82f6',
            fontWeight: 600,
            '& .MuiChip-icon': { color: '#3b82f6' },
            display: { xs: 'none', sm: 'flex' },
          }}
        />

        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderColor: 'divider',
            color: 'text.secondary',
            display: { xs: 'none', md: 'flex' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSchedule}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#10b981',
            '&:hover': { bgcolor: '#0ea271' },
          }}
        >
          Schedule Session
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default SessionTopBar;
