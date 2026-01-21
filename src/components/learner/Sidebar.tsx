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
} from '@mui/icons-material';

// Sidebar width constant
const DRAWER_WIDTH = 260;

// Navigation sections data (will come from backend later)
const navSections = [
  {
    title: 'Dashboard',
    items: [
      { text: 'Overview', icon: <DashboardIcon />, active: true },
      { text: 'My Courses', icon: <MenuBookIcon /> },
      { text: 'Notifications', icon: <NotificationsIcon />, badge: 3 },
    ],
  },
  {
    title: 'Learning',
    items: [
      { text: 'Continue Learning', icon: <SchoolIcon /> },
      { text: 'Browse Courses', icon: <SearchIcon /> },
      { text: 'My Schedule', icon: <DateRangeIcon /> },
      { text: 'Saved Courses', icon: <BookmarkIcon /> },
    ],
  },
  {
    title: 'Achievements',
    items: [
      { text: 'Certificates', icon: <EmojiEventsIcon /> },
      { text: 'Badges', icon: <BadgeIcon /> },
      { text: 'Progress', icon: <ProgressIcon /> },
    ],
  },
  {
    title: 'Assessments',
    items: [
      { text: 'Quizzes', icon: <QuizIcon /> },
      { text: 'Assignments', icon: <AssignmentIcon /> },
    ],
  },
];

// User data (will come from backend later)
const userData = {
  name: 'Emma Chen',
  plan: 'Pro Learner',
  initials: 'EC',
  overallProgress: 65,
};

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
        }}
      >
        <SchoolIcon sx={{ fontSize: 32, color: 'primary.dark' }} />
        <Typography variant="h6" fontWeight={700} color="text.primary">
          TASC LMS
        </Typography>
      </Box>

      {/* User Info */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            fontWeight: 600,
          }}
        >
          {userData.initials}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {userData.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 500 }}>
            {userData.plan}
          </Typography>
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
                    className={`nav-item ${item.active ? 'active' : ''}`}
                    sx={{
                      py: 1,
                      px: 3,
                      borderRadius: 0,
                      '&.active': {
                        bgcolor: 'rgba(255, 164, 36, 0.1)',
                        color: 'primary.dark',
                        borderRight: 3,
                        borderColor: 'primary.dark',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: item.active ? 'primary.dark' : 'inherit',
                      }}
                    >
                      {item.badge ? (
                        <Badge
                          badgeContent={item.badge}
                          color="primary"
                          sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem' } }}
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
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Box>

      {/* Overall Progress */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
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
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #ffb74d, #ffa424)',
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: 'primary.dark', textAlign: 'center', mt: 1 }}
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
