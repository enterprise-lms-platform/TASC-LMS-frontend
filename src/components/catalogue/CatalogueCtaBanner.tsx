import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Link } from 'react-router-dom';

const CatalogueCtaBanner: React.FC = () => {
  return (
    <Box className="catalogue-cta" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 700, color: 'white', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          Ready to Start Learning?
        </Typography>
        <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: 'rgba(255,255,255,0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}>
          Join 50,000+ learners who are advancing their careers with TASC LMS. Start your free trial today – no credit card required.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button component={Link} to="/register" variant="contained" size="large" startIcon={<RocketLaunchIcon />} sx={{ bgcolor: 'white', color: '#ffa424', fontWeight: 600, px: 4, py: 1.5, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#f4f4f5', boxShadow: 'none' } }}>
            Start Free Trial
          </Button>
          <Button component={Link} to="#pricing" variant="outlined" size="large" startIcon={<LocalOfferIcon />} sx={{ color: 'white', borderColor: 'white', borderWidth: 2, fontWeight: 600, px: 4, py: 1.5, textTransform: 'none', '&:hover': { bgcolor: 'white', color: '#ffa424', borderColor: 'white' } }}>
            View Pricing
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default CatalogueCtaBanner;
