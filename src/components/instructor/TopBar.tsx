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
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from './Sidebar';
import { useLogout } from '../../hooks/useLogout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials, getRoleDisplayName } from '../../utils/userHelpers';

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleLogout = useLogout();
  const { user } = useAuth();

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const onLogoutClick = () => {
    handleUserMenuClose();
    handleLogout();
  };

  // Get user display values
  const userName = getUserDisplayName(user?.first_name, user?.last_name, user?.email);
  const userInitials = getUserInitials(user?.first_name, user?.last_name);
  const userRole = user?.role ? getRoleDisplayName(user.role) : 'User';

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
            Instructor Dashboard
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            noWrap
          >
            Manage your courses, track learner progress, and create content
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
              pl: 1.5,
              color: 'text.secondary',
            }}
          >
            <SearchIcon sx={{ fontSize: 20 }} />
          </Box>
          <InputBase
            placeholder="Search courses, learners..."
            sx={{
              color: 'inherit',
              bgcolor: 'grey.100',
              borderRadius: 1,
              py: 0.75,
              px: 1.5,
              pl: 5,
              fontSize: '0.875rem',
              width: 220,
              transition: 'all 0.3s',
              border: 1,
              borderColor: 'transparent',
              '&:focus-within': {
                width: 280,
                bgcolor: 'background.paper',
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(255, 183, 77, 0.2)',
              },
            }}
          />
        </Box>

        {/* Action Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton color="inherit" size="small">
            <Badge badgeContent={5} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" size="small">
            <AddIcon />
          </IconButton>

          {/* User Profile */}
          <Box
            onClick={handleUserMenuOpen}
            sx={{
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 1,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <Avatar
              src={user?.google_picture}
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {userInitials}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2} noWrap sx={{ maxWidth: 120 }}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 500 }} noWrap>
                {userRole}
              </Typography>
            </Box>
            <ArrowDownIcon sx={{ fontSize: 16, color: 'text.secondary', display: { xs: 'none', sm: 'block' } }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
            <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
