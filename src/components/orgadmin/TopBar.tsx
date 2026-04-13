import React from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Button, Chip } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { DRAWER_WIDTH } from './Sidebar';
import { useOrgSettings } from '../../hooks/useOrgAdmin';
import { useLogout } from '../../hooks/useLogout';

interface TopBarProps {
  onMobileMenuToggle: () => void;
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle, title = 'Dashboard' }) => {
  const handleLogout = useLogout();
  const { data: orgSettings, isLoading: orgLoading } = useOrgSettings();

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
        <Typography variant="h6" fontWeight={700} color="text.primary">
          {title}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {orgLoading ? (
          <Chip label={<Box sx={{ width: 60, height: 16 }} />} size="small" />
        ) : (
          <Chip
            label={orgSettings?.name || 'Organization'}
            size="small"
            sx={{
              bgcolor: 'rgba(255,164,36,0.08)',
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        )}
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;