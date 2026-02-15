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

const DRAWER_WIDTH = 280;

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
          minHeight: 72,
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
          sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', fontSize: '1.1rem' }}
        >
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

      {/* Navigation Sections */}
      <Box className="sa-scrollbar" sx={{ flex: 1, overflowY: 'auto', py: 0.5 }}>
        {navSections.map((section, sIdx) => (
          <Box key={section.title} sx={{ mb: sIdx < navSections.length - 1 ? 0.5 : 0 }}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                pt: 2,
                pb: 0.75,
                display: 'block',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'text.disabled',
                letterSpacing: '0.06em',
                fontSize: '0.68rem',
              }}
            >
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavItemClick(item.path)}
                      sx={{
                        py: 0.75,
                        px: 2,
                        mx: 1,
                        borderRadius: 2,
                        color: active ? 'primary.dark' : 'text.secondary',
                        bgcolor: active ? 'rgba(255, 164, 36, 0.08)' : 'transparent',
                        borderLeft: active ? '3px solid' : '3px solid transparent',
                        borderColor: active ? 'primary.main' : 'transparent',
                        boxShadow: active ? '0 0 12px rgba(255,164,36,0.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: active ? 'rgba(255, 164, 36, 0.1)' : 'rgba(0,0,0,0.03)',
                          color: 'primary.dark',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: 'inherit',
                          '& .MuiSvgIcon-root': { fontSize: 20 },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: active ? 600 : 500,
                          fontSize: '0.82rem',
                        }}
                      />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.68rem',
                            bgcolor: 'primary.main',
                            color: 'white',
                            '& .MuiChip-label': { px: 0.75 },
                          }}
                        />
                      )}
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
    <>
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
    </>
  );
};

export default Sidebar;
