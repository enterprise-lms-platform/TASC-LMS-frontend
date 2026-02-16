import React, { useState } from 'react';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import {
  PersonAdd as UserIcon, Payment as PaymentIcon, MenuBook as CourseIcon,
  Security as SecurityIcon, Settings as SystemIcon, Warning as AlertIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

import KPICard from '../../components/superadmin/KPICard';

const statCards = [
  { 
    label: 'Unread', 
    value: '3', 
    icon: <AlertIcon />, 
    // Soft Rose Theme
    bgColor: '#fce4ec', badgeColor: '#f06292', valueColor: '#ad1457', labelColor: '#880e4f'
  },
  { 
    label: 'Today', 
    value: '12', 
    icon: <SystemIcon />, 
    // Soft Blue Theme
    bgColor: '#e3f2fd', badgeColor: '#64b5f6', valueColor: '#1565c0', labelColor: '#0d47a1'
  },
  { 
    label: 'This Week', 
    value: '47', 
    icon: <CourseIcon />, 
    // Mint Green Theme
    bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
  },
];

const filters = ['All', 'Unread', 'System', 'User Activity', 'Security'];

const notifications = [
  { id: 1, icon: <UserIcon />, bg: 'linear-gradient(135deg, #3b82f6, #60a5fa)', title: 'New user registration', desc: 'John Kamau registered via email at Acme Corporation', time: '5 minutes ago', unread: true },
  { id: 2, icon: <PaymentIcon />, bg: 'linear-gradient(135deg, #10b981, #34d399)', title: 'Payment completed', desc: 'Mary Wambui completed payment of $49.99 for Advanced React course', time: '15 minutes ago', unread: true },
  { id: 3, icon: <SecurityIcon />, bg: 'linear-gradient(135deg, #ef4444, #f87171)', title: 'Failed login attempts detected', desc: '5 failed login attempts from IP 192.168.1.45 in the last hour', time: '32 minutes ago', unread: true },
  { id: 4, icon: <CourseIcon />, bg: 'linear-gradient(135deg, #ffb74d, #ffa424)', title: 'Course published', desc: 'Peter Ochieng published "Data Science Fundamentals" course', time: '1 hour ago', unread: false },
  { id: 5, icon: <SystemIcon />, bg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', title: 'System update completed', desc: 'Platform version 2.4.1 deployed successfully', time: '2 hours ago', unread: false },
  { id: 6, icon: <UserIcon />, bg: 'linear-gradient(135deg, #3b82f6, #60a5fa)', title: 'Bulk user import', desc: 'Grace Akinyi imported 45 users via CSV to Global Tech Inc', time: '3 hours ago', unread: false },
  { id: 7, icon: <PaymentIcon />, bg: 'linear-gradient(135deg, #10b981, #34d399)', title: 'Subscription renewed', desc: 'Acme Corporation renewed Enterprise plan ($2,499/month)', time: '4 hours ago', unread: false },
  { id: 8, icon: <AlertIcon />, bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)', title: 'Storage usage warning', desc: 'Organization "Future Dynamics" at 85% storage capacity', time: '5 hours ago', unread: false },
  { id: 9, icon: <CourseIcon />, bg: 'linear-gradient(135deg, #ffb74d, #ffa424)', title: 'New course enrollment spike', desc: '"Cybersecurity Essentials" received 120 enrollments today', time: '6 hours ago', unread: false },
  { id: 10, icon: <SecurityIcon />, bg: 'linear-gradient(135deg, #ef4444, #f87171)', title: 'Certificate revoked', desc: 'Admin revoked certificate CERT-4521 for compliance reasons', time: '8 hours ago', unread: false },
];

const NotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SuperadminLayout title="Notifications" subtitle="System notifications and alerts">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((s, index) => (
          <Grid size={{ xs: 12, sm: 4 }} key={s.label}>
            <KPICard
              title={s.label}
              value={s.value}
              icon={s.icon}
              bgColor={s.bgColor}
              badgeColor={s.badgeColor}
              valueColor={s.valueColor}
              labelColor={s.labelColor}
              index={index}
            />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <Chip
              key={f}
              label={f}
              onClick={() => setActiveFilter(f)}
              sx={{
                bgcolor: activeFilter === f ? 'primary.main' : 'grey.100',
                color: activeFilter === f ? 'white' : 'text.primary',
                fontWeight: 500,
                '&:hover': { bgcolor: activeFilter === f ? 'primary.dark' : 'grey.200' },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {notifications.map((n, i) => (
            <Box
              key={n.id}
              sx={{
                display: 'flex', alignItems: 'flex-start', gap: 2, py: 2,
                borderBottom: i < notifications.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                bgcolor: n.unread ? 'rgba(255, 164, 36, 0.03)' : 'transparent',
                px: 1, borderRadius: 1,
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                {n.icon}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{n.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>{n.desc}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{n.time}</Typography>
              </Box>
              {n.unread && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: 1 }} />
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default NotificationsPage;
