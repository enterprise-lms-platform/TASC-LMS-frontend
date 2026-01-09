import React from 'react';

interface HowItWorksProps {
  isMobile: boolean;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ isMobile }) => {
  const steps = [
    {
      num: 1,
      icon: 'user-plus',
      title: 'Create Account',
      desc: 'Sign up for free in seconds using your email or social accounts.',
    },
    {
      num: 2,
      icon: 'magnifying-glass',
      title: 'Browse Courses',
      desc: 'Explore our catalog and find courses that match your goals.',
    },
    {
      num: 3,
      icon: 'play',
      title: 'Start Learning',
      desc: 'Enroll instantly and begin learning at your own pace.',
    },
    {
      num: 4,
      icon: 'trophy',
      title: 'Get Certified',
      desc: 'Complete courses and earn verified certificates to showcase.',
    },
  ];

  return (
    <section
      className="how-it-works-section"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        color: 'white',
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
              backgroundColor: 'rgba(255, 164, 36, 0.2)',
              color: '#ffa424',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: 600,
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            <i className="fas fa-route" />
            How It Works
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>
            Start Learning in Minutes
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#a1a1aa',
            }}
          >
            Getting started is easy. Follow these simple steps to begin your learning journey.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '24px',
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="step-card"
              style={{
                padding: '32px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
              }}
            >
              <div
                className="step-number"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  margin: '0 auto 24px',
                }}
              >
                {step.num}
              </div>

              <div
                className="step-icon"
                style={{
                  fontSize: '48px',
                  color: '#ffb74d',
                  marginBottom: '16px',
                }}
              >
                <i className={`fas fa-${step.icon}`} />
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px', margin: '0 0 12px 0' }}>
                {step.title}
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#a1a1aa',
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
