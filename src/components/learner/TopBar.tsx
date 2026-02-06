import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  HelpOutline as HelpIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { DRAWER_WIDTH } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login anyway
      navigate('/login');
    }
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/learner/profile');
  };

  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/learner/settings');
  };

  // Get user initials
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const userName = user?.name || `${user?.first_name} ${user?.last_name}` || 'User';
  const userInitials = user ? getInitials(userName) : 'U';
  const userRole = user?.role || 'learner';


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
            Learner Dashboard
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            noWrap
          >
            Continue your learning journey and track your progress
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
            placeholder="Search courses, topics..."
            sx={{
              color: 'inherit',
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 1,
              pl: 6,
              width: 240,
              transition: 'all 0.3s',
              border: 1,
              borderColor: 'transparent',
              '&:focus-within': {
                width: 300,
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
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <HelpIcon />
          </IconButton>

          {/* User Info (Desktop) */}
          <Box
            onClick={handleUserMenuOpen}
            sx={{
              ml: 1.5,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <Avatar
              src={user?.profile_picture}
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
            <Box>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 500, textTransform: 'capitalize' }}>
                {userRole.replace('_', ' ')}
              </Typography>
            </Box>
          </Box>

          {/* Mobile Avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
          >
            <Avatar
              src={user?.profile_picture}
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {userInitials}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { minWidth: 200, mt: 1 }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile} sx={{ gap: 1.5, py: 1 }}>
              <PersonIcon fontSize="small" />
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings} sx={{ gap: 1.5, py: 1 }}>
              <SettingsIcon fontSize="small" />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
