import React from 'react';
import { Box, Paper, Typography, Button, Chip, Skeleton } from '@mui/material';
import { CalendarMonth as CalendarIcon, Add as AddIcon, Videocam as VideoIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { livestreamApi } from '../../services/livestream.services';
import type { PaginatedLivestreamResponse, LivestreamSession } from '../../services/livestream.services';

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const sessionColors = [
  { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
  { bg: '#dcfce7', color: '#10b981' },
  { bg: '#fff3e0', color: '#f59e0b' },
];

const UpcomingSessions: React.FC = () => {
  const navigate = useNavigate();

  const { data: sessionsRaw, isLoading } = useQuery({
    queryKey: ['manager', 'sessions', 'upcoming'],
    queryFn: () => livestreamApi.getAll({ status: 'scheduled', page_size: 3 }).then(r => r.data),
  });

  const sessions = (sessionsRaw as PaginatedLivestreamResponse<LivestreamSession> | undefined)?.results
    ?? (Array.isArray(sessionsRaw) ? sessionsRaw as LivestreamSession[] : []);

  const formatSchedule = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((d.getTime() - now.getTime()) / 86400000);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 0) return `Today, ${time}`;
    if (diffDays === 1) return `Tomorrow, ${time}`;
    return `${d.toLocaleDateString([], { weekday: 'long' })}, ${time}`;
  };

  return (
    <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Upcoming Sessions</Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<AddIcon />}
          onClick={() => navigate('/manager/sessions')}
          sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.75rem',
            '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
          Schedule
        </Button>
      </Box>

      {isLoading ? (
        [0, 1, 2].map(i => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3, borderBottom: i < 2 ? 1 : 0, borderColor: 'divider' }}>
            <Skeleton variant="rounded" width={40} height={40} />
            <Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="40%" /></Box>
          </Box>
        ))
      ) : sessions.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">No upcoming sessions</Typography>
        </Box>
      ) : (
        sessions.map((session, i) => {
          const colors = sessionColors[i % sessionColors.length];
          const isToday = new Date(session.start_time).toDateString() === new Date().toDateString();
          return (
            <Box key={session.id} sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3,
              borderBottom: i < sessions.length - 1 ? 1 : 0, borderColor: 'divider',
              cursor: 'pointer', transition: 'all 0.15s',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: colors.bg, color: colors.color, flexShrink: 0,
                '& svg': { fontSize: 20 },
              }}><VideoIcon /></Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600}>{session.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatSchedule(session.start_time)} · {(session as any).attendee_count ?? 0} registered
                </Typography>
              </Box>
              {isToday ? (
                <Button variant="contained" size="small"
                  onClick={() => { if (session.join_url) window.open(session.join_url, '_blank'); }}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, boxShadow: 'none', fontSize: '0.75rem',
                    bgcolor: '#ffa424', '&:hover': { bgcolor: '#f59e0b', boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                  Join
                </Button>
              ) : (
                <Chip label="View" size="small" clickable
                  onClick={() => navigate('/manager/sessions')}
                  sx={{ height: 26, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.04)', color: 'text.secondary',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424' } }} />
              )}
            </Box>
          );
        })
      )}
    </Paper>
  );
};

export default UpcomingSessions;
