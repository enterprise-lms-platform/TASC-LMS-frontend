import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, Avatar, Skeleton } from '@mui/material';
import { Notifications, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../../services/notifications.services';
import type { PaginatedResponse } from '../../types/types';

interface NotificationResult {
  id: number;
  message?: string;
  title?: string;
  created_at?: string;
  notification_type?: string;
}

const getTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const getActivityColor = (type?: string): string => {
  switch (type) {
    case 'enrollment': return '#10b981';
    case 'certificate': return '#ffa424';
    case 'grade': return '#3b82f6';
    case 'discussion': return '#8b5cf6';
    default: return '#71717a';
  }
};

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  const { data: notifData, isLoading } = useQuery({
    queryKey: ['learner', 'notifications', 'recent'],
    queryFn: () => notificationApi.getAll({ page_size: 4 }).then(r => r.data),
  });

  const notifications = (notifData as PaginatedResponse<NotificationResult> | undefined)?.results
    ?? (Array.isArray(notifData) ? notifData as NotificationResult[] : []);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '1rem',
        height: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          Recent Activity
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          onClick={() => navigate('/learner/notifications')}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark', fontSize: '0.8rem' }}
        >
          See All
        </Button>
      </Box>

      <List disablePadding>
        {isLoading ? (
          [0, 1, 2, 3].map(i => (
            <ListItem key={i} sx={{ py: 1.5, px: 0 }}>
              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="30%" />
                </Box>
              </Box>
            </ListItem>
          ))
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No recent activity</Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <ListItem
              key={notif.id}
              className="activity-item ld-timeline-item"
              sx={{ py: 1.5, px: 0 }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                <Avatar
                  sx={{
                    bgcolor: getActivityColor(notif.notification_type),
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    '& svg': { fontSize: 18 },
                  }}
                >
                  <Notifications />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25, fontSize: '0.82rem', lineHeight: 1.4 }}>
                    {notif.message || notif.title || 'Activity'}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                    {getTimeAgo(notif.created_at)}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default RecentActivity;
