import React from 'react';

interface StatsBannerProps {
  isMobile: boolean;
}

const StatsBanner: React.FC<StatsBannerProps> = ({ isMobile }) => {
  const stats = [
    { icon: 'book-open', value: '1,000+', label: 'Courses Available' },
    { icon: 'users', value: '50,000+', label: 'Active Learners' },
    { icon: 'chalkboard-teacher', value: '200+', label: 'Expert Instructors' },
    { icon: 'certificate', value: '25,000+', label: 'Certificates Issued' },
  ];

  const getGridColumns = () => {
    if (isMobile) return 'repeat(2, 1fr)';
    return 'repeat(4, 1fr)';
  };

  return (
    <section
      style={{
        padding: '64px 0',
        backgroundColor: '#18181b',
        color: 'white',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: '32px',
            textAlign: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '1.875rem',
                  color: '#ffb74d',
                  marginBottom: '16px',
                }}
              >
                <i className={`fas fa-${stat.icon}`} />
              </div>
              <div
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#a1a1aa',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
