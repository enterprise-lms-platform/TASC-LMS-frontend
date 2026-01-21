import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  HelpOutline as HelpIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from './Sidebar';

// Manager data (will come from backend later)
const managerData = {
  name: 'Sarah Johnson',
  role: 'LMS Manager',
  initials: 'SJ',
  notificationCount: 8,
  messageCount: 3,
};

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMobileMenuToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Box sx={{ minWidth: 0, flex: { xs: 1, sm: 'none' } }}>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            noWrap
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            LMS Manager Dashboard
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            noWrap
          >
            Manage users, courses, and track organizational learning
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Bar */}
        <Box
          sx={{
            position: 'relative',
            mr: 2,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              pl: 2,
              color: 'text.secondary',
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search users, courses, reports..."
            sx={{
              color: 'inherit',
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 1,
              pl: 6,
              width: 280,
              transition: 'all 0.3s',
              border: 1,
              borderColor: 'transparent',
              '&:focus-within': {
                width: 320,
                bgcolor: 'background.paper',
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(255, 183, 77, 0.2)',
              },
            }}
          />
        </Box>

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5 } }}>
          <IconButton color="inherit" size="small">
            <Badge badgeContent={managerData.notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Badge badgeContent={managerData.messageCount} color="error">
              <EmailIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" size="small" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <HelpIcon />
          </IconButton>

          {/* User Info (Desktop) */}
          <Box
            sx={{
              ml: 1.5,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {managerData.initials}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {managerData.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 500 }}>
                {managerData.role}
              </Typography>
            </Box>
            <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
