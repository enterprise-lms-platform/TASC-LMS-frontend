import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, Chip } from '@mui/material';
import { AccessTime, Person, ChevronRight } from '@mui/icons-material';

// Sessions data (will come from backend later)
const sessions = [
  {
    id: '1',
    title: 'React Advanced Patterns Q&A',
    time: 'Today, 2:00 PM',
    badge: 'Starts in 2h',
    instructor: 'Michael Rodriguez',
    duration: '60 mins',
  },
  {
    id: '2',
    title: 'JavaScript Workshop',
    time: 'Tomorrow, 10:00 AM',
    badge: 'Tomorrow',
    instructor: 'Sarah Johnson',
    duration: '90 mins',
  },
  {
    id: '3',
    title: 'Data Science Office Hours',
    time: 'Friday, 3:30 PM',
    badge: 'This Week',
    instructor: 'Emily Chen',
    duration: '45 mins',
  },
];

const UpcomingSessions: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Upcoming Live Sessions
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark' }}
        >
          View Calendar
        </Button>
      </Box>

      {/* Sessions List */}
      <List disablePadding>
        {sessions.map((session) => (
          <ListItem
            key={session.id}
            className="session-item"
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              p: 2,
              mb: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:last-child': { mb: 0 },
            }}
          >
            {/* Time & Badge */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {session.time}
              </Typography>
              <Chip
                label={session.badge}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 164, 36, 0.1)',
                  color: 'primary.dark',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            </Box>

            {/* Title */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {session.title}
            </Typography>

            {/* Meta */}
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Person sx={{ fontSize: 16 }} /> {session.instructor}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 16 }} /> {session.duration}
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default UpcomingSessions;
