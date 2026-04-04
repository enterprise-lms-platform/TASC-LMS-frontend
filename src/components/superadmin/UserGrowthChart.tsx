import React from 'react';
import { Box, Paper, Typography, LinearProgress, Chip, Skeleton, Tooltip } from '@mui/material';
import { useUserGrowthStats } from '../../hooks/useSuperadmin';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  height: '100%',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const UserGrowthChart: React.FC = () => {
  const { data, isLoading } = useUserGrowthStats();

  const metrics = data?.metrics ?? [];
  const monthlySignups = data?.monthly_signups ?? [];
  const maxCount = monthlySignups.length > 0 ? Math.max(...monthlySignups.map((m) => m.count), 1) : 1;

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>User Growth</Typography>
        <Tooltip title="Last 30 days vs previous 30 days">
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>30-day window</Typography>
        </Tooltip>
      </Box>

      {/* Metric rows */}
      <Box sx={{ p: 0 }}>
        {isLoading
          ? [0, 1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, px: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Skeleton width="40%" height={20} />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Skeleton width={40} height={20} />
                  <Skeleton width={50} height={20} sx={{ borderRadius: 2 }} />
                </Box>
              </Box>
            ))
          : metrics.map((m, i) => (
              <Box
                key={m.label}
                sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  p: 1.5, px: 3,
                  borderBottom: i < metrics.length - 1 ? 1 : 0, borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{m.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
                    {m.value.toLocaleString()}
                  </Typography>
                  <Chip
                    label={`${m.change >= 0 ? '+' : ''}${m.change}%`}
                    size="small"
                    sx={{
                      height: 20, fontSize: '0.65rem', fontWeight: 600,
                      bgcolor: m.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: m.positive ? '#10b981' : '#ef4444',
                    }}
                  />
                </Box>
              </Box>
            ))}
      </Box>

      {/* Monthly signups mini bar chart */}
      <Box sx={{ p: 2.5, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" fontWeight={600} color="text.disabled" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
          Monthly Signups (6 months)
        </Typography>
        {isLoading
          ? [0, 1, 2, 3].map((i) => <Skeleton key={i} height={10} sx={{ mb: 0.75, borderRadius: 1 }} />)
          : monthlySignups.length === 0
          ? <Typography variant="caption" color="text.disabled">No data yet</Typography>
          : monthlySignups.map((m) => (
              <Box key={m.month} sx={{ mb: 1.25, '&:last-child': { mb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                  <Typography variant="caption" fontWeight={500} sx={{ fontSize: '0.75rem' }}>{m.month}</Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.75rem' }}>{m.count}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(m.count / maxCount) * 100}
                  sx={{
                    height: 5, borderRadius: 3, bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: '#ffa424' },
                  }}
                />
              </Box>
            ))}
      </Box>
    </Paper>
  );
};

export default UserGrowthChart;
