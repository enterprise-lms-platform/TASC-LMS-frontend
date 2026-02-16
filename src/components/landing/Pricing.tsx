import React from 'react';



const Pricing: React.FC = () => {
  return (
    <section
      id="pricing"
      style={{
        paddingTop: '96px',
        paddingBottom: '96px',
        backgroundColor: 'white',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            <i className="fas fa-tags" />
            Simple Pricing
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>
            One Plan, Unlimited Access
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#52525b',
              marginBottom: '32px',
              margin: '0 0 32px 0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Get full access to all courses, certifications, and live sessions with our simple biannual subscription.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            className="pricing-card"
            style={{
              padding: '48px',
              position: 'relative',
              border: '2px solid #ffa424',
              borderRadius: '24px',
              backgroundColor: 'white',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div
              className="pricing-badge"
              style={{
                position: 'absolute',
                top: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(249, 115, 22, 0.3)',
              }}
            >
              <i className="fas fa-star" />
              All-Access Pass
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center', margin: '0 0 8px 0' }}>
              Biannual Plan
            </h3>
            <p
              style={{
                fontSize: '1rem',
                color: '#71717a',
                marginBottom: '32px',
                textAlign: 'center',
                margin: '0 0 32px 0',
              }}
            >
              Everything you need to master new skills.
            </p>

            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div
                className="pricing-price"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  gap: '4px',
                  fontSize: 0,
                }}
              >
                <span className="pricing-price-currency" style={{ fontSize: '2rem', fontWeight: 600, color: '#27272a' }}>
                  $
                </span>
                <span className="pricing-price-amount" style={{ fontSize: '4rem', fontWeight: 800, color: '#27272a' }}>
                  99
                </span>
                <span className="pricing-price-period" style={{ fontSize: '1.25rem', color: '#71717a', marginLeft: '8px', fontWeight: 500 }}>
                  / 6 months
                </span>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', color: '#10b981', fontWeight: 600, fontSize: '0.875rem', marginBottom: '32px' }}>
              Just $16.50/month
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #e4e4e7', marginBottom: '32px' }} />

            {/* Features */}
            <div style={{ marginBottom: '40px' }}>
              {[
                'Unlimited access to all courses',
                'Earn professional certificates',
                'Join live interactive sessions',
                'Download resources for offline learning',
                'Priority email support',
                'Access to community forums',
              ].map((feature) => (
                <div
                  key={feature}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '10px 0',
                    fontSize: '1rem',
                    color: '#27272a',
                  }}
                >
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ecfdf5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-check" style={{ color: '#10b981', fontSize: '14px' }} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = '/register'}
              className="pricing-button"
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: '#ffa424',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.125rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(255, 164, 36, 0.25)',
              }}
            >
              Get Full Access Now
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#71717a', marginTop: '16px' }}>
              30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
