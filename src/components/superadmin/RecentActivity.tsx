import React from 'react';
import { Box, Paper, Typography, Button, Skeleton } from '@mui/material';
import {
  Notifications as NotifIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../../services/notifications.services';
import type { Notification } from '../../services/notifications.services';
import type { PaginatedResponse } from '../../types/types';

const iconColors: Record<string, string> = {
  approval: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  registration: 'linear-gradient(135deg, #10b981, #34d399)',
  system: 'linear-gradient(135deg, #a1a1aa, #71717a)',
  milestone: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
};

const getTimeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  const { data: notifRaw, isLoading } = useQuery({
    queryKey: ['superadmin', 'notifications', 'recent'],
    queryFn: () => notificationApi.getAll({ page_size: 4 }).then(r => r.data),
  });

  const notifications: Notification[] = Array.isArray(notifRaw)
    ? notifRaw
    : (notifRaw as PaginatedResponse<Notification> | undefined)?.results ?? [];

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{
        p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography fontWeight={700}>Recent Activity</Typography>
        <Button size="small" onClick={() => navigate('/superadmin/audit-logs')}
          sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
          View All
        </Button>
      </Box>

      <Box sx={{ p: 0 }}>
        {isLoading ? (
          [0, 1, 2, 3].map(i => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 2, px: 3, borderBottom: i < 3 ? 1 : 0, borderColor: 'divider' }}>
              <Skeleton variant="circular" width={30} height={30} />
              <Box sx={{ flex: 1 }}><Skeleton width="80%" /><Skeleton width="25%" /></Box>
            </Box>
          ))
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No recent activity</Typography>
          </Box>
        ) : (
          notifications.map((notif, i) => (
            <Box
              key={notif.id}
              sx={{
                display: 'flex', gap: 1.5, p: 2, px: 3,
                borderBottom: i < notifications.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              <Box sx={{
                width: 30, height: 30, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', background: iconColors[notif.type] || iconColors.system, flexShrink: 0,
              }}>
                <NotifIcon sx={{ fontSize: 14 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 400, color: 'text.primary', lineHeight: 1.4, mb: 0.25 }}>
                  {notif.title}
                </Typography>
                <Typography sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
                  {getTimeAgo(notif.created_at)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default RecentActivity;
