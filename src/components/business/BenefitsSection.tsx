import React from 'react';
import { Box, Container, Typography, Chip, Grid, Paper } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RouteIcon from '@mui/icons-material/Route';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShieldIcon from '@mui/icons-material/Shield';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ExtensionIcon from '@mui/icons-material/Extension';

const benefits = [
  { icon: MenuBookIcon, title: '1000+ Expert-Led Courses', description: 'Access our complete library of courses across technology, business, leadership, and soft skills. New content added weekly.', color: '#ffa424' },
  { icon: RouteIcon, title: 'Custom Learning Paths', description: 'Create tailored learning journeys for different roles, departments, or skill levels. Align training with business objectives.', color: '#3b82f6' },
  { icon: BarChartIcon, title: 'Advanced Analytics', description: 'Track team progress, measure skill development, and demonstrate ROI with detailed reports and dashboards.', color: '#10b981' },
  { icon: ShieldIcon, title: 'Enterprise Security', description: 'SSO integration, SCIM provisioning, and role-based access control. GDPR compliant with data encryption.', color: '#8b5cf6' },
  { icon: HeadsetMicIcon, title: 'Dedicated Support', description: 'Get a dedicated Customer Success Manager, priority support, and regular business reviews.', color: '#ef4444' },
  { icon: ExtensionIcon, title: 'Seamless Integrations', description: 'Connect with Slack, Microsoft Teams, Workday, and HRIS systems via our API and pre-built integrations.', color: '#14b8a6' },
];

const BenefitsSection: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 6, md: 10 } }}>
          <Chip icon={<StarIcon sx={{ fontSize: 16 }} />} label="Why TASC for Business" sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 2, '& .MuiChip-icon': { color: '#ffa424' } }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Everything Your Team Needs to Succeed
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b' }}>
            From onboarding to leadership development, our enterprise platform provides comprehensive learning solutions tailored to your organization's needs.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {benefits.map((benefit) => (
            <Grid key={benefit.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                className="benefit-card"
                elevation={0}
                sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3, height: '100%', '&:hover': { boxShadow: 6, borderColor: '#ffcc80' } }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${benefit.color}26, ${benefit.color}1a)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <benefit.icon sx={{ fontSize: 28, color: benefit.color }} />
                </Box>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#27272a', mb: 1.5 }}>{benefit.title}</Typography>
                <Typography sx={{ color: '#52525b', lineHeight: 1.7 }}>{benefit.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BenefitsSection;
