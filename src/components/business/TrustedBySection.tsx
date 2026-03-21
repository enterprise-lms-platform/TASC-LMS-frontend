import React from 'react';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';

const companies = [
  { name: 'GIZ', logoUrl: '/partners/logos/GIZ_Deutsche_Gesellschaft.png' },
  { name: 'Irish Aid', logoUrl: '/partners/logos/Irish_Aid.png' },
  { name: 'PSFU', logoUrl: '/partners/logos/PSFU.png' },
  { name: 'SDF', logoUrl: '/partners/logos/SDF.png' },
  { name: 'Sinohydro', logoUrl: '/partners/logos/Sinhydro.png' },
  { name: 'TotalEnergies', logoUrl: '/partners/logos/TotalEnergies.png' },
  { name: 'Uganda Breweries Limited', logoUrl: '/partners/logos/the_Uganda_Breweries_Limited.png' },
  { name: 'VSO', logoUrl: '/partners/logos/the_VSO.png' },
];

const TrustedBySection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ py: 6, bgcolor: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 4 }}>
          Trusted by Top Organizations Worldwide
        </Typography>
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '24px' : '48px',
            flexWrap: 'wrap',
          }}
        >
          {companies.map((company, index) => (
            <div
              key={company.name || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60px',
                width: isMobile ? '120px' : '160px',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              }}
            >
              <img 
                src={company.logoUrl} 
                alt={company.name} 
                title={company.name}
                style={{ 
                  maxHeight: '100%', 
                  maxWidth: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default TrustedBySection;
