import React from 'react';

interface TrustedByProps {
  isMobile: boolean;
}

const TrustedBy: React.FC<TrustedByProps> = ({ isMobile }) => {
  const companies = ['Acme Corp', 'Global Tech', 'Innovation Labs', 'Future Systems', 'Tech Solutions', 'Digital Ventures'];

  return (
    <section
      className="trusted-by-section"
      style={{
        paddingTop: '64px',
        paddingBottom: '64px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ffa424',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              margin: '0 0 8px 0',
            }}
          >
            Trusted by Industry Leaders
          </p>
          <h2
            style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}
          >
            Partnered with Thousands of Organizations
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {companies.map((company, index) => (
            <div
              key={company}
              style={{
                padding: '24px',
                backgroundColor: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                border: '1px solid #e4e4e7',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.borderColor = '#ffa424';
                target.style.boxShadow = '0 4px 12px rgba(255, 164, 36, 0.15)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.borderColor = '#e4e4e7';
                target.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `hsla(${index * 60}, 80%, 60%, 0.1)`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `hsl(${index * 60}, 80%, 50%)`,
                }}
              >
                <i className="fas fa-building" />
              </div>
              <span style={{ fontWeight: 600, color: '#18181b', fontSize: '0.875rem' }}>
                {company}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
