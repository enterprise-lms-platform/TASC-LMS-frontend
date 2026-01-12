import React, { useState } from 'react';

interface PricingProps {
  isMobile: boolean;
}

const Pricing: React.FC<PricingProps> = ({ isMobile }) => {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Basic',
      desc: 'Perfect for getting started',
      monthly: 9,
      annual: 7,
      features: [
        'Access to 50+ courses',
        '5 certificates per month',
        '5 live sessions per month',
        'Email support',
      ],
      disabled: ['Offline downloads', 'Priority support'],
    },
    {
      name: 'Pro',
      desc: 'Best for serious learners',
      monthly: 29,
      annual: 23,
      features: [
        'Unlimited course access',
        '10 certificates per month',
        '20 live sessions per month',
        '50 offline downloads',
        'Priority email support',
      ],
      disabled: ['1-on-1 mentoring'],
      popular: true,
    },
    {
      name: 'Enterprise',
      desc: 'For teams and organizations',
      monthly: 79,
      annual: 63,
      features: [
        'Everything in Pro',
        'Unlimited certificates',
        'Unlimited live sessions',
        'Unlimited downloads',
        '24/7 priority support',
        'Monthly 1-on-1 mentoring',
      ],
      disabled: [],
    },
  ];

  const getPrice = (monthly: number, ann: number) => (annual ? ann : monthly);

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
            Pricing Plans
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', margin: '0 0 16px 0' }}>
            Choose Your Learning Plan
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              color: '#52525b',
              marginBottom: '32px',
              margin: '0 0 32px 0',
            }}
          >
            Flexible pricing options to fit your learning needs. Start free and upgrade anytime.
          </p>

          {/* Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            <span style={{ fontWeight: !annual ? 600 : 400 }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: '80px',
                height: '40px',
                backgroundColor: annual ? '#ffa424' : '#e4e4e7',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  top: '4px',
                  left: annual ? '44px' : '4px',
                  transition: 'left 0.3s',
                }}
              />
            </button>
            <span style={{ fontWeight: annual ? 600 : 400 }}>Annual</span>
            {annual && (
              <div
                className="chip-badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              >
                Save 20%
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="pricing-card"
              style={{
                padding: '32px',
                position: 'relative',
                border: plan.popular ? '2px solid #ffa424' : '2px solid #e4e4e7',
                borderRadius: '20px',
                backgroundColor: 'white',
                transform: plan.popular && !isMobile ? 'scale(1.05)' : 'none',
                boxShadow: plan.popular ? '0 24px 24px rgba(0, 0, 0, 0.15)' : '0 8px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              {plan.popular && (
                <div
                  className="pricing-badge"
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'linear-gradient(135deg, #ffa424, #f97316)',
                    background: 'linear-gradient(135deg, #ffa424, #f97316)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <i className="fas fa-star" />
                  Most Popular
                </div>
              )}

              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center', margin: '0 0 8px 0' }}>
                {plan.name}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#71717a',
                  marginBottom: '24px',
                  textAlign: 'center',
                  margin: '0 0 24px 0',
                }}
              >
                {plan.desc}
              </p>

              {/* Price */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
                  <span className="pricing-price-currency" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    $
                  </span>
                  <span className="pricing-price-amount" style={{ fontSize: '3rem', fontWeight: 800 }}>
                    {getPrice(plan.monthly, plan.annual)}
                  </span>
                  <span className="pricing-price-period" style={{ fontSize: '1rem', color: '#71717a', marginLeft: '8px' }}>
                    /month
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e4e4e7', marginBottom: '24px' }} />

              {/* Features */}
              <div style={{ marginBottom: '32px' }}>
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 0',
                      fontSize: '0.875rem',
                    }}
                  >
                    <i className="fas fa-check" style={{ color: '#10b981', fontSize: '16px' }} />
                    {feature}
                  </div>
                ))}
                {plan.disabled.map((feature) => (
                  <div
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 0',
                      fontSize: '0.875rem',
                      opacity: 0.4,
                    }}
                  >
                    <i className="fas fa-times" style={{ color: '#d4d4d8', fontSize: '16px' }} />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className="pricing-button"
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: plan.popular ? '#ffa424' : 'white',
                  color: plan.popular ? 'white' : '#ffa424',
                  border: `2px solid #ffa424`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                }}
              >
                {plan.name === 'Pro'
                  ? 'Start Free Trial'
                  : plan.name === 'Enterprise'
                    ? 'Contact Sales'
                    : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
