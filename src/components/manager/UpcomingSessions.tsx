import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { CalendarMonth as CalendarIcon, Add as AddIcon, Videocam as VideoIcon } from '@mui/icons-material';

const sessionsData = [
  { title: 'React Advanced Q&A', schedule: 'Today, 2:00 PM', attendees: 45, iconBg: 'rgba(99,102,241,0.08)', iconColor: '#6366f1', isLive: true },
  { title: 'Data Science Workshop', schedule: 'Tomorrow, 10:00 AM', attendees: 62, iconBg: '#dcfce7', iconColor: '#10b981', isLive: false },
  { title: 'New Employee Orientation', schedule: 'Friday, 9:00 AM', attendees: 28, iconBg: '#fff3e0', iconColor: '#f59e0b', isLive: false },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const UpcomingSessions: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ ...cardSx, height: '100%' }}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Upcoming Sessions</Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<AddIcon />}
          sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.75rem',
            '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
          Schedule
        </Button>
      </Box>

      {sessionsData.map((session, i) => (
        <Box key={i} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3,
          borderBottom: i < sessionsData.length - 1 ? 1 : 0, borderColor: 'divider',
          cursor: 'pointer', transition: 'all 0.15s',
          '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
        }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: session.iconBg, color: session.iconColor, flexShrink: 0,
            '& svg': { fontSize: 20 },
          }}><VideoIcon /></Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600}>{session.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {session.schedule} · {session.attendees} attendees
            </Typography>
          </Box>
          {session.isLive ? (
            <Button variant="contained" size="small"
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, boxShadow: 'none', fontSize: '0.75rem',
                bgcolor: '#ffa424', '&:hover': { bgcolor: '#f59e0b', boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              Join
            </Button>
          ) : (
            <Chip label="View" size="small" clickable
              sx={{ height: 26, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.04)', color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424' } }} />
          )}
        </Box>
      ))}
    </Paper>
  );
};

export default UpcomingSessions;
