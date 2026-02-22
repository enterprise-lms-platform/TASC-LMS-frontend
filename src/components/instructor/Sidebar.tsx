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
  TrendingUp as ProgressIcon,
  Groups as WorkshopsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../utils/userHelpers';

// Sidebar width constant — matches learner sidebar
export const DRAWER_WIDTH = 260;

// Type for navigation items
interface NavItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
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
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/instructor/notifications', badge: 5, badgeColor: 'primary' },
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
      { text: 'Assignments', icon: <AssignmentsIcon />, path: '/instructor/assignment/create', badge: 12, badgeColor: 'error' },
      { text: 'Grading', icon: <GradebookIcon />, path: '/instructor/grading', badge: 18, badgeColor: 'error' },
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
    title: 'Workshops',
    items: [
      { text: 'Workshops', icon: <WorkshopsIcon />, path: '/instructor/workshops' },
    ],
  },
  {
    title: 'Learners',
    items: [
      { text: 'My Learners', icon: <LearnersIcon />, path: '/instructor/learners' },
      { text: 'Progress Tracking', icon: <ProgressIcon />, path: '/instructor/progress' },
    ],
  },
  {
    title: 'Account',
    items: [
      { text: 'Profile', icon: <ProfileIcon />, path: '/instructor/profile' },
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
  const { user } = useAuth();

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

  const userName = getUserDisplayName(user?.first_name, user?.last_name, user?.email);
  const userInitials = getUserInitials(user?.first_name, user?.last_name);

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
        onClick={() => navigate('/instructor')}
      >
        <SchoolIcon sx={{ fontSize: 32, color: 'primary.dark' }} />
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

      {/* Instructor Info */}
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
        onClick={() => navigate('/instructor/profile')}
      >
        <Avatar
          src={(user?.google_picture ?? undefined) as string | undefined}
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontWeight: 600,
            fontSize: '0.875rem',
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
          <Typography
            variant="caption"
            sx={{ color: 'primary.dark', fontWeight: 500 }}
          >
            Instructor
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
                            color={item.badgeColor === 'error' ? 'error' : 'primary'}
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
      {/* Mobile Drawer */}
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

      {/* Desktop Drawer */}
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

export default Sidebar;
