import React from 'react';
import { Box, Paper, Typography, Chip, Skeleton } from '@mui/material';
import {
  History as HistoryIcon,
  Notifications as NotifIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '../../services/notifications.services';
import type { Notification } from '../../services/notifications.services';
import type { PaginatedResponse } from '../../types/types';

const iconColors: Record<string, { bg: string; color: string }> = {
  approval: { bg: '#dcfce7', color: '#10b981' },
  registration: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
  system: { bg: '#fff3e0', color: '#f59e0b' },
  milestone: { bg: 'rgba(255,164,36,0.08)', color: '#ffa424' },
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
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  const { data: notifRaw, isLoading } = useQuery({
    queryKey: ['manager', 'notifications', 'recent'],
    queryFn: () => notificationApi.getAll({ page_size: 4 }).then(r => r.data),
  });

  const notifications: Notification[] = Array.isArray(notifRaw)
    ? notifRaw
    : (notifRaw as PaginatedResponse<Notification> | undefined)?.results ?? [];

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Recent Activity</Typography>
        </Box>
        <Chip label="View All" size="small" clickable
          onClick={() => navigate('/manager/reports')}
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } }} />
      </Box>

      {isLoading ? (
        [0, 1, 2, 3].map(i => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 2, px: 3, borderBottom: i < 3 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="rounded" width={36} height={36} />
            <Box sx={{ flex: 1 }}><Skeleton width="80%" /><Skeleton width="30%" /></Box>
          </Box>
        ))
      ) : notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No recent activity</Typography>
        </Box>
      ) : (
        notifications.map((notif, i) => {
          const colors = iconColors[notif.type] || iconColors.system;
          return (
            <Box key={notif.id} sx={{
              display: 'flex', gap: 1.5, p: 2, px: 3,
              borderBottom: i < notifications.length - 1 ? 1 : 0, borderColor: 'divider',
              transition: 'all 0.15s',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: colors.bg, color: colors.color, flexShrink: 0,
                '& svg': { fontSize: 18 },
              }}><NotifIcon /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.4, mb: 0.25 }}>
                  {notif.title}
                </Typography>
                <Typography variant="caption" color="text.disabled">{getTimeAgo(notif.created_at)}</Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Paper>
  );
};

export default RecentActivity;
