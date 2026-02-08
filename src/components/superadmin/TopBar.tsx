import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Fullscreen as FullscreenIcon,
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useLogout } from '../../hooks/useLogout';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials, getRoleDisplayName } from '../../utils/userHelpers';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
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
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: { xs: 64, lg: 80 }, py: 2 }}>
        {/* Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { lg: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ minWidth: 0, flex: { xs: 1, md: 'none' } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
              noWrap
            >
              Super Admin Dashboard
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' }
              }}
              noWrap
            >
              Platform Overview & System Management
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Bar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              px: 2,
              py: 0.5,
              width: 300,
              '&:focus-within': {
                borderColor: 'primary.main',
                bgcolor: 'background.paper',
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search users, courses, reports..."
              sx={{ flex: 1, fontSize: '0.875rem' }}
            />
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1 } }}>
            <IconButton sx={{ color: 'text.secondary' }} size="small">
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'flex' } }} size="small">
              <HelpIcon />
            </IconButton>
            <IconButton sx={{ color: 'text.secondary', display: { xs: 'none', md: 'flex' } }} size="small">
              <FullscreenIcon />
            </IconButton>

            {/* User Profile */}
            <Box
              onClick={handleUserMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar
                src={user?.google_picture}
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                  fontWeight: 700,
                }}
              >
                {userInitials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {userName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                  {userRole}
                </Typography>
              </Box>
              <ArrowDownIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
