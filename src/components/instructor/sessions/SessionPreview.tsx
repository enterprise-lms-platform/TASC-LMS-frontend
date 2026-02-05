import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  CalendarToday as DateIcon,
  Schedule as TimeIcon,
  Videocam as PlatformIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import type { Platform } from './PlatformSelector';

interface SessionPreviewProps {
  title: string;
  date: string;
  time: string;
  duration: number;
  platform: Platform;
  attendeeCount?: number;
}

const platformNames: Record<Platform, string> = {
  zoom: 'Zoom',
  teams: 'Microsoft Teams',
  meet: 'Google Meet',
};

const platformColors: Record<Platform, string> = {
  zoom: '#2d8cff',
  teams: '#6264a7',
  meet: '#00897b',
};

const SessionPreview: React.FC<SessionPreviewProps> = ({
  title,
  date,
  time,
  duration,
  platform,
  attendeeCount = 0,
}) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not set';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'Not set';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const previewItems = [
    { icon: <DateIcon />, label: 'Date', value: formatDate(date), color: '#3b82f6', bgColor: '#dbeafe' },
    { icon: <TimeIcon />, label: 'Time & Duration', value: `${formatTime(time)} • ${formatDuration(duration)}`, color: '#8b5cf6', bgColor: '#ede9fe' },
    { icon: <PlatformIcon />, label: 'Platform', value: platformNames[platform], color: platformColors[platform], bgColor: platform === 'zoom' ? '#e8f4ff' : platform === 'teams' ? '#ecedf8' : '#e0f2f1' },
    { icon: <PeopleIcon />, label: 'Attendees', value: attendeeCount > 0 ? `${attendeeCount} enrolled` : 'All course students', color: '#10b981', bgColor: '#d1fae5' },
  ];

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
          color: 'white',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {title || 'Session Preview'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Preview your session details
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {previewItems.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              py: 1.5,
              borderBottom: index < previewItems.length - 1 ? 1 : 0,
              borderColor: 'grey.100',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: item.bgColor,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography variant="caption" color="text.disabled">
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SessionPreview;
