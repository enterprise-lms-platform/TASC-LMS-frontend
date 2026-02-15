import React from 'react';
import { Paper, Box, Typography, Button, List, ListItem, Avatar } from '@mui/material';
import { PlayCircle, School, Comment, Star, ChevronRight } from '@mui/icons-material';

// Activity data (will come from backend later)
const activities = [
  {
    id: '1',
    text: 'Completed lesson "State Management in React"',
    time: '2 hours ago',
    icon: <PlayCircle />,
    color: '#ffa424',
  },
  {
    id: '2',
    text: 'Earned certificate: JavaScript Fundamentals',
    time: '1 day ago',
    icon: <School />,
    color: '#10b981',
  },
  {
    id: '3',
    text: 'Posted question in "React Patterns" discussion',
    time: '2 days ago',
    icon: <Comment />,
    color: '#3b82f6',
  },
  {
    id: '4',
    text: 'Received 5-star rating on assignment',
    time: '3 days ago',
    icon: <Star />,
    color: '#f59e0b',
  },
];

const RecentActivity: React.FC = () => {
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
          Recent Activity
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark', fontSize: '0.8rem' }}
        >
          See All
        </Button>
      </Box>

      {/* Activity List with timeline */}
      <List disablePadding>
        {activities.map((activity) => (
          <ListItem
            key={activity.id}
            className="activity-item ld-timeline-item"
            sx={{
              py: 1.5,
              px: 0,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
              <Avatar
                sx={{
                  bgcolor: activity.color,
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  '& svg': { fontSize: 18 },
                }}
              >
                {activity.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.25, fontSize: '0.82rem', lineHeight: 1.4 }}>
                  {activity.text}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentActivity;
