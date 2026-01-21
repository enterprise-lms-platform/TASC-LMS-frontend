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
        borderRadius: 3,
        height: '100%',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Recent Activity
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          sx={{ textTransform: 'none', fontWeight: 500, color: 'primary.dark' }}
        >
          See All
        </Button>
      </Box>

      {/* Activity List */}
      <List disablePadding>
        {activities.map((activity, index) => (
          <ListItem
            key={activity.id}
            className="activity-item"
            sx={{
              py: 2,
              px: 0,
              borderBottom: index < activities.length - 1 ? 1 : 0,
              borderColor: 'divider',
              '&:last-child': { pb: 0 },
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Avatar
                sx={{
                  bgcolor: activity.color,
                  borderRadius: 2,
                  width: 40,
                  height: 40,
                }}
              >
                {activity.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                  {activity.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
