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
  Avatar,
  Badge,
} from '@mui/material';
import {
  School as LogoIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Description as ReportsIcon,
  People as UsersIcon,
  PersonAdd as PersonAddIcon,
  Badge as RoleIcon,
  FileUpload as ImportIcon,
  History as ActivityIcon,
  MenuBook as CoursesIcon,
  AddCircle as CreateIcon,
  Layers as CategoriesIcon,
  Person as InstructorIcon,
  Schedule as PendingIcon,
  School as EnrollmentsIcon,
  GroupWork as BulkEnrollIcon,
  BarChart as ProgressIcon,
  EmojiEvents as CertificatesIcon,
  Assignment as QuizzesIcon,
  Task as AssignmentsIcon,
  Star as GradebookIcon,
  Videocam as SessionsIcon,
  VideoLibrary as RecordingsIcon,
  CalendarMonth as ScheduleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Extension as IntegrationsIcon,
  CreditCard as BillingIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials, getRoleDisplayName } from '../../utils/userHelpers';

// Sidebar width constant
const DRAWER_WIDTH = 260;

// Type for navigation items
interface NavItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation sections data with routes
const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { text: 'Overview', icon: <DashboardIcon />, path: '/manager' },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/manager/analytics' },
      { text: 'Reports', icon: <ReportsIcon />, path: '/manager/reports' },
    ],
  },
  {
    title: 'User Management',
    items: [
      { text: 'All Users', icon: <UsersIcon />, path: '/manager/users' },
      { text: 'Add / Invite Users', icon: <PersonAddIcon />, path: '/manager/invite' },
      { text: 'Role Assignment', icon: <RoleIcon />, path: '/manager/roles' },
      { text: 'Bulk Import', icon: <ImportIcon />, path: '/manager/import' },
      { text: 'User Activity', icon: <ActivityIcon />, path: '/manager/activity' },
    ],
  },
  {
    title: 'Learning Content',
    items: [
      { text: 'All Courses', icon: <CoursesIcon />, path: '/manager/courses' },
      { text: 'Create Course', icon: <CreateIcon />, path: '/manager/create-course' },
      { text: 'Categories', icon: <CategoriesIcon />, path: '/manager/categories' },
      { text: 'Instructors', icon: <InstructorIcon />, path: '/manager/instructors' },
      { text: 'Pending Approval', icon: <PendingIcon />, path: '/manager/pending', badge: 5 },
    ],
  },
  {
    title: 'Enrollments',
    items: [
      { text: 'All Enrollments', icon: <EnrollmentsIcon />, path: '/manager/enrollments' },
      { text: 'Bulk Enrollment', icon: <BulkEnrollIcon />, path: '/manager/bulk-enroll' },
      { text: 'Progress Tracking', icon: <ProgressIcon />, path: '/manager/progress' },
      { text: 'Certificates', icon: <CertificatesIcon />, path: '/manager/certificates' },
    ],
  },
  {
    title: 'Assessments',
    items: [
      { text: 'Quizzes', icon: <QuizzesIcon />, path: '/manager/quizzes' },
      { text: 'Assignments', icon: <AssignmentsIcon />, path: '/manager/assignments', badge: 12 },
      { text: 'Gradebook', icon: <GradebookIcon />, path: '/manager/gradebook' },
    ],
  },
  {
    title: 'Live Sessions',
    items: [
      { text: 'Scheduled Sessions', icon: <SessionsIcon />, path: '/manager/sessions' },
      { text: 'Recordings', icon: <RecordingsIcon />, path: '/manager/recordings' },
      { text: 'Schedule New', icon: <ScheduleIcon />, path: '/manager/schedule-new' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { text: 'Organization Settings', icon: <SettingsIcon />, path: '/manager/settings' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/manager/notifications', badge: 8 },
      { text: 'Integrations', icon: <IntegrationsIcon />, path: '/manager/integrations' },
      { text: 'Billing', icon: <BillingIcon />, path: '/manager/billing' },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userName = getUserDisplayName(user?.first_name, user?.last_name, user?.email);
  const userInitials = getUserInitials(user?.first_name, user?.last_name);
  const userRole = user?.role ? getRoleDisplayName(user.role) : 'LMS Manager';

  const handleNavClick = (path?: string) => {
    if (path) {
      navigate(path);
      onMobileClose();
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/manager') return location.pathname === '/manager';
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 80,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/manager')}
      >
        <LogoIcon sx={{ fontSize: 32, color: 'primary.dark' }} />
        <Typography variant="h6" fontWeight={700} color="text.primary">
          TASC LMS
        </Typography>
      </Box>

      {/* Gradient fade separator */}
      <Box
        sx={{
          height: 16,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.04), transparent)',
          mx: 2,
        }}
      />

      {/* Manager User Info */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(255, 164, 36, 0.05)' },
          transition: 'background 0.15s',
        }}
        onClick={() => navigate('/manager/profile')}
      >
        <Avatar
          src={(user?.google_picture ?? undefined) as string | undefined}
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontWeight: 600,
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        >
          {userInitials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 500 }}>
            {userRole}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Sections */}
      <Box className="ld-scrollbar" sx={{ flex: 1, overflowY: 'auto', py: 0.5 }}>
        {navSections.map((section) => (
          <Box key={section.title}>
            <List disablePadding>
              <ListItem disablePadding>
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
                    {section.title}
                  </Typography>
                </Box>
              </ListItem>
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavClick(item.path)}
                      sx={{
                        py: 0.75,
                        px: 3,
                        mx: 1.5,
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
                          '& svg': { fontSize: 20 },
                        }}
                      >
                        {item.badge ? (
                          <Badge
                            badgeContent={item.badge}
                            color="primary"
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                          >
                            {item.icon}
                          </Badge>
                        ) : (
                          item.icon
                        )}
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
        ))}
      </Box>

      {/* Org Info at Bottom */}
      <Box
        sx={{
          p: 2.5,
          mx: 1.5,
          mb: 1.5,
          borderRadius: '12px',
          bgcolor: 'rgba(255,164,36,0.04)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.disabled',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.65rem',
            display: 'block',
            mb: 1,
          }}
        >
          Organization
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'center' }}
        >
          Acme Corporation
        </Typography>
      </Box>
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
    <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': drawerPaperStyles,
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
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
