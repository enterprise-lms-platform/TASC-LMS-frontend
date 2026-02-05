import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';

export interface UpcomingSession {
  id: string;
  title: string;
  date: Date;
  time: string;
  platform: 'zoom' | 'teams' | 'meet';
}

interface UpcomingSessionsListProps {
  sessions: UpcomingSession[];
  onSessionClick?: (session: UpcomingSession) => void;
}

const platformColors: Record<string, { bg: string; color: string }> = {
  zoom: { bg: '#e8f4ff', color: '#2d8cff' },
  teams: { bg: '#ecedf8', color: '#6264a7' },
  meet: { bg: '#e0f2f1', color: '#00897b' },
};

const UpcomingSessionsList: React.FC<UpcomingSessionsListProps> = ({ sessions, onSessionClick }) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          Upcoming Sessions
        </Typography>
        <Chip label={sessions.length} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
      </Box>

      {/* List */}
      <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
        {sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.disabled">
              No upcoming sessions
            </Typography>
          </Box>
        ) : (
          sessions.map((session) => {
            const day = session.date.getDate();
            const month = session.date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const colors = platformColors[session.platform];

            return (
              <Box
                key={session.id}
                onClick={() => onSessionClick?.(session)}
                sx={{
                  p: 2,
                  display: 'flex',
                  gap: 1.5,
                  borderBottom: 1,
                  borderColor: 'grey.100',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:last-child': { borderBottom: 0 },
                }}
              >
                {/* Date */}
                <Box sx={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
                  <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ lineHeight: 1 }}>
                    {day}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ textTransform: 'uppercase' }}>
                    {month}
                  </Typography>
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    sx={{ mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {session.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {session.time}
                    </Typography>
                    <Chip
                      label={session.platform.toUpperCase()}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        bgcolor: colors.bg,
                        color: colors.color,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default UpcomingSessionsList;
