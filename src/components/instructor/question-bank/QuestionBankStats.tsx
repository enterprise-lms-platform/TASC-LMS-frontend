import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  Layers as TotalIcon,
  Folder as CategoryIcon,
  CheckCircle as UsedIcon,
  Star as SuccessIcon,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
} from '@mui/icons-material';

interface StatCard {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  label: string;
  change?: {
    value: string;
    trend: 'up' | 'down';
  };
}

const statsData: StatCard[] = [
  {
    icon: <TotalIcon />,
    iconBgColor: '#ccfbf1',
    iconColor: '#14b8a6',
    value: 248,
    label: 'Total Questions',
    change: { value: '12 this week', trend: 'up' },
  },
  {
    icon: <CategoryIcon />,
    iconBgColor: '#dbeafe',
    iconColor: '#3b82f6',
    value: 8,
    label: 'Categories',
  },
  {
    icon: <UsedIcon />,
    iconBgColor: '#d1fae5',
    iconColor: '#10b981',
    value: 156,
    label: 'Used in Quizzes',
    change: { value: '63% usage rate', trend: 'up' },
  },
  {
    icon: <SuccessIcon />,
    iconBgColor: '#ede9fe',
    iconColor: '#8b5cf6',
    value: '78%',
    label: 'Avg. Success Rate',
    change: { value: '2% from last month', trend: 'down' },
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
              p: 2.5,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 2,
                transform: 'translateY(-2px)',
              },
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
                bgcolor: stat.iconBgColor,
                color: stat.iconColor,
                fontSize: 24,
              }}
            >
              {stat.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
              {stat.change && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5,
                    color: stat.change.trend === 'up' ? 'success.main' : 'error.main',
                  }}
                >
                  {stat.change.trend === 'up' ? (
                    <TrendUpIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <TrendDownIcon sx={{ fontSize: 14 }} />
                  )}
                  <Typography variant="caption">{stat.change.value}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuestionBankStats;
