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
            className={`stat-card ld-fade-in ld-fade-in-${index}`}
            sx={{
              p: 3,
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: stat.gradient,
                borderRadius: '1rem 1rem 0 0',
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: stat.gradient,
                mx: 'auto',
                mb: 2,
                '& svg': { fontSize: 24 },
              }}
            >
              {stat.icon}
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontWeight: 600, letterSpacing: '0.06em', fontSize: '0.65rem' }}
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
