import React from 'react';
import { Grid, Paper, Box, Typography, Skeleton } from '@mui/material';
import { MenuBook, AccessTime, School, Star } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { enrollmentApi, certificateApi } from '../../services/learning.services';
import type { PaginatedResponse } from '../../types/types';

const QuickStats: React.FC = () => {
  const { data: enrollmentsData, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['learner', 'enrollments', 'stats'],
    queryFn: () => enrollmentApi.getAll({}).then(r => r.data),
  });

  const { data: certificatesData, isLoading: loadingCerts } = useQuery({
    queryKey: ['learner', 'certificates', 'stats'],
    queryFn: () => certificateApi.getAll().then(r => r.data),
  });

  const enrollments = (enrollmentsData as PaginatedResponse<{ progress_percentage: number; time_spent_seconds?: number }> | undefined)?.results ?? [];
  const activeCourses = enrollments.filter(e => e.progress_percentage < 100).length;
  const totalHours = Math.round(enrollments.reduce((sum, e) => sum + (e.time_spent_seconds || 0), 0) / 3600);
  const certificates = Array.isArray(certificatesData) ? certificatesData.length : (certificatesData as PaginatedResponse<unknown> | undefined)?.results?.length ?? 0;
  const avgScore = enrollments.length > 0
    ? (enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length / 20).toFixed(1)
    : '0';

  const isLoading = loadingEnrollments || loadingCerts;

  const stats = [
    {
      label: 'Active Courses',
      value: String(activeCourses),
      icon: <MenuBook />,
      bgcolor: '#dcfce7',
      iconBg: '#4ade80',
      color: '#14532d',
      subColor: '#166534',
    },
    {
      label: 'Learning Hours',
      value: String(totalHours),
      icon: <AccessTime />,
      bgcolor: '#f4f4f5',
      iconBg: '#a1a1aa',
      color: '#27272a',
      subColor: '#3f3f46',
    },
    {
      label: 'Certificates',
      value: String(certificates),
      icon: <School />,
      bgcolor: '#fff3e0',
      iconBg: '#ffa424',
      color: '#7c2d12',
      subColor: '#9a3412',
    },
    {
      label: 'Avg. Score',
      value: avgScore,
      icon: <Star />,
      bgcolor: '#f0fdf4',
      iconBg: '#86efac',
      color: '#14532d',
      subColor: '#166534',
    },
  ];

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

            {isLoading ? (
              <Skeleton variant="text" width={60} height={50} />
            ) : (
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
            )}

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
