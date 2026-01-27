import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';

const stats = [
  { icon: BusinessIcon, value: '500+', label: 'Enterprise Customers' },
  { icon: GroupsIcon, value: '250K+', label: 'Business Learners' },
  { icon: WorkspacePremiumIcon, value: '89%', label: 'Avg. Completion Rate' },
  { icon: StarIcon, value: '4.8', label: 'Customer Satisfaction' },
];

const BusinessStatsSection: React.FC = () => {
  return (
    <Box className="stats-section" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <stat.icon sx={{ fontSize: { xs: 32, md: 40 }, mb: 2, opacity: 0.9 }} />
                <Typography sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 700, mb: 0.5 }}>{stat.value}</Typography>
                <Typography sx={{ fontSize: '0.875rem', opacity: 0.9 }}>{stat.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessStatsSection;
