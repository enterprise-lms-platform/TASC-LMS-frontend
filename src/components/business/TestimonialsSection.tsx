import React from 'react';
import { Box, Container, Typography, Chip, Grid, Paper, Stack, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';

const testimonials = [
  {
    initials: 'SK',
    name: 'Sarah Kimani',
    role: 'Head of L&D',
    company: 'TechCorp International',
    avatar: '/avatars/female face (6).jpg',
    text: '"TASC LMS transformed our onboarding process. New hires are now productive 40% faster, and our training costs dropped by 60%. The analytics help us continuously improve our programs."',
  },
  {
    initials: 'JM',
    name: 'James Mwangi',
    role: 'VP of Human Resources',
    company: 'Global Finance Ltd',
    avatar: '/avatars/male face (16).jpg',
    text: '"The ability to create custom learning paths for different teams has been game-changing. Our completion rates went from 45% to 89% after switching to TASC LMS."',
  },
  {
    initials: 'AN',
    name: 'Amina Nakato',
    role: 'Chief Learning Officer',
    company: 'Innovate Solutions',
    avatar: '/avatars/female face (9).jpg',
    text: '"The enterprise security features and SSO integration made it easy to get IT approval. Now 2,000+ employees across 12 countries use TASC LMS daily. Best L&D investment we\'ve made."',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 6, md: 10 } }}>
          <Chip icon={<FavoriteIcon sx={{ fontSize: 16 }} />} label="Customer Stories" sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 2, '& .MuiChip-icon': { color: '#ffa424' } }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Trusted by Learning Leaders
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b' }}>
            See how organizations are transforming their workforce development with TASC LMS.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((t) => (
            <Grid key={t.name} size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ p: 4, border: '1px solid #e4e4e7', borderRadius: 3, position: 'relative', height: '100%' }}>
                <Typography className="testimonial-quote" sx={{ position: 'absolute', top: 24, right: 24 }}>"</Typography>
                <Stack direction="row" spacing={0.5} sx={{ color: '#f59e0b', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} sx={{ fontSize: 18 }} />
                  ))}
                </Stack>
                <Typography sx={{ color: '#52525b', lineHeight: 1.8, mb: 3, position: 'relative', zIndex: 1 }}>{t.text}</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={t.avatar}
                    sx={{
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(135deg, #ffa424, #f97316)',
                      fontWeight: 600,
                      fontSize: '1.125rem',
                    }}
                  >
                    {t.initials}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#27272a' }}>{t.name}</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: '#71717a' }}>{t.role}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#ffa424', fontWeight: 600 }}>{t.company}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
