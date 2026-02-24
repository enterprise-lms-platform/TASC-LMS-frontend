import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import {
  History as HistoryIcon,
  PersonAdd as EnrollIcon,
  EmojiEvents as CertificateIcon,
  MenuBook as CourseIcon,
  People as BulkIcon,
} from '@mui/icons-material';

const activitiesData = [
  { icon: <EnrollIcon />, iconBg: '#dcfce7', iconColor: '#10b981', text: '<strong>James Kariuki</strong> enrolled in "Advanced React Patterns"', time: '10 minutes ago' },
  { icon: <CertificateIcon />, iconBg: 'rgba(99,102,241,0.08)', iconColor: '#6366f1', text: '<strong>Emma Chen</strong> earned certificate in "Data Science Fundamentals"', time: '45 minutes ago' },
  { icon: <CourseIcon />, iconBg: '#fff3e0', iconColor: '#f59e0b', text: '<strong>Michael Rodriguez</strong> published new course "TypeScript Mastery"', time: '2 hours ago' },
  { icon: <BulkIcon />, iconBg: 'rgba(255,164,36,0.08)', iconColor: '#ffa424', text: '<strong>Bulk enrollment</strong> completed: 45 users added to "Onboarding Program"', time: '3 hours ago' },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const RecentActivity: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Recent Activity</Typography>
        </Box>
        <Chip label="View All" size="small" clickable
          sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: 'rgba(255,164,36,0.08)', color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' } }} />
      </Box>

      {activitiesData.map((act, i) => (
        <Box key={i} sx={{
          display: 'flex', gap: 1.5, p: 2, px: 3,
          borderBottom: i < activitiesData.length - 1 ? 1 : 0, borderColor: 'divider',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
        }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: act.iconBg, color: act.iconColor, flexShrink: 0,
            '& svg': { fontSize: 18 },
          }}>{act.icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.4, mb: 0.25 }}
              dangerouslySetInnerHTML={{ __html: act.text }} />
            <Typography variant="caption" color="text.disabled">{act.time}</Typography>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default RecentActivity;
