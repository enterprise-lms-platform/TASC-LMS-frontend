import React, { useState } from 'react';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import {
  PersonAdd as UserIcon, Payment as PaymentIcon, MenuBook as CourseIcon,
  Security as SecurityIcon, Settings as SystemIcon, Warning as AlertIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

import KPICard from '../../components/superadmin/KPICard';

const statCards = [
  { label: 'Unread', value: '—', icon: <AlertIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
  { label: 'Today', value: '—', icon: <SystemIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
  { label: 'This Week', value: '—', icon: <CourseIcon />, bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20' },
];

const filters = ['All', 'Unread', 'System', 'User Activity', 'Security'];

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

        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <AlertIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
          <Typography variant="body2">Notifications feed pending backend implementation</Typography>
          <Typography variant="caption">Real-time activity notifications coming soon</Typography>
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default NotificationsPage;
