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
        {sessionsData.map((session, index) => (
          <Box
            key={session.title}
            sx={{
              p: 1.5,
              borderRadius: '0.75rem',
              bgcolor: 'grey.50',
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
        ))}
      </Box>
    </Paper>
  );
};

export default UpcomingSessions;
