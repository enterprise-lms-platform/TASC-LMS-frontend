import React from 'react';

interface CTAProps {
  isMobile: boolean;
}

const CTA: React.FC<CTAProps> = ({ isMobile }) => {
  return (
    <section
      className="cta-section"
      style={{
        paddingTop: '80px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, #ffa424 0%, #f97316 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '48px',
          }}
        >
          <div className="cta-content" style={{ flex: 1 }}>
            <h2
              className="cta-title"
              style={{
                fontSize: isMobile ? '1.875rem' : '2.5rem',
                fontWeight: 800,
                color: 'white',
                marginBottom: '16px',
                margin: '0 0 16px 0',
              }}
            >
              Ready to Transform Your Learning?
            </h2>
            <p
              className="cta-description"
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '32px',
                margin: '0 0 32px 0',
                lineHeight: 1.6,
              }}
            >
              Join thousands of professionals already advancing their careers with our comprehensive online courses.
              Start learning today at your own pace.
            </p>

            <div
              className="cta-buttons"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '16px',
              }}
            >
              <button
                className="cta-button"
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'white',
                  color: '#ffa424',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minWidth: '200px',
                }}
              >
                <i className="fas fa-play" />
                Start Learning Free
              </button>
              <button
                className="cta-button"
                style={{
                  padding: '14px 32px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minWidth: '200px',
                }}
              >
                <i className="fas fa-calendar" />
                Schedule Demo
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: isMobile ? 'none' : 'block',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '300px',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '5rem', color: 'rgba(255, 255, 255, 0.3)' }}>
                <i className="fas fa-graduation-cap" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(100px, -100px)',
          zIndex: 0,
        }}
      />
    </section>
  );
};

export default CTA;
