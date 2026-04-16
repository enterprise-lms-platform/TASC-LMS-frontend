import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Chip, Skeleton } from '@mui/material';
import { History as HistoryIcon, School as EnrollmentIcon, CheckCircle as CompletionIcon, Assignment as SubmissionIcon } from '@mui/icons-material';
import { useOrgActivity } from '../../hooks/useOrgAdmin';
import type { ActivityEvent } from '../../services/organization.services';

const iconColors: Record<string, { bg: string; color: string }> = {
  Enrollment: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
  Completion: { bg: '#dcfce7', color: '#10b981' },
  Submission: { bg: '#fff3e0', color: '#f59e0b' },
};

const getActivityIcon = (type: ActivityEvent['type']) => {
  switch (type) {
    case 'Enrollment':
      return <EnrollmentIcon />;
    case 'Completion':
      return <CompletionIcon />;
    case 'Submission':
      return <SubmissionIcon />;
    default:
      return <HistoryIcon />;
  }
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();
  const { data: activityData, isLoading } = useOrgActivity('7days');
  const events: ActivityEvent[] = activityData?.events ?? [];

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Recent Activity</Typography>
        </Box>
        <Chip
          label="View All"
          size="small"
          clickable
          onClick={() => navigate('/org-admin/members')}
          sx={{
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: 'rgba(255,164,36,0.08)',
            color: '#ffa424',
            '&:hover': { bgcolor: 'rgba(255,164,36,0.15)' },
          }}
        />
      </Box>

      {isLoading ? (
        [0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{ display: 'flex', gap: 1.5, p: 2, px: 3, borderBottom: i < 3 ? 1 : 0, borderColor: 'divider' }}
          >
            <Skeleton variant="rounded" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="80%" />
              <Skeleton width="30%" />
            </Box>
          </Box>
        ))
      ) : events.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No recent activity
          </Typography>
        </Box>
      ) : (
        events.slice(0, 5).map((event, i) => {
          const colors = iconColors[event.type] || { bg: '#f4f4f5', color: '#a1a1aa' };
          return (
            <Box
              key={`${event.timestamp}-${i}`}
              sx={{
                display: 'flex',
                gap: 1.5,
                p: 2,
                px: 3,
                borderBottom: i < Math.min(events.length, 5) - 1 ? 1 : 0,
                borderColor: 'divider',
                transition: 'all 0.15s',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: colors.bg,
                  color: colors.color,
                  flexShrink: 0,
                  '& svg': { fontSize: 18 },
                }}
              >
                {getActivityIcon(event.type)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.4, mb: 0.25 }}>
                  {event.description}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {event.relative_time}
                </Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Paper>
  );
};

export default RecentActivity;