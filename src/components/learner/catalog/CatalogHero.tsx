import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

const heroStats = [
  { value: '1000+', label: 'Courses' },
  { value: '200+', label: 'Instructors' },
  { value: '50K+', label: 'Learners' },
  { value: '4.8', label: 'Avg Rating' },
];

const CatalogHero: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: 'url("/dashboard banner images/browse courses.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: { xs: 4, md: 6 },
        borderRadius: 4,
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)',
          pointerEvents: 'none',
        },
      }}
    >
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.2,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
          }}
        >
          Transform Your Career with World-Class Learning
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.125rem' },
            opacity: 0.9,
            mb: 4,
            maxWidth: 600,
          }}
        >
          Access courses from top instructors and industry leaders. Learn at your own pace with hands-on projects and certifications.
        </Typography>
        
        <Stack
          direction="row"
          spacing={{ xs: 2, md: 4 }}
          sx={{ flexWrap: 'wrap', gap: 2 }}
        >
          {heroStats.map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.875rem' },
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  opacity: 0.8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CatalogHero;
