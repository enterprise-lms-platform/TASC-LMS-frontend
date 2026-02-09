import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShowChart as AnalyticsIcon,
  Notifications as NotificationsIcon,
  People as UsersIcon,
  PersonAdd as AddUserIcon,
  AdminPanelSettings as RolesIcon,
  Assignment as AuditIcon,
  Business as OrganizationsIcon,
  AddBusiness as AddOrgIcon,
  Handshake as PartnershipsIcon,
  MenuBook as CoursesIcon,
  School as InstructorsIcon,
  CardMembership as CertificationsIcon,
  Quiz as AssessmentsIcon,
  CreditCard as PaymentsIcon,
  PieChart as RevenueIcon,
  Receipt as InvoicesIcon,
  Settings as SettingsIcon,
  Extension as IntegrationsIcon,
  Storage as DataMigrationIcon,
  Security as SecurityIcon,
  SettingsApplications as GatewayIcon,
  School as LogoIcon,
} from '@mui/icons-material';

// Sidebar width constant
const DRAWER_WIDTH = 280;

// Type for navigation items
interface NavItem {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
  path?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation sections data
const navSections: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { text: 'Overview', icon: <DashboardIcon />, active: true, path: '/superadmin' },
      { text: 'Analytics', icon: <AnalyticsIcon />, badge: 'New' },
      { text: 'Notifications', icon: <NotificationsIcon />, badge: '3' },
    ],
  },
  {
    title: 'User Management',
    items: [
      { text: 'All Users', icon: <UsersIcon /> },
      { text: 'Add User', icon: <AddUserIcon />, path: '/superadmin/add-user' },
      { text: 'Roles & Permissions', icon: <RolesIcon /> },
      { text: 'Audit Logs', icon: <AuditIcon /> },
    ],
  },
  {
    title: 'Organizations',
    items: [
      { text: 'All Organizations', icon: <OrganizationsIcon /> },
      { text: 'Add Organization', icon: <AddOrgIcon /> },
      { text: 'Partnerships', icon: <PartnershipsIcon /> },
    ],
  },
  {
    title: 'Learning Content',
    items: [
      { text: 'All Courses', icon: <CoursesIcon /> },
      { text: 'Instructors', icon: <InstructorsIcon /> },
      { text: 'Certifications', icon: <CertificationsIcon /> },
      { text: 'Assessments', icon: <AssessmentsIcon /> },
    ],
  },
  {
    title: 'Financial',
    items: [
      { text: 'Payments', icon: <PaymentsIcon /> },
      { text: 'Revenue Reports', icon: <RevenueIcon /> },
      { text: 'Invoices', icon: <InvoicesIcon /> },
      { text: 'Gateway Settings', icon: <GatewayIcon /> },
    ],
  },
  {
    title: 'System',
    items: [
      { text: 'System Settings', icon: <SettingsIcon /> },
      { text: 'Integrations', icon: <IntegrationsIcon /> },
      { text: 'Data Migration', icon: <DataMigrationIcon /> },
      { text: 'Security', icon: <SecurityIcon /> },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();

  const handleNavItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
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
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 80,
        }}
      >
        <Box
          sx={{
            color: 'primary.main',
            fontSize: '1.5rem',
            minWidth: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogoIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}
        >
          TASC LMS
        </Typography>
      </Box>

      {/* Navigation Sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {navSections.map((section) => (
          <Box key={section.title}>
            <Box sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  pb: 1,
                  display: 'block',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  letterSpacing: '0.05em',
                  fontSize: '0.75rem',
                }}
              >
                {section.title}
              </Typography>
              <List disablePadding>
                {section.items.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavItemClick(item.path)}
                      sx={{
                        py: 1,
                        px: 3,
                        color: item.active ? 'primary.main' : 'text.secondary',
                        bgcolor: item.active ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                        borderRight: item.active ? '3px solid' : 'none',
                        borderColor: 'primary.main',
                        cursor: item.path ? 'pointer' : 'default',
                        '&:hover': {
                          bgcolor: item.path ? 'action.hover' : 'transparent',
                          color: item.path ? 'primary.main' : 'text.secondary',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: 'inherit',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}
                      />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            bgcolor: 'primary.main',
                            color: 'white',
                            '& .MuiChip-label': { px: 1 },
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
