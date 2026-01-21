import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { CalendarMonth as CalendarIcon, Add as AddIcon, Videocam as VideoIcon } from '@mui/icons-material';

// Sessions data (will come from backend later)
const sessionsData = [
  {
    title: 'React Advanced Q&A',
    schedule: 'Today, 2:00 PM',
    attendees: 45,
    iconBg: 'info.lighter',
    iconColor: 'info.main',
    actionLabel: 'Join',
    actionVariant: 'contained' as const,
  },
  {
    title: 'Data Science Workshop',
    schedule: 'Tomorrow, 10:00 AM',
    attendees: 62,
    iconBg: 'success.lighter',
    iconColor: 'success.main',
    actionLabel: 'View',
    actionVariant: 'outlined' as const,
  },
  {
    title: 'New Employee Orientation',
    schedule: 'Friday, 9:00 AM',
    attendees: 28,
    iconBg: 'warning.lighter',
    iconColor: 'warning.main',
    actionLabel: 'View',
    actionVariant: 'outlined' as const,
  },
];

const UpcomingSessions: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', height: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Upcoming Sessions
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          sx={{ textTransform: 'none', fontWeight: 500 }}
        >
          Schedule
        </Button>
      </Box>

      {/* Sessions List */}
      <Box>
        {sessionsData.map((session, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              px: 3,
              borderBottom: index < sessionsData.length - 1 ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: session.iconBg,
                color: session.iconColor,
                flexShrink: 0,
              }}
            >
              <VideoIcon />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500}>
                {session.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {session.schedule} • {session.attendees} attendees
              </Typography>
            </Box>
            <Button
              variant={session.actionVariant}
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                ...(session.actionVariant === 'contained' && {
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' },
                }),
              }}
            >
              {session.actionLabel}
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default UpcomingSessions;
