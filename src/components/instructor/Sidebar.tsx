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
  Notifications as NotificationsIcon,
  MenuBook as CoursesIcon,
  AddCircle as CreateIcon,
  AccountTree as StructureIcon,
  CloudUpload as UploadIcon,
  Assignment as QuizzesIcon,
  Task as AssignmentsIcon,
  Star as GradebookIcon,
  Videocam as VideoIcon,
  CalendarMonth as CalendarIcon,
  History as RecordingsIcon,
  People as LearnersIcon,
  Chat as MessagesIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Sidebar width constant
export const DRAWER_WIDTH = 240;

// Instructor data (will come from backend later)
const instructorData = {
  name: 'Michael Rodriguez',
  role: 'Senior Instructor',
  initials: 'MR',
  avatar: '',
};

// Type for navigation items
interface NavItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  badge?: string;
  badgeColor?: 'warning' | 'error' | 'primary';
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
      { text: 'Overview', icon: <DashboardIcon />, path: '/instructor' },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/instructor/analytics' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/instructor/notifications', badge: '5', badgeColor: 'primary' },
    ],
  },
  {
    title: 'Course Management',
    items: [
      { text: 'My Courses', icon: <CoursesIcon />, path: '/instructor/courses' },
      { text: 'Create Course', icon: <CreateIcon />, path: '/instructor/course/create' },
      { text: 'Course Structure', icon: <StructureIcon />, path: '/instructor/course/1/structure' },
      { text: 'Upload Content', icon: <UploadIcon />, path: '/instructor/course/1/upload' },
    ],
  },
  {
    title: 'Assessments',
    items: [
      { text: 'Quiz Builder', icon: <QuizzesIcon />, path: '/instructor/course/1/quiz/builder' },
      { text: 'Question Bank', icon: <StructureIcon />, path: '/instructor/question-bank' },
      { text: 'Assignments', icon: <AssignmentsIcon />, path: '/instructor/assignment/create', badge: '12', badgeColor: 'error' },
      { text: 'Grading', icon: <GradebookIcon />, path: '/instructor/grading', badge: '18', badgeColor: 'error' },
      { text: 'Gradebook', icon: <GradebookIcon />, path: '/instructor/gradebook' },
    ],
  },
  {
    title: 'Live Sessions',
    items: [
      { text: 'Schedule Session', icon: <VideoIcon />, path: '/instructor/sessions/schedule' },
      { text: 'Upcoming', icon: <CalendarIcon />, path: '/instructor/sessions/upcoming' },
      { text: 'Recordings', icon: <RecordingsIcon />, path: '/instructor/sessions/recordings' },
    ],
  },
  {
    title: 'Learners',
    items: [
      { text: 'My Learners', icon: <LearnersIcon />, path: '/instructor/learners' },
      { text: 'Messages', icon: <MessagesIcon />, path: '/instructor/messages' },
      { text: 'Progress Tracking', icon: <ProgressIcon />, path: '/instructor/progress' },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path?: string) => {
    if (path) {
      navigate(path);
      if (onMobileClose) {
        onMobileClose();
      }
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/instructor')}
      >
        <SchoolIcon sx={{ fontSize: 28, color: 'primary.dark' }} />
        <Typography variant="h6" fontWeight={700} color="text.primary">
          TASC LMS
        </Typography>
      </Box>

      {/* Instructor Info */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          src={instructorData.avatar}
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          {instructorData.initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {instructorData.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.dark',
              fontWeight: 500,
            }}
          >
            {instructorData.role}
          </Typography>
        </Box>
      </Box>

      {/* Navigation Sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {navSections.map((section, sectionIndex) => (
          <Box key={section.title}>
            <List disablePadding>
              <ListItem disablePadding>
                <Box sx={{ px: 3, pt: 2, pb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
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
                        borderRadius: 0,
                        ...(active && {
                          bgcolor: 'rgba(255, 164, 36, 0.1)',
                          color: 'primary.dark',
                          borderRight: 3,
                          borderColor: 'primary.dark',
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
                          fontSize: '0.875rem',
                          fontWeight: active ? 600 : 500,
                        }}
                      />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor:
                              item.badgeColor === 'error'
                                ? 'error.main'
                                : item.badgeColor === 'warning'
                                ? 'warning.main'
                                : 'primary.dark',
                            color: 'white',
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {sectionIndex < navSections.length - 1 && <Divider sx={{ my: 1 }} />}
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

export default Sidebar;

