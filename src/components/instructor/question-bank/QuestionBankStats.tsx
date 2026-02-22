import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  Layers as TotalIcon,
  Folder as CategoryIcon,
  CheckCircle as UsedIcon,
  Star as SuccessIcon,
} from '@mui/icons-material';

interface StatCard {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgcolor: string;
  iconBg: string;
  color: string;
  subColor: string;
}

// Matches learner QuickStats color themes
const statsData: StatCard[] = [
  {
    icon: <TotalIcon />,
    value: 248,
    label: 'Total Questions',
    bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534',
  },
  {
    icon: <CategoryIcon />,
    value: 8,
    label: 'Categories',
    bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46',
  },
  {
    icon: <UsedIcon />,
    value: 156,
    label: 'Used in Quizzes',
    bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412',
  },
  {
    icon: <SuccessIcon />,
    value: '78%',
    label: 'Avg. Success Rate',
    bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534',
  },
];

const QuestionBankStats: React.FC = () => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statsData.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
          <Paper
            elevation={0}
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
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
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
            <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" sx={{ color: stat.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
              {stat.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuestionBankStats;
