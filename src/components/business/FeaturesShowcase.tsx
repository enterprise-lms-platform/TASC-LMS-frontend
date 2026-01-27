import React from 'react';
import { Box, Container, Typography, Chip, Grid, Button, Stack, Paper } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PieChartIcon from '@mui/icons-material/PieChart';
import PaletteIcon from '@mui/icons-material/Palette';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/Check';

interface FeatureRowProps {
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonIcon: React.ReactNode;
  imageUrl: string;
  reverse?: boolean;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ badge, badgeIcon, title, description, features, buttonText, buttonIcon, imageUrl, reverse }) => (
  <Grid container spacing={8} alignItems="center" className={reverse ? 'feature-row-reverse' : ''} sx={{ mb: { xs: 8, md: 12 }, '&:last-child': { mb: 0 } }}>
    <Grid size={{ xs: 12, lg: 6 }}>
      <Box sx={{ maxWidth: 520, textAlign: { xs: 'center', lg: 'left' } }}>
        <Chip icon={badgeIcon as any} label={badge} sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 2, '& .MuiChip-icon': { color: '#ffa424' } }} />
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.5rem', md: '1.875rem' }, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography sx={{ color: '#52525b', lineHeight: 1.8, mb: 3 }}>{description}</Typography>
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {features.map((f) => (
            <Stack key={f} direction="row" alignItems="flex-start" spacing={1.5} sx={{ justifyContent: { xs: 'center', lg: 'flex-start' } }}>
              <CheckIcon sx={{ color: '#10b981', mt: 0.5, flexShrink: 0 }} />
              <Typography sx={{ color: '#3f3f46' }}>{f}</Typography>
            </Stack>
          ))}
        </Stack>
        <Button href="#demo" variant="contained" size="large" startIcon={buttonIcon} sx={{ bgcolor: '#ffa424', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}>
          {buttonText}
        </Button>
      </Box>
    </Grid>
    <Grid size={{ xs: 12, lg: 6 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 3, border: '1px solid #e4e4e7' }}>
        <Box component="img" src={imageUrl} alt={title} sx={{ width: '100%', borderRadius: 2, objectFit: 'cover' }} />
      </Paper>
    </Grid>
  </Grid>
);

const FeaturesShowcase: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <FeatureRow
          badge="Team Management"
          badgeIcon={<GroupsIcon sx={{ fontSize: 16 }} />}
          title="Manage Your Entire Organization with Ease"
          description="Streamline team administration with powerful management tools. Create groups, assign courses, set deadlines, and monitor progress—all from a centralized dashboard."
          features={['Bulk user import via CSV or SCIM', 'Organize teams by department, location, or custom groups', 'Automated enrollment based on role or tenure', 'Manager dashboards for team oversight']}
          buttonText="See It in Action"
          buttonIcon={<PlayCircleIcon />}
          imageUrl="https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?q=80&w=1173&auto=format&fit=crop"
        />

        <FeatureRow
          badge="Analytics & Reporting"
          badgeIcon={<PieChartIcon sx={{ fontSize: 16 }} />}
          title="Data-Driven Insights to Maximize Impact"
          description="Make informed decisions with comprehensive analytics. Track engagement, measure skill development, and demonstrate the ROI of your learning programs."
          features={['Real-time progress tracking and completion rates', 'Skill gap analysis and competency mapping', 'Custom reports with scheduled delivery', 'API access for custom BI integration']}
          buttonText="Explore Analytics"
          buttonIcon={<TrendingUpIcon />}
          imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop"
          reverse
        />

        <FeatureRow
          badge="Custom Content"
          badgeIcon={<PaletteIcon sx={{ fontSize: 16 }} />}
          title="Create & Upload Your Own Training Content"
          description="Combine our expert-led courses with your proprietary training materials. Upload videos, documents, SCORM packages, and more to create a unified learning experience."
          features={['Support for video, PDF, SCORM 1.2/2004, and HTML content', 'Built-in course authoring tools', 'White-labeling with your brand colors and logo', 'Custom certificates with your branding']}
          buttonText="Learn More"
          buttonIcon={<UploadIcon />}
          imageUrl="https://images.unsplash.com/photo-1707157281599-d155d1da5b4c?q=80&w=1170&auto=format&fit=crop"
        />
      </Container>
    </Box>
  );
};

export default FeaturesShowcase;
