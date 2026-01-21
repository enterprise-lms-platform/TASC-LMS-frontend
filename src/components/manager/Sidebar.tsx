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
  Divider,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
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
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// Sidebar width constant
const DRAWER_WIDTH = 280;

// Manager data (will come from backend later)
const managerData = {
  name: 'Sarah Johnson',
  role: 'LMS Manager',
  initials: 'SJ',
  organization: 'Acme Corporation',
};

// Type for navigation items
interface NavItem {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
  badgeColor?: 'warning' | 'error';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation sections data (will come from backend later)
const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { text: 'Overview', icon: <DashboardIcon />, active: true },
      { text: 'Analytics', icon: <AnalyticsIcon /> },
      { text: 'Reports', icon: <ReportsIcon /> },
    ],
  },
  {
    title: 'User Management',
    items: [
      { text: 'All Users', icon: <UsersIcon />, badge: '2,450' },
      { text: 'Add / Invite Users', icon: <PersonAddIcon /> },
      { text: 'Role Assignment', icon: <RoleIcon /> },
      { text: 'Bulk Import', icon: <ImportIcon /> },
      { text: 'User Activity', icon: <ActivityIcon /> },
    ],
  },
  {
    title: 'Learning Content',
    items: [
      { text: 'All Courses', icon: <CoursesIcon /> },
      { text: 'Create Course', icon: <CreateIcon /> },
      { text: 'Categories', icon: <CategoriesIcon /> },
      { text: 'Instructors', icon: <InstructorIcon /> },
      { text: 'Pending Approval', icon: <PendingIcon />, badge: '5', badgeColor: 'warning' },
    ],
  },
  {
    title: 'Enrollments',
    items: [
      { text: 'All Enrollments', icon: <EnrollmentsIcon /> },
      { text: 'Bulk Enrollment', icon: <BulkEnrollIcon /> },
      { text: 'Progress Tracking', icon: <ProgressIcon /> },
      { text: 'Certificates', icon: <CertificatesIcon /> },
    ],
  },
  {
    title: 'Assessments',
    items: [
      { text: 'Quizzes', icon: <QuizzesIcon /> },
      { text: 'Assignments', icon: <AssignmentsIcon />, badge: '12', badgeColor: 'error' },
      { text: 'Gradebook', icon: <GradebookIcon /> },
    ],
  },
  {
    title: 'Live Sessions',
    items: [
      { text: 'Scheduled Sessions', icon: <SessionsIcon /> },
      { text: 'Recordings', icon: <RecordingsIcon /> },
      { text: 'Schedule New', icon: <ScheduleIcon /> },
    ],
  },
  {
    title: 'Settings',
    items: [
      { text: 'Organization Settings', icon: <SettingsIcon /> },
      { text: 'Notifications', icon: <NotificationsIcon />, badge: '8' },
      { text: 'Integrations', icon: <IntegrationsIcon /> },
      { text: 'Billing', icon: <BillingIcon /> },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 80,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 10,
        }}
      >
        <SchoolIcon sx={{ fontSize: 32, color: 'primary.dark' }} />
        <Typography variant="h6" fontWeight={700} color="text.primary">
          TASC LMS
        </Typography>
      </Box>

      {/* Manager Info */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #ffb74d, #f97316)',
              fontWeight: 700,
              fontSize: '1.125rem',
            }}
          >
            {managerData.initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {managerData.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'primary.dark',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {managerData.role}
            </Typography>
          </Box>
        </Box>

        {/* Organization Selector */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
            },
          }}
        >
          <BusinessIcon sx={{ fontSize: 18, color: 'primary.dark' }} />
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {managerData.organization}
          </Typography>
          <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
      </Box>

      {/* Navigation Sections */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {navSections.map((section) => (
          <Box key={section.title}>
            <List disablePadding>
              <ListItem disablePadding>
                <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
              </ListItem>
              {section.items.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    sx={{
                      py: 1,
                      px: 3,
                      borderRadius: 0,
                      ...(item.active && {
                        bgcolor: 'rgba(255, 164, 36, 0.1)',
                        color: 'primary.dark',
                        borderRight: 3,
                        borderColor: 'primary.dark',
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: item.active ? 'primary.dark' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          bgcolor: item.badgeColor === 'warning'
                            ? 'warning.main'
                            : item.badgeColor === 'error'
                            ? 'error.main'
                            : 'primary.dark',
                          color: 'white',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: 1,
            borderColor: 'divider',
          },
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
