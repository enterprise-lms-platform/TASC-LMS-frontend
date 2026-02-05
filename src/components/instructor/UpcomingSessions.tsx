import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Edit as EditIcon, Videocam as VideoIcon } from '@mui/icons-material';

interface Session {
  time: string;
  title: string;
}

// Sample sessions data (will come from backend later)
const sessionsData: Session[] = [
  {
    time: 'Today, 2:00 PM',
    title: 'React Advanced Patterns Q&A',
  },
  {
    time: 'Tomorrow, 10:00 AM',
    title: 'JavaScript Workshop',
  },
];

const UpcomingSessions: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Widget Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Upcoming Sessions
        </Typography>
      </Box>

      {/* Sessions List */}
      <Box sx={{ p: 2 }}>
        {sessionsData.map((session, index) => (
          <Box
            key={session.title}
            sx={{
              p: 1.5,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: index < sessionsData.length - 1 ? 1.5 : 0,
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.primary" gutterBottom>
              {session.time}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {session.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'grey.50' },
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<VideoIcon />}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' },
                }}
              >
                Join
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default UpcomingSessions;
