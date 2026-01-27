import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BoltIcon from '@mui/icons-material/Bolt';
import StarIcon from '@mui/icons-material/Star';

const logos = [
  { icon: BusinessIcon, name: 'Acme Corp' },
  { icon: PublicIcon, name: 'Global Tech' },
  { icon: RocketLaunchIcon, name: 'Innovate Inc' },
  { icon: BoltIcon, name: 'Future Dynamics' },
  { icon: StarIcon, name: 'NextGen Solutions' },
];

const TrustedBySection: React.FC = () => {
  return (
    <Box sx={{ py: 6, bgcolor: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 4 }}>
          Trusted by 500+ Organizations Worldwide
        </Typography>
        <Stack direction="row" spacing={6} justifyContent="center" alignItems="center" flexWrap="wrap" sx={{ gap: 3 }}>
          {logos.map((logo) => (
            <Stack
              key={logo.name}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ color: '#a1a1aa', fontSize: '1.25rem', fontWeight: 700, transition: 'color 0.3s', '&:hover': { color: '#52525b' } }}
            >
              <logo.icon sx={{ fontSize: '1.5rem' }} />
              <Typography sx={{ fontWeight: 700 }}>{logo.name}</Typography>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default TrustedBySection;
