import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, Chip, Skeleton } from '@mui/material';
import { AccessTime, Person, ChevronRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { livestreamApi } from '../../services/livestream.services';
import type { PaginatedResponse } from '../../types/types';

interface LivestreamResult {
  id: number;
  title: string;
  scheduled_at?: string;
  start_time?: string;
  duration_minutes?: number;
  instructor_name?: string;
  status?: string;
}

const formatSessionTime = (dateStr?: string): string => {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (diffDays === 0) return `Today, ${timeStr}`;
  if (diffDays === 1) return `Tomorrow, ${timeStr}`;
  if (diffDays < 7) return `${d.toLocaleDateString(undefined, { weekday: 'long' })}, ${timeStr}`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + `, ${timeStr}`;
};

const getBadge = (dateStr?: string): string => {
  if (!dateStr) return 'Upcoming';
  const d = new Date(dateStr);
  const now = new Date();
  const diffHrs = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (diffHrs < 0) return 'Live Now';
  if (diffHrs < 3) return `Starts in ${Math.round(diffHrs)}h`;
  if (diffHrs < 24) return 'Today';
  if (diffHrs < 48) return 'Tomorrow';
  return 'This Week';
};

const UpcomingSessions: React.FC = () => {
  const navigate = useNavigate();

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ['learner', 'livestreams', 'upcoming'],
    queryFn: () => livestreamApi.getAll({ status: 'scheduled', page_size: 3 }).then(r => r.data),
  });

  const sessions = (sessionsData as PaginatedResponse<LivestreamResult> | undefined)?.results ?? [];

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
          Upcoming Live Sessions
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          onClick={() => navigate('/learner/schedule')}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark', fontSize: '0.8rem' }}
        >
          View Calendar
        </Button>
      </Box>

      <List disablePadding>
        {isLoading ? (
          [0, 1, 2].map(i => (
            <ListItem key={i} sx={{ p: 2, mb: 1.5 }}>
              <Skeleton variant="rounded" width="100%" height={60} />
            </ListItem>
          ))
        ) : sessions.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No upcoming sessions</Typography>
          </Box>
        ) : (
          sessions.map((session) => (
            <ListItem
              key={session.id}
              className="session-item"
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 2,
                mb: 1.5,
                bgcolor: 'rgba(0,0,0,0.01)',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.04)',
                '&:last-child': { mb: 0 },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.82rem' }}>
                  {formatSessionTime(session.scheduled_at || session.start_time)}
                </Typography>
                <Chip
                  label={getBadge(session.scheduled_at || session.start_time)}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 164, 36, 0.08)',
                    color: 'primary.dark',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    borderRadius: '50px',
                  }}
                />
              </Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.75, fontSize: '0.88rem', lineHeight: 1.3 }}>
                {session.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, color: 'text.disabled', fontSize: '0.78rem' }}>
                {session.instructor_name && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Person sx={{ fontSize: 14 }} /> {session.instructor_name}
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 14 }} /> {session.duration_minutes || 60} mins
                </Box>
              </Box>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default UpcomingSessions;
