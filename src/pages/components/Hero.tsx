import React from 'react';

interface HeroProps {
  isMobile: boolean;
}

const Hero: React.FC<HeroProps> = ({ isMobile }) => {
  return (
    <section
      className="hero-section"
      style={{
        paddingTop: '160px',
        paddingBottom: '96px',
        background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left Content */}
          <div>
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
                marginBottom: '24px',
                fontSize: '0.875rem',
              }}
            >
              <i className="fas fa-wand-magic-sparkles" />
              New: AI-Powered Learning Paths
            </div>

            <h2
              className="hero-title"
              style={{
                fontSize: isMobile ? '2rem' : '3rem',
                fontWeight: 800,
                marginBottom: '24px',
                lineHeight: 1.2,
              }}
            >
              Transform Your Career with{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                World-Class Learning
              </span>
            </h2>

            <p
              className="hero-description"
              style={{
                fontSize: '1.125rem',
                color: '#52525b',
                marginBottom: '32px',
                lineHeight: 1.7,
              }}
            >
              Access 1000+ courses from industry experts. Master in-demand skills, earn recognized
              certifications, and accelerate your professional growth with TASC Learning Management System.
            </p>

            <div
              className="hero-buttons"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '16px',
                marginBottom: '48px',
              }}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  backgroundColor: '#ffa424',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                <i className="fas fa-play" />
                Start Learning Free
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 32px',
                  backgroundColor: 'white',
                  color: '#ffa424',
                  border: '2px solid #ffa424',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                <i className="fas fa-briefcase" />
                For Organizations
              </button>
            </div>

            {/* Stats */}
            <div
              className="hero-stats"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '32px',
              }}
            >
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                  1000+
                </div>
                <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0 }}>Expert-Led Courses</p>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                  50K+
                </div>
                <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0 }}>Active Learners</p>
              </div>
              <div className="stat-card" style={{ textAlign: 'center' }}>
                <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
                  4.8
                </div>
                <p style={{ fontSize: '0.875rem', color: '#71717a', margin: 0 }}>Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          {!isMobile && (
            <div
              className="course-image"
              style={{
                height: '400px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-play" style={{ fontSize: '80px', opacity: 0.9, marginBottom: '16px' }} />
                <p style={{ fontSize: '1.125rem', margin: 0 }}>Start Your Learning Journey</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
