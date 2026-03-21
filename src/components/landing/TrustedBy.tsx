import React from 'react';

interface TrustedByProps {
  isMobile: boolean;
}

const TrustedBy: React.FC<TrustedByProps> = ({ isMobile }) => {
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

  return (
    <section
      className="trusted-by-section"
      style={{
        padding: '48px 0',
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        borderBottom: '1px solid #e4e4e7',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '32px',
          }}
        >
          Trusted by Leading Organizations Worldwide
        </p>

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
              className="trusted-logo"
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
      </div>
    </section>
  );
};

export default TrustedBy;
