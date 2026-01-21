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
  Chip,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShowChart as AnalyticsIcon,
  Notifications as AlertsIcon,
  CreditCard as PaymentsIcon,
  Receipt as InvoicesIcon,
  PieChart as RevenueReportsIcon,
  SwapHoriz as RefundsIcon,
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

// Sidebar width constant
const DRAWER_WIDTH = 260;

// Finance manager data
const financeUser = {
  name: 'Lisa Thompson',
  role: 'Finance Manager',
  initials: 'LT',
};

// Type for navigation items
interface NavItem {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
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
      { text: 'Overview', icon: <DashboardIcon />, active: true },
      { text: 'Analytics', icon: <AnalyticsIcon /> },
      { text: 'Alerts', icon: <AlertsIcon />, badge: '2' },
    ],
  },
  {
    title: 'Revenue',
    items: [
      { text: 'All Payments', icon: <PaymentsIcon /> },
      { text: 'Invoices', icon: <InvoicesIcon /> },
      { text: 'Revenue Reports', icon: <RevenueReportsIcon /> },
      { text: 'Refunds', icon: <RefundsIcon /> },
    ],
  },
  {
    title: 'Subscriptions',
    items: [
      { text: 'Active Subscriptions', icon: <SubscriptionsIcon /> },
      { text: 'Subscription History', icon: <HistoryIcon /> },
      { text: 'Churn Analysis', icon: <ChurnIcon /> },
      { text: 'Plans & Pricing', icon: <PricingIcon /> },
    ],
  },
  {
    title: 'Payment Gateways',
    items: [
      { text: 'M-Pesa', icon: <MpesaIcon /> },
      { text: 'MTN MoMo', icon: <MtnIcon /> },
      { text: 'Airtel Money', icon: <AirtelIcon /> },
      { text: 'Pesa Pal', icon: <PesaPalIcon /> },
    ],
  },
  {
    title: 'Reports',
    items: [
      { text: 'Export Data', icon: <ExportIcon /> },
      { text: 'Financial Statements', icon: <StatementsIcon /> },
      { text: 'Custom Reports', icon: <CustomReportsIcon /> },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
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

      {/* Finance User Info */}
      <Box
        sx={{
          p: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
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
          {financeUser.initials}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {financeUser.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
            {financeUser.role}
          </Typography>
        </Box>
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
                      sx={{
                        py: 1,
                        px: 3,
                        color: item.active ? 'primary.main' : 'text.secondary',
                        bgcolor: item.active ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                        borderRight: item.active ? '3px solid' : 'none',
                        borderColor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'action.hover',
                          color: 'primary.main',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
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

      {/* Finance Summary at Bottom */}
      <Box
        sx={{
          p: 2,
          px: 3,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
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
