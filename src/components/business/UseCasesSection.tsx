import React from 'react';
import { Box, Container, Typography, Chip, Grid, Paper } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import LaptopIcon from '@mui/icons-material/Laptop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FactoryIcon from '@mui/icons-material/Factory';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const useCases = [
  { icon: LaptopIcon, title: 'Technology', subtitle: 'Upskill developers & engineers', className: 'icon-tech' },
  { icon: TrendingUpIcon, title: 'Finance & Banking', subtitle: 'Compliance & risk training', className: 'icon-finance' },
  { icon: FavoriteIcon, title: 'Healthcare', subtitle: 'Medical & safety compliance', className: 'icon-healthcare' },
  { icon: ShoppingBagIcon, title: 'Retail', subtitle: 'Customer service excellence', className: 'icon-retail' },
  { icon: FactoryIcon, title: 'Manufacturing', subtitle: 'Safety & operations training', className: 'icon-manufacturing' },
  { icon: SchoolIcon, title: 'Education', subtitle: 'Faculty development', className: 'icon-education' },
  { icon: AccountBalanceIcon, title: 'Government', subtitle: 'Public sector training', className: 'icon-government' },
  { icon: VolunteerActivismIcon, title: 'Non-Profit', subtitle: 'Volunteer & staff development', className: 'icon-nonprofit' },
];

const UseCasesSection: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 6, md: 10 } }}>
          <Chip icon={<GridViewIcon sx={{ fontSize: 16 }} />} label="Industry Solutions" sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 2, '& .MuiChip-icon': { color: '#ffa424' } }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Built for Every Industry
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b' }}>
            Whether you're a startup or enterprise, TASC LMS adapts to your industry's unique training requirements and compliance needs.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {useCases.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper className="use-case-card" elevation={0} sx={{ p: 3, textAlign: 'center', border: '1px solid #e4e4e7', borderRadius: 3, cursor: 'pointer', '&:hover': { boxShadow: 6, borderColor: '#ffcc80' } }}>
                <Box className={`use-case-icon ${item.className}`} sx={{ width: 72, height: 72, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5, color: item.className === 'icon-nonprofit' ? '#3f3f46' : 'white' }}>
                  <item.icon sx={{ fontSize: 28 }} />
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#27272a', mb: 0.5 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>{item.subtitle}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UseCasesSection;
