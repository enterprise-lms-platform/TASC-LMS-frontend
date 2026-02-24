import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
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
  { id: '1', text: 'New organization registered: Tech Innovators Ltd', time: '10 minutes ago', icon: <UserAddIcon sx={{ fontSize: 14 }} />, iconBg: 'linear-gradient(135deg, #ffb74d, #ffa424)' },
  { id: '2', text: 'Payment completed for Acme Corporation ($5,280)', time: '45 minutes ago', icon: <PaymentIcon sx={{ fontSize: 14 }} />, iconBg: 'linear-gradient(135deg, #10b981, #34d399)' },
  { id: '3', text: 'New course published: "Advanced Data Science"', time: '2 hours ago', icon: <CourseIcon sx={{ fontSize: 14 }} />, iconBg: 'linear-gradient(135deg, #a1a1aa, #71717a)' },
  { id: '4', text: 'Security audit completed - All systems secure', time: '5 hours ago', icon: <SecurityIcon sx={{ fontSize: 14 }} />, iconBg: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
];

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const RecentActivity: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{
        p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography fontWeight={700}>Recent Activity</Typography>
        <Button size="small" sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
          View All
        </Button>
      </Box>

      <Box sx={{ p: 0 }}>
        {activities.map((activity, i) => (
          <Box
            key={activity.id}
            sx={{
              display: 'flex', gap: 1.5, p: 2, px: 3,
              borderBottom: i < activities.length - 1 ? 1 : 0, borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}
          >
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', background: activity.iconBg, flexShrink: 0,
            }}>
              {activity.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 400, color: 'text.primary', lineHeight: 1.4, mb: 0.25 }}>
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
