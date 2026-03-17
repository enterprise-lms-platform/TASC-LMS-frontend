import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicClientsApi } from '../../services/public.services';

interface TrustedByProps {
  isMobile: boolean;
}

const TrustedBy: React.FC<TrustedByProps> = ({ isMobile }) => {
  const clientsData = useQuery({
    queryKey: ['publicClients'],
    queryFn: () => publicClientsApi.getClients(),
  });

  const companies = (clientsData?.data?.data || []).map((client: any) => ({
    name: client.name,
    logoUrl: client.logo_url,
  }));

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
              {company.logoUrl ? (
                <img 
                  src={company.logoUrl} 
                  alt={company.name} 
                  style={{ height: '32px', objectFit: 'contain' }} 
                />
              ) : (
                <i className="fas fa-building" style={{ fontSize: '1.5rem' }} />
              )}
              <span>{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
