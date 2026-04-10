import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/org-admin', exact: true },
  { text: 'Members', icon: <PeopleIcon />, path: '/org-admin/members', exact: true },
  { text: 'Add Member', icon: <PersonAddIcon />, path: '/org-admin/invite', exact: true },
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 80,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <Box component="img" src="/TASC logo.png" alt="TASC Logo" sx={{ width: 64, height: 64, objectFit: 'contain' }} />
        <Typography variant="h6" fontWeight={700} color="#ffa424">
          TASC LMS
        </Typography>
      </Box>

      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.disabled',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.65rem',
          }}
        >
          Organization Admin
        </Typography>
      </Box>

      <List disablePadding sx={{ px: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path, item.exact);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  onMobileClose();
                }}
                sx={{
                  py: 0.75,
                  px: 1.5,
                  borderRadius: '10px',
                  position: 'relative',
                  ...(active && {
                    bgcolor: 'rgba(255, 164, 36, 0.08)',
                    color: 'primary.dark',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 4,
                      borderRadius: 4,
                      bgcolor: 'primary.main',
                      boxShadow: '0 0 8px rgba(255,164,36,0.4)',
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: active ? 'primary.dark' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: active ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  const drawerPaperStyles = {
    boxSizing: 'border-box' as const,
    width: DRAWER_WIDTH,
    bgcolor: '#fefdfb',
    borderRight: 'none',
    boxShadow: '1px 0 8px rgba(0,0,0,0.03)',
  };

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': drawerPaperStyles,
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': drawerPaperStyles,
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
