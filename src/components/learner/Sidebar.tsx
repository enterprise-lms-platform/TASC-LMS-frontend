import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  Bookmark as BookmarkIcon,
  EmojiEvents as EmojiEventsIcon,
  MilitaryTech as BadgeIcon,
  TrendingUp as ProgressIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CardMembership as CardMembershipIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

// Sidebar width constant
const DRAWER_WIDTH = 260;

// Navigation sections data (will come from backend later)
const navSections = [
  {
    title: 'Dashboard',
    items: [
      { text: 'Overview', icon: <DashboardIcon />, path: '/learner' },
      { text: 'My Courses', icon: <MenuBookIcon />, path: '/learner/my-courses' },
      { text: 'Notifications', icon: <NotificationsIcon />, badge: 3, path: '/learner/notifications' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { text: 'Continue Learning', icon: <SchoolIcon />, path: '/learner/continue' },
      { text: 'Browse Courses', icon: <SearchIcon />, path: '/learner/courses' },
      { text: 'My Schedule', icon: <DateRangeIcon />, path: '/learner/schedule' },
      { text: 'Saved Courses', icon: <BookmarkIcon />, path: '/learner/saved' },
    ],
  },
  {
    title: 'Achievements',
    items: [
      { text: 'Certificates', icon: <EmojiEventsIcon />, path: '/learner/certificates' },
      { text: 'Badges', icon: <BadgeIcon />, path: '/learner/badges' },
      { text: 'Progress', icon: <ProgressIcon />, path: '/learner/progress' },
    ],
  },
  {
    title: 'Assessments',
    items: [
      { text: 'Quizzes', icon: <QuizIcon />, path: '/learner/quizzes' },
      { text: 'Assignments', icon: <AssignmentIcon />, path: '/learner/assignments' },
    ],
  },
  {
    title: 'Account',
    items: [
      { text: 'Profile', icon: <PersonIcon />, path: '/learner/profile' },
      { text: 'Subscription', icon: <CardMembershipIcon />, path: '/learner/subscription' },
      { text: 'Payment History', icon: <ReceiptIcon />, path: '/learner/payments' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/learner/settings' },
    ],
  },
];

// User data (will come from backend later)
const userData = {
  name: 'Emma Chen',
  plan: 'Pro Learner',
  initials: 'EC',
  avatar: '/avatars/female face (1).jpg',
  overallProgress: 65,
};

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const userName = user?.name || `${user?.first_name} ${user?.last_name}` || 'Emma Chen';
  const userInitials = (user?.first_name && user?.last_name) ? `${user.first_name[0]}${user.last_name[0]}` : 'EC';

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
        }}
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

      {/* User Info */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
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
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {userName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 500 }}>
             Pro Learner
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
                const isActive = location.pathname === item.path;
                return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavClick(item.path)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    sx={{
                      py: 0.75,
                      px: 3,
                      mx: 1.5,
                      borderRadius: '10px',
                      position: 'relative',
                      ...(isActive && {
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
                        color: isActive ? 'primary.dark' : 'text.secondary',
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
                        fontWeight: isActive ? 600 : 500,
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

      {/* Overall Progress */}
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
          Overall Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={userData.overallProgress}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(0,0,0,0.06)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #ffb74d, #ffa424)',
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: 'primary.dark', textAlign: 'center', mt: 1, fontSize: '0.85rem' }}
        >
          {userData.overallProgress}%
        </Typography>
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
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            bgcolor: '#fefdfb',
            borderRight: 'none',
          },
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
            bgcolor: '#fefdfb',
            borderRight: 'none',
            boxShadow: '1px 0 8px rgba(0,0,0,0.03)',
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
