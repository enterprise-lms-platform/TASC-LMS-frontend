import React from 'react';

interface FeaturesProps {
  isMobile: boolean;
}

const Features: React.FC<FeaturesProps> = ({ isMobile }) => {
  const features = [
    {
      icon: 'book-open',
      title: 'Comprehensive Course Library',
      desc: 'Access 1000+ courses across web development, data science, cybersecurity, business, and more. New content added weekly.',
      color: '#ffa424',
    },
    {
      icon: 'chalkboard-user',
      title: 'Expert Instructors',
      desc: 'Learn from industry professionals with real-world experience. Our instructors are certified experts in their fields.',
      color: '#3b82f6',
    },
    {
      icon: 'certificate',
      title: 'Verified Certifications',
      desc: 'Earn industry-recognized certificates with unique QR verification. Showcase your achievements to employers.',
      color: '#10b981',
    },
    {
      icon: 'video',
      title: 'Live Interactive Sessions',
      desc: 'Join live classes with Zoom, Teams, or Google Meet integration. Ask questions and interact in real-time.',
      color: '#8b5cf6',
    },
    {
      icon: 'tasks',
      title: 'Hands-On Assessments',
      desc: 'Practice with quizzes, assignments, and projects. Get instant feedback and track your progress.',
      color: '#ef4444',
    },
    {
      icon: 'mobile-alt',
      title: 'Learn Anywhere',
      desc: 'Access courses on any device. Download content for offline learning. Continue where you left off.',
      color: '#14b8a6',
    },
  ];

  return (
    <section
      id="features"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: 'white',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div
            className="chip-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fff3e0',
              color: '#ffa424',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 600,
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            <i className="fas fa-star" />
            Why Choose Us
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>
            Everything You Need to Succeed
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#52525b',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            Our comprehensive learning platform provides all the tools and resources you need to master new
            skills and advance your career.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px',
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.icon}
              className="feature-card"
              style={{
                padding: '32px',
                height: '100%',
                border: '1px solid #e4e4e7',
                borderRadius: '16px',
                backgroundColor: 'white',
              }}
            >
              <div
                className="feature-icon-box"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${feature.color}20`,
                  color: feature.color,
                  marginBottom: '24px',
                  fontSize: '32px',
                }}
              >
                <i className={`fas fa-${feature.icon}`} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px', margin: '0 0 12px 0' }}>
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#52525b',
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
