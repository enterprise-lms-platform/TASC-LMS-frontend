import React from 'react';

interface TrustedByProps {
  isMobile: boolean;
}

const TrustedBy: React.FC<TrustedByProps> = ({ isMobile }) => {
  const companies = [
    { icon: 'building', name: 'Acme Corp' },
    { icon: 'globe', name: 'Global Tech' },
    { icon: 'rocket', name: 'Innovate' },
    { icon: 'bolt', name: 'Future Dynamics' },
    { icon: 'star', name: 'NextGen' },
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
              key={index}
              className="trusted-logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a1a1aa',
                fontSize: '1.25rem',
                fontWeight: 700,
                transition: 'color 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.color = '#52525b';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.color = '#a1a1aa';
              }}
            >
              <i className={`fas fa-${company.icon}`} style={{ fontSize: '1.5rem' }} />
              <span>{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
