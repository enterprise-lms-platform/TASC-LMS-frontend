import React from 'react';
import { Box, Container, Typography, Button, Chip, Stack, Grid, Paper } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';

const BusinessHero: React.FC = () => {
  return (
    <Box className="business-hero">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', lg: 'left' } }}>
              <Chip
                icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                label="Enterprise Solutions"
                sx={{
                  bgcolor: 'rgba(255, 164, 36, 0.2)',
                  color: '#ffb74d',
                  fontWeight: 600,
                  mb: 3,
                  '& .MuiChip-icon': { color: '#ffb74d' },
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1.1,
                  mb: 3,
                }}
              >
                Empower Your{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #ffb74d, #fb923c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Workforce
                </Box>{' '}
                with World-Class Learning
              </Typography>

              <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#d4d4d8', lineHeight: 1.8, mb: 4, maxWidth: { lg: 540 } }}>
                Transform your organization's learning and development with TASC LMS for Business. Upskill your team, track progress, and drive measurable results with our enterprise-grade platform.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                <Button
                  href="#demo"
                  variant="contained"
                  size="large"
                  startIcon={<CalendarMonthIcon />}
                  sx={{ bgcolor: '#ffa424', px: 4, py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#f97316' } }}
                >
                  Request a Demo
                </Button>
                <Button
                  href="#pricing"
                  variant="outlined"
                  size="large"
                  startIcon={<LocalOfferIcon />}
                  sx={{ color: 'white', borderColor: 'white', borderWidth: 2, px: 4, py: 1.5, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: 'white', color: '#ffa424' } }}
                >
                  View Pricing
                </Button>
              </Stack>

              <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ justifyContent: { xs: 'center', lg: 'flex-start' }, gap: 2 }}>
                {['No credit card required', '14-day free trial', 'Dedicated support'].map((item) => (
                  <Stack key={item} direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 18 }} />
                    <Typography sx={{ fontSize: '0.875rem', color: '#a1a1aa' }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Dashboard Visual */}
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'relative' }}>
              <Paper elevation={8} sx={{ borderRadius: 3, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #e4e4e7' }}>
                  <Typography sx={{ fontWeight: 600, color: '#27272a' }}>Team Analytics</Typography>
                  <Chip label="Live Data" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }} />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {[{ value: '156', label: 'Active Learners' }, { value: '89%', label: 'Completion Rate' }, { value: '42', label: 'Certifications' }].map((stat) => (
                    <Grid key={stat.label} size={4}>
                      <Box sx={{ bgcolor: '#fafafa', borderRadius: 2, p: 2, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181b' }}>{stat.value}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#71717a' }}>{stat.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ background: 'linear-gradient(135deg, #fff3e0, #fff8e1)', borderRadius: 2, height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', p: 2 }}>
                  {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                    <Box key={i} className="chart-bar" sx={{ height: `${h}%` }} />
                  ))}
                </Box>
              </Paper>

              {/* Floating Badges */}
              <Paper className="floating-badge" elevation={6} sx={{ position: 'absolute', top: -20, right: -30, p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUpIcon sx={{ color: '#8b5cf6' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#27272a' }}>ROI Tracking</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#71717a' }}>Measure L&D impact</Typography>
                </Box>
              </Paper>

              <Paper className="floating-badge-delay" elevation={6} sx={{ position: 'absolute', bottom: 40, left: -40, p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SecurityIcon sx={{ color: '#10b981' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#27272a' }}>SSO & Security</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#71717a' }}>Enterprise-grade</Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BusinessHero;
