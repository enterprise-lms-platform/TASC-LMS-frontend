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
  Dashboard as DashboardIcon,
  ShowChart as AnalyticsIcon,
  Notifications as AlertsIcon,
  CreditCard as PaymentsIcon,
  Receipt as InvoicesIcon,
  PieChart as RevenueReportsIcon,
  Sync as SubscriptionsIcon,
  History as HistoryIcon,
  BarChart as ChurnIcon,
  LocalOffer as PricingIcon,
  PhoneAndroid as MpesaIcon,
  SimCard as MtnIcon,
  Wifi as AirtelIcon,
  Payment as PesaPalIcon,
  TableChart as ExportIcon,
  PictureAsPdf as StatementsIcon,
  Assessment as CustomReportsIcon,
  School as LogoIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../utils/userHelpers';

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
      { text: 'Overview', icon: <DashboardIcon />, path: '/finance' },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/finance/analytics' },
      { text: 'Alerts', icon: <AlertsIcon />, path: '/finance/alerts', badge: 2 },
    ],
  },
  {
    title: 'Revenue',
    items: [
      { text: 'All Payments', icon: <PaymentsIcon />, path: '/finance/payments' },
      { text: 'Invoices', icon: <InvoicesIcon />, path: '/finance/invoices' },
      { text: 'Revenue Reports', icon: <RevenueReportsIcon />, path: '/finance/revenue-reports' },
    ],
  },
  {
    title: 'Subscriptions',
    items: [
      { text: 'Active Subscriptions', icon: <SubscriptionsIcon />, path: '/finance/subscriptions' },
      { text: 'Subscription History', icon: <HistoryIcon />, path: '/finance/subscription-history' },
      { text: 'Churn Analysis', icon: <ChurnIcon />, path: '/finance/churn' },
      { text: 'Plans & Pricing', icon: <PricingIcon />, path: '/finance/pricing' },
    ],
  },
  {
    title: 'Payment Gateways',
    items: [
      { text: 'M-Pesa', icon: <MpesaIcon />, path: '/finance/gateway/mpesa' },
      { text: 'MTN MoMo', icon: <MtnIcon />, path: '/finance/gateway/mtn' },
      { text: 'Airtel Money', icon: <AirtelIcon />, path: '/finance/gateway/airtel' },
      { text: 'Pesa Pal', icon: <PesaPalIcon />, path: '/finance/gateway/pesapal' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { text: 'Export Data', icon: <ExportIcon />, path: '/finance/export' },
      { text: 'Financial Statements', icon: <StatementsIcon />, path: '/finance/statements' },
      { text: 'Custom Reports', icon: <CustomReportsIcon />, path: '/finance/custom-reports' },
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
  const { user } = useAuth();
  const userName = getUserDisplayName(user?.first_name, user?.last_name, user?.email);
  const userInitials = getUserInitials(user?.first_name, user?.last_name);

  const handleNavClick = (path?: string) => {
    if (path) {
      navigate(path);
      onMobileClose();
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    // Exact match for /finance (overview), startsWith for sub-routes
    if (path === '/finance') return location.pathname === '/finance';
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
        onClick={() => navigate('/finance')}
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

      {/* Finance User Info */}
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
        onClick={() => navigate('/finance/profile')}
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
            Finance Manager
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

      {/* Today's Revenue at Bottom */}
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
          Today's Revenue
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'success.main', textAlign: 'center' }}
        >
          $8,425
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
