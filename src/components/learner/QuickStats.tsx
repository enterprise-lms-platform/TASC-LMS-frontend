import React from 'react';
import { Grid, Paper, Box, Typography, Skeleton } from '@mui/material';
import { MenuBook, AccessTime, School, Star } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { enrollmentApi, certificateApi, sessionProgressApi } from '../../services/learning.services';
import { normalizeEnrollmentListResponse } from '../../hooks/useLearning';
import type { Certificate, PaginatedResponse, SessionProgress } from '../../types/types';

function normalizeCertificateList(data: unknown): Certificate[] {
  if (Array.isArray(data)) return data as Certificate[];
  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as PaginatedResponse<Certificate>).results)
  ) {
    return (data as PaginatedResponse<Certificate>).results;
  }
  return [];
}

function normalizeSessionProgressList(data: unknown): SessionProgress[] {
  if (Array.isArray(data)) return data as SessionProgress[];
  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as PaginatedResponse<SessionProgress>).results)
  ) {
    return (data as PaginatedResponse<SessionProgress>).results;
  }
  return [];
}

const QuickStats: React.FC = () => {
  const { data: enrollmentsData, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['learner', 'enrollments', 'stats'],
    queryFn: () => enrollmentApi.getAll({}).then(r => r.data),
  });

  const { data: certificatesData, isLoading: loadingCerts } = useQuery({
    queryKey: ['learner', 'certificates', 'stats'],
    queryFn: () => certificateApi.getAll({ page: 1, page_size: 100 }).then((r) => r.data),
  });
  const { data: sessionProgressData, isLoading: loadingProgress } = useQuery({
    queryKey: ['learner', 'session-progress', 'stats'],
    queryFn: () => sessionProgressApi.getAll().then((r) => r.data),
  });

  const enrollments = normalizeEnrollmentListResponse(enrollmentsData);
  const activeCourses = enrollments.filter(e => Number(e.progress_percentage) < 100).length;
  const certificates = normalizeCertificateList(certificatesData).length;
  const sessionProgress = normalizeSessionProgressList(sessionProgressData);
  const totalTimeSpentSeconds = sessionProgress.reduce(
    (sum, progress) => sum + Number(progress.time_spent_seconds || 0),
    0,
  );
  const learningHours = Math.round((totalTimeSpentSeconds / 3600) * 10) / 10;
  const learningHoursLabel = `${learningHours % 1 === 0 ? learningHours.toFixed(0) : learningHours.toFixed(1)}h`;
  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + Number(e.progress_percentage || 0), 0) / enrollments.length,
        )
      : 0;

  const isLoading = loadingEnrollments || loadingCerts || loadingProgress;

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
      value: learningHoursLabel,
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
      label: 'Avg. progress',
      value: `${avgProgress}%`,
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
        <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
          <Paper
            elevation={0}
            className={`stat-card ld-fade-in ld-fade-in-${index}`}
            sx={{
              bgcolor: stat.bgcolor,
              borderRadius: '20px',
              p: 3,
              position: 'relative',
              height: '100%',
              minHeight: { xs: 120, md: 160 },
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
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
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
