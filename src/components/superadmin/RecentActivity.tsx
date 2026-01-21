import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  PersonAdd as UserAddIcon,
  CreditCard as PaymentIcon,
  MenuBook as CourseIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    text: 'New organization registered: Tech Innovators Ltd',
    time: '10 minutes ago',
    icon: <UserAddIcon sx={{ fontSize: 16 }} />,
    iconBg: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  },
  {
    id: '2',
    text: 'Payment completed for Acme Corporation ($5,280)',
    time: '45 minutes ago',
    icon: <PaymentIcon sx={{ fontSize: 16 }} />,
    iconBg: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    id: '3',
    text: 'New course published: "Advanced Data Science"',
    time: '2 hours ago',
    icon: <CourseIcon sx={{ fontSize: 16 }} />,
    iconBg: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
  {
    id: '4',
    text: 'Security audit completed - All systems secure',
    time: '5 hours ago',
    icon: <SecurityIcon sx={{ fontSize: 16 }} />,
    iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
        Recent Activity
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {activities.map((activity, index) => (
          <Box
            key={activity.id}
            sx={{
              display: 'flex',
              gap: 1.5,
              pb: index < activities.length - 1 ? 2 : 0,
              borderBottom: index < activities.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: activity.iconBg,
                flexShrink: 0,
              }}
            >
              {activity.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {activity.text}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {activity.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default RecentActivity;
