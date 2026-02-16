import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import { MenuBook, AccessTime, School, Star } from '@mui/icons-material';

// Stats data
const stats = [
  {
    label: 'Active Courses',
    value: '6',
    icon: <MenuBook />,
    // Mint Green Theme
    bgcolor: '#dcfce7',
    iconBg: '#86efac',
    color: '#14532d',
    subColor: '#166534',
  },
  {
    label: 'Learning Hours',
    value: '42',
    icon: <AccessTime />,
    // Light Blue Theme
    bgcolor: '#dbeafe',
    iconBg: '#93c5fd',
    color: '#1e3a8a',
    subColor: '#1e40af',
  },
  {
    label: 'Certificates',
    value: '3',
    icon: <School />,
    // Warm Peach Theme
    bgcolor: '#ffedd5',
    iconBg: '#fdba74',
    color: '#7c2d12',
    subColor: '#9a3412',
  },
  {
    label: 'Avg. Score',
    value: '4.8',
    icon: <Star />,
    // Dusty Lavender Theme
    bgcolor: '#f3e8ff',
    iconBg: '#d8b4fe',
    color: '#581c87',
    subColor: '#6b21a8',
  },
];

const QuickStats: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Paper
            elevation={0}
            className={`stat-card ld-fade-in ld-fade-in-${index}`}
            sx={{
              bgcolor: stat.bgcolor,
              borderRadius: '20px',
              p: 3,
              position: 'relative',
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            {/* Icon Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: stat.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                '& svg': { fontSize: 20 },
              }}
            >
              {stat.icon}
            </Box>

            {/* Main Stat */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: stat.color,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1,
                mb: 1,
              }}
            >
              {stat.value}
            </Typography>

            {/* Label */}
            <Typography
              variant="body2"
              sx={{
                color: stat.subColor,
                fontWeight: 500,
                fontSize: '0.875rem',
                opacity: 0.8,
              }}
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
