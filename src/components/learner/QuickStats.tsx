import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { MenuBook, AccessTime, School, Star } from '@mui/icons-material';

// Stats data (will come from backend later)
const stats = [
  {
    label: 'ACTIVE COURSES',
    value: '6',
    icon: <MenuBook />,
    gradient: 'linear-gradient(135deg, #ffb74d, #ffa424)',
  },
  {
    label: 'LEARNING HOURS',
    value: '42',
    icon: <AccessTime />,
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
  },
  {
    label: 'CERTIFICATES',
    value: '3',
    icon: <School />,
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    label: 'AVG. SCORE',
    value: '4.8',
    icon: <Star />,
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
];

const QuickStats: React.FC = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Paper
            elevation={0}
            className="stat-card"
            sx={{
              p: 3,
              borderRadius: 3,
              textAlign: 'center',
              border: 1,
              borderColor: 'divider',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: stat.gradient,
                mx: 'auto',
                mb: 2,
                '& svg': { fontSize: 28 },
              }}
            >
              {stat.icon}
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, letterSpacing: '0.05em' }}
            >
              {stat.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickStats;
