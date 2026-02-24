import React from 'react';
import { Box, Paper, Typography, LinearProgress, Chip } from '@mui/material';

const userMetrics = [
  { label: 'New Signups', value: '2,450', change: '+18%', positive: true },
  { label: 'Active Users', value: '8,234', change: '+12%', positive: true },
  { label: 'Returning Users', value: '5,120', change: '+8%', positive: true },
  { label: 'Churned Users', value: '186', change: '-22%', positive: true },
];

const acquisitionChannels = [
  { channel: 'Organic Search', users: 3240, percentage: 39, color: '#10b981' },
  { channel: 'Direct', users: 2100, percentage: 25, color: '#6366f1' },
  { channel: 'Referral', users: 1450, percentage: 18, color: '#ffa424' },
  { channel: 'Social Media', users: 980, percentage: 12, color: '#f59e0b' },
  { channel: 'Paid Ads', users: 464, percentage: 6, color: '#ef4444' },
];

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  height: '100%',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const UserGrowthChart: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography fontWeight={700}>User Acquisition</Typography>
      </Box>

      {/* Key metrics */}
      <Box sx={{ p: 0 }}>
        {userMetrics.map((m, i) => (
          <Box
            key={m.label}
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              p: 1.5, px: 3,
              borderBottom: i < userMetrics.length - 1 ? 1 : 0, borderColor: 'divider',
              '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{m.label}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>{m.value}</Typography>
              <Chip label={m.change} size="small" sx={{
                height: 20, fontSize: '0.65rem', fontWeight: 600,
                bgcolor: m.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: m.positive ? '#10b981' : '#ef4444',
              }} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Channels */}
      <Box sx={{ p: 2.5, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" fontWeight={600} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
          Acquisition Channels
        </Typography>
        {acquisitionChannels.map((ch) => (
          <Box key={ch.channel} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
              <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{ch.channel}</Typography>
              <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.75rem' }}>{ch.percentage}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={ch.percentage} sx={{
              height: 5, borderRadius: 3, bgcolor: 'grey.100',
              '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: ch.color },
            }} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default UserGrowthChart;
