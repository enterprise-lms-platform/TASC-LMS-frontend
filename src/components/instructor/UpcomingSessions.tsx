import React from 'react';
import { Box, Typography, Paper, Button, Skeleton } from '@mui/material';
import { Edit as EditIcon, Videocam as VideoIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { livestreamApi } from '../../services/livestream.services';
import type { PaginatedLivestreamResponse, LivestreamSession } from '../../services/livestream.services';

const UpcomingSessions: React.FC = () => {
  const navigate = useNavigate();

  const { data: sessionsRaw, isLoading } = useQuery({
    queryKey: ['instructor', 'sessions', 'upcoming'],
    queryFn: () => livestreamApi.getAll({ status: 'scheduled', page_size: 3 }).then(r => r.data),
  });

  const sessions = (sessionsRaw as PaginatedLivestreamResponse<LivestreamSession> | undefined)?.results
    ?? (Array.isArray(sessionsRaw) ? sessionsRaw as LivestreamSession[] : []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 0) return `Today, ${time}`;
    if (diffDays === 1) return `Tomorrow, ${time}`;
    return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}, ${time}`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
      }}
    >
      {/* Widget Header */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Upcoming Sessions
        </Typography>
      </Box>

      {/* Sessions List */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        {isLoading ? (
          [0, 1].map(i => <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: '0.75rem', mb: i === 0 ? 1.5 : 0 }} />)
        ) : sessions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No upcoming sessions
          </Typography>
        ) : (
          sessions.map((session, index) => (
            <Box
              key={session.id}
              sx={{
                p: 1.5,
                borderRadius: '0.75rem',
                bgcolor: 'grey.50',
                mb: index < sessions.length - 1 ? 1.5 : 0,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom>
                {formatTime(session.start_time)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {session.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => navigate('/instructor/sessions')}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: '50px',
                    borderColor: 'grey.300',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,164,36,0.04)' },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<VideoIcon />}
                  onClick={() => {
                    if (session.join_url) window.open(session.join_url, '_blank');
                  }}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    borderRadius: '50px',
                    bgcolor: 'primary.dark',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: 'primary.main', boxShadow: 'none' },
                  }}
                >
                  Join
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default UpcomingSessions;
