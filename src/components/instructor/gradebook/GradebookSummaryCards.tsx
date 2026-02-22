import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  TrendingUp as AvgIcon,
  CheckCircle as GradedIcon,
  People as StudentsIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import { formatGrade } from '../../../utils/gradingUtils';
import type { GradingConfig } from '../../../utils/gradingUtils';

interface GradebookSummaryCardsProps {
  classAverage: number;
  gradedItemCount: number;
  totalStudents: number;
  pendingGradingCount: number;
  gradingConfig: GradingConfig;
}

const GradebookSummaryCards: React.FC<GradebookSummaryCardsProps> = ({
  classAverage,
  gradedItemCount,
  totalStudents,
  pendingGradingCount,
  gradingConfig,
}) => {
  const cards = [
    {
      label: 'Class Average',
      value: formatGrade(classAverage, gradingConfig),
      sub: `${Math.round(classAverage)}%`,
      icon: <AvgIcon />,
      // Green Theme
      bgcolor: '#dcfce7',
      iconBg: '#4ade80',
      color: '#14532d',
      subColor: '#166534',
    },
    {
      label: 'Graded Items',
      value: String(gradedItemCount),
      sub: 'total assessments',
      icon: <GradedIcon />,
      // Grey Theme
      bgcolor: '#f4f4f5',
      iconBg: '#a1a1aa',
      color: '#27272a',
      subColor: '#3f3f46',
    },
    {
      label: 'Students',
      value: String(totalStudents),
      sub: 'enrolled',
      icon: <StudentsIcon />,
      // Orange Theme
      bgcolor: '#fff3e0',
      iconBg: '#ffa424',
      color: '#7c2d12',
      subColor: '#9a3412',
    },
    {
      label: 'Needs Grading',
      value: String(pendingGradingCount),
      sub: 'submissions',
      icon: <PendingIcon />,
      // Alt Green Theme
      bgcolor: '#f0fdf4',
      iconBg: '#86efac',
      color: '#14532d',
      subColor: '#166534',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: card.bgcolor,
              borderRadius: '20px',
              p: 3,
              position: 'relative',
              height: '100%',
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'transform 0.2s',
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
                bgcolor: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                '& svg': { fontSize: 20 },
              }}
            >
              {card.icon}
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: card.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 0.5 }}>
              {card.value}
            </Typography>
            <Typography variant="body2" sx={{ color: card.subColor, fontWeight: 500, opacity: 0.8 }}>
              {card.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default GradebookSummaryCards;
