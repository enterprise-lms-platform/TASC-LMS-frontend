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
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as MembersIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Upload as UploadIcon,
  History as ActivityIcon,
  School as CoursesIcon,
  AssignmentInd as EnrollmentsIcon,
  GroupAdd as BulkEnrollIcon,
  TrendingUp as ProgressIcon,
  CardMembership as CertificatesIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  RateReview as TestimonialIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportsIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  exact?: boolean;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/org-admin', exact: true },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/org-admin/analytics' },
      { text: 'Reports', icon: <ReportsIcon />, path: '/org-admin/reports' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/org-admin/notifications' },
      { text: 'Messages', icon: <MessageIcon />, path: '/org-admin/messages' },
    ],
  },
  {
    title: 'Members',
    items: [
      { text: 'All Members', icon: <PeopleIcon />, path: '/org-admin/members', exact: true },
      { text: 'Add Member', icon: <PersonAddIcon />, path: '/org-admin/invite', exact: true },
      { text: 'Bulk Import', icon: <UploadIcon />, path: '/org-admin/import', exact: true },
      { text: 'Member Activity', icon: <ActivityIcon />, path: '/org-admin/activity' },
    ],
  },
  {
    title: 'Courses',
    items: [
      { text: 'Browse Courses', icon: <CoursesIcon />, path: '/org-admin/courses' },
    ],
  },
{
  title: 'Learning',
  items: [
    { text: 'Enrollments', icon: <EnrollmentsIcon />, path: '/org-admin/enrollments' },
    { text: 'Bulk Enroll', icon: <BulkEnrollIcon />, path: '/org-admin/bulk-enroll' },
    { text: 'Progress Tracking', icon: <ProgressIcon />, path: '/org-admin/progress' },
    { text: 'Certificates', icon: <CertificatesIcon />, path: '/org-admin/certificates' },
  ],
},
{
  title: 'Account',
  items: [
    { text: 'Leave a Testimonial', icon: <TestimonialIcon />, path: '/org-admin/testimonial' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/org-admin/settings' },
    { text: 'My Profile', icon: <ProfileIcon />, path: '/org-admin/profile' },
  ],
},
];

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const renderNavItem = (item: NavItem) => {
    const active = !item.disabled && isActive(item.path, item.exact ?? false);
    const listItem = (
      <ListItem key={item.path} disablePadding>
        <ListItemButton
          onClick={() => {
            if (!item.disabled) {
              navigate(item.path);
              onMobileClose();
            }
          }}
          disabled={item.disabled}
          sx={{
            py: 0.75,
            px: 1.5,
            borderRadius: '10px',
            position: 'relative',
            opacity: item.disabled ? 0.45 : 1,
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

    if (item.disabled) {
      return (
        <Tooltip key={item.path} title="Coming soon" placement="right">
          {listItem}
        </Tooltip>
      );
    }

    return listItem;
  };

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

      {NAV_SECTIONS.map((section) => (
        <Box key={section.title} sx={{ px: 2, pt: 2.5, pb: 0.5 }}>
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
            {section.title}
          </Typography>
          <List disablePadding sx={{ mt: 0.5 }}>
            {section.items.map(renderNavItem)}
          </List>
        </Box>
      ))}
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