import React from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';
import {
  History as HistoryIcon,
  PersonAdd as EnrollIcon,
  EmojiEvents as CertificateIcon,
  MenuBook as CourseIcon,
  People as BulkIcon,
} from '@mui/icons-material';

// Activity data (will come from backend later)
const activitiesData = [
  {
    icon: <EnrollIcon />,
    iconBg: 'success.lighter',
    iconColor: 'success.main',
    text: '<strong>James Kariuki</strong> enrolled in "Advanced React Patterns"',
    time: '10 minutes ago',
  },
  {
    icon: <CertificateIcon />,
    iconBg: 'info.lighter',
    iconColor: 'info.main',
    text: '<strong>Emma Chen</strong> earned certificate in "Data Science Fundamentals"',
    time: '45 minutes ago',
  },
  {
    icon: <CourseIcon />,
    iconBg: 'warning.lighter',
    iconColor: 'warning.main',
    text: '<strong>Michael Rodriguez</strong> published new course "TypeScript Mastery"',
    time: '2 hours ago',
  },
  {
    icon: <BulkIcon />,
    iconBg: 'primary.50',
    iconColor: 'primary.dark',
    text: '<strong>Bulk enrollment</strong> completed: 45 users added to "Onboarding Program"',
    time: '3 hours ago',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Recent Activity
          </Typography>
        </Box>
        <Link href="#" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'primary.dark' }}>
          View All
        </Link>
      </Box>

      {/* Activity List */}
      <Box>
        {activitiesData.map((activity, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              gap: 1.5,
              p: 2,
              px: 3,
              borderBottom: index < activitiesData.length - 1 ? 1 : 0,
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: activity.iconBg,
                color: activity.iconColor,
                flexShrink: 0,
                fontSize: 18,
              }}
            >
              {activity.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.4, mb: 0.25 }}
                dangerouslySetInnerHTML={{ __html: activity.text }}
              />
              <Typography variant="caption" color="text.secondary">
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
