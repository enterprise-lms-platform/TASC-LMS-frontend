import React from 'react';
import { Box, Container, Typography, Chip, Grid, Paper, Button, Stack } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  seats: string;
  features: { text: string; included: boolean }[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'contained' | 'outlined';
}

const plans: PricingPlan[] = [
  {
    name: 'Team',
    description: 'For small teams getting started',
    price: 15,
    seats: '5-25 users • Billed annually',
    features: [
      { text: 'Access to 500+ courses', included: true },
      { text: 'Basic team management', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Certificates of completion', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom learning paths', included: false },
      { text: 'SSO integration', included: false },
      { text: 'Custom content upload', included: false },
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'outlined',
  },
  {
    name: 'Business',
    description: 'For growing organizations',
    price: 20,
    seats: '25-200 users • Billed annually',
    features: [
      { text: 'Access to all 1000+ courses', included: true },
      { text: 'Advanced team management', included: true },
      { text: 'Custom learning paths', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'SSO integration', included: true },
      { text: 'Upload custom content', included: true },
      { text: 'Priority support', included: true },
      { text: 'Dedicated CSM', included: false },
    ],
    popular: true,
    buttonText: 'Start Free Trial',
    buttonVariant: 'contained',
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 25,
    seats: '200+ users • Custom billing',
    features: [
      { text: 'Everything in Business', included: true },
      { text: 'Unlimited custom content', included: true },
      { text: 'SCIM provisioning', included: true },
      { text: 'Advanced security controls', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated CSM', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Quarterly business reviews', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'contained',
  },
];

const PricingSection: React.FC = () => {
  return (
    <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 6, md: 10 } }}>
          <Chip icon={<LocalOfferIcon sx={{ fontSize: 16 }} />} label="Simple Pricing" sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 2, '& .MuiChip-icon': { color: '#ffa424' } }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Plans That Scale with Your Team
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b' }}>
            Transparent pricing with no hidden fees. Start with a free trial and upgrade as your team grows.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
          {plans.map((plan) => (
            <Grid key={plan.name} size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={plan.popular ? 8 : 0}
                className={plan.popular ? 'pricing-card-popular' : ''}
                sx={{
                  p: 4,
                  border: plan.popular ? '2px solid #ffa424' : '2px solid #e4e4e7',
                  borderRadius: 3,
                  position: 'relative',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                }}
              >
                {plan.popular && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label="Most Popular"
                    sx={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #ffa424, #f97316)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}

                <Box sx={{ textAlign: 'center', mb: 4, pb: 4, borderBottom: '1px solid #e4e4e7' }}>
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#27272a', mb: 0.5 }}>{plan.name}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mb: 3 }}>{plan.description}</Typography>
                  <Stack direction="row" alignItems="flex-end" justifyContent="center" spacing={0.5}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#27272a', alignSelf: 'flex-start', mt: 1 }}>$</Typography>
                    <Typography sx={{ fontSize: '3rem', fontWeight: 800, color: '#18181b', lineHeight: 1 }}>{plan.price}</Typography>
                    <Typography sx={{ fontSize: '1rem', color: '#71717a', mb: 0.5 }}>/user/month</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mt: 1 }}>{plan.seats}</Typography>
                </Box>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {plan.features.map((f) => (
                    <Stack key={f.text} direction="row" alignItems="center" spacing={1.5}>
                      {f.included ? <CheckIcon sx={{ color: '#10b981', fontSize: 18 }} /> : <CloseIcon sx={{ color: '#d4d4d8', fontSize: 18 }} />}
                      <Typography sx={{ fontSize: '0.875rem', color: f.included ? '#52525b' : '#a1a1aa' }}>{f.text}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  component={Link}
                  to="#demo"
                  variant={plan.buttonVariant}
                  fullWidth
                  size="large"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    ...(plan.buttonVariant === 'contained'
                      ? { bgcolor: plan.name === 'Enterprise' ? '#18181b' : '#ffa424', color: 'white', '&:hover': { bgcolor: plan.name === 'Enterprise' ? '#27272a' : '#f97316' } }
                      : { borderColor: '#ffa424', color: '#ffa424', borderWidth: 2, '&:hover': { bgcolor: '#ffa424', color: 'white' } }),
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography sx={{ textAlign: 'center', mt: 6, fontSize: '0.875rem', color: '#71717a' }}>
          Need a custom plan?{' '}
          <Box component={Link} to="#demo" sx={{ color: '#ffa424', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
            Talk to our sales team
          </Box>{' '}
          for volume discounts and tailored solutions.
        </Typography>
      </Container>
    </Box>
  );
};

export default PricingSection;
