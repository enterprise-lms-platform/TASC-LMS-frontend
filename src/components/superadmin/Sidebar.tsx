import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      { text: 'Overview', icon: <DashboardIcon />, path: '/superadmin' },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/superadmin/analytics', badge: 'New' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/superadmin/notifications', badge: '3' },
    ],
  },
  {
    title: 'User Management',
    items: [
      { text: 'All Users', icon: <UsersIcon />, path: '/superadmin/users' },
      { text: 'Add User', icon: <AddUserIcon />, path: '/superadmin/add-user' },
      { text: 'Roles & Permissions', icon: <RolesIcon />, path: '/superadmin/roles' },
      { text: 'Audit Logs', icon: <AuditIcon />, path: '/superadmin/audit-logs' },
    ],
  },
  {
    title: 'Organizations',
    items: [
      { text: 'All Organizations', icon: <OrganizationsIcon />, path: '/superadmin/organizations' },
      { text: 'Add Organization', icon: <AddOrgIcon />, path: '/superadmin/organizations/add' },
      { text: 'Partnerships', icon: <PartnershipsIcon />, path: '/superadmin/partnerships' },
    ],
  },
  {
    title: 'Learning Content',
    items: [
      { text: 'All Courses', icon: <CoursesIcon />, path: '/superadmin/courses' },
      { text: 'Instructors', icon: <InstructorsIcon />, path: '/superadmin/instructors' },
      { text: 'Certifications', icon: <CertificationsIcon />, path: '/superadmin/certifications' },
      { text: 'Assessments', icon: <AssessmentsIcon />, path: '/superadmin/assessments' },
    ],
  },
  {
    title: 'Financial',
    items: [
      { text: 'Payments', icon: <PaymentsIcon />, path: '/superadmin/payments' },
      { text: 'Revenue Reports', icon: <RevenueIcon />, path: '/superadmin/revenue' },
      { text: 'Invoices', icon: <InvoicesIcon />, path: '/superadmin/invoices' },
      { text: 'Gateway Settings', icon: <GatewayIcon />, path: '/superadmin/gateway-settings' },
    ],
  },
  {
    title: 'System',
    items: [
      { text: 'System Settings', icon: <SettingsIcon />, path: '/superadmin/settings' },
      { text: 'Integrations', icon: <IntegrationsIcon />, path: '/superadmin/integrations' },
      { text: 'Data Migration', icon: <DataMigrationIcon />, path: '/superadmin/data-migration' },
      { text: 'Security', icon: <SecurityIcon />, path: '/superadmin/security' },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path?: string) => {
    if (!path) return false;
    if (path === '/superadmin') return location.pathname === '/superadmin';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavItemClick = (path?: string) => {
    if (path) {
      navigate(path);
      onMobileClose();
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
                        color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                        bgcolor: isActive(item.path) ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                        borderRight: isActive(item.path) ? '3px solid' : 'none',
                        borderColor: 'primary.main',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          color: 'primary.main',
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
