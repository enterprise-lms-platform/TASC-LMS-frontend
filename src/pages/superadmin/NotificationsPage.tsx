import React, { useState } from 'react';
import { Box, Paper, Typography, Chip, Grid, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton, Skeleton, Button } from '@mui/material';
import {
  PersonAdd as UserIcon, Payment as PaymentIcon, MenuBook as CourseIcon,
  Security as SecurityIcon, Settings as SystemIcon, Warning as AlertIcon,
  Circle as DotIcon, DoneAll as MarkAllIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';
import { notificationApi } from '../../services/notifications.services';
import type { Notification } from '../../services/notifications.services';

const typeIcon: Record<string, React.ReactNode> = {
  approval: <CourseIcon sx={{ color: '#ffa424' }} />,
  registration: <UserIcon sx={{ color: '#6366f1' }} />,
  system: <SystemIcon sx={{ color: '#71717a' }} />,
  milestone: <SecurityIcon sx={{ color: '#10b981' }} />,
};

const filters = ['All', 'Unread', 'System', 'Approval', 'Registration', 'Milestone'];

const typeFilterMap: Record<string, string | undefined> = {
  All: undefined,
  Unread: undefined,
  System: 'system',
  Approval: 'approval',
  Registration: 'registration',
  Milestone: 'milestone',
};

const NotificationsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const queryClient = useQueryClient();

  const { data: unreadCountData } = useQuery({
    queryKey: ['superadmin', 'notifications', 'unread-count'],
    queryFn: () => notificationApi.getUnreadCount().then(r => r.data),
  });

  const { data: allNotifsData, isLoading } = useQuery({
    queryKey: ['superadmin', 'notifications', 'all'],
    queryFn: () => notificationApi.getAll({ page_size: 50 }).then(r => r.data),
  });

  const allNotifs: Notification[] = Array.isArray(allNotifsData)
    ? allNotifsData
    : (allNotifsData as any)?.results ?? [];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();

  const todayCount = allNotifs.filter(n => new Date(n.created_at).getTime() >= todayStart).length;
  const weekCount = allNotifs.filter(n => new Date(n.created_at).getTime() >= weekStart).length;
  const unreadCount = unreadCountData?.unread_count ?? 0;

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'notifications'] });
    },
  });

  const markOneMutation = useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superadmin', 'notifications'] });
    },
  });

  const filtered = allNotifs.filter(n => {
    if (activeFilter === 'Unread') return !n.is_read;
    const typeFilter = typeFilterMap[activeFilter];
    if (typeFilter) return n.type === typeFilter;
    return true;
  });

  const statCards = [
    { label: 'Unread', value: String(unreadCount), icon: <AlertIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
    { label: 'Today', value: String(todayCount), icon: <SystemIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
    { label: 'This Week', value: String(weekCount), icon: <CourseIcon />, bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20' },
  ];

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<MarkAllIcon />}
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[0,1,2,3,4].map(i => <Skeleton key={i} height={64} sx={{ borderRadius: 2 }} />)}
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <AlertIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
            <Typography variant="body2">No notifications found</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((n, i) => (
              <React.Fragment key={n.id}>
                {i > 0 && <Divider />}
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 1,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: n.is_read ? 'transparent' : 'rgba(255,164,36,0.04)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  }}
                  secondaryAction={
                    !n.is_read && (
                      <IconButton size="small" onClick={() => markOneMutation.mutate(n.id)} title="Mark as read">
                        <DotIcon sx={{ fontSize: 10, color: '#ffa424' }} />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
                    {typeIcon[n.type] ?? <AlertIcon sx={{ color: '#9ca3af' }} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={n.is_read ? 500 : 700}>
                        {n.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">{n.description}</Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.25 }}>
                          {new Date(n.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </SuperadminLayout>
  );
};

export default NotificationsPage;
