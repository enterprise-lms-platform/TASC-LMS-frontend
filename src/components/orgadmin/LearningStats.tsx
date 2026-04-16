import React from 'react';
import { Box, Paper, Typography, Skeleton, Divider } from '@mui/material';
import { School as EnrollmentsIcon, CheckCircle as CompletionsIcon, Assignment as SubmissionsIcon } from '@mui/icons-material';
import { useOrgActivity } from '../../hooks/useOrgAdmin';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

interface StatRowProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
  isLoading: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ icon, iconBg, iconColor, value, label, isLoading }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      py: 2,
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: iconBg,
        color: iconColor,
        flexShrink: 0,
        '& svg': { fontSize: 20 },
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      {isLoading ? (
        <Skeleton width={40} height={32} />
      ) : (
        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1 }}>
          {value.toLocaleString()}
        </Typography>
      )}
    </Box>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>
      {label}
    </Typography>
  </Box>
);

const LearningStats: React.FC = () => {
  const { data: activityData, isLoading } = useOrgActivity('30days');
  const summary = activityData?.summary;

  const stats = [
    {
      icon: <EnrollmentsIcon />,
      iconBg: 'rgba(99,102,241,0.08)',
      iconColor: '#6366f1',
      value: summary?.enrollments ?? 0,
      label: 'Enrollments',
    },
    {
      icon: <CompletionsIcon />,
      iconBg: '#dcfce7',
      iconColor: '#10b981',
      value: summary?.completions ?? 0,
      label: 'Completions',
    },
    {
      icon: <SubmissionsIcon />,
      iconBg: '#fff3e0',
      iconColor: '#f59e0b',
      value: summary?.submissions ?? 0,
      label: 'Submissions',
    },
  ];

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
      >
        <Typography fontWeight={700}>Learning This Month</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {stats.map((stat, i) => (
          <React.Fragment key={stat.label}>
            <StatRow {...stat} isLoading={isLoading} />
            {i < stats.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default LearningStats;