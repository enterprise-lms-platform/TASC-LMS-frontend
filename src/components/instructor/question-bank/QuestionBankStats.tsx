import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  Layers as TotalIcon,
  Folder as CategoryIcon,
  CheckCircle as UsedIcon,
  Star as SuccessIcon,
} from '@mui/icons-material';

interface StatCardConfig {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  bgcolor: string;
  iconBg: string;
  color: string;
  subColor: string;
}

export interface QuestionBankStatsProps {
  /** Total number of questions in the bank */
  totalQuestions?: number;
  /** Number of categories */
  categoryCount?: number;
  /** Number of questions used in quizzes (optional; card hidden when undefined) */
  usedInQuizzes?: number;
  /** Average success rate, e.g. "78%" (optional; card hidden when undefined) */
  avgSuccessRate?: string | number;
}

const QuestionBankStats: React.FC<QuestionBankStatsProps> = ({
  totalQuestions = 0,
  categoryCount = 0,
  usedInQuizzes,
  avgSuccessRate,
}) => {
  const statsData: StatCardConfig[] = [
    {
      icon: <TotalIcon />,
      value: totalQuestions,
      label: 'Total Questions',
      bgcolor: '#dcfce7',
      iconBg: '#4ade80',
      color: '#14532d',
      subColor: '#166534',
    },
    {
      icon: <CategoryIcon />,
      value: categoryCount,
      label: 'Categories',
      bgcolor: '#f4f4f5',
      iconBg: '#a1a1aa',
      color: '#27272a',
      subColor: '#3f3f46',
    },
    ...(usedInQuizzes !== undefined
      ? [
          {
            icon: <UsedIcon />,
            value: usedInQuizzes,
            label: 'Used in Quizzes',
            bgcolor: '#fff3e0',
            iconBg: '#ffa424',
            color: '#7c2d12',
            subColor: '#9a3412',
          } as StatCardConfig,
        ]
      : []),
    ...(avgSuccessRate !== undefined
      ? [
          {
            icon: <SuccessIcon />,
            value: avgSuccessRate,
            label: 'Avg. Success Rate',
            bgcolor: '#f0fdf4',
            iconBg: '#86efac',
            color: '#14532d',
            subColor: '#166534',
          } as StatCardConfig,
        ]
      : []),
  ];
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
