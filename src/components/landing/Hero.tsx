import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  isMobile: boolean;
}

const Hero: React.FC<HeroProps> = ({ isMobile }) => {
  const navigate = useNavigate();
  return (
    <section
      className="hero-section"
      style={{
        padding: '96px 0 80px',
        background: 'linear-gradient(135deg, rgba(255, 164, 36, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
        marginTop: '72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(255, 164, 36, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left Content */}
          <div style={{ maxWidth: '600px' }}>
            <div
              className="chip-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fff3e0',
                color: '#ffa424',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontWeight: 600,
                marginBottom: '24px',
                fontSize: '0.875rem',
              }}
            >
              <i className="fas fa-sparkles" />
              New: AI-Powered Learning Paths
            </div>

            <h1
              className="hero-title"
              style={{
                fontSize: isMobile ? '2.25rem' : '3rem',
                fontWeight: 800,
                color: '#18181b',
                lineHeight: 1.1,
                marginBottom: '24px',
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
            </h1>

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
              className="hero-actions"
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '40px',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-xl"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px 40px',
                  backgroundColor: '#ffa424',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-play-circle" />
                Start Learning Free
              </button>
              <button
                onClick={() => navigate('/for-business')}
                className="btn btn-outline-primary btn-xl"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '18px 38px',
                  backgroundColor: 'transparent',
                  color: '#ffa424',
                  border: '2px solid #ffa424',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-building" />
                For Organizations
              </button>
            </div>

            {/* Hero Stats */}
            <div
              className="hero-stats"
              style={{
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#18181b' }}>1000+</div>
                <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Expert-Led Courses</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#18181b' }}>50K+</div>
                <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Active Learners</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#18181b' }}>4.8</div>
                <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Visual */}
          {!isMobile && (
            <div style={{ position: 'relative' }}>
              {/* Main Image Container */}
              <div
                className="hero-image-container"
                style={{
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <video
                  src="/video/Hero.mkv.m4v"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Floating Card 1 - Verified Certificates */}
              <div
                className="hero-floating-card"
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '-10%',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  <i className="fas fa-certificate" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#27272a', margin: 0 }}>
                    Verified Certificates
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0 }}>Industry-recognized credentials</p>
                </div>
              </div>

              {/* Floating Card 2 - 200+ Instructors */}
              <div
                className="hero-floating-card"
                style={{
                  position: 'absolute',
                  bottom: '20%',
                  right: '-5%',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '1s',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 164, 36, 0.1)',
                    color: '#ffa424',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  <i className="fas fa-users" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#27272a', margin: 0 }}>
                    200+ Instructors
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0 }}>Learn from the best</p>
                </div>
              </div>

              {/* Floating Card 3 - Live Sessions */}
              <div
                className="hero-floating-card"
                style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '5%',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '2s',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}
                >
                  <i className="fas fa-video" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#27272a', margin: 0 }}>
                    Live Sessions
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0 }}>Interactive learning</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
