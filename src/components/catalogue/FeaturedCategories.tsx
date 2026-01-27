import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BrushIcon from '@mui/icons-material/Brush';
import CampaignIcon from '@mui/icons-material/Campaign';
import CloudIcon from '@mui/icons-material/Cloud';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AppsIcon from '@mui/icons-material/Apps';

const categories = [
  { name: 'Web Development', count: '142 courses', icon: CodeIcon, className: 'category-icon-web' },
  { name: 'Data Science', count: '98 courses', icon: TimelineIcon, className: 'category-icon-data' },
  { name: 'Cybersecurity', count: '67 courses', icon: SecurityIcon, className: 'category-icon-security' },
  { name: 'Business', count: '124 courses', icon: BusinessCenterIcon, className: 'category-icon-business' },
  { name: 'Design', count: '89 courses', icon: BrushIcon, className: 'category-icon-design' },
  { name: 'Marketing', count: '76 courses', icon: CampaignIcon, className: 'category-icon-marketing' },
  { name: 'Cloud Computing', count: '54 courses', icon: CloudIcon, className: 'category-icon-cloud' },
  { name: 'Mobile Development', count: '63 courses', icon: PhoneAndroidIcon, className: 'category-icon-mobile' },
];

const FeaturedCategories: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white', borderTop: '1px solid #e4e4e7' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Chip icon={<AppsIcon sx={{ fontSize: 16 }} />} label="Browse by Category" sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 3, '& .MuiChip-icon': { color: '#ffa424' } }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Explore Top Categories
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b', maxWidth: 600, mx: 'auto' }}>
            Discover courses across a wide range of topics to help you achieve your goals.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid key={cat.name} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                className="category-card"
                elevation={0}
                sx={{ p: 3, textAlign: 'center', border: '1px solid #e4e4e7', borderRadius: 2, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Box className={`category-icon ${cat.className}`} sx={{ width: 64, height: 64, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'white' }}>
                  <cat.icon sx={{ fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#27272a', mb: 0.5 }}>{cat.name}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>{cat.count}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedCategories;
