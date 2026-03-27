import React from 'react';
import { Box, Container, Grid, Typography, Skeleton } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import { useQuery } from '@tanstack/react-query';
import { publicStatsApi } from '../../services/public.services';

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  color?: string;
}

const BusinessStatsSection: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publicStats', 'business'],
    queryFn: () => publicStatsApi.getStats(),
  });

  const stats: StatItem[] = React.useMemo(() => {
    if (!data?.data) return [];

    const { courses = 0, learners = 0, instructors = 0, certificates = 0 } = data.data;

    return [
      { icon: BusinessIcon, value: `${Math.floor(courses / 10) * 10}+`, label: 'Courses Available', color: '#ffa424' },
      { icon: GroupsIcon, value: `${Math.floor(learners / 1000) * 1000}+`, label: 'Active Learners', color: '#10b981' },
      { icon: WorkspacePremiumIcon, value: certificates > 0 ? `${certificates.toLocaleString()}` : 'N/A', label: 'Certificates Issued', color: '#8b5cf6' },
      { icon: StarIcon, value: instructors > 0 ? '4.8' : 'N/A', label: 'Platform Rating', color: '#3b82f6' },
    ];
  }, [data]);

  const fallbackStats: StatItem[] = [
    { icon: BusinessIcon, value: '500+', label: 'Enterprise Customers' },
    { icon: GroupsIcon, value: '250K+', label: 'Business Learners' },
    { icon: WorkspacePremiumIcon, value: '89%', label: 'Avg. Completion Rate' },
    { icon: StarIcon, value: '4.8', label: 'Customer Satisfaction' },
  ];

  const displayStats = error || stats.length === 0 ? fallbackStats : stats;

  return (
    <Box className="stats-section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {displayStats.map((stat, index) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                {isLoading ? (
                  <>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="text" width={80} height={40} sx={{ mx: 'auto', mb: 0.5, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Skeleton variant="text" width={100} height={20} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
                  </>
                ) : (
                  <>
                    <stat.icon sx={{ fontSize: { xs: 32, md: 40 }, mb: 2, opacity: 0.9, color: stat.color || 'inherit' }} />
                    <Typography sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.875rem', opacity: 0.9 }}>{stat.label}</Typography>
                  </>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessStatsSection;
