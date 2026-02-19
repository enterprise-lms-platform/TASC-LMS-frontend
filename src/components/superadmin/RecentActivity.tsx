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
    icon: <UserAddIcon sx={{ fontSize: 13 }} />,
    iconBg: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  },
  {
    id: '2',
    text: 'Payment completed for Acme Corporation ($5,280)',
    time: '45 minutes ago',
    icon: <PaymentIcon sx={{ fontSize: 13 }} />,
    iconBg: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    id: '3',
    text: 'New course published: "Advanced Data Science"',
    time: '2 hours ago',
    icon: <CourseIcon sx={{ fontSize: 13 }} />,
    iconBg: 'linear-gradient(135deg, #a1a1aa, #71717a)',
  },
  {
    id: '4',
    text: 'Security audit completed - All systems secure',
    time: '5 hours ago',
    icon: <SecurityIcon sx={{ fontSize: 13 }} />,
    iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transition: 'box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem', mb: 2.5 }}>
        Recent Activity
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {activities.map((activity, index) => (
          <Box
            key={activity.id}
            className="sa-timeline-item"
            sx={{
              display: 'flex',
              gap: 1.5,
              pb: index < activities.length - 1 ? 2.5 : 0,
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
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
                sx={{
                  mb: 0.25,
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '0.8rem',
                  fontWeight: 400,
                  color: 'text.primary',
                }}
              >
                {activity.text}
              </Typography>
              <Typography sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
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
