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
  Divider,
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
  title?: string;
  subtitle?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  title = 'Super Admin Dashboard',
  subtitle = 'Platform Overview & System Management',
}) => {
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

  const userName = getUserDisplayName(user?.first_name, user?.last_name, user?.email);
  const userInitials = getUserInitials(user?.first_name, user?.last_name);
  const userRole = user?.role ? getRoleDisplayName(user.role) : 'User';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: { xs: 60, lg: 72 }, py: 1.5 }}>
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
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                letterSpacing: '-0.01em',
              }}
              noWrap
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.disabled',
                display: { xs: 'none', sm: 'block' },
                fontSize: '0.8rem',
                fontWeight: 400,
              }}
              noWrap
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Search Bar */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.03)',
              borderRadius: 50,
              px: 2,
              py: 0.5,
              width: 280,
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:focus-within': {
                width: 340,
                bgcolor: 'white',
                boxShadow: '0 0 0 2px rgba(255,164,36,0.2), inset 0 1px 3px rgba(0,0,0,0.02)',
              },
            }}
          >
            <SearchIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search users, courses, reports..."
              sx={{ flex: 1, fontSize: '0.82rem', fontWeight: 400 }}
            />
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.5 } }}>
            <IconButton
              sx={{
                color: 'text.secondary',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' },
              }}
              size="small"
            >
              <Badge
                badgeContent={5}
                color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 16, minWidth: 16 } }}
              >
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
            <IconButton
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'flex' },
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' },
              }}
              size="small"
            >
              <HelpIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', md: 'flex' },
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' },
              }}
              size="small"
            >
              <FullscreenIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Divider before profile */}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 28, alignSelf: 'center', display: { xs: 'none', sm: 'block' } }} />

            {/* User Profile */}
            <Box
              onClick={handleUserMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                p: 0.75,
                borderRadius: 2,
                transition: 'background 0.2s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
              }}
            >
              <Avatar
                src={user?.google_picture ?? undefined}
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                {userInitials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem', lineHeight: 1.3 }}>
                  {userName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, fontSize: '0.7rem' }}>
                  {userRole}
                </Typography>
              </Box>
              <ArrowDownIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    border: 'none',
                    minWidth: 160,
                  },
                },
              }}
            >
              <MenuItem onClick={handleUserMenuClose} sx={{ fontSize: '0.85rem' }}>Profile</MenuItem>
              <MenuItem onClick={handleUserMenuClose} sx={{ fontSize: '0.85rem' }}>Settings</MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={onLogoutClick} sx={{ fontSize: '0.85rem', color: 'error.main' }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
